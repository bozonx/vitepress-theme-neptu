import { describe, it, expect, vi } from 'vitest'
import {
  addOgMetaTags,
  type AddOgMetaTagsContext,
} from '../../../src/transformers/addOgMetaTags.ts'

vi.mock('../../../src/utils/shared/index.ts', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../../../src/utils/shared/index.ts')>()
  return {
    ...actual,
    generatePageUrlPath: vi.fn((path: string) =>
      path.replace(/\.md$/, '').replace(/\/index$/, '')
    ),
  }
})

describe('addOgMetaTags', () => {
  function createContext(
    overrides: Partial<AddOgMetaTagsContext> = {}
  ): AddOgMetaTagsContext {
    return {
      head: [],
      pageData: {
        filePath: 'en/post/hello.md',
        relativePath: 'en/post/hello.md',
        frontmatter: {
          title: 'Hello',
          description: 'World',
          cover: '/img/cover.png',
          date: '2023-01-01',
          tags: ['foo', 'bar'],
          authorId: 'alice',
          layout: 'post',
        },
        ...overrides.pageData,
      } as any,
      siteConfig: {
        userConfig: {
          siteUrl: 'https://example.com',
          themeConfig: {
            authors: [{ id: 'alice', name: 'Alice Author' }],
          },
        },
        site: {
          locales: {
            en: {
              title: 'My Blog',
              description: 'Blog description',
              lang: 'en-US',
              themeConfig: {
                authors: [
                  {
                    id: 'alice',
                    name: 'Alice Author',
                    aboutUrl: 'https://alice.example.com',
                  },
                ],
              },
            },
          },
        },
        ...overrides.siteConfig,
      } as any,
      ...overrides,
    }
  }

  it('does nothing without siteUrl', () => {
    const ctx = createContext({
      siteConfig: { userConfig: {}, site: { locales: {} } } as any,
    })
    addOgMetaTags(ctx)
    expect(ctx.head).toEqual([])
  })

  it('does nothing without matching locale config', () => {
    const ctx = createContext({
      pageData: {
        filePath: 'de/post/hello.md',
        relativePath: 'de/post/hello.md',
        frontmatter: {},
      } as any,
    })
    addOgMetaTags(ctx)
    expect(ctx.head).toEqual([])
  })

  it('adds basic Open Graph tags', () => {
    const ctx = createContext()
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual([
      'meta',
      { property: 'og:site_name', content: 'My Blog' },
    ])
    expect(ctx.head).toContainEqual([
      'meta',
      { property: 'og:type', content: 'article' },
    ])
    expect(ctx.head).toContainEqual([
      'meta',
      { property: 'og:title', content: 'Hello' },
    ])
    expect(ctx.head).toContainEqual([
      'meta',
      { property: 'og:description', content: 'World' },
    ])
    expect(ctx.head).toContainEqual([
      'meta',
      { property: 'og:url', content: 'https://example.com/en/post/hello' },
    ])
    expect(ctx.head).toContainEqual([
      'meta',
      { property: 'og:locale', content: 'en_US' },
    ])
  })

  it('adds Twitter card tags', () => {
    const ctx = createContext()
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual([
      'meta',
      { name: 'twitter:card', content: 'summary_large_image' },
    ])
    expect(ctx.head).toContainEqual([
      'meta',
      { name: 'twitter:title', content: 'Hello' },
    ])
    expect(ctx.head).toContainEqual([
      'meta',
      { name: 'twitter:description', content: 'World' },
    ])
  })

  it('uses cover image when available', () => {
    const ctx = createContext()
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual([
      'meta',
      { property: 'og:image', content: 'https://example.com/img/cover.png' },
    ])
    expect(ctx.head).toContainEqual([
      'meta',
      { name: 'twitter:image', content: 'https://example.com/img/cover.png' },
    ])
  })

  it('uses absolute cover URL as-is', () => {
    const ctx = createContext()
    ctx.pageData.frontmatter.cover = 'https://cdn.example.com/cover.png'
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual([
      'meta',
      { property: 'og:image', content: 'https://cdn.example.com/cover.png' },
    ])
  })

  it('uses protocol-relative cover URL as external', () => {
    const ctx = createContext()
    ctx.pageData.frontmatter.cover = '//cdn.example.com/cover.png'
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual([
      'meta',
      { property: 'og:image', content: 'https://cdn.example.com/cover.png' },
    ])
  })

  it('normalizes relative cover paths without a leading slash', () => {
    const ctx = createContext()
    ctx.pageData.frontmatter.cover = 'img/cover.png'
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual([
      'meta',
      { property: 'og:image', content: 'https://example.com/img/cover.png' },
    ])
  })

  it('skips image tags when no image is available', () => {
    const ctx = createContext()
    ctx.pageData.frontmatter.cover = undefined
    addOgMetaTags(ctx)
    const imageTags = ctx.head.filter(
      (h) => h[1]?.property === 'og:image' || h[1]?.name === 'twitter:image'
    )
    expect(imageTags).toHaveLength(0)
    expect(ctx.head).toContainEqual([
      'meta',
      { name: 'twitter:card', content: 'summary' },
    ])
  })

  it('uses frontmatter title over locale title', () => {
    const ctx = createContext()
    ctx.pageData.frontmatter.title = 'Custom Title'
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual([
      'meta',
      { property: 'og:title', content: 'Custom Title' },
    ])
  })

  it('falls back to locale title when frontmatter title is absent', () => {
    const ctx = createContext()
    ctx.pageData.frontmatter.title = undefined
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual([
      'meta',
      { property: 'og:title', content: 'My Blog' },
    ])
  })

  it('uses website type for non-post pages', () => {
    const ctx = createContext()
    ctx.pageData.frontmatter.layout = 'page'
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual([
      'meta',
      { property: 'og:type', content: 'website' },
    ])
  })

  it('adds article published time for posts', () => {
    const ctx = createContext()
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual([
      'meta',
      {
        property: 'article:published_time',
        content: new Date('2023-01-01').toISOString(),
      },
    ])
  })

  it('adds article tags for posts', () => {
    const ctx = createContext()
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual([
      'meta',
      { property: 'article:tag', content: 'foo' },
    ])
    expect(ctx.head).toContainEqual([
      'meta',
      { property: 'article:tag', content: 'bar' },
    ])
  })

  it('adds article author for posts', () => {
    const ctx = createContext()
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual([
      'meta',
      { property: 'article:author', content: 'https://alice.example.com' },
    ])
  })

  it('skips article-specific tags for non-posts', () => {
    const ctx = createContext()
    ctx.pageData.frontmatter.layout = 'page'
    addOgMetaTags(ctx)
    const articleTags = ctx.head.filter((h) =>
      h[1]?.property?.startsWith('article:')
    )
    expect(articleTags).toHaveLength(0)
  })

  it('handles tag objects with name property', () => {
    const ctx = createContext()
    ctx.pageData.frontmatter.tags = [{ name: 'Tagged' } as any, 'plain']
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual([
      'meta',
      { property: 'article:tag', content: 'Tagged' },
    ])
    expect(ctx.head).toContainEqual([
      'meta',
      { property: 'article:tag', content: 'plain' },
    ])
  })

  it('handles string tag', () => {
    const ctx = createContext()
    ctx.pageData.frontmatter.tags = ['single-tag'] as any
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual([
      'meta',
      { property: 'article:tag', content: 'single-tag' },
    ])
  })

  it('skips meta tags with falsy content', () => {
    const ctx = createContext()
    ctx.pageData.frontmatter.title = ''
    ctx.pageData.frontmatter.description = ''
    ctx.siteConfig.site.locales.en.title = ''
    addOgMetaTags(ctx)
    const titleTag = ctx.head.find((h) => h[1]?.property === 'og:title')
    expect(titleTag).toBeUndefined()
  })

  it('uses pageData.description as fallback before locale description', () => {
    const ctx = createContext()
    ctx.pageData.frontmatter.description = ''
    ;(ctx.pageData as any).description = 'Resolved page description'
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual([
      'meta',
      { property: 'og:description', content: 'Resolved page description' },
    ])
    expect(ctx.head).toContainEqual([
      'meta',
      { name: 'twitter:description', content: 'Resolved page description' },
    ])
  })

  it('skips published_time when date is invalid', () => {
    const ctx = createContext()
    ctx.pageData.frontmatter.date = 'not-a-date'
    expect(() => addOgMetaTags(ctx)).not.toThrow()
    const publishedTag = ctx.head.find(
      (h) => h[1]?.property === 'article:published_time'
    )
    expect(publishedTag).toBeUndefined()
  })

  it('adds image alt and dimensions when available', () => {
    const ctx = createContext()
    ctx.pageData.frontmatter.coverAlt = 'Cover alt text'
    ctx.pageData.frontmatter.coverWidth = 1200
    ctx.pageData.frontmatter.coverHeight = 630
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual([
      'meta',
      { property: 'og:image:alt', content: 'Cover alt text' },
    ])
    expect(ctx.head).toContainEqual([
      'meta',
      { property: 'og:image:width', content: '1200' },
    ])
    expect(ctx.head).toContainEqual([
      'meta',
      { property: 'og:image:height', content: '630' },
    ])
    expect(ctx.head).toContainEqual([
      'meta',
      { name: 'twitter:image:alt', content: 'Cover alt text' },
    ])
  })

  it('uses explicit canonical URL for og:url when frontmatter has canonical', () => {
    const ctx = createContext()
    ctx.pageData.frontmatter.canonical = 'https://other.com/page'
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual([
      'meta',
      { property: 'og:url', content: 'https://other.com/page' },
    ])
  })

  it('uses self page URL for og:url when canonical is self', () => {
    const ctx = createContext()
    ctx.pageData.frontmatter.canonical = 'self'
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual([
      'meta',
      { property: 'og:url', content: 'https://example.com/en/post/hello' },
    ])
  })

  it('handles trailing slash in siteUrl without producing malformed URLs', () => {
    const ctx = createContext()
    ctx.siteConfig.userConfig.siteUrl = 'https://example.com/'
    ctx.pageData.frontmatter.cover = 'img/cover.png'
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual([
      'meta',
      { property: 'og:url', content: 'https://example.com/en/post/hello' },
    ])
    expect(ctx.head).toContainEqual([
      'meta',
      { property: 'og:image', content: 'https://example.com/img/cover.png' },
    ])
  })

  it('does nothing when frontmatter.seo.og is false', () => {
    const ctx = createContext()
    ctx.pageData.frontmatter.seo = { og: false }
    addOgMetaTags(ctx)
    expect(ctx.head).toEqual([])
  })

  it('surfaces description via og/twitter but not a bare meta description', () => {
    const ctx = createContext()
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual([
      'meta',
      { property: 'og:description', content: 'World' },
    ])
    expect(ctx.head).toContainEqual([
      'meta',
      { name: 'twitter:description', content: 'World' },
    ])
    // The plain <meta name="description"> is owned by addDescriptionMetaTag,
    // so addOgMetaTags must not emit a duplicate.
    expect(ctx.head).not.toContainEqual([
      'meta',
      { name: 'description', content: 'World' },
    ])
  })

  it('converts og:locale hyphen to underscore', () => {
    const ctx = createContext()
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual([
      'meta',
      { property: 'og:locale', content: 'en_US' },
    ])
    expect(ctx.head).not.toContainEqual([
      'meta',
      { property: 'og:locale', content: 'en-US' },
    ])
  })

  it('falls back to auto-generated og:url when canonical is invalid URL', () => {
    const ctx = createContext()
    ctx.pageData.frontmatter.canonical = 'not-a-valid-url'
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual([
      'meta',
      { property: 'og:url', content: 'https://example.com/en/post/hello' },
    ])
  })

  it('adds twitter:site when twitterSite is set in themeConfig', () => {
    const ctx = createContext()
    ;(ctx.siteConfig.site.locales.en.themeConfig as any).twitterSite = 'myblog'
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual([
      'meta',
      { name: 'twitter:site', content: '@myblog' },
    ])
  })

  it('normalizes twitter:site handle with leading @', () => {
    const ctx = createContext()
    ;(ctx.siteConfig.site.locales.en.themeConfig as any).twitterSite = '@myblog'
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual([
      'meta',
      { name: 'twitter:site', content: '@myblog' },
    ])
  })

  it('skips twitter:site when twitterSite is not set', () => {
    const ctx = createContext()
    addOgMetaTags(ctx)
    const tag = ctx.head.find((h) => h[1]?.name === 'twitter:site')
    expect(tag).toBeUndefined()
  })

  it('adds twitter:creator when author has twitterHandle', () => {
    const ctx = createContext()
    ;(ctx.siteConfig.site.locales.en.themeConfig as any).authors = [
      { id: 'alice', name: 'Alice Author', aboutUrl: 'https://alice.example.com', twitterHandle: 'alice_dev' },
    ]
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual([
      'meta',
      { name: 'twitter:creator', content: '@alice_dev' },
    ])
  })

  it('normalizes twitter:creator handle with leading @', () => {
    const ctx = createContext()
    ;(ctx.siteConfig.site.locales.en.themeConfig as any).authors = [
      { id: 'alice', name: 'Alice Author', aboutUrl: 'https://alice.example.com', twitterHandle: '@alice_dev' },
    ]
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual([
      'meta',
      { name: 'twitter:creator', content: '@alice_dev' },
    ])
  })

  it('skips twitter:creator when author has no twitterHandle', () => {
    const ctx = createContext()
    addOgMetaTags(ctx)
    const tag = ctx.head.find((h) => h[1]?.name === 'twitter:creator')
    expect(tag).toBeUndefined()
  })

  it('skips twitter:creator when post has no authorId', () => {
    const ctx = createContext()
    ctx.pageData.frontmatter.authorId = undefined
    ;(ctx.siteConfig.site.locales.en.themeConfig as any).authors = [
      { id: 'alice', name: 'Alice Author', twitterHandle: 'alice_dev' },
    ]
    addOgMetaTags(ctx)
    const tag = ctx.head.find((h) => h[1]?.name === 'twitter:creator')
    expect(tag).toBeUndefined()
  })
})
