import { ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { useContentLangs } from '../../../src/composables/useContentLangs.ts'

const { mockedUseData, provided } = vi.hoisted(() => ({
  mockedUseData: vi.fn(),
  // Stands in for what the app Layout provides.
  provided: {} as Record<string, unknown>,
}))

vi.mock('vue', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue')>()
  return {
    ...actual,
    inject: (key: string, fallback?: unknown) =>
      key in provided ? provided[key] : fallback,
  }
})

vi.mock('vitepress', () => ({
  useData: mockedUseData,
}))

describe('useContentLangs', () => {
  it('always builds locale-prefixed links even if locale.link is "/"', () => {
    mockedUseData.mockReturnValue({
      site: ref({
        locales: {
          en: { label: 'English', link: '/' },
          ru: { label: 'Русский', link: '/' },
        },
        cleanUrls: true,
      }),
      localeIndex: ref('en'),
      page: ref({
        relativePath: 'en/posts/hello.md',
      }),
      theme: ref({
        i18nRouting: true,
      }),
      hash: ref(''),
    })

    const { currentLang, localeLinks } = useContentLangs({ correspondingLink: true })

    expect(currentLang.value.link).toBe('/en/')
    expect(localeLinks.value).toEqual([
      {
        text: 'Русский',
        link: '/ru/posts/hello',
        lang: undefined,
        dir: undefined,
      },
    ])
  })

  it('keeps locale root links prefixed when correspondingLink is disabled', () => {
    mockedUseData.mockReturnValue({
      site: ref({
        locales: {
          en: { label: 'English' },
          ru: { label: 'Русский' },
        },
        cleanUrls: true,
      }),
      localeIndex: ref('en'),
      page: ref({
        relativePath: 'en/posts/hello.md',
      }),
      theme: ref({
        i18nRouting: true,
      }),
      hash: ref('#top'),
    })

    const { localeLinks } = useContentLangs()

    expect(localeLinks.value).toEqual([
      {
        text: 'Русский',
        link: '/ru/#top',
        lang: undefined,
        dir: undefined,
      },
    ])
  })

  it('does not hide another locale when labels are duplicated', () => {
    mockedUseData.mockReturnValue({
      site: ref({
        locales: {
          en: { label: 'English' },
          'en-GB': { label: 'English' },
        },
        cleanUrls: true,
      }),
      localeIndex: ref('en'),
      page: ref({
        relativePath: 'en/posts/hello.md',
      }),
      theme: ref({
        i18nRouting: true,
      }),
      hash: ref(''),
    })

    const { localeLinks } = useContentLangs({ correspondingLink: true })

    expect(localeLinks.value).toEqual([
      {
        text: 'English',
        link: '/en-GB/posts/hello',
        lang: undefined,
        dir: undefined,
      },
    ])
  })

  it('filters out missing corresponding locale pages when pages index is available', () => {
    mockedUseData.mockReturnValue({
      site: ref({
        locales: {
          en: { label: 'English' },
          ru: { label: 'Русский' },
        },
        pages: [{ relativePath: 'en/posts/hello.md' }],
        cleanUrls: true,
      }),
      localeIndex: ref('en'),
      page: ref({
        relativePath: 'en/posts/hello.md',
      }),
      theme: ref({
        i18nRouting: true,
      }),
      hash: ref(''),
    })

    const { localeLinks } = useContentLangs({ correspondingLink: true })

    expect(localeLinks.value).toEqual([])
  })

  it('uses explicit frontmatter translations with different localized slugs', () => {
    mockedUseData.mockReturnValue({
      site: ref({
        locales: {
          en: { label: 'English' },
          ru: { label: 'Русский' },
        },
        pages: [
          { relativePath: 'en/posts/hello-world.md' },
          { relativePath: 'ru/posts/privet-mir.md' },
        ],
        cleanUrls: true,
      }),
      localeIndex: ref('en'),
      page: ref({
        relativePath: 'en/posts/hello-world.md',
        frontmatter: {
          translations: {
            ru: '/ru/posts/privet-mir',
          },
        },
      }),
      theme: ref({
        i18nRouting: true,
      }),
      hash: ref('#comments'),
    })

    const { localeLinks } = useContentLangs({ correspondingLink: true })

    expect(localeLinks.value).toEqual([
      {
        text: 'Русский',
        link: '/ru/posts/privet-mir#comments',
        lang: undefined,
        dir: undefined,
      },
    ])
  })

  it('does not fall back to same-path links when explicit translations are present', () => {
    mockedUseData.mockReturnValue({
      site: ref({
        locales: {
          en: { label: 'English' },
          ru: { label: 'Русский' },
        },
        pages: [
          { relativePath: 'en/posts/hello-world.md' },
          { relativePath: 'ru/posts/hello-world.md' },
        ],
        cleanUrls: true,
      }),
      localeIndex: ref('en'),
      page: ref({
        relativePath: 'en/posts/hello-world.md',
        frontmatter: {
          translations: {},
        },
      }),
      theme: ref({
        i18nRouting: true,
      }),
      hash: ref(''),
    })

    const { localeLinks } = useContentLangs({ correspondingLink: true })

    expect(localeLinks.value).toEqual([])
  })

  it('supports full locale codes in explicit translations', () => {
    mockedUseData.mockReturnValue({
      site: ref({
        locales: {
          'en-US': { label: 'English (US)' },
          'pt-BR': { label: 'Português (Brasil)' },
        },
        pages: [
          { relativePath: 'en-US/posts/hello-world.md' },
          { relativePath: 'pt-BR/artigos/ola-mundo.md' },
        ],
        cleanUrls: true,
      }),
      localeIndex: ref('en-US'),
      page: ref({
        relativePath: 'en-US/posts/hello-world.md',
        frontmatter: {
          translations: {
            'pt-BR': '/pt-BR/artigos/ola-mundo',
          },
        },
      }),
      theme: ref({
        i18nRouting: true,
      }),
      hash: ref(''),
    })

    const { localeLinks } = useContentLangs({ correspondingLink: true })

    expect(localeLinks.value).toEqual([
      {
        text: 'Português (Brasil)',
        link: '/pt-BR/artigos/ola-mundo',
        lang: undefined,
        dir: undefined,
      },
    ])
  })

  it('returns locale root links when i18nRouting is false even with correspondingLink', () => {
    mockedUseData.mockReturnValue({
      site: ref({
        locales: {
          en: { label: 'English' },
          ru: { label: 'Русский' },
        },
        pages: [
          { relativePath: 'en/posts/hello.md' },
          { relativePath: 'ru/posts/hello.md' },
        ],
        cleanUrls: true,
      }),
      localeIndex: ref('en'),
      page: ref({
        relativePath: 'en/posts/hello.md',
        frontmatter: {},
      }),
      theme: ref({
        i18nRouting: false,
      }),
      hash: ref(''),
    })

    const { localeLinks } = useContentLangs({ correspondingLink: true })

    expect(localeLinks.value).toEqual([
      {
        text: 'Русский',
        link: '/ru/',
        lang: undefined,
        dir: undefined,
      },
    ])
  })

  it('shows locale root link when i18nRouting is false even without translation file', () => {
    mockedUseData.mockReturnValue({
      site: ref({
        locales: {
          en: { label: 'English' },
          ru: { label: 'Русский' },
        },
        pages: [{ relativePath: 'en/posts/hello.md' }],
        cleanUrls: true,
      }),
      localeIndex: ref('en'),
      page: ref({
        relativePath: 'en/posts/hello.md',
        frontmatter: {},
      }),
      theme: ref({
        i18nRouting: false,
      }),
      hash: ref('#section'),
    })

    const { localeLinks } = useContentLangs({ correspondingLink: true })

    expect(localeLinks.value).toEqual([
      {
        text: 'Русский',
        link: '/ru/#section',
        lang: undefined,
        dir: undefined,
      },
    ])
  })
})

