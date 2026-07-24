import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as sharedUtils from '../../../src/utils/shared/index.ts'
import yaml from 'yaml'
import {
  addJsonLd,
  type AddJsonLdContext,
} from '../../../src/transformers/addJsonLd.ts'

beforeEach(() => {
  vi.spyOn(yaml, 'parse').mockImplementation((str: string) => {
    try {
      return JSON.parse(str)
    } catch {
      throw new Error('Invalid JSON/YAML')
    }
  })
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
})

vi.mock('../../../src/utils/shared/index.ts', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../../../src/utils/shared/index.ts')>()
  return {
    ...actual,
    isPost: vi.fn(),
    isAuthorPage: vi.fn(),
    isPage: vi.fn(),
    generatePageUrlPath: vi.fn((path: string) =>
      path.replace(/\.md$/, '').replace(/\/index$/, '')
    ),
    omitUndefined: vi.fn((obj: any) => {
      if (!obj || typeof obj !== 'object') return {}
      const result: Record<string, any> = {}
      for (const key of Object.keys(obj)) {
        if (obj[key] !== undefined) result[key] = obj[key]
      }
      return result
    }),
  }
})

describe('addJsonLd', () => {
  function createContext(
    overrides: Partial<AddJsonLdContext> = {}
  ): AddJsonLdContext {
    return {
      page: overrides.page ?? 'en/post/hello.md',
      head: [],
      pageData: {
        title: 'Hello',
        description: 'World',
        relativePath: 'en/post/hello.md',
        filePath: 'en/post/hello.md',
        frontmatter: {
          layout: 'post',
          date: '2023-01-01',
          cover: '/img/cover.png',
          tags: ['foo', 'bar'],
          authorId: 'alice',
        },
        lastUpdated: 1672531200000,
        ...overrides.pageData,
      } as any,
      siteConfig: {
        srcDir: '.',
        userConfig: {
          siteUrl: 'https://example.com',
          themeConfig: {
            authors: [
              { id: 'alice', name: 'Alice', aboutUrl: 'https://alice.com' },
            ],
            publisher: {
              name: 'Pub',
              url: 'https://pub.com',
              logo: '/img/logo.png',
            },
          },
        },
        site: {
          locales: {
            en: {
              lang: 'en-US',
              title: 'Blog',
              themeConfig: {
                authors: [
                  { id: 'alice', name: 'Alice', aboutUrl: 'https://alice.com' },
                ],
                publisher: {
                  name: 'Pub',
                  url: 'https://pub.com',
                  logo: '/img/logo.png',
                },
              },
            },
          },
        },
        ...overrides.siteConfig,
      } as any,
      ...overrides,
    }
  }

  it('does nothing if page has no slash', () => {
    const ctx = createContext({ page: 'hello' })
    addJsonLd(ctx)
    expect(ctx.head).toEqual([])
  })

  it('does nothing without matching locale config', () => {
    const ctx = createContext({
      page: 'de/post/hello.md',
      siteConfig: {
        userConfig: { siteUrl: 'https://example.com' },
        site: { locales: {} },
      } as any,
    })
    addJsonLd(ctx)
    expect(ctx.head).toEqual([])
  })

  it('adds post JSON-LD for post layout', () => {
    vi.mocked(sharedUtils.isPost).mockReturnValue(true)
    vi.mocked(sharedUtils.isAuthorPage).mockReturnValue(false)
    vi.mocked(sharedUtils.isPage).mockReturnValue(false)

    const ctx = createContext()
    addJsonLd(ctx)
    expect(ctx.head).toHaveLength(1)
    const script = ctx.head[0] as [string, any, string]
    expect(script[0]).toBe('script')
    expect(script[1]).toEqual({ type: 'application/ld+json' })

    const json = JSON.parse(script[2])
    expect(json['@context']).toBe('https://schema.org')
    expect(json['@type']).toBe('BlogPosting')
    expect(json.headline).toBe('Hello')
    expect(json.url).toBe('https://example.com/en/post/hello')
    expect(json.datePublished).toBe('2023-01-01T00:00:00.000Z')
    expect(json.inLanguage).toBe('en-US')
    expect(json.author).toEqual({
      '@type': 'Person',
      name: 'Alice',
      url: 'https://alice.com',
    })
    expect(json.publisher).toEqual({
      '@type': 'Organization',
      name: 'Pub',
      url: 'https://pub.com',
      logo: { '@type': 'ImageObject', url: 'https://example.com/img/logo.png' },
    })
    expect(json.isPartOf).toEqual({
      '@type': 'WebSite',
      '@id': 'https://example.com/en/#website',
      url: 'https://example.com/en',
      inLanguage: 'en-US',
    })
    expect(json.image).toBeDefined()
  })

  it('adds page JSON-LD for page layout', () => {
    vi.mocked(sharedUtils.isPost).mockReturnValue(false)
    vi.mocked(sharedUtils.isAuthorPage).mockReturnValue(false)
    vi.mocked(sharedUtils.isPage).mockReturnValue(true)

    const ctx = createContext({
      page: 'en/about.md',
      pageData: {
        title: 'About',
        description: 'About us',
        relativePath: 'en/about.md',
        frontmatter: { layout: 'page' },
      } as any,
    })
    addJsonLd(ctx)
    expect(ctx.head).toHaveLength(1)
    const json = JSON.parse((ctx.head[0] as [string, any, string])[2])
    expect(json['@type']).toBe('WebPage')
    expect(json.name).toBe('About')
  })

  it('adds author JSON-LD for author page', () => {
    vi.mocked(sharedUtils.isPost).mockReturnValue(false)
    vi.mocked(sharedUtils.isAuthorPage).mockReturnValue(true)
    vi.mocked(sharedUtils.isPage).mockReturnValue(false)

    const ctx = createContext({
      page: 'en/authors/alice/1.md',
      pageData: {
        title: 'Alice',
        description: 'Author page',
        relativePath: 'en/authors/alice/1.md',
        frontmatter: { layout: 'author' },
        params: { id: 'alice' },
      } as any,
    })
    addJsonLd(ctx)
    expect(ctx.head).toHaveLength(1)
    const json = JSON.parse((ctx.head[0] as [string, any, string])[2])
    expect(json['@type']).toBe('Person')
    expect(json.name).toBe('Alice')
  })

  it('skips author JSON-LD when author not found', () => {
    vi.mocked(sharedUtils.isPost).mockReturnValue(false)
    vi.mocked(sharedUtils.isAuthorPage).mockReturnValue(true)
    vi.mocked(sharedUtils.isPage).mockReturnValue(false)

    const ctx = createContext({
      page: 'en/authors/unknown/1.md',
      pageData: {
        title: 'Unknown',
        relativePath: 'en/authors/unknown/1.md',
        frontmatter: { layout: 'author' },
        params: { id: 'unknown' },
      } as any,
      siteConfig: {
        userConfig: {
          siteUrl: 'https://example.com',
          themeConfig: {
            authors: [{ id: 'alice', name: 'Alice' }],
          },
        },
        site: {
          locales: {
            en: {
              lang: 'en',
              title: 'Blog',
              themeConfig: { authors: [{ id: 'alice', name: 'Alice' }] },
            },
          },
        },
      } as any,
    })
    addJsonLd(ctx)
    expect(ctx.head).toHaveLength(0)
  })

  it('adds custom JSON-LD when frontmatter.jsonLd is set', () => {
    vi.mocked(sharedUtils.isPost).mockReturnValue(false)
    vi.mocked(sharedUtils.isPage).mockReturnValue(false)
    vi.mocked(sharedUtils.isAuthorPage).mockReturnValue(false)

    const ctx = createContext({
      page: 'en/custom.md',
      pageData: {
        title: 'Custom',
        relativePath: 'en/custom.md',
        frontmatter: {
          layout: 'util',
          jsonLd: '{"@type": "CustomType", "custom": true}',
        },
      } as any,
    })
    addJsonLd(ctx)
    expect(ctx.head).toHaveLength(1)
    const json = JSON.parse((ctx.head[0] as [string, any, string])[2])
    expect(json['@type']).toBe('CustomType')
    expect(json.custom).toBe(true)
  })

  it('skips empty or non-object JSON-LD', () => {
    vi.mocked(sharedUtils.isPost).mockReturnValue(false)
    vi.mocked(sharedUtils.isPage).mockReturnValue(false)
    vi.mocked(sharedUtils.isAuthorPage).mockReturnValue(false)

    const ctx = createContext({
      page: 'en/none.md',
      pageData: {
        title: 'None',
        relativePath: 'en/none.md',
        frontmatter: { layout: 'util' },
      } as any,
    })
    addJsonLd(ctx)
    expect(ctx.head).toHaveLength(0)
  })

  it('includes updatedDate when lastUpdated is present', () => {
    vi.mocked(sharedUtils.isPost).mockReturnValue(true)
    vi.mocked(sharedUtils.isAuthorPage).mockReturnValue(false)
    vi.mocked(sharedUtils.isPage).mockReturnValue(false)

    const ctx = createContext()
    addJsonLd(ctx)
    const json = JSON.parse((ctx.head[0] as [string, any, string])[2])
    expect(json.dateModified).toBe(new Date(1672531200000).toISOString())
  })

  it('uses frontmatter description when pageData.description is missing', () => {
    vi.mocked(sharedUtils.isPost).mockReturnValue(true)
    vi.mocked(sharedUtils.isAuthorPage).mockReturnValue(false)
    vi.mocked(sharedUtils.isPage).mockReturnValue(false)

    const ctx = createContext({
      pageData: {
        title: 'Hello',
        description: undefined,
        relativePath: 'en/post/hello.md',
        frontmatter: {
          layout: 'post',
          title: 'Hello',
          description: '  World from frontmatter  ',
          date: '2023-01-01',
        },
      } as any,
    })

    addJsonLd(ctx)

    const json = JSON.parse((ctx.head[0] as [string, any, string])[2])
    expect(json.description).toBe('World from frontmatter')
  })

  it('uses frontmatter title for pages when pageData.title is missing', () => {
    vi.mocked(sharedUtils.isPost).mockReturnValue(false)
    vi.mocked(sharedUtils.isAuthorPage).mockReturnValue(false)
    vi.mocked(sharedUtils.isPage).mockReturnValue(true)

    const ctx = createContext({
      page: 'en/about.md',
      pageData: {
        title: undefined,
        description: 'About us',
        relativePath: 'en/about.md',
        frontmatter: { layout: 'page', title: '  About  ' },
      } as any,
    })

    addJsonLd(ctx)

    const json = JSON.parse((ctx.head[0] as [string, any, string])[2])
    expect(json.name).toBe('About')
  })

  it('skips invalid lastUpdated instead of throwing', () => {
    vi.mocked(sharedUtils.isPost).mockReturnValue(true)
    vi.mocked(sharedUtils.isAuthorPage).mockReturnValue(false)
    vi.mocked(sharedUtils.isPage).mockReturnValue(false)

    const ctx = createContext({
      pageData: {
        title: 'Hello',
        description: 'World',
        relativePath: 'en/post/hello.md',
        frontmatter: { layout: 'post', date: '2023-01-01' },
        lastUpdated: 'not-a-date',
      } as any,
    })

    expect(() => addJsonLd(ctx)).not.toThrow()

    const json = JSON.parse((ctx.head[0] as [string, any, string])[2])
    expect(json.dateModified).toBeUndefined()
  })

  it('handles external cover URL', () => {
    vi.mocked(sharedUtils.isPost).mockReturnValue(true)
    vi.mocked(sharedUtils.isAuthorPage).mockReturnValue(false)
    vi.mocked(sharedUtils.isPage).mockReturnValue(false)

    const ctx = createContext()
    ctx.pageData.frontmatter.cover = 'https://cdn.example.com/cover.png'
    addJsonLd(ctx)
    const json = JSON.parse((ctx.head[0] as [string, any, string])[2])
    expect(json.image.url).toBe('https://cdn.example.com/cover.png')
  })

  it('normalizes relative cover paths without a leading slash', () => {
    vi.mocked(sharedUtils.isPost).mockReturnValue(true)
    vi.mocked(sharedUtils.isAuthorPage).mockReturnValue(false)
    vi.mocked(sharedUtils.isPage).mockReturnValue(false)

    const ctx = createContext()
    ctx.pageData.frontmatter.cover = 'img/cover.png'
    addJsonLd(ctx)
    const json = JSON.parse((ctx.head[0] as [string, any, string])[2])
    expect(json.image.url).toBe('https://example.com/img/cover.png')
  })

  it('includes keywords from tags', () => {
    vi.mocked(sharedUtils.isPost).mockReturnValue(true)
    vi.mocked(sharedUtils.isAuthorPage).mockReturnValue(false)
    vi.mocked(sharedUtils.isPage).mockReturnValue(false)

    const ctx = createContext()
    ctx.pageData.frontmatter.tags = [
      { name: 'JavaScript' } as any,
      'TypeScript',
    ]
    addJsonLd(ctx)
    const json = JSON.parse((ctx.head[0] as [string, any, string])[2])
    expect(json.keywords).toBe('JavaScript, TypeScript')
  })

  it('falls back to author ID when name is missing', () => {
    vi.mocked(sharedUtils.isPost).mockReturnValue(true)
    vi.mocked(sharedUtils.isAuthorPage).mockReturnValue(false)
    vi.mocked(sharedUtils.isPage).mockReturnValue(false)

    const ctx = createContext()
    ctx.siteConfig.userConfig.themeConfig.authors = [{ id: 'alice' } as any]
    ;(ctx.siteConfig.site.locales.en.themeConfig as any).authors = [
      { id: 'alice' },
    ]
    addJsonLd(ctx)
    const json = JSON.parse((ctx.head[0] as [string, any, string])[2])
    expect(json.author.name).toBe('alice')
  })

  it('constructs author URL when aboutUrl is absent', () => {
    vi.mocked(sharedUtils.isPost).mockReturnValue(true)
    vi.mocked(sharedUtils.isAuthorPage).mockReturnValue(false)
    vi.mocked(sharedUtils.isPage).mockReturnValue(false)

    const ctx = createContext()
    ctx.siteConfig.userConfig.themeConfig.authors = [{ id: 'alice' } as any]
    ;(ctx.siteConfig.site.locales.en.themeConfig as any).authors = [
      { id: 'alice' },
    ]
    addJsonLd(ctx)
    const json = JSON.parse((ctx.head[0] as [string, any, string])[2])
    expect(json.author.url).toBe('https://example.com/en/authors/alice/1')
  })

  it('normalizes URLs when siteUrl has a trailing slash', () => {
    vi.mocked(sharedUtils.isPost).mockReturnValue(true)
    vi.mocked(sharedUtils.isAuthorPage).mockReturnValue(false)
    vi.mocked(sharedUtils.isPage).mockReturnValue(false)

    const ctx = createContext()
    ctx.siteConfig.userConfig.siteUrl = 'https://example.com/'
    ctx.pageData.frontmatter.cover = 'img/cover.png'

    addJsonLd(ctx)

    const json = JSON.parse((ctx.head[0] as [string, any, string])[2])
    expect(json.url).toBe('https://example.com/en/post/hello')
    expect(json.image.url).toBe('https://example.com/img/cover.png')
  })

  it('warns and falls back to base post JSON-LD when custom YAML is invalid', () => {
    vi.mocked(sharedUtils.isPost).mockReturnValue(true)
    vi.mocked(sharedUtils.isAuthorPage).mockReturnValue(false)
    vi.mocked(sharedUtils.isPage).mockReturnValue(false)

    const ctx = createContext({
      pageData: {
        title: 'Hello',
        description: 'World',
        relativePath: 'en/post/hello.md',
        frontmatter: {
          layout: 'post',
          date: '2023-01-01',
          jsonLd: 'not: valid: yaml:',
        },
      } as any,
    })

    addJsonLd(ctx)

    expect(console.warn).toHaveBeenCalledOnce()
    expect(ctx.head).toHaveLength(1)
    const json = JSON.parse((ctx.head[0] as [string, any, string])[2])
    expect(json['@type']).toBe('BlogPosting')
    expect(json.headline).toBe('Hello')
  })

  it('warns and skips custom-only JSON-LD when YAML is invalid', () => {
    vi.mocked(sharedUtils.isPost).mockReturnValue(false)
    vi.mocked(sharedUtils.isPage).mockReturnValue(false)
    vi.mocked(sharedUtils.isAuthorPage).mockReturnValue(false)

    const ctx = createContext({
      page: 'en/custom.md',
      pageData: {
        title: 'Custom',
        relativePath: 'en/custom.md',
        frontmatter: { layout: 'util', jsonLd: 'not: valid: yaml:' },
      } as any,
    })

    addJsonLd(ctx)

    expect(console.warn).toHaveBeenCalledOnce()
    expect(ctx.head).toHaveLength(0)
  })

  it('wraps top-level custom JSON-LD arrays in @graph', () => {
    vi.mocked(sharedUtils.isPost).mockReturnValue(false)
    vi.mocked(sharedUtils.isPage).mockReturnValue(false)
    vi.mocked(sharedUtils.isAuthorPage).mockReturnValue(false)

    const ctx = createContext({
      page: 'en/custom.md',
      pageData: {
        title: 'Custom',
        relativePath: 'en/custom.md',
        frontmatter: {
          layout: 'util',
          jsonLd:
            '[{"@type":"Thing","name":"One"},{"@type":"Thing","name":"Two"}]',
        },
      } as any,
    })

    addJsonLd(ctx)

    expect(ctx.head).toHaveLength(1)
    const json = JSON.parse((ctx.head[0] as [string, any, string])[2])
    expect(json['@context']).toBe('https://schema.org')
    expect(json['@graph']).toEqual([
      { '@type': 'Thing', name: 'One' },
      { '@type': 'Thing', name: 'Two' },
    ])
  })

  it('ignores top-level custom arrays when merging into generated post JSON-LD', () => {
    vi.mocked(sharedUtils.isPost).mockReturnValue(true)
    vi.mocked(sharedUtils.isAuthorPage).mockReturnValue(false)
    vi.mocked(sharedUtils.isPage).mockReturnValue(false)

    const ctx = createContext({
      pageData: {
        title: 'Hello',
        description: 'World',
        relativePath: 'en/post/hello.md',
        frontmatter: {
          layout: 'post',
          date: '2023-01-01',
          jsonLd: '[{"@type":"Thing","name":"Ignored"}]',
        },
      } as any,
    })

    addJsonLd(ctx)

    expect(ctx.head).toHaveLength(1)
    const json = JSON.parse((ctx.head[0] as [string, any, string])[2])
    expect(json['@type']).toBe('BlogPosting')
    expect(json['@graph']).toBeUndefined()
  })

  it('does nothing when frontmatter.seo.jsonLd is false', () => {
    vi.mocked(sharedUtils.isPost).mockReturnValue(true)
    vi.mocked(sharedUtils.isAuthorPage).mockReturnValue(false)
    vi.mocked(sharedUtils.isPage).mockReturnValue(false)

    const ctx = createContext()
    ctx.pageData.frontmatter.seo = { jsonLd: false }
    addJsonLd(ctx)
    expect(ctx.head).toEqual([])
  })
})
