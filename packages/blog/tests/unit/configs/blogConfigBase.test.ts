import { describe, it, expect, vi } from 'vitest'
import {
  mergeBlogConfig,
  defineBlogConfig,
  defineBlogConfigSync,
} from '../../../src/configs/blogConfigBase.ts'
import { autoLoadLocales } from '../../../src/utils/node/config.ts'

vi.mock('../../../src/utils/node/config.ts', () => ({
  autoLoadLocales: vi.fn(async () => ({ en: { lang: 'en-US' } })),
}))

vi.mock('../../../src/transformers/filterSitemap.ts', () => ({
  filterSitemap: vi.fn((items: any[]) => items),
}))

vi.mock('../../../src/transformers/collectImageDimensions.ts', () => ({
  collectImageDimensions: vi.fn(),
}))

vi.mock('../../../src/transformers/transformTitle.ts', () => ({
  transformTitle: vi.fn(),
}))

vi.mock('../../../src/transformers/transformPageMeta.ts', () => ({
  transformPageMeta: vi.fn(),
}))

vi.mock('../../../src/transformers/resolveDescription.ts', () => ({
  resolveDescription: vi.fn(),
}))

vi.mock('../../../src/transformers/addOgMetaTags.ts', () => ({
  addOgMetaTags: vi.fn(),
}))

vi.mock('../../../src/transformers/addJsonLd.ts', () => ({ addJsonLd: vi.fn() }))

vi.mock('../../../src/transformers/addHreflang.ts', () => ({
  addHreflang: vi.fn(),
}))

vi.mock('../../../src/transformers/addCanonicalLink.ts', () => ({
  addCanonicalLink: vi.fn(),
}))

vi.mock('../../../src/transformers/addRssLinks.ts', () => ({
  addRssLinks: vi.fn(),
}))

vi.mock('../../../src/transformers/generateRssFeed.ts', () => ({
  generateRssFeed: vi.fn(),
}))