describe('useContentLangs on generated list routes', () => {
  // These routes come from `paths()`, not from files, so the file-path match
  // used for ordinary pages cannot tell whether the target locale has the page.
  function mockListPage(options: {
    relativePath: string
    params: Record<string, unknown>
    ruPosts?: unknown[]
    ruCategories?: Array<Record<string, unknown>>
  }) {
    mockedUseData.mockReturnValue({
      site: ref({
        locales: {
          en: { label: 'English' },
          ru: {
            label: 'Русский',
            themeConfig: {
              categories: options.ruCategories ?? [
                { id: 'configuration', name: 'Настройка', slug: 'nastrojka' },
              ],
            },
          },
        },
        cleanUrls: true,
        pages: [],
      }),
      localeIndex: ref('en'),
      page: ref({ relativePath: options.relativePath }),
      theme: ref({ i18nRouting: true }),
      hash: ref(''),
      params: ref(options.params),
    })
    provided.posts = { ru: options.ruPosts ?? [] }
  }

  it('maps a category page to the target locale slug', () => {
    mockListPage({
      relativePath: 'en/categories/configuration/1.md',
      params: { id: 'configuration', slug: 'configuration', page: 1 },
      ruPosts: [{ categories: [{ id: 'configuration' }] }],
    })
    const { localeLinks } = useContentLangs({ correspondingLink: true })

    expect(localeLinks.value).toMatchObject([{ link: '/ru/categories/nastrojka/1' }])
  })

  // The reader asked for another language, not for the same offset into a
  // different set of posts — and page 3 may not exist there at all.
  it('always lands on page 1 of the target list', () => {
    mockListPage({
      relativePath: 'en/categories/configuration/3.md',
      params: { id: 'configuration', slug: 'configuration', page: 3 },
      ruPosts: [{ categories: [{ id: 'configuration' }] }],
    })
    const { localeLinks } = useContentLangs({ correspondingLink: true })

    expect(localeLinks.value).toMatchObject([{ link: '/ru/categories/nastrojka/1' }])
  })

  it('stays on the popular variant of the list', () => {
    mockListPage({
      relativePath: 'en/categories/configuration/popular/2.md',
      params: { id: 'configuration', slug: 'configuration', page: 2 },
      ruPosts: [{ categories: [{ id: 'configuration' }] }],
    })
    const { localeLinks } = useContentLangs({ correspondingLink: true })

    expect(localeLinks.value).toMatchObject([
      { link: '/ru/categories/nastrojka/popular/1' },
    ])
  })

  it('drops the link when the target locale does not declare the category', () => {
    mockListPage({
      relativePath: 'en/categories/configuration/1.md',
      params: { id: 'configuration', slug: 'configuration', page: 1 },
      ruCategories: [{ id: 'writing', name: 'Контент' }],
    })
    const { localeLinks } = useContentLangs({ correspondingLink: true })

    expect(localeLinks.value).toEqual([])
  })

  // A tag has no id beyond its slug, so that is what identifies it.
  it('maps a tag page by slug', () => {
    mockListPage({
      relativePath: 'en/tags/config/2.md',
      params: { slug: 'config', name: 'config', id: 'config', page: 2 },
      ruPosts: [{ tags: [{ slug: 'config' }] }],
    })
    const { localeLinks } = useContentLangs({ correspondingLink: true })

    expect(localeLinks.value).toMatchObject([{ link: '/ru/tags/config/1' }])
  })

  it('drops a tag link when no post in the target locale uses it', () => {
    mockListPage({
      relativePath: 'en/tags/analytics/1.md',
      params: { slug: 'analytics', name: 'analytics', id: 'analytics', page: 1 },
      ruPosts: [{ tags: [{ slug: 'config' }] }],
    })
    const { localeLinks } = useContentLangs({ correspondingLink: true })

    expect(localeLinks.value).toEqual([])
  })

  it('drops an author link when the author has no posts in the target locale', () => {
    mockListPage({
      relativePath: 'en/authors/maria/1.md',
      params: { id: 'maria', page: 1 },
      ruPosts: [{ authorId: 'ivan' }],
    })
    const { localeLinks } = useContentLangs({ correspondingLink: true })

    expect(localeLinks.value).toEqual([])
  })

  it('maps an archive year when the target locale has posts from it', () => {
    mockListPage({
      relativePath: 'en/archive/2026/2.md',
      params: { year: 2026, page: 2 },
      ruPosts: [{ date: '2026-03-01' }],
    })
    const { localeLinks } = useContentLangs({ correspondingLink: true })

    expect(localeLinks.value).toMatchObject([{ link: '/ru/archive/2026/1' }])
  })

  it('drops an archive year the target locale has no posts from', () => {
    mockListPage({
      relativePath: 'en/archive/2026/1.md',
      params: { year: 2026, page: 1 },
      ruPosts: [{ date: '2024-03-01' }],
    })
    const { localeLinks } = useContentLangs({ correspondingLink: true })

    expect(localeLinks.value).toEqual([])
  })

  it('drops a featured page when the target locale has no featured posts', () => {
    mockListPage({
      relativePath: 'en/featured/1.md',
      params: { page: 1 },
      ruPosts: [{ featured: false }],
    })
    const { localeLinks } = useContentLangs({ correspondingLink: true })

    expect(localeLinks.value).toEqual([])
  })

  it('sends a deep recent page to page 1', () => {
    mockListPage({
      relativePath: 'en/recent/3.md',
      params: { page: 3 },
      ruPosts: [{ date: '2026-03-01' }],
    })
    const { localeLinks } = useContentLangs({ correspondingLink: true })

    expect(localeLinks.value).toMatchObject([{ link: '/ru/recent/1' }])
  })

  // `tags/index.md` is an ordinary file: no route params, so it keeps the
  // file-path mapping.
  it('leaves the taxonomy index pages on the file-path mapping', () => {
    mockedUseData.mockReturnValue({
      site: ref({
        locales: { en: { label: 'English' }, ru: { label: 'Русский' } },
        cleanUrls: true,
        pages: [{ relativePath: 'ru/tags/index.md' }],
      }),
      localeIndex: ref('en'),
      page: ref({ relativePath: 'en/tags/index.md' }),
      theme: ref({ i18nRouting: true }),
      hash: ref(''),
      params: ref({}),
    })
    const { localeLinks } = useContentLangs({ correspondingLink: true })

    expect(localeLinks.value).toMatchObject([{ link: '/ru/tags/' }])
  })
})

