import { describe, it, expect, vi } from 'vitest'
import {
  SiteYamlSchema,
  AuthorsListSchema,
  validateAndWarn,
} from '../../../src/configs/siteSchema.ts'

describe('SiteYamlSchema', () => {
  it('accepts a minimal config', () => {
    const result = SiteYamlSchema.safeParse({ lang: 'en-US' })
    expect(result.success).toBe(true)
  })

  it('accepts full canonical shape', () => {
    const result = SiteYamlSchema.safeParse({
      lang: 'en-US',
      title: 'Blog',
      description: 'Desc',
      extends: 'en',
      themeConfig: {
        authors: [{ id: 'a', name: 'A' }],
      },
    })
    expect(result.success).toBe(true)
  })

  it('accepts false to disable a locale title suffix', () => {
    expect(SiteYamlSchema.safeParse({ titleTemplate: false }).success).toBe(true)
  })

  it('passes through unknown top-level keys', () => {
    const result = SiteYamlSchema.safeParse({ customKey: 'value' })
    expect(result.success).toBe(true)
  })

  it('rejects wrong types on known keys', () => {
    const result = SiteYamlSchema.safeParse({ lang: 123 })
    expect(result.success).toBe(false)
  })

  it('rejects developer-only fields in YAML', () => {
    expect(SiteYamlSchema.safeParse({ siteUrl: 'https://example.com' }).success).toBe(false)
    expect(SiteYamlSchema.safeParse({ base: '/blog/' }).success).toBe(false)
  })

  it('rejects perPage in YAML (build-time only field)', () => {
    const result = SiteYamlSchema.safeParse({
      themeConfig: { perPage: 10 },
    })
    expect(result.success).toBe(false)
  })

  it('validates documented nested theme fields', () => {
    const result = SiteYamlSchema.safeParse({
      themeConfig: {
        langMenuLabel: 'Change language',
        feeds: { formats: ['rss', 'atom'] },
        seo: { canonical: true, maxDescriptionLength: 300 },
        nav: { links: [{ text: 'About', href: 'pages/about' }] },
        popularPosts: { sortBy: 'pageviews' },
        home: {
          appearance: 'auto',
          sections: [{ type: 'tags', enabled: true, limit: 12 }],
        },
      },
    })
    expect(result.success).toBe(true)
  })

  it('accepts hero image as a string', () => {
    const result = SiteYamlSchema.safeParse({
      themeConfig: { home: { hero: { image: '/img/hero.webp' } } },
    })
    expect(result.success).toBe(true)
  })

  it('accepts hero image as { src, alt }', () => {
    const result = SiteYamlSchema.safeParse({
      themeConfig: {
        home: { hero: { image: { src: '/img/hero.webp', alt: 'Hero' } } },
      },
    })
    expect(result.success).toBe(true)
  })

  it('accepts hero image as { light, dark, alt }', () => {
    const result = SiteYamlSchema.safeParse({
      themeConfig: {
        home: {
          hero: {
            image: {
              light: '/img/hero-light.webp',
              dark: '/img/hero-dark.webp',
              alt: 'Hero',
            },
          },
        },
      },
    })
    expect(result.success).toBe(true)
  })
})

describe('AuthorsListSchema', () => {
  it('requires id on each author', () => {
    const result = AuthorsListSchema.safeParse([{ name: 'Noid' }])
    expect(result.success).toBe(false)
  })

  it('accepts authors with arbitrary extra fields', () => {
    const result = AuthorsListSchema.safeParse([
      { id: 'a', name: 'A', custom: 'anything' },
    ])
    expect(result.success).toBe(true)
  })
})

describe('validateAndWarn', () => {
  it('returns value unchanged on valid input', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const value = { lang: 'en' }
    expect(validateAndWarn(SiteYamlSchema, value, '/src/en/_site.yaml')).toBe(value)
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })

  it('warns once per issue with path and file label', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    validateAndWarn(
      SiteYamlSchema,
      { lang: 42, themeConfig: { perPage: 10 } },
      '/src/en/_site.yaml'
    )
    expect(spy).toHaveBeenCalledTimes(2)
    const messages = spy.mock.calls.map((args) => String(args[0]))
    expect(messages.some((m) => m.includes('/src/en/_site.yaml'))).toBe(true)
    expect(messages.some((m) => m.includes('lang'))).toBe(true)
    expect(messages.some((m) => m.includes('themeConfig.perPage'))).toBe(true)
    spy.mockRestore()
  })

  it('returns value unchanged on invalid input (non-blocking)', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const value = { lang: 42 }
    expect(validateAndWarn(SiteYamlSchema, value, 'f')).toBe(value)
    spy.mockRestore()
  })

  it('passes through null/undefined without warnings', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(validateAndWarn(SiteYamlSchema, null, 'f')).toBe(null)
    expect(validateAndWarn(SiteYamlSchema, undefined, 'f')).toBe(undefined)
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})