describe('mergeBlogConfig', () => {
  it('returns merged config with defaults', () => {
    const result = mergeBlogConfig({})
    expect(result.themeConfig).toBeDefined()
    expect(result.themeConfig.perPage).toBe(10)
    expect(result.themeConfig.feeds.maxPosts).toBe(50)
  })

  it('does not throw when themeConfig is missing', () => {
    expect(() => mergeBlogConfig({})).not.toThrow()
  })

  it('overrides defaults with provided values', () => {
    const result = mergeBlogConfig({
      themeConfig: { perPage: 20, feeds: { maxPosts: 100 } },
    })
    expect(result.themeConfig.perPage).toBe(20)
    expect(result.themeConfig.feeds.maxPosts).toBe(100)
  })

  it('merges head arrays', () => {
    const result = mergeBlogConfig({
      head: [['meta', { name: 'custom', content: 'value' }]],
    })
    expect(result.head).toEqual(
      expect.arrayContaining([
        expect.arrayContaining(['meta', expect.any(Object)]),
      ])
    )
    const customMeta = result.head.find((h: any[]) => h[1]?.name === 'custom')
    expect(customMeta).toEqual(['meta', { name: 'custom', content: 'value' }])
  })

  it('merges locales', () => {
    const result = mergeBlogConfig({ locales: { de: { label: 'Deutsch' } } })
    expect(result.locales.de).toEqual({ label: 'Deutsch' })
  })

  it('preserves themeConfig.feeds.formats array', () => {
    const result = mergeBlogConfig({
      themeConfig: { feeds: { formats: ['rss', 'atom'] } },
    })
    expect(result.themeConfig.feeds.formats).toEqual(['rss', 'atom'])
  })

  it('wraps transformPageData to call internal transformers', () => {
    const result = mergeBlogConfig({})
    expect(typeof result.transformPageData).toBe('function')
  })

  it('wraps transformHead to call meta transformers', () => {
    const result = mergeBlogConfig({})
    expect(typeof result.transformHead).toBe('function')
  })

  it('wraps buildEnd to call generateRssFeed', () => {
    const result = mergeBlogConfig({})
    expect(typeof result.buildEnd).toBe('function')
  })

  it('includes sitemap configuration with filterSitemap', () => {
    const result = mergeBlogConfig({})
    expect(result.sitemap).toBeDefined()
    expect(typeof result.sitemap.transformItems).toBe('function')
    const items = [{ url: 'en/post/test', links: [] }]
    expect(result.sitemap.transformItems(items)).toEqual(items)
  })

  it('sitemap hostname comes from siteUrl', () => {
    const result = mergeBlogConfig({ siteUrl: 'https://blog.example.com' })
    expect(result.sitemap.hostname).toBe('https://blog.example.com')
  })

  it('deep merges themeConfig.popularPosts.dataSource', () => {
    const result = mergeBlogConfig({
      themeConfig: {
        popularPosts: { dataSource: { provider: 'ga4', propertyId: '123' } },
      },
    })
    expect(result.themeConfig.popularPosts.dataSource?.propertyId).toBe('123')
    expect(result.themeConfig.popularPosts.dataSource?.dataPeriodDays).toBe(30)
  })

  it('deep merges themeConfig.popularPosts', () => {
    const result = mergeBlogConfig({
      themeConfig: { popularPosts: { enabled: true } },
    })
    expect(result.themeConfig.popularPosts.enabled).toBe(true)
    expect(result.themeConfig.popularPosts.sortBy).toBe('pageviews')
  })

  it('provides complete default t from built-in EN locale when t is not specified', () => {
    const result = mergeBlogConfig({})
    expect(result.themeConfig.t).toBeDefined()
    expect(typeof result.themeConfig.t.popularPosts).toBe('string')
    expect(typeof result.themeConfig.t.tags).toBe('string')
  })

  it('deep merges partial t over built-in defaults', () => {
    const result = mergeBlogConfig({
      themeConfig: { t: { popularPosts: 'Top Posts' } },
    })
    expect(result.themeConfig.t.popularPosts).toBe('Top Posts')
    expect(typeof result.themeConfig.t.tags).toBe('string')
  })

  it('deep merges themeConfig.postList', () => {
    const result = mergeBlogConfig({
      themeConfig: { postList: { showTags: false, maxPreviewLength: 120 } },
    })
    expect(result.themeConfig.postList?.showTags).toBe(false)
    expect(result.themeConfig.postList?.showDate).toBe(true)
    expect(result.themeConfig.postList?.showAuthor).toBe(true)
    expect(result.themeConfig.postList?.maxPreviewLength).toBe(120)
  })

  it('markdown config includes lazyLoading image', () => {
    const result = mergeBlogConfig({})
    expect(result.markdown.image.lazyLoading).toBe(true)
  })

  it('vite ssr config marks theme as noExternal', () => {
    const result = mergeBlogConfig({})
    expect(result.vite.ssr.noExternal).toContain('vitepress-theme-neptu-blog')
  })

  it('vite merges with provided config', () => {
    const result = mergeBlogConfig({ vite: { build: { target: 'esnext' } } })
    expect(result.vite.build.target).toBe('esnext')
    expect(result.vite.ssr.noExternal).toContain('vitepress-theme-neptu-blog')
  })

  it('resolves title from config', () => {
    const result = mergeBlogConfig({ title: 'Custom Title' })
    expect(result.title).toBe('Custom Title')
  })

  it('resolves title from en locale fallback', () => {
    const result = mergeBlogConfig({ en: { title: 'EN Title' } })
    expect(result.title).toBe('EN Title')
  })

  it('calls custom transformHead if provided', async () => {
    const customFn = vi.fn().mockReturnValue([
      ['meta', { name: 'custom-head', content: 'value' }],
    ])
    const result = mergeBlogConfig({ transformHead: customFn })
    const ctx = { head: [], pageData: {}, siteConfig: {} }
    const extraHead = await (result.transformHead as any)(ctx)
    expect(customFn).toHaveBeenCalledWith(ctx)
    expect(extraHead).toEqual([
      ['meta', { name: 'custom-head', content: 'value' }],
    ])
  })

  it('calls custom transformPageData and merges returned page data', async () => {
    const customFn = vi.fn().mockReturnValue({
      frontmatter: { title: 'Returned Title' },
      customData: 'value',
    })
    const result = mergeBlogConfig({ transformPageData: customFn })
    const pageData = { frontmatter: {}, relativePath: 'en/post/test.md' }
    const ctx = { siteConfig: {} }
    await (result.transformPageData as any)(pageData, ctx)
    expect(customFn).toHaveBeenCalledWith(pageData, ctx)
    expect(pageData).toMatchObject({
      frontmatter: { title: 'Returned Title' },
      customData: 'value',
    })
  })

  it('calls custom buildEnd if provided', async () => {
    const customFn = vi.fn()
    const result = mergeBlogConfig({ buildEnd: customFn })
    const cfg = {}
    await (result.buildEnd as any)(cfg)
    expect(customFn).toHaveBeenCalledWith(cfg)
  })

  it('transformHead calls all SEO transformers by default', async () => {
    const {
      addOgMetaTags,
      addJsonLd,
      addHreflang,
      addCanonicalLink,
      addRssLinks,
    } = await import('../../../src/transformers/addOgMetaTags.ts').then(() => ({
      addOgMetaTags: vi.fn(),
      addJsonLd: vi.fn(),
      addHreflang: vi.fn(),
      addCanonicalLink: vi.fn(),
      addRssLinks: vi.fn(),
    }))
    const result = mergeBlogConfig({})
    const ctx = {
      head: [],
      pageData: { frontmatter: {} },
      siteConfig: { userConfig: { themeConfig: {} }, site: { locales: {} } },
      page: 'en/index.md',
    }
    await (result.transformHead as any)(ctx)
    expect(addOgMetaTags).not.toHaveBeenCalled()
    expect(addJsonLd).not.toHaveBeenCalled()
    expect(addHreflang).not.toHaveBeenCalled()
    expect(addCanonicalLink).not.toHaveBeenCalled()
    expect(addRssLinks).not.toHaveBeenCalled()
  })

  it('transformHead respects frontmatter.seo to disable transformers', async () => {
    const result = mergeBlogConfig({})
    const ctx = {
      head: [],
      pageData: { frontmatter: { seo: { og: false, jsonLd: false } } },
      siteConfig: { userConfig: { themeConfig: {} }, site: { locales: {} } },
      page: 'en/index.md',
    }
    await (result.transformHead as any)(ctx)
  })

  it('transformHead respects global themeConfig.seo to disable transformers', async () => {
    const result = mergeBlogConfig({
      themeConfig: { seo: { hreflang: false, canonical: false, rss: false } },
    })
    const ctx = {
      head: [],
      pageData: { frontmatter: {} },
      siteConfig: {
        userConfig: {
          themeConfig: {
            seo: { hreflang: false, canonical: false, rss: false },
          },
        },
        site: { locales: {} },
      },
      page: 'en/index.md',
    }
    await (result.transformHead as any)(ctx)
  })
})

