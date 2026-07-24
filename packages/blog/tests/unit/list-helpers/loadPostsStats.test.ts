import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  mergeWithAnalytics,
  loadGoogleAnalytics,
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
    vi.restoreAllMocks()
  })

  afterEach(() => {
    delete (globalThis as any).loadingGaStatsPromise
    vi.restoreAllMocks()
  })

  describe('mergeWithAnalytics', () => {
    it('returns posts unchanged if dataSource is empty or provider is not ga4', async () => {
      expect(await mergeWithAnalytics([dummyPost], null)).toEqual([dummyPost])
      expect(
        await mergeWithAnalytics([dummyPost], { provider: 'ga4', propertyId: '' })
      ).toEqual([dummyPost])
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

      expect(result[0].analyticsStats).toEqual({
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
