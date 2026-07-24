import { describe, it, expect } from 'vitest'
import { removeTitleFromMd } from '../../../../src/utils/shared/markdown.ts'

describe('removeTitleFromMd', () => {
  it('removes H1 title at the beginning', () => {
    const md = '# Hello World\n\nSome content'
    expect(removeTitleFromMd(md)).toBe('\n\nSome content')
  })

  it('returns empty string for H1-only markdown', () => {
    expect(removeTitleFromMd('# Title')).toBe('')
  })

  it('does not remove H2 or lower headings', () => {
    const md = '## Section\n\nContent'
    expect(removeTitleFromMd(md)).toBe('## Section\n\nContent')
  })

  it('does not remove H1 not at the start after trim', () => {
    const md = 'Intro\n# Title\nContent'
    expect(removeTitleFromMd(md)).toBe('Intro\n# Title\nContent')
  })

  it('trims whitespace before removing', () => {
    const md = '   # Title   \n\nContent'
    expect(removeTitleFromMd(md)).toBe('\n\nContent')
  })

  it('removes setext H1 titles', () => {
    const md = 'Hello World\n===\n\nContent'
    expect(removeTitleFromMd(md)).toBe('\n\nContent')
  })

  it('returns empty string for null', () => {
    expect(removeTitleFromMd(null)).toBe('')
  })

  it('returns empty string for undefined', () => {
    expect(removeTitleFromMd(undefined)).toBe('')
  })

  it('returns empty string for empty input', () => {
    expect(removeTitleFromMd('')).toBe('')
  })
})
