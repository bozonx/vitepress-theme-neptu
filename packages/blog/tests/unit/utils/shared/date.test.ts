import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  formatReadableDate,
  resetLocaleTagWarnings,
} from '../../../../src/utils/shared/date.ts'

describe('formatReadableDate', () => {
  it('formats a valid date string', () => {
    const result = formatReadableDate('2024-03-15', 'en-US')
    expect(result).toBeDefined()
    expect(result).toContain('15')
    expect(result).toContain('2024')
  })

  it('formats a timestamp number', () => {
    const result = formatReadableDate(1700000000000, 'en-US')
    expect(result).toBeDefined()
    expect(result).toContain('2023')
  })

  it('formats a Date object', () => {
    const result = formatReadableDate(new Date('2024-01-01'), 'en-US')
    expect(result).toBeDefined()
    expect(result).toContain('2024')
  })

  it('returns undefined for null', () => {
    expect(formatReadableDate(null)).toBeUndefined()
  })

  it('returns undefined for undefined', () => {
    expect(formatReadableDate(undefined)).toBeUndefined()
  })

  it('returns undefined for empty string', () => {
    expect(formatReadableDate('')).toBeUndefined()
  })

  it('returns undefined for 0', () => {
    expect(formatReadableDate(0)).toBeUndefined()
  })

  it('uses UTC by default', () => {
    const result = formatReadableDate('2024-06-01T00:00:00Z', 'en-US')
    expect(result).toBeDefined()
  })

  it('respects custom timeZone', () => {
    const utc = formatReadableDate('2024-01-15T00:00:00Z', 'en-US', 'UTC')
    const ny = formatReadableDate('2024-01-15T00:00:00Z', 'en-US', 'America/New_York')
    expect(utc).toBeDefined()
    expect(ny).toBeDefined()
    expect(utc).not.toBe(ny)
  })
})

describe('formatReadableDate language tags', () => {
  beforeEach(() => {
    resetLocaleTagWarnings()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // `lang` comes from user-written `_site.yaml`, so a structurally invalid tag
  // must degrade to the default locale rather than throw a RangeError and take
  // the SSR build down with it.
  it.each(['en_US', 'root', 'invalid locale', 'c'])(
    'does not throw on the invalid tag "%s"',
    (lang) => {
      expect(() => formatReadableDate('2024-01-01', lang)).not.toThrow()
      expect(formatReadableDate('2024-01-01', lang)).toBeTruthy()
    }
  )

  it('warns once per invalid tag', () => {
    formatReadableDate('2024-01-01', 'en_US')
    formatReadableDate('2024-02-01', 'en_US')
    expect(console.warn).toHaveBeenCalledTimes(1)
    expect(vi.mocked(console.warn).mock.calls[0]?.[0]).toContain('en_US')
  })

  it('does not warn for a valid tag', () => {
    formatReadableDate('2024-01-01', 'en-US')
    expect(console.warn).not.toHaveBeenCalled()
  })

  it('accepts a well-formed but unknown tag without warning', () => {
    expect(formatReadableDate('2024-01-01', 'xx-YY')).toBeTruthy()
    expect(console.warn).not.toHaveBeenCalled()
  })

  it('falls back to the default time zone when the given one is unsupported', () => {
    expect(formatReadableDate('2024-01-01', 'en-US', 'Not/AZone')).toBeTruthy()
  })
})
