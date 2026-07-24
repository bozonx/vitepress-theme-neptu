import { describe, it, expect, vi } from 'vitest'
import {
  validatePostForRss,
  createPostGuid,
  formatTagsForRss,
  getFeedPath,
  getFeedUrl,
  validateRssConfig,
  getFormatInfo,
  getRssFormats,
  makeAuthorForRss,
} from '../../../../src/utils/node/rss.ts'

describe('validatePostForRss', () => {
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  afterEach(() => warnSpy.mockClear())
  afterAll(() => warnSpy.mockRestore())

  it('returns true for valid post', () => {
    expect(validatePostForRss({ title: 'Hello', date: '2024-01-01' }, '/hello')).toBe(true)
  })

  it('fails when title is missing', () => {
    expect(validatePostForRss({ date: '2024-01-01' }, '/hello')).toBe(false)
  })

  it('fails when date is missing', () => {
    expect(validatePostForRss({ title: 'Hello' }, '/hello')).toBe(false)
  })

  it('fails for invalid date format', () => {
    expect(validatePostForRss({ title: 'Hello', date: 'not-a-date' }, '/hello')).toBe(false)
  })

  it('fails for date too far in the future', () => {
    const future = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    expect(validatePostForRss({ title: 'Hello', date: future.toISOString() }, '/hello')).toBe(false)
  })

  it('passes for date within 1 day tolerance', () => {
    const nearFuture = new Date(Date.now() + 12 * 60 * 60 * 1000)
    expect(validatePostForRss({ title: 'Hello', date: nearFuture.toISOString() }, '/hello')).toBe(
      true
    )
  })

  it('passes for past date', () => {
    expect(validatePostForRss({ title: 'Hello', date: '2020-01-01' }, '/hello')).toBe(true)
  })

  it('handles Date object', () => {
    expect(validatePostForRss({ title: 'Hello', date: new Date('2024-06-01') }, '/hello')).toBe(true)
  })

  it('supports explicit reference date parameter for deterministic testing', () => {
    const fixedNow = new Date('2025-01-01T12:00:00Z')
    const validDate = '2025-01-02T06:00:00Z' // 18h in future relative to fixedNow (within 24h limit)
    const invalidFutureDate = '2025-01-03T12:00:00Z' // 48h in future relative to fixedNow

    expect(validatePostForRss({ title: 'Test', date: validDate }, '/test', fixedNow)).toBe(true)
    expect(validatePostForRss({ title: 'Test', date: invalidFutureDate }, '/test', fixedNow)).toBe(
      false
    )
  })
})

describe('createPostGuid', () => {
  it('includes date when provided', () => {
    expect(createPostGuid('https://site.com', '/path', '2024-03-15')).toBe(
      'https://site.com/path#2024-03-15'
    )
  })

  it('omits date when not provided', () => {
    expect(createPostGuid('https://site.com', '/path')).toBe('https://site.com/path')
  })

  it('handles Date object input', () => {
    expect(createPostGuid('https://site.com', '/path', new Date('2024-03-15'))).toBe(
      'https://site.com/path#2024-03-15'
    )
  })

  it('ignores invalid date string', () => {
    expect(createPostGuid('https://site.com', '/path', 'invalid-date')).toBe('https://site.com/path')
  })
})

describe('formatTagsForRss', () => {
  it('formats tags into categories', () => {
    expect(formatTagsForRss(['JavaScript', 'Vue'], 'https://site.com', 'en')).toEqual([
      { name: 'JavaScript', domain: 'https://site.com/en/tags/javascript/1' },
      { name: 'Vue', domain: 'https://site.com/en/tags/vue/1' },
    ])
  })

  it('trims whitespace and replaces spaces with hyphens', () => {
    expect(formatTagsForRss(['  web dev  '], 'https://site.com', 'en')).toEqual([
      { name: 'web dev', domain: 'https://site.com/en/tags/web-dev/1' },
    ])
  })

  it('filters non-string and empty entries', () => {
    expect(formatTagsForRss(['ok', '', 123, null, '   '], 'https://site.com', 'en')).toEqual([
      { name: 'ok', domain: 'https://site.com/en/tags/ok/1' },
    ])
  })

  it('supports tag objects with explicit slug', () => {
    expect(
      formatTagsForRss([{ name: 'Web Dev', slug: 'custom-web-dev' }], 'https://site.com', 'en')
    ).toEqual([
      { name: 'Web Dev', domain: 'https://site.com/en/tags/custom-web-dev/1' },
    ])
  })

  it('returns empty array for null', () => {
    expect(formatTagsForRss(null, 'https://site.com', 'en')).toEqual([])
  })

  it('returns empty array for non-array', () => {
    expect(formatTagsForRss('tag', 'https://site.com', 'en')).toEqual([])
  })

})

