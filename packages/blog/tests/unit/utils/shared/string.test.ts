import { describe, it, expect } from 'vitest'
import {
  mustacheTemplate,
  standardTemplate,
  smartTruncate,
  pathTrimExt,
  transliterate,
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

describe('standardTemplate', () => {
  it('replaces simple key', () => {
    expect(standardTemplate('Hello ${name}!', { name: 'World' })).toBe('Hello World!')
  })

  it('replaces nested key', () => {
    expect(standardTemplate('${user.name}', { user: { name: 'Alice' } })).toBe('Alice')
  })

  it('replaces unknown keys with empty string', () => {
    expect(standardTemplate('${unknown}', {})).toBe('')
  })

  it('replaces multiple occurrences', () => {
    expect(standardTemplate('${a} and ${a}', { a: 'X' })).toBe('X and X')
  })

  it('handles eval option', () => {
    expect(standardTemplate('${a + b}', { a: 1, b: 2 }, { eval: true })).toBe('3')
  })

  it('returns empty string for null template', () => {
    expect(standardTemplate(null, { a: 1 })).toBe('')
  })

  it('returns original template for null data', () => {
    expect(standardTemplate('${a}', null)).toBe('${a}')
  })

  it('ignores spaces inside tags by trimming key', () => {
    expect(standardTemplate('${ name }', { name: 'Bob' })).toBe('Bob')
  })
})

describe('smartTruncate', () => {
  it('returns rawString when length is <= 4', () => {
    expect(smartTruncate('abc', 4)).toBe('abc')
  })

  it('returns rawString when mark is not a string', () => {
    expect(smartTruncate('abcdef', 3, { mark: 123 as any })).toBe('abcdef')
  })

  it('returns rawString when shorter than limit', () => {
    expect(smartTruncate('short', 100)).toBe('short')
  })

  it('returns rawString when invalid input', () => {
    expect(smartTruncate(undefined as any, 10)).toBe(undefined)
  })

  it('truncates without respecting words', () => {
    expect(smartTruncate('abcdefgh', 5)).toBe('abcd…')
  })

  it('truncates respecting words', () => {
    expect(smartTruncate('Hello world there', 12, { respectWords: true })).toBe('Hello…')
  })

  it('returns mark when text is too short for mark', () => {
    expect(smartTruncate('abcdefgh', 5, { respectWords: true, mark: '.....' })).toBe('.....')
  })

  it('removes returns by default', () => {
    expect(smartTruncate('Hello\nworld\nthere', 10, { respectWords: true })).toBe('Hello…')
  })

  it('keeps returns when removeReturns is false', () => {
    const result = smartTruncate('Hello\nworld\nthere', 10, { respectWords: true, removeReturns: false })
    expect(result).toContain('\n')
    expect(result.endsWith('…')).toBe(true)
  })

  it('supports custom position', () => {
    expect(smartTruncate('abcdefgh', 5, { position: 2 })).toBe('ab…gh')
  })

  it('supports custom mark', () => {
    expect(smartTruncate('abcdefgh', 5, { mark: '...' })).toBe('ab...')
  })

  it('returns plain substring when markAtTheEnd is false', () => {
    expect(smartTruncate('abcdefgh', 5, { markAtTheEnd: false })).toBe('abcde')
  })
})

describe('pathTrimExt', () => {
  it('trims single extension', () => {
    expect(pathTrimExt('file.md')).toBe('file')
  })

  it('trims last extension only', () => {
    expect(pathTrimExt('archive.tar.gz')).toBe('archive.tar')
  })

  it('returns input when no dot', () => {
    expect(pathTrimExt('README')).toBe('README')
  })

  it('returns empty string for empty input', () => {
    expect(pathTrimExt('')).toBe('')
  })

  it('returns empty string for non-string', () => {
    expect(pathTrimExt(123 as any)).toBe('')
  })
})

describe('transliterate', () => {
  it('returns empty string for empty input', () => {
    expect(transliterate('')).toBe('')
  })

  it('returns empty string for falsy input', () => {
    expect(transliterate(null as any)).toBe('')
  })

  it('transliterates esperanto characters', () => {
    expect(transliterate('ĉĝĥĵŝŭ', 'eo')).toBe('cygyxjysyw')
    expect(transliterate('ĈĜĤĴŜŬ', 'eo')).toBe('CyGyXJySyW')
  })

  it('slugifies russian text', () => {
    const result = transliterate('Привет мир', 'ru')
    expect(result).toBe('privet-mir')
  })

  it('slugifies english text', () => {
    expect(transliterate('Hello World')).toBe('hello-world')
  })
})
