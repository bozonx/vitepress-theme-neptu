import { describe, it, expect } from 'vitest'
import { arrayIntersection } from '../../../../src/utils/shared/array.ts'

describe('arrayIntersection', () => {
  it('returns common elements of two arrays', () => {
    expect(arrayIntersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3])
  })

  it('returns empty array when no common elements', () => {
    expect(arrayIntersection([1, 2], [3, 4])).toEqual([])
  })

  it('returns empty array when first array is empty', () => {
    expect(arrayIntersection([], [1, 2])).toEqual([])
  })

  it('returns empty array when second array is empty', () => {
    expect(arrayIntersection([1, 2], [])).toEqual([])
  })

  it('returns empty array when both arrays are empty', () => {
    expect(arrayIntersection([], [])).toEqual([])
  })

  it('uses default empty arrays when arguments are omitted', () => {
    expect(arrayIntersection()).toEqual([])
    expect(arrayIntersection([1])).toEqual([])
  })

  it('preserves duplicates from the first array', () => {
    expect(arrayIntersection([1, 1, 2], [1])).toEqual([1, 1])
  })

  it('works with string arrays', () => {
    expect(arrayIntersection(['a', 'b'], ['b', 'c'])).toEqual(['b'])
  })
})
