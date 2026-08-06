import { ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { useContentLangs } from '../../../src/composables/useContentLangs.ts'

const { mockedUseData } = vi.hoisted(() => ({
  mockedUseData: vi.fn(),
}))

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
