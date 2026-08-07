import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  mergeWithAnalytics,
  loadGoogleAnalytics,
  loadGoogleAnalyticsOrThrow,
  type AnalyticsDataSource,
} from '../../../src/list-helpers/loadPostsStats.ts'
import type { Post } from '../../../src/types.d.ts'
import crypto from 'node:crypto'

describe('loadPostsStats', () => {
  const dummyPost: Post = {
    title: 'Test Post',
    url: '/posts/test-post.html',
    date: '2026-01-01',
    excerpt: 'Test excerpt',
    frontmatter: {
      title: 'Test Post',
      date: '2026-01-01',
    } as any,
  }

  // Generate a real dummy RSA keypair for JWT signing tests
  const { privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  })

  const validCredentialsJson = JSON.stringify({
    client_email: 'test-sa@project.iam.gserviceaccount.com',
    private_key: privateKey,
  })

  beforeEach(() => {
    delete (globalThis as any).loadingGaStatsPromise
    delete (globalThis as any).warnedGaLatestFallback
    vi.restoreAllMocks()
  })

  afterEach(() => {
    delete (globalThis as any).loadingGaStatsPromise
    delete (globalThis as any).warnedGaNoData
    vi.restoreAllMocks()
  })

  describe('mergeWithAnalytics', () => {
    it('returns posts unchanged if dataSource is empty or provider is not ga4', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      expect(await mergeWithAnalytics([dummyPost], null)).toEqual([dummyPost])
      expect(
        await mergeWithAnalytics([dummyPost], { provider: 'ga4', propertyId: '' })
      ).toEqual([dummyPost])
      expect(consoleWarnSpy).toHaveBeenCalledOnce()
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Popular posts list will be empty')
      )
    })

    it('merges stats into matching post URLs', async () => {
      const globalFetch = vi.fn()
      vi.stubGlobal('fetch', globalFetch)

      // Mock OAuth token endpoint response
      globalFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 'fake-token-123' }),
      })

      // Mock GA4 runReport endpoint response
      globalFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          rows: [
            {
              dimensionValues: [{ value: '/posts/test-post' }],
              metricValues: [{ value: '100' }, { value: '50' }, { value: '120.5' }],
            },
          ],
        }),
      })

      const dataSource: AnalyticsDataSource = {
        provider: 'ga4',
        propertyId: '123456789',
        credentialsJson: validCredentialsJson,
      }

      const result = await mergeWithAnalytics([dummyPost], dataSource)

      expect(result[0]!.analyticsStats).toEqual({
        pageviews: 100,
        uniquePageviews: 50,
        avgTimeOnPage: 120.5,
      })
    })
  })

  describe('loadGoogleAnalytics', () => {
    it('returns empty object when credentials are missing', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const result = await loadGoogleAnalytics({
        provider: 'ga4',
        propertyId: '123',
        credentialsJson: null,
      })

      expect(result).toEqual({})
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('No valid Google Analytics credentials provided')
      )
    })

    it('returns empty object on API error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const globalFetch = vi.fn()
      vi.stubGlobal('fetch', globalFetch)

      // Token request fails
      globalFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => 'Unauthorized',
      })

      const result = await loadGoogleAnalytics({
        provider: 'ga4',
        propertyId: '123456',
        credentialsJson: validCredentialsJson,
      })

      expect(result).toEqual({})
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Critical error fetching Google Analytics data:')
      )
    })
  })
})