describe('defineBlogConfigSync', () => {
  it('is a factory that calls mergeBlogConfig', () => {
    const result = defineBlogConfigSync({
      siteUrl: 'https://example.com',
      locales: { en: { lang: 'en-US' } },
    })
    expect(result.themeConfig).toBeDefined()
    expect(result.themeConfig.perPage).toBe(10)
  })

  it('warns when siteUrl is missing', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    defineBlogConfigSync({ locales: { en: { lang: 'en-US' } } })
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('siteUrl'))
    warnSpy.mockRestore()
  })

  it('warns when locales are empty', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    defineBlogConfigSync({ siteUrl: 'https://example.com' })
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('locales'))
    warnSpy.mockRestore()
  })

})

describe('defineBlogConfig', () => {
  it('discovers locales when they are omitted', async () => {
    const result = await defineBlogConfig({
      siteUrl: 'https://example.com',
      srcDir: '/src',
    })

    expect(autoLoadLocales).toHaveBeenCalledWith({
      siteUrl: 'https://example.com',
      srcDir: '/src',
    })
    expect(result.locales.en.lang).toBe('en-US')
  })

  it('preserves explicit locales', async () => {
    vi.mocked(autoLoadLocales).mockClear()

    const result = await defineBlogConfig({
      siteUrl: 'https://example.com',
      locales: { ru: { lang: 'ru-RU' } },
    })

    expect(autoLoadLocales).not.toHaveBeenCalled()
    expect(result.locales.ru.lang).toBe('ru-RU')
  })
})
