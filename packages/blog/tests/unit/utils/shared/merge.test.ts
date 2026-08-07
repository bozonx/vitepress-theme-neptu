import { describe, it, expect } from 'vitest'
import { isPlainObject, deepMerge } from '../../../../src/utils/shared/merge.ts'

describe('isPlainObject', () => {
  it('returns true for plain objects', () => {
    expect(isPlainObject({})).toBe(true)
    expect(isPlainObject({ a: 1 })).toBe(true)
  })

  it('returns false for arrays', () => {
    expect(isPlainObject([])).toBe(false)
    expect(isPlainObject([1, 2])).toBe(false)
  })

  it('returns false for null', () => {
    expect(isPlainObject(null)).toBe(false)
  })

  it('returns false for primitives', () => {
    expect(isPlainObject(1)).toBe(false)
    expect(isPlainObject('str')).toBe(false)
    expect(isPlainObject(true)).toBe(false)
    expect(isPlainObject(undefined)).toBe(false)
  })

  it('returns false for functions', () => {
    expect(isPlainObject(() => {})).toBe(false)
  })

  it('returns false for Date instances', () => {
    expect(isPlainObject(new Date())).toBe(false)
  })

  it('returns false for RegExp instances', () => {
    expect(isPlainObject(/foo/)).toBe(false)
  })

  it('returns false for class instances', () => {
    class Foo {}
    expect(isPlainObject(new Foo())).toBe(false)
  })

  it('returns true for Object.create(null)', () => {
    expect(isPlainObject(Object.create(null))).toBe(true)
  })
})

describe('deepMerge', () => {
  it('merges shallow properties', () => {
    const base = { a: 1, b: 2 }
    const patch = { b: 3, c: 4 }
    expect(deepMerge(base, patch)).toEqual({ a: 1, b: 3, c: 4 })
  })

  it('deeply merges nested objects', () => {
    const base = { a: { x: 1, y: 2 }, b: 3 }
    const patch = { a: { y: 5, z: 6 } }
    expect(deepMerge(base, patch)).toEqual({ a: { x: 1, y: 5, z: 6 }, b: 3 })
  })

  it('replaces arrays instead of merging', () => {
    const base = { a: [1, 2], b: 3 }
    const patch = { a: [3, 4] }
    const result = deepMerge(base, patch)
    expect(result.a).toEqual([3, 4])
    expect(result.a).not.toBe(base.a)
  })

  it('returns patch when base is not a plain object', () => {
    expect(deepMerge(null as any, { a: 1 })).toEqual({ a: 1 })
    expect(deepMerge([1, 2] as any, { a: 1 })).toEqual({ a: 1 })
  })

  it('returns patch when patch is not a plain object', () => {
    expect(deepMerge({ a: 1 }, [1, 2] as any)).toEqual([1, 2])
  })

  it('returns base when patch is null', () => {
    expect(deepMerge({ a: 1 }, null as any)).toEqual({ a: 1 })
  })

  it('returns patch when both are non-plain objects', () => {
    expect(deepMerge(null as any, null as any)).toBe(null)
    expect(deepMerge([1] as any, [2] as any)).toEqual([2])
  })

  it('does not overwrite with undefined', () => {
    const base = { a: 1, b: 2 }
    const patch = { a: undefined, c: 3 }
    expect(deepMerge(base, patch)).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('overwrites with null', () => {
    const base = { a: 1 }
    const patch = { a: null }
    expect(deepMerge(base, patch)).toEqual({ a: null })
  })

  it('handles empty objects', () => {
    expect(deepMerge({}, { a: 1 })).toEqual({ a: 1 })
    expect(deepMerge({ a: 1 }, {})).toEqual({ a: 1 })
  })

  it('creates nested objects when base key is missing', () => {
    const base = { a: 1 }
    const patch = { b: { x: 2 } }
    expect(deepMerge(base, patch)).toEqual({ a: 1, b: { x: 2 } })
  })

  it('preserves Date instances instead of merging them into empty objects', () => {
    const date = new Date('2024-01-01')
    const result = deepMerge({ d: date }, { d: new Date('2024-06-01') })
    expect(result.d).toBeInstanceOf(Date)
    expect((result.d as Date).toISOString()).toBe('2024-06-01T00:00:00.000Z')
  })

  it('skips __proto__ key to prevent prototype pollution', () => {
    const base = { a: 1 }
    const patch = JSON.parse('{"__proto__":{"polluted":true}}')
    const result = deepMerge(base, patch)
    expect(result).toEqual({ a: 1 })
    expect((result as any).polluted).toBeUndefined()
  })

  it('skips constructor and prototype keys', () => {
    const base = { a: 1 }
    const patch = { constructor: { b: 2 }, prototype: { c: 3 } }
    const result = deepMerge(base, patch)
    expect(result).toEqual({ a: 1 })
  })
})
