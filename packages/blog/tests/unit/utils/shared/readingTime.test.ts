import { describe, it, expect } from 'vitest'
import {
  DEFAULT_READING_WPM,
  countWords,
  estimateReadingMinutes,
  isReadingTimeEnabled,
  toIsoDuration,
} from '../../../../src/utils/shared/readingTime.ts'
import type { ThemeConfig } from '../../../../src/types.d.ts'

describe('countWords', () => {
  it('counts whitespace-separated words', () => {
    expect(countWords('Hello world, this is a test.')).toBe(6)
  })

  it('returns 0 for empty input', () => {
    expect(countWords('')).toBe(0)
    expect(countWords(undefined)).toBe(0)
    expect(countWords(null)).toBe(0)
  })

  it('ignores punctuation-only tokens', () => {
    expect(countWords('one — two – three')).toBe(3)
  })

  it('counts CJK characters instead of splitting on spaces', () => {
    // Ten characters, counted at two per equivalent word.
    expect(countWords('日本語のテキストです')).toBe(5)
  })

  it('handles a mix of scripts', () => {
    expect(countWords('Vue 日本語 text')).toBe(4)
  })
})

describe('estimateReadingMinutes', () => {
  it('rounds to whole minutes at the configured speed', () => {
    expect(estimateReadingMinutes(400, 200)).toBe(2)
    expect(estimateReadingMinutes(500, 200)).toBe(3)
  })

  it('never returns 0 for a non-empty text', () => {
    expect(estimateReadingMinutes(1)).toBe(1)
    expect(estimateReadingMinutes(10, DEFAULT_READING_WPM)).toBe(1)
  })

  it('returns 0 for an empty text', () => {
    expect(estimateReadingMinutes(0)).toBe(0)
    expect(estimateReadingMinutes(-5)).toBe(0)
  })

  it('falls back to the default speed for a nonsensical wpm', () => {
    expect(estimateReadingMinutes(400, 0)).toBe(2)
    expect(estimateReadingMinutes(400, Number.NaN)).toBe(2)
  })
})

describe('toIsoDuration', () => {
  it('formats minutes as an ISO 8601 duration', () => {
    expect(toIsoDuration(7)).toBe('PT7M')
  })

  it('omits a zero or invalid duration', () => {
    expect(toIsoDuration(0)).toBeUndefined()
    expect(toIsoDuration(Number.NaN)).toBeUndefined()
  })
})

describe('isReadingTimeEnabled', () => {
  const theme = (readingTime?: ThemeConfig['readingTime']): ThemeConfig =>
    ({ readingTime }) as ThemeConfig

  it('defaults to posts only', () => {
    expect(isReadingTimeEnabled(theme(), { layout: 'post' })).toBe(true)
    expect(isReadingTimeEnabled(theme(), {})).toBe(true)
    expect(isReadingTimeEnabled(theme(), { layout: 'page' })).toBe(false)
  })

  it('never shows on the home page', () => {
    expect(isReadingTimeEnabled(theme(), { layout: 'home' })).toBe(false)
  })

  it('honours the global switch', () => {
    expect(
      isReadingTimeEnabled(theme({ enabled: false }), { layout: 'post' })
    ).toBe(false)
  })

  it('lets frontmatter override the layout list', () => {
    expect(
      isReadingTimeEnabled(theme(), { layout: 'page', readingTime: true })
    ).toBe(true)
    expect(
      isReadingTimeEnabled(theme(), { layout: 'post', readingTime: false })
    ).toBe(false)
  })

  it('honours a custom layout list', () => {
    const custom = theme({ layouts: ['page'] })
    expect(isReadingTimeEnabled(custom, { layout: 'page' })).toBe(true)
    expect(isReadingTimeEnabled(custom, { layout: 'post' })).toBe(false)
  })
})
