import { describe, it, expect, vi } from 'vitest'
import {
  addCanonicalLink,
  type AddCanonicalLinkContext,
} from '../../../src/transformers/addCanonicalLink.ts'

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

describe('addCanonicalLink', () => {
  function createContext(
    overrides: Partial<AddCanonicalLinkContext> = {}
  ): AddCanonicalLinkContext {
    const page = overrides.page ?? 'en/post/hello.md'
    const pageData =
      overrides.pageData === null
        ? null
        : ({
            filePath: page,
            frontmatter: {},
            ...(overrides.pageData || {}),
          } as any)

    const siteConfig =
      overrides.siteConfig === null
        ? null
        : ({
            userConfig: {
              siteUrl: 'https://example.com',
              themeConfig: { seo: { autoCanonical: true } },
            },
            site: { locales: {} },
            ...(overrides.siteConfig || {}),
          } as any)

    return {
      page,
      head: overrides.head ?? [],
      pageData,
      siteConfig,
    } as AddCanonicalLinkContext
  }

  it('does nothing if page has no slash', () => {
    const ctx = createContext({ page: 'hello' })
    addCanonicalLink(ctx)
    expect(ctx.head).toEqual([])
  })

  it('does nothing if page is empty', () => {
    const ctx = createContext({ page: '' })
    addCanonicalLink(ctx)
    expect(ctx.head).toEqual([])
  })

  it('adds self-canonical automatically when autoCanonical is enabled and no frontmatter canonical', () => {
    const ctx = createContext()
    addCanonicalLink(ctx)
    expect(ctx.head).toEqual([
      ['link', { rel: 'canonical', href: 'https://example.com/en/post/hello' }],
    ])
  })

  it('does nothing without canonical frontmatter when autoCanonical is disabled', () => {
    const ctx = createContext({
      siteConfig: {
        userConfig: {
          siteUrl: 'https://example.com',
          themeConfig: { seo: { autoCanonical: false } },
        },
        site: { locales: {} },
      } as any,
    })
    addCanonicalLink(ctx)
    expect(ctx.head).toEqual([])
  })

  it('adds self-canonical link', () => {
    const ctx = createContext({
      page: 'en/post/hello.md',
      pageData: { frontmatter: { canonical: 'self' } } as any,
    })
    addCanonicalLink(ctx)
    expect(ctx.head).toEqual([
      ['link', { rel: 'canonical', href: 'https://example.com/en/post/hello' }],
    ])
  })

  it('supports the short self alias', () => {
    const ctx = createContext({
      page: 'en/post/hello.md',
      pageData: { frontmatter: { canonical: 's' } } as any,
    })

    addCanonicalLink(ctx)
    expect(ctx.head).toEqual([
      ['link', { rel: 'canonical', href: 'https://example.com/en/post/hello' }],
    ])
  })

  it('warns and skips if siteUrl is missing for self-canonical', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const ctx = createContext({
      pageData: { frontmatter: { canonical: 'self' } } as any,
      siteConfig: {
        userConfig: { themeConfig: {} },
        site: { locales: {} },
      } as any,
    })
    addCanonicalLink(ctx)
    expect(ctx.head).toEqual([])
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('siteUrl not configured')
    )
    warnSpy.mockRestore()
  })

  it('adds explicit canonical URL', () => {
    const ctx = createContext({
      pageData: { frontmatter: { canonical: 'https://other.com/page' } } as any,
    })
    addCanonicalLink(ctx)
    expect(ctx.head).toEqual([
      ['link', { rel: 'canonical', href: 'https://other.com/page' }],
    ])
  })

  it('normalizes self-canonical when siteUrl has a trailing slash', () => {
    const ctx = createContext({
      pageData: { frontmatter: { canonical: 'self' } } as any,
      siteConfig: { userConfig: { siteUrl: 'https://example.com/' } } as any,
    })
    addCanonicalLink(ctx)
    expect(ctx.head).toEqual([
      ['link', { rel: 'canonical', href: 'https://example.com/en/post/hello' }],
    ])
  })

  it('warns and skips invalid explicit URL', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const ctx = createContext({
      page: 'en/post/hello.md',
      pageData: { frontmatter: { canonical: 'not-a-url' } } as any,
    })
    addCanonicalLink(ctx)
    expect(ctx.head).toEqual([])
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Invalid canonical URL')
    )
    warnSpy.mockRestore()
  })

  it('skips non-string canonical values', () => {
    const ctx = createContext({
      pageData: { frontmatter: { canonical: true } } as any,
    })
    addCanonicalLink(ctx)
    expect(ctx.head).toEqual([])
  })

  it('handles null pageData gracefully', () => {
    const ctx = createContext({
      page: 'en/post/hello.md',
      pageData: null as any,
    })
    addCanonicalLink(ctx)
    expect(ctx.head).toEqual([])
  })

  it('catches errors inside try block gracefully', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const ctx = createContext({
      page: 'en/post/hello.md',
      pageData: { frontmatter: { canonical: 'self' } } as any,
      siteConfig: null as any,
    })
    addCanonicalLink(ctx)
    expect(ctx.head).toEqual([])
    expect(errorSpy).toHaveBeenCalled()
    errorSpy.mockRestore()
  })

  it('auto-canonical respects locale themeConfig over userConfig themeConfig', () => {
    const ctx = createContext({
      pageData: { filePath: 'en/post/hello.md', frontmatter: {} } as any,
      siteConfig: {
        userConfig: {
          siteUrl: 'https://example.com',
          themeConfig: { seo: { autoCanonical: false } },
        },
        site: { locales: { en: { themeConfig: { seo: { autoCanonical: true } } } } },
      } as any,
    })
    addCanonicalLink(ctx)
    expect(ctx.head).toEqual([
      ['link', { rel: 'canonical', href: 'https://example.com/en/post/hello' }],
    ])
  })

  it('does nothing when frontmatter.seo.canonical is false', () => {
    const ctx = createContext({
      pageData: {
        frontmatter: { canonical: 'self', seo: { canonical: false } },
      } as any,
    })
    addCanonicalLink(ctx)
    expect(ctx.head).toEqual([])
  })
})
