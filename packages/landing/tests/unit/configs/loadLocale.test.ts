import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  loadLocale,
  autoLoadLocales,
} from '../../../src/configs/loadLocale.ts'

vi.mock('vitepress-theme-neptu/utils/node', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vitepress-theme-neptu/utils/node')>()
  const mockedHasLocaleSite = vi.fn((_srcDir: string, _name: string) => true)
  return {
    ...actual,
    parseLocaleSite: vi.fn(async () => ({})),
    parseSharedSite: vi.fn(async () => ({})),
    hasLocaleSite: mockedHasLocaleSite,
    resolveEditLinkPattern: vi.fn(
      (repo: string) => `${repo}/blob/main/{path}`
    ),
    autoLoadLocalesFactory: vi.fn(
      async (options: {
        config: { srcDir?: string }
        loadLocale: (localeIndex: string, config: unknown) => Promise<unknown>
      }) => {
        const srcDir = options.config.srcDir || ''
        if (!srcDir) {
          console.warn(
            '[vitepress-theme-neptu-landing] autoLoadLocales: `srcDir` is not set; no locales discovered.'
          )
          return {}
        }
        const fs = await import('node:fs')
        if (!fs.existsSync(srcDir)) {
          console.warn(
            `[vitepress-theme-neptu-landing] autoLoadLocales: \`srcDir\` does not exist: ${srcDir}`
          )
          return {}
        }
        const entries = await fs.promises.readdir(srcDir, { withFileTypes: true })
        const candidates = entries
          .filter((entry) => entry.isDirectory())
          .map((entry) => entry.name)
          .filter((name) => !name.startsWith('.') && !name.startsWith('_'))
          .sort()

        const locales: Record<string, unknown> = {}
        for (const name of candidates) {
          if (!mockedHasLocaleSite(srcDir, name)) continue
          locales[name] = await options.loadLocale(name, options.config)
        }

        if (Object.keys(locales).length === 0) {
          console.warn(
            `[vitepress-theme-neptu-landing] autoLoadLocales: no folders with \`_site.yaml\` or \`_site.ts\` found under ${srcDir}.`
          )
        }

        return locales
      }
    ),
  }
})

vi.mock('vitepress-theme-neptu/utils', () => ({
  interpolateDollarTemplate: vi.fn(
    (tmpl: string | null | undefined, data: Record<string, unknown> | null) => {
      if (!tmpl) return ''
      let result = tmpl
      for (const [key, value] of Object.entries(data || {})) {
        result = result.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), String(value))
      }
      return result
    }
  ),
  isExternalUrl: vi.fn((url: string) => url.startsWith('http')),
  deepMerge: vi.fn(function deepMerge(
    a: Record<string, unknown>,
    b: Record<string, unknown>
  ): Record<string, unknown> {
    if (!a) return b
    if (!b) return a
    const result: Record<string, unknown> = { ...a }
    for (const key of Object.keys(b)) {
      if (
        a[key] &&
        typeof a[key] === 'object' &&
        !Array.isArray(a[key]) &&
        b[key] &&
        typeof b[key] === 'object' &&
        !Array.isArray(b[key])
      ) {
        result[key] = deepMerge(
          a[key] as Record<string, unknown>,
          b[key] as Record<string, unknown>
        )
      } else {
        result[key] = b[key]
      }
    }
    return result
  }),
  resolveBaseLocaleKey: vi.fn((key: string) => {
    if (key.startsWith('en')) return 'en'
    if (key.startsWith('ru')) return 'ru'
    return 'en'
  }),
  extractThemeConfig: vi.fn((site: Record<string, unknown> | undefined) =>
    (site?.themeConfig as Record<string, unknown> | undefined) ?? {}
  ),
  castToExtendedPageData: vi.fn((d: unknown) => d),
  castToExtendedSiteConfig: vi.fn((d: unknown) => d),
  castToTransformContext: vi.fn((d: unknown) => d),
  castToTransformHeadContext: vi.fn((d: unknown) => d),
  mergeReturnedPageData: vi.fn(),
  hasTailwindPlugin: vi.fn(() => false),
  sharedBaseConfig: {
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
  normalizeSitemapUrl: vi.fn((p: string) => p),
  warnMissingRequired: vi.fn(),
  resolveExternalLinkIcon: vi.fn((_u: boolean | undefined, d: boolean) => d),
}))

