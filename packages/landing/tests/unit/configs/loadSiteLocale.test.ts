import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  loadSiteLocale,
  autoLoadSiteLocales,
} from '../../../src/configs/loadSiteLocale.ts'

vi.mock('vitepress-theme-neptu-blog/utils/node', () => ({
  parseLocaleSite: vi.fn(async () => ({})),
  parseSharedSite: vi.fn(async () => ({})),
  hasLocaleSite: vi.fn(() => true),
  resolveEditLinkPattern: vi.fn(
    (repo: string) => `${repo}/blob/main/{path}`
  ),
}))

vi.mock('vitepress-theme-neptu-blog/utils', () => ({
  standardTemplate: vi.fn(
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
  'vitepress-theme-neptu-blog/utils/node'
)

// existsSync mock is accessed via mockedExistsSync directly

describe('loadSiteLocale', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns a locale with label from built-in base', async () => {
    const result = await loadSiteLocale('en', {
      siteUrl: 'https://example.com',
      srcDir: '/src',
    })
    expect(result.label).toBe('English')
    expect(result.lang).toBeUndefined()
  })

  it('extracts lang, title, description from _site.yaml', async () => {
    vi.mocked(parseLocaleSite).mockResolvedValueOnce({
      lang: 'en-US',
      title: 'My Landing',
      description: 'A great landing',
    })

    const result = await loadSiteLocale('en', {
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

    const result = await loadSiteLocale('en', {
      siteUrl: 'https://example.com',
      srcDir: '/src',
    })
    expect(result.titleTemplate).toBe(':title | My Site')
  })

  it('falls back to blogTitle from themeConfig if title is missing', async () => {
    vi.mocked(parseLocaleSite).mockResolvedValueOnce({
      themeConfig: { blogTitle: 'Blog Title Fallback' },
    })

    const result = await loadSiteLocale('en', {
      siteUrl: 'https://example.com',
      srcDir: '/src',
    })
    expect(result.title).toBe('Blog Title Fallback')
  })

  it('merges themeConfig from shared and locale layers', async () => {
    vi.mocked(parseSharedSite).mockResolvedValueOnce({
      themeConfig: { footer: { message: 'Shared footer' } },
    })
    vi.mocked(parseLocaleSite).mockResolvedValueOnce({
      themeConfig: { footer: { copyright: '© 2024' } },
    })

    const result = await loadSiteLocale('en', {
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

    const result = await loadSiteLocale('en', {
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

    await loadSiteLocale('en', {
      siteUrl: 'https://example.com',
      srcDir: '/src',
    })
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Cycle detected')
    )
    warnSpy.mockRestore()
  })

  it('sets editLink pattern from repo', async () => {
    const result = await loadSiteLocale('en', {
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

    const result = await loadSiteLocale('en', {
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

    const result = await loadSiteLocale('en', {
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

describe('autoLoadSiteLocales', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('warns when srcDir is not set', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const result = await autoLoadSiteLocales({})
    expect(result).toEqual({})
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('is not set')
    )
    warnSpy.mockRestore()
  })

  it('warns when srcDir does not exist', async () => {
    mockedExistsSync.mockReturnValue(false)
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const result = await autoLoadSiteLocales({ srcDir: '/nonexistent' })
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

    const result = await autoLoadSiteLocales({
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
    const result = await autoLoadSiteLocales({
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
