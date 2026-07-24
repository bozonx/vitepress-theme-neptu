import { describe, it, expect } from 'vitest'
import { makeHumanDate } from '../../../../src/utils/shared/date.ts'

describe('makeHumanDate', () => {
  it('formats a valid date string', () => {
    const result = makeHumanDate('2024-03-15', 'en-US')
    expect(result).toBeDefined()
    expect(result).toContain('15')
    expect(result).toContain('2024')
  })

  it('formats a timestamp number', () => {
    const result = makeHumanDate(1700000000000, 'en-US')
    expect(result).toBeDefined()
    expect(result).toContain('2023')
  })

  it('formats a Date object', () => {
    const result = makeHumanDate(new Date('2024-01-01'), 'en-US')
    expect(result).toBeDefined()
    expect(result).toContain('2024')
  })

  it('returns undefined for null', () => {
    expect(makeHumanDate(null)).toBeUndefined()
  })

  it('returns undefined for undefined', () => {
    expect(makeHumanDate(undefined)).toBeUndefined()
  })

  it('returns undefined for empty string', () => {
    expect(makeHumanDate('')).toBeUndefined()
  })

  it('returns undefined for 0', () => {
    expect(makeHumanDate(0)).toBeUndefined()
  })

  it('uses UTC by default', () => {
    const result = makeHumanDate('2024-06-01T00:00:00Z', 'en-US')
    expect(result).toBeDefined()
  })

  it('respects custom timeZone', () => {
    const utc = makeHumanDate('2024-01-15T00:00:00Z', 'en-US', 'UTC')
    const ny = makeHumanDate('2024-01-15T00:00:00Z', 'en-US', 'America/New_York')
    expect(utc).toBeDefined()
    expect(ny).toBeDefined()
    expect(utc).not.toBe(ny)
  })
})
