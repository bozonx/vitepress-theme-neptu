import { describe, it, expect } from 'vitest'
import {
  stripMd,
  mdToHtml,
  parseMdFile,
  extractDescriptionFromMd,
  extractDescriptionFromContent,
} from '../../../../src/utils/node/markdown.ts'

describe('stripMd', () => {
  it('strips markdown to plain text', () => {
    expect(stripMd('Hello **world**')).toBe('Hello world\n')
  })

  it('handles headings', () => {
    expect(stripMd('# Title\n\nParagraph')).toBe('Title\n\nParagraph\n')
  })

  it('returns empty string for null', () => {
    expect(stripMd(null)).toBe('')
  })

  it('returns empty string for undefined', () => {
    expect(stripMd(undefined)).toBe('')
  })

  it('returns empty string for empty string', () => {
    expect(stripMd('')).toBe('')
  })
})

describe('mdToHtml', () => {
  it('converts markdown to HTML', () => {
    const result = mdToHtml('Hello **world**')
    expect(result).toContain('<strong>world</strong>')
  })

  it('wraps multiple paragraphs in p tags', () => {
    const result = mdToHtml('First\n\nSecond')
    expect(result).toContain('<p>First</p>')
    expect(result).toContain('<p>Second</p>')
  })

  it('strips outer p tag for single paragraph', () => {
    expect(mdToHtml('Single paragraph')).toBe('Single paragraph')
  })

  it('adds target=_blank to external links', () => {
    const result = mdToHtml('[link](https://example.com)')
    expect(result).toContain('target="_blank"')
    expect(result).toContain('rel="noopener noreferrer"')
  })

  it('strips unsafe javascript links', () => {
    const result = mdToHtml('[link](javascript:alert(1))')
    expect(result).not.toContain('javascript:alert(1)')
    expect(result).toContain('<a>link</a>')
  })

  it('returns empty string for null', () => {
    expect(mdToHtml(null)).toBe('')
  })

  it('returns empty string for undefined', () => {
    expect(mdToHtml(undefined)).toBe('')
  })

  it('handles headings without stripping p', () => {
    const result = mdToHtml('# Title\n\nParagraph')
    expect(result).toContain('<h1>Title</h1>')
  })
})

describe('parseMdFile', () => {
  it('parses frontmatter and content', () => {
    const raw = '---\ntitle: Hello\n---\n\nBody content'
    const result = parseMdFile(raw)
    expect(result.frontmatter).toEqual({ title: 'Hello' })
    expect(result.content).toBe('\nBody content')
  })

  it('parses without frontmatter', () => {
    const raw = 'Plain content'
    const result = parseMdFile(raw)
    expect(result.frontmatter).toEqual({})
    expect(result.content).toBe('Plain content')
  })

  it('parses empty frontmatter', () => {
    const raw = '---\n---\nContent'
    const result = parseMdFile(raw)
    expect(result.frontmatter).toEqual({})
  })

  it('throws with source context for invalid frontmatter', () => {
    expect(() => parseMdFile('---\ntitle: [\n---\nBody', 'broken.md')).toThrow(
      'Failed to parse frontmatter in broken.md'
    )
  })
})

describe('extractDescriptionFromMd', () => {
  it('extracts plain text from markdown', () => {
    const raw = '---\ntitle: T\n---\n\nHello **world** this is a test'
    const result = extractDescriptionFromMd(raw, 20)
    expect(result).toContain('Hello')
    expect(result.length).toBeLessThanOrEqual(20 + 3)
  })

  it('removes H1 before extraction', () => {
    const raw = '# Title\n\nContent here'
    const result = extractDescriptionFromMd(raw, 100)
    expect(result).toContain('Content')
    expect(result).not.toContain('Title')
  })

  it('removes setext H1 before extraction', () => {
    const raw = 'Title\n===\n\nContent here'
    const result = extractDescriptionFromMd(raw, 100)
    expect(result).toContain('Content')
    expect(result).not.toContain('Title')
  })

  it('returns empty string for empty content', () => {
    expect(extractDescriptionFromMd('', 10)).toBe('')
  })
})

describe('extractDescriptionFromContent', () => {
  it('extracts from already parsed markdown content', () => {
    const result = extractDescriptionFromContent('# Title\n\nHello **world**', 100)

    expect(result).toBe('Hello world')
  })

  it('does not parse leading delimiters as frontmatter', () => {
    const result = extractDescriptionFromContent('---\n\nVisible content', 100)

    expect(result).toContain('Visible content')
  })
})