const { mockedExistsSync, mockedReaddir } = vi.hoisted(() => ({
  mockedExistsSync: vi.fn(() => true),
  mockedReaddir: vi.fn(async () => [
    { name: 'en', isDirectory: () => true },
    { name: 'ru', isDirectory: () => true },
  ]),
}))

vi.mock('node:fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs')>()
  return {
    ...actual,
    existsSync: mockedExistsSync,
    promises: {
      ...actual.promises,
      readdir: mockedReaddir,
    },
    default: {
      ...actual,
      existsSync: mockedExistsSync,
      promises: {
        ...actual.promises,
        readdir: mockedReaddir,
      },
    },
  }
})

const { parseLocaleSite, parseSharedSite, hasLocaleSite } = await import(
  'vitepress-theme-neptu/utils/node'
)

// existsSync mock is accessed via mockedExistsSync directly

describe('loadLocale', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns a locale with label from built-in base', async () => {
    const result = await loadLocale('en', {
      siteUrl: 'https://example.com',
      srcDir: '/src',
    })
    expect(result.label).toBe('English')
    expect(result.lang).toBeUndefined()
  })

  it('lets _site.yaml override the built-in label', async () => {
    vi.mocked(parseLocaleSite).mockResolvedValueOnce({
      label: 'British English',
    })

    const result = await loadLocale('en', {
      siteUrl: 'https://example.com',
      srcDir: '/src',
    })
    expect(result.label).toBe('British English')
  })

  it('extracts lang, title, description from _site.yaml', async () => {
    vi.mocked(parseLocaleSite).mockResolvedValueOnce({
      lang: 'en-US',
      title: 'My Landing',
      description: 'A great landing',
    })

    const result = await loadLocale('en', {
      siteUrl: 'https://example.com',
      srcDir: '/src',
    })
    expect(result.lang).toBe('en-US')
    expect(result.title).toBe('My Landing')
    expect(result.description).toBe('A great landing')
  })

  it('extracts titleTemplate from _site.yaml', async () => {
    vi.mocked(parseLocaleSite).mockResolvedValueOnce({
      titleTemplate: ':title | My Site',
    })

    const result = await loadLocale('en', {
      siteUrl: 'https://example.com',
      srcDir: '/src',
    })
    expect(result.titleTemplate).toBe(':title | My Site')
  })

  it('uses title from locale site when title is set', async () => {
    vi.mocked(parseLocaleSite).mockResolvedValueOnce({
      title: 'Locale Title',
    })

    const result = await loadLocale('en', {
      siteUrl: 'https://example.com',
      srcDir: '/src',
    })
    expect(result.title).toBe('Locale Title')
  })

  it('merges themeConfig from shared and locale layers', async () => {
    vi.mocked(parseSharedSite).mockResolvedValueOnce({
      themeConfig: { footer: { message: 'Shared footer' } },
    })
    vi.mocked(parseLocaleSite).mockResolvedValueOnce({
      themeConfig: { footer: { copyright: '© 2024' } },
    })

    const result = await loadLocale('en', {
      siteUrl: 'https://example.com',
      srcDir: '/src',
    })
    expect(result.themeConfig.footer).toEqual({
      message: 'Shared footer',
      copyright: '© 2024',
    })
  })

  it('resolves extends chain for locale inheritance', async () => {
    vi.mocked(parseLocaleSite)
      .mockResolvedValueOnce({ extends: 'ru', title: 'EN Title' })
      .mockResolvedValueOnce({ lang: 'ru-RU', description: 'RU Description' })

    const result = await loadLocale('en', {
      siteUrl: 'https://example.com',
      srcDir: '/src',
    })
    expect(result.lang).toBe('ru-RU')
    expect(result.title).toBe('EN Title')
    expect(result.description).toBe('RU Description')
  })

  it('detects cycles in extends chain and warns', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.mocked(parseLocaleSite)
      .mockResolvedValueOnce({ extends: 'ru' })
      .mockResolvedValueOnce({ extends: 'en' })

    await loadLocale('en', {
      siteUrl: 'https://example.com',
      srcDir: '/src',
    })
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Cycle detected')
    )
    warnSpy.mockRestore()
  })

  it('sets editLink pattern from repo', async () => {
    const result = await loadLocale('en', {
      siteUrl: 'https://example.com',
      srcDir: '/src',
      themeConfig: { repo: 'https://github.com/example/repo' },
    })
    expect(result.themeConfig.editLink).toBeDefined()
    expect(result.themeConfig.editLink.pattern).toBe(
      'https://github.com/example/repo/blob/main/{path}'
    )
  })

  it('merges t from base, shared, and locale layers', async () => {
    vi.mocked(parseSharedSite).mockResolvedValueOnce({
      themeConfig: { t: { customKey: 'Shared' } },
    })
    vi.mocked(parseLocaleSite).mockResolvedValueOnce({
      themeConfig: { t: { customKey: 'Locale' } },
    })

    const result = await loadLocale('en', {
      siteUrl: 'https://example.com',
      srcDir: '/src',
    })
    expect(result.themeConfig.t.customKey).toBe('Locale')
  })

  it('processes sidebar with template substitution and link prefixing', async () => {
    vi.mocked(parseLocaleSite).mockResolvedValueOnce({
      themeConfig: {
        sidebar: {
          doc: [
            { text: 'Intro', link: 'intro' },
            { text: 'Guide', link: 'guide' },
          ],
        },
      },
    })

    const result = await loadLocale('en', {
      siteUrl: 'https://example.com',
      srcDir: '/src',
    })
    const sidebar = result.themeConfig.sidebar as Record<string, unknown[]>
    const docKey = Object.keys(sidebar).find((k) => k.includes('doc'))
    expect(docKey).toBeDefined()
    const items = sidebar[docKey!] as Array<Record<string, unknown>>
    expect(items[0].link).toBe('/en/doc/intro')
    expect(items[1].link).toBe('/en/doc/guide')
  })
})

