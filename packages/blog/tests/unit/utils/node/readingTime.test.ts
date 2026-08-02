import { describe, it, expect } from 'vitest'
import { measureMarkdown } from '../../../../src/utils/node/readingTime.ts'

describe('measureMarkdown', () => {
  it('returns zeros for empty content', () => {
    expect(measureMarkdown('')).toEqual({ wordCount: 0, readingTime: 0 })
    expect(measureMarkdown(undefined)).toEqual({ wordCount: 0, readingTime: 0 })
  })

  it('counts prose without markdown syntax', () => {
    const { wordCount } = measureMarkdown('## Title\n\nOne **two** _three_ four.')

    expect(wordCount).toBe(5)
  })

  it('does not count fenced code blocks', () => {
    const withCode = measureMarkdown(
      'Intro text here.\n\n```js\nconst a = 1\nconst b = 2\nconsole.log(a + b)\n```\n'
    )
    const withoutCode = measureMarkdown('Intro text here.\n')

    expect(withCode.wordCount).toBe(withoutCode.wordCount)
  })

  it('does not count inline code or raw HTML', () => {
    const { wordCount } = measureMarkdown(
      'Run `npm install vitepress` now <span class="x">tag</span>'
    )

    // "Run", "now" and the HTML element's text "tag".
    expect(wordCount).toBe(3)
  })

  it('scales the estimate with the configured speed', () => {
    const content = Array.from({ length: 400 }, () => 'word').join(' ')

    expect(measureMarkdown(content, 200).readingTime).toBe(2)
    expect(measureMarkdown(content, 400).readingTime).toBe(1)
  })
})
