import { describe, it, expect } from 'vitest'
import {
  isExternalUrl,
  resolveI18Href,
  generatePageUrlPath,
  normalizeSiteUrl,
  makeAbsoluteUrl,
  replaceRelativePathLocale,
} from '../../../../src/utils/shared/url.ts'

describe('isExternalUrl', () => {
  it('returns true for http://', () => {
    expect(isExternalUrl('http://example.com')).toBe(true)
  })

  it('returns true for https://', () => {
    expect(isExternalUrl('https://example.com')).toBe(true)
  })

  it('returns true for ftp://', () => {
    expect(isExternalUrl('ftp://example.com')).toBe(true)
  })

  it('returns true for uppercase scheme', () => {
    expect(isExternalUrl('HTTP://example.com')).toBe(true)
    expect(isExternalUrl('HTTPS://example.com')).toBe(true)
  })

  it('returns false for protocol-relative URL', () => {
    expect(isExternalUrl('//example.com')).toBe(false)
  })

  it('returns false for relative path', () => {
    expect(isExternalUrl('/path/to/page')).toBe(false)
  })

  it('returns false for local path', () => {
    expect(isExternalUrl('assets/image.png')).toBe(false)
  })

  it('returns false for null', () => {
    expect(isExternalUrl(null)).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(isExternalUrl('')).toBe(false)
  })
})

describe('resolveI18Href', () => {
  it('returns locale-prefixed root for /', () => {
    expect(resolveI18Href('/', 'en')).toBe('/en')
  })

  it('returns external URL unchanged', () => {
    expect(resolveI18Href('https://example.com', 'en')).toBe('https://example.com')
  })

  it('returns already-absolute internal path unchanged', () => {
    expect(resolveI18Href('/path', 'en')).toBe('/path')
  })

  it('prepends locale to relative path', () => {
    expect(resolveI18Href('path/to/page', 'en')).toBe('/en/path/to/page')
  })

  it('trims whitespace', () => {
    expect(resolveI18Href('  path  ', 'en')).toBe('/en/path')
  })

  it('returns stringified non-string input', () => {
    expect(resolveI18Href(123 as any, 'en')).toBe('123')
  })

  it('returns empty string for empty string', () => {
    expect(resolveI18Href('', 'en')).toBe('')
  })

  it('does not add double slashes', () => {
    expect(resolveI18Href('/path', 'en')).toBe('/path')
  })

  it('supports hyphenated locale indexes', () => {
    expect(resolveI18Href('post/hello', 'en-US')).toBe('/en-US/post/hello')
  })
})

describe('generatePageUrlPath', () => {
  it('removes file extension', () => {
    expect(generatePageUrlPath('post/hello.md')).toBe('post/hello')
  })

  it('removes trailing /index', () => {
    expect(generatePageUrlPath('post/index.md')).toBe('post')
  })

  it('returns empty string for root index', () => {
    expect(generatePageUrlPath('index.md')).toBe('')
  })

  it('handles nested index', () => {
    expect(generatePageUrlPath('en/post/index.md')).toBe('en/post')
  })

  it('handles path without index', () => {
    expect(generatePageUrlPath('about.md')).toBe('about')
  })
})

describe('normalizeSiteUrl', () => {
  it('trims whitespace and removes trailing slashes', () => {
    expect(normalizeSiteUrl(' https://example.com/// ')).toBe('https://example.com')
  })

  it('returns undefined for blank values', () => {
    expect(normalizeSiteUrl('   ')).toBeUndefined()
  })
})

describe('makeAbsoluteUrl', () => {
  it('joins relative paths with normalized siteUrl', () => {
    expect(makeAbsoluteUrl('https://example.com/', 'en/post/hello')).toBe(
      'https://example.com/en/post/hello'
    )
  })

  it('normalizes paths without a leading slash', () => {
    expect(makeAbsoluteUrl('https://example.com/', 'img/cover.png')).toBe(
      'https://example.com/img/cover.png'
    )
  })

  it('keeps absolute URLs unchanged', () => {
    expect(makeAbsoluteUrl('https://example.com', 'https://cdn.example.com/a.png')).toBe(
      'https://cdn.example.com/a.png'
    )
  })
})

describe('replaceRelativePathLocale', () => {
  it('replaces the locale prefix', () => {
    expect(replaceRelativePathLocale('en/post/hello.md', 'ru')).toBe('ru/post/hello.md')
  })

  it('returns undefined for invalid paths', () => {
    expect(replaceRelativePathLocale('hello.md', 'ru')).toBeUndefined()
  })
})
