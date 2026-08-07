import crypto from 'node:crypto'
import { POSTS_DIR } from '../constants.ts'
import type { Post } from '../types.d.ts'

declare global {
  var loadingGaStatsPromise:
    | Promise<Record<string, AnalyticsStats>>
    | null
    | undefined
  var warnedGaNoData: boolean | undefined
}

if (!globalThis.loadingGaStatsPromise) {
  globalThis.loadingGaStatsPromise = null
}

function warnNoAnalyticsData(): void {
  if (globalThis.warnedGaNoData) return
  globalThis.warnedGaNoData = true
  console.warn(
    '\x1b[33mPopular posts are enabled, but GA4 returned no data (or credentials missing). Popular posts list will be empty.\x1b[0m'
  )
}

/** Reset module-level cache and warning state. Useful for tests and watch-mode rebuilds. */
export function resetAnalyticsState(): void {
  globalThis.loadingGaStatsPromise = null
  globalThis.warnedGaNoData = false
}

export interface AnalyticsDataSource {
  provider: 'ga4'
  propertyId?: string | null
  credentialsJson?: string | null
  dataPeriodDays?: number
  dataLimit?: number
  /**
   * How many times a transient failure (network error, 429, 5xx) is retried
   * before giving up. Defaults to {@link DEFAULT_MAX_RETRIES}. Set to `0` to
   * disable retrying.
   */
  maxRetries?: number
  /**
   * Base delay for the exponential backoff, in milliseconds. Attempt `n` waits
   * `retryDelayMs * 2 ** n` plus jitter. Defaults to
   * {@link DEFAULT_RETRY_DELAY_MS}.
   */
  retryDelayMs?: number
}

const DEFAULT_MAX_RETRIES = 3
const DEFAULT_RETRY_DELAY_MS = 500

/** HTTP statuses worth another attempt: rate limiting, timeouts, server faults. */
function isRetryableStatus(status: number): boolean {
  return status === 408 || status === 425 || status === 429 || status >= 500
}

/**
 * Marks a failure as worth retrying. A wrong property id or revoked
 * credentials will fail identically on every attempt, so only transport-level
 * and server-side faults carry this.
 */
class TransientAnalyticsError extends Error {
  override readonly name = 'TransientAnalyticsError'
}

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Runs `operation`, retrying only {@link TransientAnalyticsError} with
 * exponential backoff and jitter. Jitter matters because every locale of a
 * multilingual build would otherwise retry in lockstep.
 */
async function withRetry<T>(
  operation: () => Promise<T>,
  label: string,
  maxRetries: number,
  baseDelayMs: number
): Promise<T> {
  let lastError: unknown

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      if (!(error instanceof TransientAnalyticsError)) throw error
      if (attempt === maxRetries) break

      const delay = baseDelayMs * 2 ** attempt + Math.floor(Math.random() * 100)
      console.warn(
        `\x1b[33m${label} failed (attempt ${attempt + 1}/${maxRetries + 1}): ` +
          `${(error as Error).message}. Retrying in ${delay}ms…\x1b[0m`
      )
      await sleep(delay)
    }
  }

  throw lastError
}

/** Wraps `fetch` so network-level faults become retryable. */
async function fetchWithTransientErrors(
  url: string,
  init: RequestInit
): Promise<Response> {
  try {
    return await fetch(url, init)
  } catch (error) {
    // A rejected `fetch` is always a transport problem (DNS, TLS, socket).
    throw new TransientAnalyticsError(
      `Network error contacting ${new URL(url).host}: ${(error as Error).message}`
    )
  }
}

export interface AnalyticsStats extends Record<string, number> {
  pageviews: number
  uniquePageviews: number
  avgTimeOnPage: number
}

// Helper to normalize paths so GA paths match VitePress output URLs
function normalizePath(p: string): string {
  // `split` on a non-empty string always yields at least one segment.
  return (p.split('?')[0] ?? '')
    .split('#')[0]!
    .replace(/\/index\.html$/, '/')
    .replace(/\.html$/, '')
    .replace(/\/$/, '') // remove trailing slash
}

