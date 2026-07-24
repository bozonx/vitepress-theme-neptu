import crypto from 'node:crypto'
import fs from 'node:fs'
import { POSTS_DIR } from '../constants.ts'
import type { Post } from '../types.d.ts'

declare global {
  var loadingGaStatsPromise:
    | Promise<Record<string, AnalyticsStats>>
    | null
    | undefined
}

if (!globalThis.loadingGaStatsPromise) {
  globalThis.loadingGaStatsPromise = null
}

export interface AnalyticsDataSource {
  provider: 'ga4'
  propertyId?: string | null
  credentialsJson?: string | null
  dataPeriodDays?: number
  dataLimit?: number
}

export interface AnalyticsStats extends Record<string, number> {
  pageviews: number
  uniquePageviews: number
  avgTimeOnPage: number
}

// Helper to normalize paths so GA paths match VitePress output URLs
function normalizePath(p: string): string {
  return p
    .split('?')[0] // remove query string
    .split('#')[0] // remove hash
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

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(
      `Google OAuth token request failed (${res.status}): ${errorText}`
    )
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
    credentialsJson =
      process.env.GA_CREDENTIALS_JSON ||
      process.env.GOOGLE_APPLICATION_CREDENTIALS
  }

  if (!credentialsJson) return null

  try {
    let jsonString = credentialsJson.trim()
    if (!jsonString.startsWith('{')) {
      if (fs.existsSync(jsonString)) {
        jsonString = fs.readFileSync(jsonString, 'utf-8')
      }
    }

    const parsed = JSON.parse(jsonString)
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
      '\x1b[33m⚠️ Failed to parse Google Analytics credentials JSON.\x1b[0m',
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
    return posts
  }

  try {
    let stats: Record<string, AnalyticsStats> | null = null

    if (!globalThis.loadingGaStatsPromise) {
      globalThis.loadingGaStatsPromise = loadGoogleAnalytics(dataSource)
    }

    stats = await globalThis.loadingGaStatsPromise!

    if (!stats || Object.keys(stats).length === 0) {
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
        `\x1b[32m📈 Merged GA stats for ${postsWithStatsCount} posts.\x1b[0m`
      )
    }

    return postsWithStats
  } catch (err) {
    console.error('\x1b[31m❌ Error merging GA stats with posts:\x1b[0m', err)
    return posts
  }
}

export async function loadGoogleAnalytics(
  dataSource: AnalyticsDataSource
): Promise<Record<string, AnalyticsStats>> {
  try {
    const credentials = parseCredentials(dataSource)
    if (!credentials) {
      console.warn(
        '\x1b[33m⚠️ No valid Google Analytics credentials provided (client_email and private_key are required).\x1b[0m'
      )
      return {}
    }

    const accessToken = await getGoogleAccessToken(
      credentials.client_email,
      credentials.private_key
    )

    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - (dataSource.dataPeriodDays || 30))

    const url = `https://analyticsdata.googleapis.com/v1beta/properties/${dataSource.propertyId}:runReport`

    console.info(
      `\x1b[36m🔍 Fetching GA stats for property ${dataSource.propertyId}...\x1b[0m`
    )

    const response = await fetch(url, {
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
      throw new Error(`GA4 API request failed (${response.status}): ${errText}`)
    }

    const data = (await response.json()) as {
      rows?: Array<{
        dimensionValues?: Array<{ value?: string }>
        metricValues?: Array<{ value?: string }>
      }>
    }

    const stats: Record<string, AnalyticsStats> = {}
    const rows = data.rows

    if (!rows || rows.length === 0) {
      console.warn('\x1b[33m⚠️ GA returned no data for this period.\x1b[0m')
      return {}
    }

    rows.forEach((row) => {
      if (!row.dimensionValues?.[0]?.value || !row.metricValues) return

      const pagePath = normalizePath(row.dimensionValues[0].value)

      stats[pagePath] = {
        pageviews: parseInt(row.metricValues[0].value || '0', 10),
        uniquePageviews: parseInt(row.metricValues[1].value || '0', 10),
        avgTimeOnPage: parseFloat(row.metricValues[2].value || '0'),
      }
    })

    console.info(
      `\x1b[32m✅ Loaded GA stats for ${Object.keys(stats).length} paths.\x1b[0m`
    )

    return stats
  } catch (err: unknown) {
    console.error(
      '\x1b[31m❌ Critical error fetching Google Analytics data:\x1b[0m'
    )
    if (err instanceof Error) {
      console.error(err.message)
    } else {
      console.error(err)
    }
    return {}
  }
}

