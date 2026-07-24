import { describe, it, expect, vi, beforeEach } from 'vitest'
import { parseLocaleSite, parseSharedSite } from '../../../../src/utils/node/i18n.ts'

// Shared mock state so individual tests can program per-locale YAML payloads
// for the `extends` and `autoLoadLocales` scenarios.
const siteMocks: Record<string, Record<string, unknown>> = {}
const authorsMocks: Record<string, unknown[]> = {}

vi.mock('../../../../src/utils/node/i18n.ts', () => ({
  LOCALE_SITE_FILE: '_site.yaml',
  SHARED_SITE_FILE: 'site.yaml',
  LOCALE_AUTHORS_FILE: '_authors.yaml',
  parseLocaleSite: vi.fn(async (_srcDir: string, props: any) => {
    const mock = siteMocks[props.localeIndex]
    if (mock) return mock
    return {
      lang: 'en-US',
      title: 'Example',
      description: 'Example description',
      themeConfig: {
        donate: { url: 'page/donate' },
        resolvedLangMenuLabel: props.theme?.langMenuLabel,
        resolvedViewInAnotherLanguage: props.theme?.t?.viewInAnotherLanguage,
        t: { rootCustomKey: 'Root custom value', customKey: 'Custom value' },
      },
    }
  }),
  parseSharedSite: vi.fn(async () => ({})),
  parseLocaleAuthors: vi.fn(async (_srcDir: string, props: any) => {
    return authorsMocks[props.localeIndex] ?? []
  }),
  hasLocaleSite: vi.fn(
    (srcDir: string, locale: string) =>
      siteMocks[locale] !== undefined || hasSiteYamlPath(srcDir, locale)
  ),
}))

function hasSiteYamlPath(_srcDir: string, _locale: string): boolean {
  return false
}

vi.mock('../../../../src/utils/node/image.ts', () => ({
  getImageDimensions: vi.fn(() => null),
}))

vi.mock('../../../../src/utils/node/markdown.ts', () => ({
  mdToHtml: vi.fn((value: string) => value),
}))

vi.mock('node:fs', async () => {
  const real = (await vi.importActual<any>('node:fs')) as any
  const mocked = {
    ...real,
    existsSync: vi.fn((p: string) => fsExistsMock(p)),
    promises: {
      ...real.promises,
      readdir: vi.fn(async (_p: string, _opts?: unknown) => fsReaddirMock()),
    },
  }
  return { ...mocked, default: mocked }
})

let fsExistsMock: (p: string) => boolean = () => false
let fsReaddirMock: () => Array<{ name: string; isDirectory: () => boolean }> = () => []

import { loadBlogLocale, autoLoadLocales } from '../../../../src/utils/node/config.ts'

beforeEach(() => {
  for (const k of Object.keys(siteMocks)) delete siteMocks[k]
  for (const k of Object.keys(authorsMocks)) delete authorsMocks[k]
  fsExistsMock = () => false
  fsReaddirMock = () => []
  vi.mocked(parseSharedSite).mockResolvedValue({})
})

