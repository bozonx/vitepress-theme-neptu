import { describe, it, expect, vi } from 'vitest'
import {
  mergeLandingConfig,
  defineLandingConfig,
  defineLandingConfigSync,
} from '../../../src/configs/siteConfigBase.ts'
import { autoLoadSiteLocales } from '../../../src/configs/loadSiteLocale.ts'

vi.mock('../../../src/configs/loadSiteLocale.ts', () => ({
  autoLoadSiteLocales: vi.fn(async () => ({ en: { lang: 'en-US' } })),
  loadSiteLocale: vi.fn(async () => ({ lang: 'en-US' })),
}))

vi.mock('vitepress-theme-neptu/transformers', () => ({
  collectImageDimensions: vi.fn(),
  resolveMediaPaths: vi.fn(),
  transformTitle: vi.fn(),
  transformPageMeta: vi.fn(),
  resolveDescription: vi.fn(),
  addDescriptionMetaTag: vi.fn(),
  addOgMetaTags: vi.fn(),
  addJsonLd: vi.fn(),
  addHreflang: vi.fn(),
  addCanonicalLink: vi.fn(),
  filterSitemap: vi.fn((items: unknown[]) => items),
  generateRobotsTxt: vi.fn(),
  mdImage: vi.fn(),
}))

vi.mock('vitepress-theme-neptu/utils', () => ({
  omitUndefined: (obj: Record<string, unknown>) =>
    Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)),
  hasNoIndex: vi.fn(() => false),
  deepMerge: vi.fn(
    (a: Record<string, unknown>, b: Record<string, unknown>) => ({ ...a, ...b })
  ),
  resolveBaseLocaleKey: vi.fn(() => 'en'),
  resolveContentMediaPath: vi.fn((value: unknown) => value),
  resolveTranslationsByFilePath: vi.fn(),
  extractThemeConfig: vi.fn((site: Record<string, unknown> | undefined) =>
    (site?.themeConfig as Record<string, unknown> | undefined) ?? {}
  ),
  asExtendedPageData: vi.fn((d: unknown) => d),
  asExtendedSiteConfig: vi.fn((d: unknown) => d),
  asTransformContext: vi.fn((d: unknown) => d),
  asTransformHeadContext: vi.fn((d: unknown) => d),
  mergeReturnedPageData: vi.fn((pageData: Record<string, unknown>, returned: unknown) => {
    if (returned && typeof returned === 'object' && !Array.isArray(returned)) {
      Object.assign(pageData, returned)
    }
  }),
  commonBaseConfig: {
    head: [
      ['meta', { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' }],
      ['link', { rel: 'icon', sizes: '16x16', href: '/img/favicon-16x16.png' }],
      ['link', { rel: 'icon', sizes: '32x32', href: '/img/favicon-32x32.png' }],
      ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/img/apple-touch-icon.png' }],
      ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ],
    lastUpdated: true,
    cleanUrls: true,
    lang: 'en-US',
  },
  commonHead: [
    ['meta', { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' }],
    ['link', { rel: 'icon', sizes: '16x16', href: '/img/favicon-16x16.png' }],
    ['link', { rel: 'icon', sizes: '32x32', href: '/img/favicon-32x32.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/img/apple-touch-icon.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
  ],
  normalizeSitemapUrl: vi.fn((p: string) => p.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')),
  resolveSitemapSiteUrl: vi.fn((siteUrl: string | undefined) => {
    if (!siteUrl) return { hostname: undefined, basePath: '' }
    const url = new URL(siteUrl)
    return {
      hostname: url.origin,
      basePath: url.pathname.replace(/^\/+|\/+$/g, ''),
    }
  }),
  prefixSitemapItems: vi.fn((items: Array<{ url: string; links: Array<{ url?: string }> }>, basePath: string) =>
    basePath
      ? items.map((item) => ({
          ...item,
          url: `${basePath}/${item.url}`,
          links: item.links.map((link) => ({
            ...link,
            url: link.url ? `${basePath}/${link.url}` : link.url,
          })),
        }))
      : items
  ),
  warnMissingRequired: vi.fn((_config: unknown, prefix: string) => {
    if (!(_config as { siteUrl?: string }).siteUrl) {
      console.warn(`${prefix} \`siteUrl\` is not set.`)
    }
    if (!(_config as { locales?: Record<string, unknown> }).locales || Object.keys((_config as { locales?: Record<string, unknown> }).locales || {}).length === 0) {
      console.warn(`${prefix} \`locales\` is empty.`)
    }
  }),
  resolveExternalLinkIcon: vi.fn((userVal: boolean | undefined, defaultVal: boolean) =>
    typeof userVal === 'boolean' ? userVal : defaultVal
  ),
}))

vi.mock('vitepress-theme-neptu/utils/node', () => ({
  assertStrictLocaleStructure: vi.fn((config: { locales?: Record<string, unknown> }) => {
    if (Object.hasOwn(config.locales || {}, 'root')) {
      throw new Error('`root` content locale is not supported')
    }
  }),
  createSiteYamlHotReloadPlugin: vi.fn(() => ({ name: 'hot-reload' })),
  createColocatedMediaPlugin: vi.fn(() => ({ name: 'colocated-media' })),
  getImageDimensions: vi.fn(),
}))

describe('mergeLandingConfig', () => {
  it('returns merged config with defaults', () => {
    const result = mergeLandingConfig({})
    expect(result.themeConfig).toBeDefined()
    expect(result.themeConfig.externalLinkIcon).toBe(true)
    expect(result.themeConfig.i18nRouting).toBe(true)
    expect(result.themeConfig.mainHeroImg).toBe('/img/home-logo.webp')
    expect(result.themeConfig.colorPicker).toBe(false)
    expect(result.themeConfig.stylePicker).toBe(false)
  })

  it('does not throw when themeConfig is missing', () => {
    expect(() => mergeLandingConfig({})).not.toThrow()
  })

  it('overrides defaults with provided values', () => {
    const result = mergeLandingConfig({
      themeConfig: { externalLinkIcon: false, mainHeroImg: '/img/custom.svg' },
    })
    expect(result.themeConfig.externalLinkIcon).toBe(false)
    expect(result.themeConfig.mainHeroImg).toBe('/img/custom.svg')
  })

  it('merges head arrays', () => {
    const result = mergeLandingConfig({
      head: [['meta', { name: 'custom', content: 'value' }]],
    })
    expect(result.head).toEqual(
      expect.arrayContaining([
        expect.arrayContaining(['meta', expect.any(Object)]),
      ])
    )
    const customMeta = result.head.find(
      (h) => (h[1] as Record<string, unknown> | undefined)?.name === 'custom'
    )
    expect(customMeta).toEqual(['meta', { name: 'custom', content: 'value' }])
  })

  it('merges locales', () => {
    const result = mergeLandingConfig({
      locales: { de: { label: 'Deutsch' } },
    })
    expect(result.locales.de).toEqual({ label: 'Deutsch' })
  })

  it('wraps transformPageData to call internal transformers', () => {
    const result = mergeLandingConfig({})
    expect(typeof result.transformPageData).toBe('function')
  })

  it('wraps transformHead to call meta transformers', () => {
    const result = mergeLandingConfig({})
    expect(typeof result.transformHead).toBe('function')
  })

  it('wraps buildEnd to call generateRobotsTxt', () => {
    const result = mergeLandingConfig({})
    expect(typeof result.buildEnd).toBe('function')
  })

  it('includes sitemap configuration with filterSitemap', () => {
    const result = mergeLandingConfig({})
    expect(result.sitemap).toBeDefined()
    expect(typeof result.sitemap.transformItems).toBe('function')
    const items = [{ url: 'en/post/test', links: [] }]
    expect(result.sitemap.transformItems(items)).toEqual(items)
  })

  it('sitemap hostname comes from siteUrl', () => {
    const result = mergeLandingConfig({ siteUrl: 'https://landing.example.com' })
    expect(result.sitemap.hostname).toBe('https://landing.example.com')
  })

  it('preserves the siteUrl pathname in sitemap entries', () => {
    const result = mergeLandingConfig({
      siteUrl: 'https://landing.example.com/project/landing',
    })
    expect(result.sitemap.hostname).toBe('https://landing.example.com')
    expect(result.sitemap.transformItems([{ url: 'en/', links: [{ url: 'en/', lang: 'en-US' }] }])).toEqual([
      {
        url: 'project/landing/en/',
        links: [{ url: 'project/landing/en/', lang: 'en-US' }],
      },
    ])
  })

  it('deep merges themeConfig.seo', () => {
    const result = mergeLandingConfig({
      themeConfig: { seo: { maxDescriptionLength: 200 } },
    })
    expect(result.themeConfig.seo.maxDescriptionLength).toBe(200)
    expect(result.themeConfig.seo.autoCanonical).toBe(true)
  })

  it('provides default t from built-in EN locale when t is not specified', () => {
    const result = mergeLandingConfig({})
    expect(result.themeConfig.t).toBeDefined()
  })

  it('markdown config includes lazyLoading image', () => {
    const result = mergeLandingConfig({})
    expect(result.markdown.image.lazyLoading).toBe(true)
  })

  it('vite ssr config marks theme as noExternal', () => {
    const result = mergeLandingConfig({})
    expect(result.vite.ssr.noExternal).toContain('vitepress-theme-neptu')
    expect(result.vite.ssr.noExternal).toContain('vitepress-theme-neptu-landing')
  })

  it('vite merges with provided config', () => {
    const result = mergeLandingConfig({
      vite: { build: { target: 'esnext' } },
    })
    expect(result.vite.build.target).toBe('esnext')
    expect(result.vite.ssr.noExternal).toContain('vitepress-theme-neptu')
  })

  it('includes lastUpdated at top level', () => {
    const result = mergeLandingConfig({})
    expect(result.lastUpdated).toBe(true)
  })

  it('includes cleanUrls at top level', () => {
    const result = mergeLandingConfig({})
    expect(result.cleanUrls).toBe(true)
  })

  it('resolves title from config', () => {
    const result = mergeLandingConfig({ title: 'Custom Title' })
    expect(result.title).toBe('Custom Title')
  })

  it('resolves title from en locale fallback', () => {
    const result = mergeLandingConfig({ en: { title: 'EN Title' } })
    expect(result.title).toBe('EN Title')
  })

  it('adds socialLinks when repo is provided', () => {
    const result = mergeLandingConfig({
      themeConfig: { repo: 'https://github.com/example/repo' },
    })
    expect(result.themeConfig.socialLinks).toEqual([
      { icon: 'github', link: 'https://github.com/example/repo' },
    ])
  })

  it('does not add socialLinks when repo is missing', () => {
    const result = mergeLandingConfig({})
    expect(result.themeConfig.socialLinks).toBeUndefined()
  })

  it('calls custom transformHead if provided', async () => {
    const customFn = vi.fn().mockReturnValue([
      ['meta', { name: 'custom-head', content: 'value' }],
    ])
    const result = mergeLandingConfig({ transformHead: customFn })
    const ctx = { head: [], pageData: {}, siteConfig: {} }
    await (result.transformHead as unknown as (ctx: unknown) => void)(ctx)
    expect(customFn).toHaveBeenCalledWith(ctx)
  })

  it('calls custom transformPageData and merges returned page data', async () => {
    const customFn = vi.fn().mockReturnValue({
      frontmatter: { title: 'Returned Title' },
      customData: 'value',
    })
    const result = mergeLandingConfig({ transformPageData: customFn })
    const pageData = { frontmatter: {}, relativePath: 'en/index.md' }
    const ctx = { siteConfig: {} }
    await (result.transformPageData as unknown as (
      pageData: unknown,
      ctx: unknown
    ) => void)(pageData, ctx)
    expect(customFn).toHaveBeenCalledWith(pageData, ctx)
    expect(pageData).toMatchObject({
      frontmatter: { title: 'Returned Title' },
      customData: 'value',
    })
  })

  it('calls custom buildEnd if provided', async () => {
    const customFn = vi.fn()
    const result = mergeLandingConfig({ buildEnd: customFn })
    const cfg = {} as Record<string, unknown>
    await (result.buildEnd as unknown as (cfg: unknown) => void)(cfg)
    expect(customFn).toHaveBeenCalledWith(cfg)
  })
})

describe('defineLandingConfigSync', () => {
  it('is a factory that calls mergeLandingConfig', () => {
    const result = defineLandingConfigSync({
      siteUrl: 'https://example.com',
      locales: { en: { lang: 'en-US' } },
    })
    expect(result.themeConfig).toBeDefined()
    expect(result.themeConfig.externalLinkIcon).toBe(true)
  })

  it('warns when siteUrl is missing', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    defineLandingConfigSync({ locales: { en: { lang: 'en-US' } } })
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('siteUrl'))
    warnSpy.mockRestore()
  })

  it('warns when locales are empty', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    defineLandingConfigSync({ siteUrl: 'https://example.com' })
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('locales'))
    warnSpy.mockRestore()
  })

  it('rejects the VitePress root content locale', () => {
    expect(() =>
      defineLandingConfigSync({
        siteUrl: 'https://example.com',
        locales: { root: { lang: 'en-US' } },
      })
    ).toThrow('`root` content locale is not supported')
  })
})

describe('defineLandingConfig', () => {
  it('discovers locales when they are omitted', async () => {
    const result = await defineLandingConfig({
      siteUrl: 'https://example.com',
      srcDir: '/src',
    })

    expect(autoLoadSiteLocales).toHaveBeenCalledWith({
      siteUrl: 'https://example.com',
      srcDir: '/src',
    })
    expect(result.locales.en.lang).toBe('en-US')
  })

  it('preserves explicit locales', async () => {
    vi.mocked(autoLoadSiteLocales).mockClear()

    const result = await defineLandingConfig({
      siteUrl: 'https://example.com',
      locales: { ru: { lang: 'ru-RU' } },
    })

    expect(autoLoadSiteLocales).not.toHaveBeenCalled()
    expect(result.locales.ru.lang).toBe('ru-RU')
  })
})