describe('useContentLangs with build-time resolved translations', () => {
  // `site.pages` only exists in dev. In a production bundle the old candidate
  // check had nothing to filter against and offered every locale on every page.
  function mockPage(frontmatter: Record<string, unknown>) {
    mockedUseData.mockReturnValue({
      site: ref({
        locales: {
          en: { label: 'English' },
          ru: { label: 'Русский' },
          de: { label: 'Deutsch' },
        },
        cleanUrls: true,
      }),
      localeIndex: ref('en'),
      page: ref({ relativePath: 'en/posts/hello.md', frontmatter }),
      theme: ref({ i18nRouting: true }),
      hash: ref(''),
      params: ref({}),
    })
  }

  it('offers only the locales that actually have the page', () => {
    mockPage({
      __neptuTranslations: {
        en: 'en/posts/hello.md',
        ru: 'ru/posts/hello.md',
      },
    })
    const { localeLinks } = useContentLangs({ correspondingLink: true })

    expect(localeLinks.value).toMatchObject([{ link: '/ru/posts/hello' }])
  })

  it('offers nothing when the page has no translations', () => {
    mockPage({ __neptuTranslations: { en: 'en/posts/hello.md' } })
    const { localeLinks } = useContentLangs({ correspondingLink: true })

    expect(localeLinks.value).toEqual([])
  })

  // Honours an explicitly declared target, which the resolver already followed.
  it('uses the resolved path even when it does not mirror the source path', () => {
    mockPage({
      translations: { ru: '/ru/posts/privet' },
      __neptuTranslations: {
        en: 'en/posts/hello.md',
        ru: 'ru/posts/privet.md',
      },
    })
    const { localeLinks } = useContentLangs({ correspondingLink: true })

    expect(localeLinks.value).toMatchObject([{ link: '/ru/posts/privet' }])
  })
})