describe('loadBlogLocale', () => {
  it('falls back from locale variant to base built-in content locale', async () => {
    const result = await loadBlogLocale('en-US', {
      srcDir: '/src',
      themeConfig: { repo: 'https://github.com/example/repo' },
    })

    expect(result.lang).toBe('en-US')
    expect(result.label).toBe('English')
    expect((result.themeConfig!.donate as any).url).toBe('page/donate')
    expect((result.themeConfig!.t as any).rootCustomKey).toBe(
      'Root custom value'
    )
    expect((result.themeConfig!.t as any).customKey).toBe('Custom value')
    expect(result.themeConfig!.perPage).not.toBe(99)
    expect(result.themeConfig!.t!.toBlog).toBeDefined()
  })

  it('exposes built-in content-locale defaults to YAML template params', async () => {
    const result = await loadBlogLocale('en', {
      srcDir: '/src',
      themeConfig: { repo: 'https://github.com/example/repo' },
    })

    // `langMenuLabel` comes from `blogLocalesBase/en.ts` and must be
    // available to YAML templates via `${theme.langMenuLabel}` and to the
    // final merged themeConfig.
    expect(result.themeConfig!.langMenuLabel).toBe('Change language')
    expect((result.themeConfig as any).resolvedLangMenuLabel).toBe(
      'Change language'
    )
    expect(parseLocaleSite).toHaveBeenCalledWith(
      '/src',
      expect.objectContaining({
        localeIndex: 'en',
        theme: expect.objectContaining({ langMenuLabel: 'Change language' }),
      })
    )
  })

  it('lets _site.yaml override built-in content-locale translations', async () => {
    siteMocks['en'] = {
      themeConfig: {
        langMenuLabel: 'Language',
        t: { viewInAnotherLanguage: 'Read in another language' },
      },
    }

    const result = await loadBlogLocale('en', { srcDir: '/src' })

    expect(result.themeConfig!.langMenuLabel).toBe('Language')
    expect(result.themeConfig!.t!.viewInAnotherLanguage).toBe(
      'Read in another language'
    )
  })

  it('resolves extends chain from _site.yaml (child wins, new fields appended)', async () => {
    siteMocks['en'] = {
      lang: 'en-US',
      title: 'Parent title',
      description: 'Parent desc',
      themeConfig: {
        blogTitle: 'Parent Blog',
        donate: { url: 'page/donate-parent', postDonateCall: 'Parent call' },
      },
    }
    siteMocks['en-GB'] = {
      extends: 'en',
      title: 'Child title',
      themeConfig: {
        donate: { url: 'page/donate-gb' },
      },
    }

    const result = await loadBlogLocale('en-GB', { srcDir: '/src' })

    expect(result.title).toBe('Child title')
    // From parent
    expect(result.description).toBe('Parent desc')
    expect((result.themeConfig!.donate as any).postDonateCall).toBe('Parent call')
    // Overridden by child
    expect((result.themeConfig!.donate as any).url).toBe('page/donate-gb')
    expect((result.themeConfig as any).blogTitle).toBe('Parent Blog')
  })

  it('detects cycles in _site.yaml extends chain without crashing', async () => {
    siteMocks['a'] = { extends: 'b', themeConfig: { blogTitle: 'A' } }
    siteMocks['b'] = { extends: 'a', themeConfig: { blogTitle: 'B' } }
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const result = await loadBlogLocale('a', { srcDir: '/src' })
    expect(result).toBeDefined()
    expect(warnSpy).toHaveBeenCalled()
    warnSpy.mockRestore()
  })

  it('merges _authors.yaml with _site.yaml themeConfig.authors by id', async () => {
    siteMocks['en'] = {
      themeConfig: {
        authors: [
          { id: 'a', name: 'A (site)', description: 'from site' },
          { id: 'b', name: 'B (site)' },
        ],
      },
    }
    authorsMocks['en'] = [
      { id: 'a', description: 'from _authors' },
      { id: 'c', name: 'C (authors)' },
    ]

    const result = await loadBlogLocale('en', { srcDir: '/src' })
    const authors = result.themeConfig!.authors as any[]

    expect(authors.map((a) => a.id)).toEqual(['a', 'b', 'c'])
    // _authors.yaml override on same id
    expect(authors[0].description).toBe('from _authors')
    expect(authors[0].name).toBe('A (site)') // preserved from parent
    expect(authors[2].name).toBe('C (authors)')
  })

  it('merges authors across extends chain by id', async () => {
    siteMocks['en'] = {
      themeConfig: {
        authors: [{ id: 'shared', name: 'Shared parent', description: 'old' }],
      },
    }
    siteMocks['ru'] = {
      extends: 'en',
      themeConfig: {
        authors: [{ id: 'shared', description: 'ru-override' }],
      },
    }

    const result = await loadBlogLocale('ru', { srcDir: '/src' })
    const authors = result.themeConfig!.authors as any[]
    expect(authors).toHaveLength(1)
    expect(authors[0]).toMatchObject({
      id: 'shared',
      name: 'Shared parent',
      description: 'ru-override',
    })
  })

  it('deep-merges shared site.yaml nav/sidebar with per-locale _site.yaml', async () => {
    vi.mocked(parseSharedSite).mockResolvedValue({
      themeConfig: {
        nav: {
          donate: true,
          socialLinks: [{ icon: 'github', link: 'https://github.com' }],
        },
        sidebar: {
          popular: true,
          recent: true,
          donate: true,
          rssFeed: true,
        },
      },
    })
    siteMocks['en'] = {
      themeConfig: {
        nav: {
          links: [{ text: 'About', href: '/about' }],
        },
        sidebar: {
          bottomLinks: [{ text: 'Privacy', href: '/privacy' }],
        },
      },
    }

    const result = await loadBlogLocale('en', { srcDir: '/src' })
    const nav = result.themeConfig!.nav as Record<string, unknown>
    const sidebar = result.themeConfig!.sidebar as Record<string, unknown>

    // Shared booleans preserved
    expect(nav.donate).toBe(true)
    expect((nav.socialLinks as any[]).length).toBe(1)
    // Locale arrays present
    expect((nav.links as any[]).length).toBe(1)
    expect((nav.links as any[])[0].text).toBe('About')

    // Shared sidebar booleans preserved
    expect(sidebar.popular).toBe(true)
    expect(sidebar.recent).toBe(true)
    expect(sidebar.donate).toBe(true)
    expect(sidebar.rssFeed).toBe(true)
    // Locale sidebar arrays present
    expect((sidebar.bottomLinks as any[]).length).toBe(1)
    expect((sidebar.bottomLinks as any[])[0].text).toBe('Privacy')
  })
})

describe('autoLoadLocales', () => {
  it('discovers folders that contain _site.yaml', async () => {
    siteMocks['en'] = { themeConfig: { blogTitle: 'EN' } }
    siteMocks['ru'] = { themeConfig: { blogTitle: 'RU' } }

    fsExistsMock = (p: string) => {
      if (p === '/src') return true
      return p.endsWith('/en/_site.yaml') || p.endsWith('/ru/_site.yaml')
    }
    fsReaddirMock = () => [
      { name: 'en', isDirectory: () => true },
      { name: 'ru', isDirectory: () => true },
      { name: 'public', isDirectory: () => true }, // no _site.yaml -> skipped
      { name: 'index.md', isDirectory: () => false }, // not a dir
      { name: '_meta', isDirectory: () => true }, // underscore-prefixed
      { name: '.vitepress', isDirectory: () => true }, // dot-prefixed
    ]

    const result = await autoLoadLocales({ srcDir: '/src' })
    expect(Object.keys(result).sort()).toEqual(['en', 'ru'])
    expect((result.en!.themeConfig as any).blogTitle).toBe('EN')
    expect((result.ru!.themeConfig as any).blogTitle).toBe('RU')
  })

  it('warns and returns empty when no locales found', async () => {
    fsExistsMock = (p: string) => p === '/src'
    fsReaddirMock = () => []
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const result = await autoLoadLocales({ srcDir: '/src' })
    expect(result).toEqual({})
    expect(warnSpy).toHaveBeenCalled()
    warnSpy.mockRestore()
  })

  it('warns and returns empty when srcDir is missing', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const result = await autoLoadLocales({})
    expect(result).toEqual({})
    expect(warnSpy).toHaveBeenCalled()
    warnSpy.mockRestore()
  })
})