function base64UrlEncode(input: string | Buffer): string {
  const buf = typeof input === 'string' ? Buffer.from(input) : input
  return buf
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function createGoogleJwt(
  clientEmail: string,
  privateKey: string,
  scope: string
): string {
  const header = base64UrlEncode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const now = Math.floor(Date.now() / 1000)
  const payload = base64UrlEncode(
    JSON.stringify({
      iss: clientEmail,
      scope,
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    })
  )

  const sign = crypto.createSign('RSA-SHA256')
  sign.update(`${header}.${payload}`)
  const signature = base64UrlEncode(sign.sign(privateKey))

  return `${header}.${payload}.${signature}`
}

async function getGoogleAccessToken(
  clientEmail: string,
  privateKey: string
): Promise<string> {
  const jwt = createGoogleJwt(
    clientEmail,
    privateKey,
    'https://www.googleapis.com/auth/analytics.readonly'
  )

  const res = await fetchWithTransientErrors(
    'https://oauth2.googleapis.com/token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    }
  )

  if (!res.ok) {
    const errorText = await res.text()
    const message = `Google OAuth token request failed (${res.status}): ${errorText}`
    // A rejected JWT (400/401) fails the same way every time; a 429 or 5xx does not.
    throw isRetryableStatus(res.status)
      ? new TransientAnalyticsError(message)
      : new Error(message)
  }

  const data = (await res.json()) as { access_token?: string }
  if (!data.access_token) {
    throw new Error('Google OAuth response did not contain access_token')
  }

  return data.access_token
}

function parseCredentials(
  dataSource: AnalyticsDataSource
): { client_email: string; private_key: string } | null {
  let credentialsJson = dataSource.credentialsJson

  if (!credentialsJson && typeof process !== 'undefined' && process.env) {
    credentialsJson = process.env.GA_CREDENTIALS_JSON
  }

  if (!credentialsJson) return null

  try {
    const parsed = JSON.parse(credentialsJson.trim())
    if (
      parsed &&
      typeof parsed.client_email === 'string' &&
      typeof parsed.private_key === 'string'
    ) {
      return {
        client_email: parsed.client_email,
        private_key: parsed.private_key.replace(/\\n/g, '\n'),
      }
    }
  } catch (err) {
    console.warn(
      '\x1b[33mFailed to parse Google Analytics credentials JSON.\x1b[0m',
      err
    )
  }

  return null
}

export async function mergeWithAnalytics(
  posts: Post[],
  dataSource: AnalyticsDataSource | null | undefined
): Promise<Post[]> {
  if (dataSource?.provider !== 'ga4' || !dataSource?.propertyId) {
    warnNoAnalyticsData()
    return posts
  }

  try {
    let stats: Record<string, AnalyticsStats> | null = null

    if (!globalThis.loadingGaStatsPromise) {
      const pending = loadGoogleAnalyticsOrThrow(dataSource)
      globalThis.loadingGaStatsPromise = pending

      // The promise is shared so every locale of a multilingual build hits GA
      // once. A failed fetch must not be shared for the rest of the process,
      // though: drop it so the next locale gets a fresh attempt instead of
      // inheriting one transient outage for the whole build.
      void pending.catch(() => {
        if (globalThis.loadingGaStatsPromise === pending) {
          globalThis.loadingGaStatsPromise = null
        }
      })
    }

    stats = await globalThis.loadingGaStatsPromise

    if (!stats || Object.keys(stats).length === 0) {
      warnNoAnalyticsData()
      return posts
    }

    let postsWithStatsCount = 0

    const postsWithStats = posts.map((post) => {
      const normalizedPostUrl = normalizePath(post.url)
      const analyticsData = stats![normalizedPostUrl]

      if (analyticsData) postsWithStatsCount++

      return { ...post, analyticsStats: analyticsData || {} } as Post
    })

    if (postsWithStatsCount > 0) {
      console.info(
        `\x1b[32mMerged GA stats for ${postsWithStatsCount} posts.\x1b[0m`
      )
    }

    return postsWithStats
  } catch (err) {
    // Every retry is already exhausted by this point. Popular posts degrade to
    // empty rather than failing the build over an analytics outage.
    console.error(
      '\x1b[31mError merging GA stats with posts:\x1b[0m',
      err instanceof Error ? err.message : err
    )
    warnNoAnalyticsData()
    return posts
  }
}

/**
 * One GA4 fetch attempt. Throws on failure — {@link TransientAnalyticsError}
 * when another attempt could succeed, a plain `Error` when it could not.
 *
 * Kept separate from {@link loadGoogleAnalytics} because the caller needs to
 * tell "GA has no data for this period" (a legitimate empty result, worth
 * caching) from "the request failed" (worth retrying).
 */
async function fetchGoogleAnalytics(
  dataSource: AnalyticsDataSource
): Promise<Record<string, AnalyticsStats>> {
  const credentials = parseCredentials(dataSource)
  if (!credentials) {
    // A configuration problem, not an outage — warned as such, and thrown as a
    // non-transient error so retrying does not waste attempts on it.
    const message =
      'No valid Google Analytics credentials provided (client_email and private_key are required).'
    console.warn(`\x1b[33m${message}\x1b[0m`)
    throw new Error(message)
  }

  const accessToken = await getGoogleAccessToken(
    credentials.client_email,
    credentials.private_key
  )

  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - (dataSource.dataPeriodDays || 30))

  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${dataSource.propertyId}:runReport`

  const response = await fetchWithTransientErrors(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dateRanges: [
        {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
        },
      ],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'totalUsers' },
        { name: 'averageSessionDuration' },
      ],
      dimensions: [{ name: 'pagePath' }],
      dimensionFilter: {
        filter: {
          fieldName: 'pagePath',
          stringFilter: {
            matchType: 'CONTAINS',
            value: `/${POSTS_DIR}/`,
            caseSensitive: false,
          },
        },
      },
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: (dataSource.dataLimit || 1000).toString(),
    }),
  })

  if (!response.ok) {
    const errText = await response.text()
    const message = `GA4 API request failed (${response.status}): ${errText}`
    throw isRetryableStatus(response.status)
      ? new TransientAnalyticsError(message)
      : new Error(message)
  }

  const data = (await response.json()) as {
    rows?: Array<{
      dimensionValues?: Array<{ value?: string }>
      metricValues?: Array<{ value?: string }>
    }>
  }

  const stats: Record<string, AnalyticsStats> = {}
  const rows = data.rows

  // No rows is a valid answer — the property simply has no traffic for the
  // period. It is not a failure, so it is not retried.
  if (!rows || rows.length === 0) {
    console.warn('\x1b[33mGA returned no data for this period.\x1b[0m')
    return {}
  }

  rows.forEach((row) => {
    if (!row.dimensionValues?.[0]?.value || !row.metricValues) return

    const pagePath = normalizePath(row.dimensionValues[0].value)

    stats[pagePath] = {
      pageviews: parseInt(row.metricValues[0]?.value || '0', 10),
      uniquePageviews: parseInt(row.metricValues[1]?.value || '0', 10),
      avgTimeOnPage: parseFloat(row.metricValues[2]?.value || '0'),
    }
  })

  console.info(
    `\x1b[32mLoaded GA stats for ${Object.keys(stats).length} paths.\x1b[0m`
  )

  return stats
}

/**
 * Fetches GA4 stats, retrying transient failures. Rejects when every attempt
 * failed, so the caller can decide whether to cache the outcome.
 */
export async function loadGoogleAnalyticsOrThrow(
  dataSource: AnalyticsDataSource
): Promise<Record<string, AnalyticsStats>> {
  console.info(
    `\x1b[36mFetching GA stats for property ${dataSource.propertyId}...\x1b[0m`
  )

  return withRetry(
    () => fetchGoogleAnalytics(dataSource),
    'GA4 request',
    Math.max(0, dataSource.maxRetries ?? DEFAULT_MAX_RETRIES),
    Math.max(0, dataSource.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS)
  )
}

/**
 * Best-effort variant: returns `{}` instead of throwing, for callers that only
 * want stats when they happen to be available.
 */
export async function loadGoogleAnalytics(
  dataSource: AnalyticsDataSource
): Promise<Record<string, AnalyticsStats>> {
  try {
    return await loadGoogleAnalyticsOrThrow(dataSource)
  } catch (err: unknown) {
    console.error(
      '\x1b[31mCritical error fetching Google Analytics data:\x1b[0m'
    )
    console.error(err instanceof Error ? err.message : err)
    return {}
  }
}
