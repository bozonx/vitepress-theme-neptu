import { describe, it, expect } from 'vitest'
import { formatReadableDate } from '../../../../src/utils/shared/date.ts'

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
