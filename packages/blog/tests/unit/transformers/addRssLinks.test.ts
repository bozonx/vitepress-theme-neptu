import { describe, it, expect, vi } from 'vitest'
import {
  addRssLinks,
  type AddRssLinksContext,
} from '../../../src/transformers/addRssLinks.ts'

vi.mock('../../../src/utils/node/index.ts', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../../../src/utils/node/index.ts')>()
  return {
    ...actual,
    getRssFormats: vi.fn((_config: any) => ['rss', 'atom']),
    getFormatInfo: vi.fn((format: string) => {
      const map: Record<string, { mimeType: string; title: string }> = {
        rss: { mimeType: 'application/rss+xml', title: 'RSS Feed' },
        atom: { mimeType: 'application/atom+xml', title: 'Atom Feed' },
      }
      return map[format] || map.rss
    }),
  }
})

describe('addRssLinks', () => {
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

  afterEach(() => warnSpy.mockClear())
  afterAll(() => warnSpy.mockRestore())

  function createContext(
    overrides: Partial<AddRssLinksContext> = {}
  ): AddRssLinksContext {
    return {
      page: 'en/index.md',
      head: [],
      pageData: (overrides.pageData ?? {
        filePath: 'en/index.md',
        frontmatter: { layout: 'home' },
        relativePath: 'en/index.md',
        title: 'English Blog',
        description: 'Blog description',
      }) as any,
      siteConfig: (overrides.siteConfig ?? {
        srcDir: '.',
        userConfig: { siteUrl: 'https://example.com', themeConfig: {} as any },
        site: {
          locales: {
            en: {
              title: 'English Blog',
              lang: 'en-US',
              label: 'English',
              link: '/en/',
            },
            ru: {
              title: 'Russian Blog',
              lang: 'ru-RU',
              label: 'Russian',
              link: '/ru/',
            },
          },
        },
      }) as any,
      ...overrides,
    } as AddRssLinksContext
  }

  it('does nothing for non-home pages', () => {
    const ctx = createContext({
      pageData: { frontmatter: { layout: 'post' } } as any,
    })
    addRssLinks(ctx)
    expect(ctx.head).toEqual([])
  })

  it('adds RSS links for current locale formats', () => {
    const ctx = createContext()
    addRssLinks(ctx)
    expect(ctx.head).toHaveLength(4)
    expect(ctx.head).toContainEqual([
      'link',
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: 'English Blog - RSS Feed',
        href: 'https://example.com/en/feed.rss',
        hreflang: 'en-US',
      },
    ])
    expect(ctx.head).toContainEqual([
      'link',
      {
        rel: 'alternate',
        type: 'application/atom+xml',
        title: 'English Blog - Atom Feed',
        href: 'https://example.com/en/feed.atom',
        hreflang: 'en-US',
      },
    ])
  })

  it('adds alternate locale links for configured formats', () => {
    const ctx = createContext()
    addRssLinks(ctx)
    expect(ctx.head).toContainEqual([
      'link',
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: 'Russian Blog - RSS Feed',
        href: 'https://example.com/ru/feed.rss',
        hreflang: 'ru-RU',
      },
    ])
    expect(ctx.head).toContainEqual([
      'link',
      {
        rel: 'alternate',
        type: 'application/atom+xml',
        title: 'Russian Blog - Atom Feed',
        href: 'https://example.com/ru/feed.atom',
        hreflang: 'ru-RU',
      },
    ])
  })

  it('keeps exactly one entry per locale and format', () => {
    const ctx = createContext({ page: 'ru/index.md' })
    addRssLinks(ctx)
    const ruAlts = ctx.head.filter((h) => h[1]?.hreflang === 'ru-RU')
    expect(ruAlts).toHaveLength(2)
  })

  it('warns and skips when siteUrl is missing', () => {
    const ctx = createContext({
      siteConfig: {
        userConfig: {},
        site: {
          locales: {
            en: { title: 'English Blog', label: 'English', link: '/en/' },
            ru: { title: 'Russian Blog', label: 'Russian', link: '/ru/' },
          },
        },
      } as any,
    })

    addRssLinks(ctx)
    expect(ctx.head).toEqual([])
    expect(warnSpy).toHaveBeenCalledWith(
      '[addRssLinks] siteUrl is not configured. RSS links were not added.'
    )
  })

  it('does nothing when frontmatter.seo.rss is false', () => {
    const ctx = createContext({
      pageData: {
        filePath: 'en/index.md',
        frontmatter: { layout: 'home', seo: { rss: false } },
        relativePath: 'en/index.md',
      } as any,
    })
    addRssLinks(ctx)
    expect(ctx.head).toEqual([])
  })
})
