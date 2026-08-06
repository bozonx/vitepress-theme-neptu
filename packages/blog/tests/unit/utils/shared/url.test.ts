import { describe, it, expect } from 'vitest'
import {
  isExternalUrl,
  isAnchorUrl,
  isSafeExternalUrl,
  sanitizeUrl,
  externalTarget,
  resolveI18nHref,
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

  it('returns true for protocol-relative URL', () => {
    expect(isExternalUrl('//example.com')).toBe(true)
  })

  it('returns true for mailto:', () => {
    expect(isExternalUrl('mailto:foo@example.com')).toBe(true)
  })

  it('returns true for tel:', () => {
    expect(isExternalUrl('tel:+1234567890')).toBe(true)
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

describe('resolveI18nHref', () => {
  it('returns locale-prefixed root for /', () => {
    expect(resolveI18nHref('/', 'en')).toBe('/en')
  })

  it('returns external URL unchanged', () => {
    expect(resolveI18nHref('https://example.com', 'en')).toBe('https://example.com')
  })

  it('returns already-absolute internal path unchanged', () => {
    expect(resolveI18nHref('/path', 'en')).toBe('/path')
  })

  it('prepends locale to relative path', () => {
    expect(resolveI18nHref('path/to/page', 'en')).toBe('/en/path/to/page')
  })

  it('trims whitespace', () => {
    expect(resolveI18nHref('  path  ', 'en')).toBe('/en/path')
  })

  it('returns stringified non-string input', () => {
    expect(resolveI18nHref(123 as any, 'en')).toBe('123')
  })

  it('returns empty string for empty string', () => {
    expect(resolveI18nHref('', 'en')).toBe('')
  })

  it('does not add double slashes', () => {
    expect(resolveI18nHref('/path', 'en')).toBe('/path')
  })

  it('supports hyphenated locale indexes', () => {
    expect(resolveI18nHref('posts/hello', 'en-US')).toBe('/en-US/posts/hello')
  })
})

describe('generatePageUrlPath', () => {
  it('removes file extension', () => {
    expect(generatePageUrlPath('posts/hello.md')).toBe('posts/hello')
  })

  it('removes trailing /index', () => {
    expect(generatePageUrlPath('posts/index.md')).toBe('posts')
  })

  it('returns empty string for root index', () => {
    expect(generatePageUrlPath('index.md')).toBe('')
  })

  it('handles nested index', () => {
    expect(generatePageUrlPath('en/posts/index.md')).toBe('en/posts')
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
    expect(makeAbsoluteUrl('https://example.com/', 'en/posts/hello')).toBe(
      'https://example.com/en/posts/hello'
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
    expect(replaceRelativePathLocale('en/posts/hello.md', 'ru')).toBe('ru/posts/hello.md')
  })

  it('returns undefined for invalid paths', () => {
    expect(replaceRelativePathLocale('hello.md', 'ru')).toBeUndefined()
  })
})

describe('isAnchorUrl', () => {
  it('returns true for anchor links', () => {
    expect(isAnchorUrl('#section')).toBe(true)
    expect(isAnchorUrl('#')).toBe(true)
  })

  it('returns false for non-anchor links', () => {
    expect(isAnchorUrl('/path')).toBe(false)
    expect(isAnchorUrl('https://example.com')).toBe(false)
    expect(isAnchorUrl('')).toBe(false)
    expect(isAnchorUrl(undefined)).toBe(false)
  })
})

describe('isSafeExternalUrl', () => {
  it('returns true for http and https', () => {
    expect(isSafeExternalUrl('http://example.com')).toBe(true)
    expect(isSafeExternalUrl('https://example.com')).toBe(true)
  })

  it('returns true for protocol-relative URLs', () => {
    expect(isSafeExternalUrl('//example.com')).toBe(true)
  })

  it('returns true for mailto and tel', () => {
    expect(isSafeExternalUrl('mailto:foo@example.com')).toBe(true)
    expect(isSafeExternalUrl('tel:+1234567890')).toBe(true)
  })

  it('returns false for javascript scheme', () => {
    expect(isSafeExternalUrl('javascript:alert(1)')).toBe(false)
  })

  it('returns false for data scheme', () => {
    expect(isSafeExternalUrl('data:text/html,<script>alert(1)</script>')).toBe(false)
  })

  it('returns false for non-external URLs', () => {
    expect(isSafeExternalUrl('/path')).toBe(false)
    expect(isSafeExternalUrl('#anchor')).toBe(false)
  })
})

describe('sanitizeUrl', () => {
  it('returns safe external URLs unchanged', () => {
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com')
    expect(sanitizeUrl('mailto:foo@example.com')).toBe('mailto:foo@example.com')
  })

  it('returns anchors unchanged', () => {
    expect(sanitizeUrl('#section')).toBe('#section')
  })

  it('returns relative paths unchanged', () => {
    expect(sanitizeUrl('/path/to/page')).toBe('/path/to/page')
  })

  it('strips dangerous schemes to undefined', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBeUndefined()
    expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBeUndefined()
  })

  it('returns undefined for undefined input', () => {
    expect(sanitizeUrl(undefined)).toBeUndefined()
  })
})

describe('externalTarget', () => {
  it('returns _blank for http(s) URLs', () => {
    expect(externalTarget('https://example.com')).toBe('_blank')
    expect(externalTarget('http://example.com')).toBe('_blank')
  })

  it('returns _blank for protocol-relative URLs', () => {
    expect(externalTarget('//example.com')).toBe('_blank')
  })

  it('returns undefined for local paths', () => {
    expect(externalTarget('/path')).toBeUndefined()
    expect(externalTarget('mailto:foo@example.com')).toBeUndefined()
  })
})
