import { describe, it, expect } from 'vitest'
import { hasNoIndex } from '../../../../src/utils/shared/head.ts'

describe('hasNoIndex', () => {
  it('returns false for non-array input', () => {
    expect(hasNoIndex(undefined)).toBe(false)
    expect(hasNoIndex(null)).toBe(false)
    expect(hasNoIndex('noindex')).toBe(false)
    expect(hasNoIndex({})).toBe(false)
  })

  it('returns false for empty array', () => {
    expect(hasNoIndex([])).toBe(false)
  })

  it('returns true for simple noindex meta', () => {
    const head = [['meta', { name: 'robots', content: 'noindex' }]]
    expect(hasNoIndex(head)).toBe(true)
  })

  it('returns true for noindex with additional directives', () => {
    const head = [['meta', { name: 'robots', content: 'noindex, nofollow' }]]
    expect(hasNoIndex(head)).toBe(true)
  })

  it('returns true for mixed-case content', () => {
    const head = [['meta', { name: 'robots', content: 'NoIndex' }]]
    expect(hasNoIndex(head)).toBe(true)
  })

  it('returns false when robots meta does not contain noindex', () => {
    const head = [['meta', { name: 'robots', content: 'index, follow' }]]
    expect(hasNoIndex(head)).toBe(false)
  })

  it('returns false for non-robots meta tags', () => {
    const head = [['meta', { name: 'description', content: 'foo' }]]
    expect(hasNoIndex(head)).toBe(false)
  })

  it('returns false for non-meta tags', () => {
    const head = [['link', { rel: 'canonical', href: 'https://example.com' }]]
    expect(hasNoIndex(head)).toBe(false)
  })

  it('detects noindex among multiple head entries', () => {
    const head = [
      ['link', { rel: 'canonical', href: 'https://example.com' }],
      ['meta', { name: 'robots', content: 'noindex' }],
      ['meta', { name: 'description', content: 'foo' }],
    ]
    expect(hasNoIndex(head)).toBe(true)
  })

  it('ignores malformed head entries', () => {
    const head = [
      'invalid',
      ['meta'],
      ['meta', null],
      ['meta', { name: 'robots', content: 'noindex' }],
    ]
    expect(hasNoIndex(head)).toBe(true)
  })
})
