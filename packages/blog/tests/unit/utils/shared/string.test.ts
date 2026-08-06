import { describe, it, expect } from 'vitest'
import {
  mustacheTemplate,
  interpolateDollarTemplate,
  truncateText,
  stripExtension,
  slugify,
} from '../../../../src/utils/shared/string.ts'

describe('mustacheTemplate', () => {
  it('replaces simple key', () => {
    expect(mustacheTemplate('Hello {{name}}!', { name: 'World' })).toBe('Hello World!')
  })

  it('replaces nested key', () => {
    expect(mustacheTemplate('{{user.name}}', { user: { name: 'Alice' } })).toBe('Alice')
  })

  it('replaces unknown keys with empty string', () => {
    expect(mustacheTemplate('{{unknown}}', {})).toBe('')
  })

  it('replaces multiple occurrences', () => {
    expect(mustacheTemplate('{{a}} and {{a}}', { a: 'X' })).toBe('X and X')
  })

  it('handles eval option', () => {
    expect(mustacheTemplate('{{a + b}}', { a: 1, b: 2 }, { eval: true })).toBe('3')
  })

  it('returns empty string for null template', () => {
    expect(mustacheTemplate(null, { a: 1 })).toBe('')
  })

  it('returns original template for null data', () => {
    expect(mustacheTemplate('{{a}}', null)).toBe('{{a}}')
  })

  it('ignores spaces inside tags by trimming key', () => {
    expect(mustacheTemplate('{{ name }}', { name: 'Bob' })).toBe('Bob')
  })
})

describe('interpolateDollarTemplate', () => {
  it('replaces simple key', () => {
    expect(interpolateDollarTemplate('Hello ${name}!', { name: 'World' })).toBe('Hello World!')
  })

  it('replaces nested key', () => {
    expect(interpolateDollarTemplate('${user.name}', { user: { name: 'Alice' } })).toBe('Alice')
  })

  it('preserves unknown keys for a later config-merge pass', () => {
    expect(interpolateDollarTemplate('${unknown}', {})).toBe('${unknown}')
  })

  it('replaces multiple occurrences', () => {
    expect(interpolateDollarTemplate('${a} and ${a}', { a: 'X' })).toBe('X and X')
  })

  it('handles eval option', () => {
    expect(interpolateDollarTemplate('${a + b}', { a: 1, b: 2 }, { eval: true })).toBe('3')
  })

  it('returns empty string for null template', () => {
    expect(interpolateDollarTemplate(null, { a: 1 })).toBe('')
  })

  it('returns original template for null data', () => {
    expect(interpolateDollarTemplate('${a}', null)).toBe('${a}')
  })

  it('ignores spaces inside tags by trimming key', () => {
    expect(interpolateDollarTemplate('${ name }', { name: 'Bob' })).toBe('Bob')
  })
})

describe('truncateText', () => {
  it('returns rawString when length is <= 4', () => {
    expect(truncateText('abc', 4)).toBe('abc')
  })

  it('returns rawString when ellipsis is not a string', () => {
    expect(truncateText('abcdef', 3, { ellipsis: 123 as any })).toBe('abcdef')
  })

  it('returns rawString when shorter than limit', () => {
    expect(truncateText('short', 100)).toBe('short')
  })

  it('returns rawString when invalid input', () => {
    expect(truncateText(undefined as any, 10)).toBe(undefined)
  })

  it('truncates without respecting words', () => {
    expect(truncateText('abcdefgh', 5)).toBe('abcd…')
  })

  it('truncates respecting words', () => {
    expect(truncateText('Hello world there', 12, { respectWords: true })).toBe('Hello…')
  })

  it('returns ellipsis when text is too short for ellipsis', () => {
    expect(truncateText('abcdefgh', 5, { respectWords: true, ellipsis: '.....' })).toBe('.....')
  })

  it('removes returns by default', () => {
    expect(truncateText('Hello\nworld\nthere', 10, { respectWords: true })).toBe('Hello…')
  })

  it('keeps returns when removeReturns is false', () => {
    const result = truncateText('Hello\nworld\nthere', 10, { respectWords: true, removeReturns: false })
    expect(result).toContain('\n')
    expect(result.endsWith('…')).toBe(true)
  })

  it('supports custom splitPosition', () => {
    expect(truncateText('abcdefgh', 5, { splitPosition: 2 })).toBe('ab…gh')
  })

  it('supports custom ellipsis', () => {
    expect(truncateText('abcdefgh', 5, { ellipsis: '...' })).toBe('ab...')
  })

  it('returns plain substring when appendEllipsis is false', () => {
    expect(truncateText('abcdefgh', 5, { appendEllipsis: false })).toBe('abcde')
  })
})

describe('stripExtension', () => {
  it('trims single extension', () => {
    expect(stripExtension('file.md')).toBe('file')
  })

  it('trims last extension only', () => {
    expect(stripExtension('archive.tar.gz')).toBe('archive.tar')
  })

  it('returns input when no dot', () => {
    expect(stripExtension('README')).toBe('README')
  })

  it('returns empty string for empty input', () => {
    expect(stripExtension('')).toBe('')
  })

  it('returns empty string for non-string', () => {
    expect(stripExtension(123 as any)).toBe('')
  })
})

describe('slugify', () => {
  it('returns empty string for empty input', () => {
    expect(slugify('')).toBe('')
  })

  it('returns empty string for falsy input', () => {
    expect(slugify(null as any)).toBe('')
  })

  it('transliterates esperanto characters', () => {
    expect(slugify('ĉĝĥĵŝŭ', 'eo')).toBe('cygyxjysyw')
    expect(slugify('ĈĜĤĴŜŬ', 'eo')).toBe('CyGyXJySyW')
  })

  it('slugifies russian text', () => {
    const result = slugify('Привет мир', 'ru')
    expect(result).toBe('privet-mir')
  })

  it('slugifies english text', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })
})