describe('GA4 retry behaviour', () => {
  const { privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  })
  const credentialsJson = JSON.stringify({
    client_email: 'sa@project.iam.gserviceaccount.com',
    private_key: privateKey,
  })
  const source = (over: Partial<AnalyticsDataSource> = {}): AnalyticsDataSource => ({
    provider: 'ga4',
    propertyId: '123',
    credentialsJson,
    retryDelayMs: 0,
    ...over,
  })

  const tokenResponse = () =>
    new Response(JSON.stringify({ access_token: 'tok' }), { status: 200 })
  const reportResponse = (rows: unknown[]) =>
    new Response(JSON.stringify({ rows }), { status: 200 })
  const row = (path: string, views: string) => ({
    dimensionValues: [{ value: path }],
    metricValues: [{ value: views }, { value: '1' }, { value: '2' }],
  })

  beforeEach(() => {
    delete (globalThis as any).loadingGaStatsPromise
    delete (globalThis as any).warnedGaNoData
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'info').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    delete (globalThis as any).loadingGaStatsPromise
    delete (globalThis as any).warnedGaNoData
    vi.restoreAllMocks()
  })

  it('retries a 5xx report response and succeeds', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(tokenResponse())
      .mockResolvedValueOnce(new Response('boom', { status: 503 }))
      .mockResolvedValueOnce(tokenResponse())
      .mockResolvedValueOnce(reportResponse([row('/posts/a', '10')]))
    vi.stubGlobal('fetch', fetchMock)

    await expect(loadGoogleAnalyticsOrThrow(source())).resolves.toEqual({
      '/posts/a': { pageviews: 10, uniquePageviews: 1, avgTimeOnPage: 2 },
    })
    expect(fetchMock).toHaveBeenCalledTimes(4)
  })

  it('retries a network-level failure', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('fetch failed'))
      .mockResolvedValueOnce(tokenResponse())
      .mockResolvedValueOnce(reportResponse([row('/posts/a', '3')]))
    vi.stubGlobal('fetch', fetchMock)

    await expect(loadGoogleAnalyticsOrThrow(source())).resolves.toHaveProperty('/posts/a')
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it('retries a 429 on the token endpoint', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('slow down', { status: 429 }))
      .mockResolvedValueOnce(tokenResponse())
      .mockResolvedValueOnce(reportResponse([row('/posts/a', '1')]))
    vi.stubGlobal('fetch', fetchMock)

    await expect(loadGoogleAnalyticsOrThrow(source())).resolves.toHaveProperty('/posts/a')
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it('does not retry a 403 — bad credentials fail the same way every time', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(tokenResponse())
      .mockResolvedValueOnce(new Response('forbidden', { status: 403 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(loadGoogleAnalyticsOrThrow(source())).rejects.toThrow(/403/)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  // A fresh Response per call: a body can only be read once.
  const alwaysFailing = () =>
    vi.fn().mockImplementation(async () => new Response('boom', { status: 500 }))

  it('gives up after maxRetries and rejects', async () => {
    const fetchMock = alwaysFailing()
    vi.stubGlobal('fetch', fetchMock)

    await expect(loadGoogleAnalyticsOrThrow(source({ maxRetries: 2 }))).rejects.toThrow(
      /500/
    )
    // 3 attempts (1 + 2 retries); each dies on the token endpoint, one call each.
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it('honours maxRetries: 0', async () => {
    const fetchMock = alwaysFailing()
    vi.stubGlobal('fetch', fetchMock)

    await expect(loadGoogleAnalyticsOrThrow(source({ maxRetries: 0 }))).rejects.toThrow()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('treats an empty report as a valid answer, not a failure', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(tokenResponse())
      .mockResolvedValueOnce(reportResponse([]))
    vi.stubGlobal('fetch', fetchMock)

    await expect(loadGoogleAnalyticsOrThrow(source())).resolves.toEqual({})
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('does not cache a failed fetch — a later locale retries from scratch', async () => {
    const posts = [{ url: '/posts/a', title: 'A' } as any]
    const failing = vi
      .fn()
      .mockImplementation(async () => new Response('boom', { status: 500 }))
    vi.stubGlobal('fetch', failing)

    await mergeWithAnalytics(posts, source({ maxRetries: 0 }))
    expect((globalThis as any).loadingGaStatsPromise).toBeFalsy()

    const succeeding = vi
      .fn()
      .mockResolvedValueOnce(tokenResponse())
      .mockResolvedValueOnce(reportResponse([row('/posts/a', '7')]))
    vi.stubGlobal('fetch', succeeding)

    const merged = await mergeWithAnalytics(posts, source({ maxRetries: 0 }))
    expect(merged[0]!.analyticsStats).toMatchObject({ pageviews: 7 })
  })

  it('shares one successful fetch across locales', async () => {
    const posts = [{ url: '/posts/a', title: 'A' } as any]
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(tokenResponse())
      .mockResolvedValueOnce(reportResponse([row('/posts/a', '5')]))
    vi.stubGlobal('fetch', fetchMock)

    await mergeWithAnalytics(posts, source())
    await mergeWithAnalytics(posts, source())
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
