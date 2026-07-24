import { describe, it, expect } from 'vitest'
import { arraysIntersection } from '../../../../src/utils/shared/array.ts'

describe('arraysIntersection', () => {
  it('returns common elements of two arrays', () => {
    expect(arraysIntersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3])
  })

  it('returns empty array when no common elements', () => {
    expect(arraysIntersection([1, 2], [3, 4])).toEqual([])
  })

  it('returns empty array when first array is empty', () => {
    expect(arraysIntersection([], [1, 2])).toEqual([])
  })

  it('returns empty array when second array is empty', () => {
    expect(arraysIntersection([1, 2], [])).toEqual([])
  })

  it('returns empty array when both arrays are empty', () => {
    expect(arraysIntersection([], [])).toEqual([])
  })

  it('uses default empty arrays when arguments are omitted', () => {
    expect(arraysIntersection()).toEqual([])
    expect(arraysIntersection([1])).toEqual([])
  })

  it('preserves duplicates from the first array', () => {
    expect(arraysIntersection([1, 1, 2], [1])).toEqual([1, 1])
  })

  it('works with string arrays', () => {
    expect(arraysIntersection(['a', 'b'], ['b', 'c'])).toEqual(['b'])
  })
})