describe('autoLoadLocales', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('warns when srcDir is not set', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const result = await autoLoadLocales({})
    expect(result).toEqual({})
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('is not set')
    )
    warnSpy.mockRestore()
  })

  it('warns when srcDir does not exist', async () => {
    mockedExistsSync.mockReturnValue(false)
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const result = await autoLoadLocales({ srcDir: '/nonexistent' })
    expect(result).toEqual({})
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('does not exist')
    )
    warnSpy.mockRestore()
    mockedExistsSync.mockReturnValue(true)
  })

  it('discovers locale folders and loads them', async () => {
    mockedExistsSync.mockReturnValue(true)
    vi.mocked(hasLocaleSite).mockReturnValue(true)

    const result = await autoLoadLocales({
      siteUrl: 'https://example.com',
      srcDir: '/src',
    })
    expect(Object.keys(result)).toEqual(['en', 'ru'])
    expect(result.en.label).toBe('English')
    expect(result.ru.label).toBe('Русский')
  })

  it('warns when no locale folders are found', async () => {
    mockedExistsSync.mockReturnValue(true)
    vi.mocked(hasLocaleSite).mockReturnValue(false)

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const result = await autoLoadLocales({
      siteUrl: 'https://example.com',
      srcDir: '/src',
    })
    expect(result).toEqual({})
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('no folders')
    )
    warnSpy.mockRestore()
    vi.mocked(hasLocaleSite).mockReturnValue(true)
  })
})