describe('useContentLangs and missing list sections', () => {
  // A blog opts out of a section by deleting its directory.
  it('drops the link when the target locale does not build the section', () => {
    mockedUseData.mockReturnValue({
      site: ref({
        locales: {
          en: { label: 'English' },
          ru: {
            label: 'Русский',
            themeConfig: { listSections: ['recent', 'tags'] },
          },
        },
        cleanUrls: true,
      }),
      localeIndex: ref('en'),
      page: ref({ relativePath: 'en/popular/2.md' }),
      theme: ref({ i18nRouting: true }),
      hash: ref(''),
      params: ref({ page: 2 }),
    })
    provided.posts = { ru: [{ date: '2026-01-01' }] }

    const { localeLinks } = useContentLangs({ correspondingLink: true })
    expect(localeLinks.value).toEqual([])
  })

  it('keeps the link for a section the target locale does build', () => {
    mockedUseData.mockReturnValue({
      site: ref({
        locales: {
          en: { label: 'English' },
          ru: {
            label: 'Русский',
            themeConfig: { listSections: ['recent', 'popular'] },
          },
        },
        cleanUrls: true,
      }),
      localeIndex: ref('en'),
      page: ref({ relativePath: 'en/popular/2.md' }),
      theme: ref({ i18nRouting: true }),
      hash: ref(''),
      params: ref({ page: 2 }),
    })
    provided.posts = { ru: [{ date: '2026-01-01' }] }

    const { localeLinks } = useContentLangs({ correspondingLink: true })
    expect(localeLinks.value).toMatchObject([{ link: '/ru/popular/1' }])
  })
})
