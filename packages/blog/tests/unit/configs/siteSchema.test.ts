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
        blogTitle: 'Blog',
        perPage: 10,
        authors: [{ id: 'a', name: 'A' }],
      },
    })
    expect(result.success).toBe(true)
  })

  it('passes through unknown top-level keys', () => {
    const result = SiteYamlSchema.safeParse({ customKey: 'value' })
    expect(result.success).toBe(true)
  })

  it('rejects wrong types on known keys', () => {
    const result = SiteYamlSchema.safeParse({ lang: 123 })
    expect(result.success).toBe(false)
  })

  it('rejects perPage with wrong type', () => {
    const result = SiteYamlSchema.safeParse({
      themeConfig: { perPage: '10' },
    })
    expect(result.success).toBe(false)
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
      { lang: 42, themeConfig: { perPage: 'x' } },
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