describe('validateRssConfig', () => {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  afterEach(() => errorSpy.mockClear())
  afterAll(() => errorSpy.mockRestore())

  it('returns true for valid config', () => {
    expect(
      validateRssConfig({
        site: { locales: { en: {} } },
        userConfig: { siteUrl: 'https://site.com' },
        outDir: 'dist',
      })
    ).toBe(true)
  })

  it('fails when site.locales is missing', () => {
    expect(validateRssConfig({ userConfig: { siteUrl: 'https://site.com' }, outDir: 'dist' })).toBe(
      false
    )
  })

  it('fails when siteUrl is missing', () => {
    expect(validateRssConfig({ site: { locales: {} }, outDir: 'dist' })).toBe(false)
  })

  it('fails when outDir is missing', () => {
    expect(
      validateRssConfig({ site: { locales: {} }, userConfig: { siteUrl: 'https://site.com' } })
    ).toBe(false)
  })
})

describe('getFormatInfo', () => {
  it('returns RSS info for rss', () => {
    const info = getFormatInfo('rss')
    expect(info.mimeType).toBe('application/rss+xml')
    expect(info.extension).toBe('rss')
  })

  it('returns Atom info for atom', () => {
    const info = getFormatInfo('atom')
    expect(info.mimeType).toBe('application/atom+xml')
  })

  it('returns JSON info for json', () => {
    const info = getFormatInfo('json')
    expect(info.mimeType).toBe('application/feed+json')
  })

  it('defaults to rss for unknown format', () => {
    const info = getFormatInfo('unknown')
    expect(info.mimeType).toBe('application/rss+xml')
  })
})

describe('getRssFormats', () => {
  it('returns defaults when no config', () => {
    expect(getRssFormats({})).toEqual(['rss', 'atom', 'json'])
  })

  it('returns configured formats', () => {
    expect(
      getRssFormats({ userConfig: { themeConfig: { feeds: { formats: ['rss', 'json'] } } } })
    ).toEqual(['rss', 'json'])
  })

  it('normalizes, deduplicates and filters invalid formats', () => {
    expect(
      getRssFormats({
        userConfig: {
          themeConfig: { feeds: { formats: [' RSS ', 'atom', 'atom', 'invalid'] } },
        },
      })
    ).toEqual(['rss', 'atom'])
  })
})

describe('feed helpers', () => {
  it('builds localized feed paths', () => {
    expect(getFeedPath('en', 'rss')).toBe('/en/feed.rss')
  })

  it('builds localized feed urls', () => {
    expect(getFeedUrl('https://site.com/', 'ru', 'atom')).toBe('https://site.com/ru/feed.atom')
  })
})

describe('makeAuthorForRss', () => {
  it('returns author info when found', () => {
    const config = {
      userConfig: {
        locales: {
          en: {
            themeConfig: {
              authors: [{ id: 'john', name: 'John' }],
            },
          },
        },
      },
    }
    expect(makeAuthorForRss(config, { authorId: 'john' }, 'https://site.com', 'en')).toEqual({
      name: 'John',
      link: 'https://site.com/authors/john/1',
    })
  })

  it('returns undefined when authorId is missing', () => {
    expect(makeAuthorForRss({}, {}, 'https://site.com', 'en')).toBeUndefined()
  })

  it('returns undefined when authors array is missing', () => {
    const config = {
      userConfig: {
        locales: { en: { themeConfig: {} } },
      },
    }
    expect(makeAuthorForRss(config, { authorId: 'john' }, 'https://site.com', 'en')).toBeUndefined()
  })

  it('reads authors from built site locales when available', () => {
    const config = {
      site: {
        locales: {
          en: {
            themeConfig: {
              authors: [{ id: 'john', name: 'John' }],
            },
          },
        },
      },
      userConfig: {
        themeConfig: {},
      },
    }
    expect(makeAuthorForRss(config, { authorId: 'john' }, 'https://site.com/en', 'en')).toEqual({
      name: 'John',
      link: 'https://site.com/en/authors/john/1',
    })
  })

  it('returns undefined when author is not found', () => {
    const config = {
      userConfig: {
        locales: {
          en: {
            themeConfig: {
              authors: [{ id: 'jane', name: 'Jane' }],
            },
          },
        },
      },
    }
    expect(makeAuthorForRss(config, { authorId: 'john' }, 'https://site.com', 'en')).toBeUndefined()
  })
})
