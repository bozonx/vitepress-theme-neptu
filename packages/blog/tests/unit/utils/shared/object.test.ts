import { describe, it, expect } from 'vitest'
import {
  splitDeepPath,
  joinDeepPath,
  isPathValid,
  deepGet,
  omitUndefined,
} from '../../../../src/utils/shared/object.ts'

describe('splitDeepPath', () => {
  it('splits dot-notation path', () => {
    expect(splitDeepPath('a.b.c')).toEqual(['a', 'b', 'c'])
  })

  it('splits array indices', () => {
    expect(splitDeepPath('a[0].b[1].c')).toEqual(['a', 0, 'b', 1, 'c'])
  })

  it('handles consecutive arrays', () => {
    expect(splitDeepPath('a[0][1]')).toEqual(['a', 0, 1])
  })

  it('marks negative indexes specially', () => {
    expect(splitDeepPath('a[-1]')).toEqual(['a', '__NEGATIVE_INDEX__'])
  })

  it('returns empty array for non-string input', () => {
    expect(splitDeepPath(null)).toEqual([])
    expect(splitDeepPath(123 as any)).toEqual([])
    expect(splitDeepPath(undefined)).toEqual([])
  })

  it('returns empty array for invalid bracket syntax', () => {
    expect(splitDeepPath('a[foo]')).toEqual([])
  })

  it('handles leading dot', () => {
    expect(splitDeepPath('.a.b')).toEqual(['a', 'b'])
  })
})

describe('joinDeepPath', () => {
  it('joins strings and numbers', () => {
    expect(joinDeepPath(['a', 0, 'b', 1, 'c'])).toBe('a[0].b[1].c')
  })

  it('joins plain strings only', () => {
    expect(joinDeepPath(['a', 'b'])).toBe('a.b')
  })

  it('handles numbers at start', () => {
    expect(joinDeepPath([0, 'a'])).toBe('[0].a')
  })

  it('returns empty string for empty array', () => {
    expect(joinDeepPath([])).toBe('')
  })

  it('returns empty string for non-array', () => {
    expect(joinDeepPath(null as any)).toBe('')
  })

  it('skips empty strings', () => {
    expect(joinDeepPath(['a', '', 'b'])).toBe('a.b')
  })
})

describe('isPathValid', () => {
  it('returns true for valid path', () => {
    expect(isPathValid('a.b')).toBe(true)
  })

  it('returns false for empty string', () => {
    expect(isPathValid('')).toBe(false)
  })

  it('returns false for non-string', () => {
    expect(isPathValid(123 as any)).toBe(false)
  })

  it('returns false for invalid bracket syntax', () => {
    expect(isPathValid('a[foo]')).toBe(false)
  })
})

describe('deepGet', () => {
  const obj = {
    a: {
      b: [
        { c: 'value' },
        { d: 42 },
      ],
    },
  }

  it('gets nested object value', () => {
    expect(deepGet(obj, 'a.b')).toEqual(obj.a.b)
  })

  it('gets value inside array', () => {
    expect(deepGet(obj, 'a.b[0].c')).toBe('value')
  })

  it('returns defaultValue for missing path', () => {
    expect(deepGet(obj, 'a.x', 'default')).toBe('default')
  })

  it('returns defaultValue for negative array index', () => {
    expect(deepGet(obj, 'a.b[-1]', 'default')).toBe('default')
  })

  it('returns defaultValue when src is null', () => {
    expect(deepGet(null, 'a', 'default')).toBe('default')
  })

  it('returns defaultValue when path is not a string', () => {
    expect(deepGet(obj, 123 as any, 'default')).toBe('default')
  })

  it('does not read inherited properties', () => {
    const parent = { inherited: 'yes' }
    const child = Object.create(parent)
    child.own = 'yes'
    expect(deepGet(child, 'inherited', 'default')).toBe('default')
    expect(deepGet(child, 'own', 'default')).toBe('yes')
  })

  it('handles array src with numeric path', () => {
    expect(deepGet([10, 20, 30], '[1]')).toBe(20)
  })

  it('returns defaultValue for out-of-bounds array index', () => {
    expect(deepGet([10, 20], '[5]', 'default')).toBe('default')
  })

  it('returns defaultValue for string path on array src', () => {
    expect(deepGet([10, 20], 'foo', 'default')).toBe('default')
  })
})

describe('omitUndefined', () => {
  it('removes undefined values', () => {
    expect(omitUndefined({ a: 1, b: undefined, c: 'x' })).toEqual({ a: 1, c: 'x' })
  })

  it('keeps null and false', () => {
    expect(omitUndefined({ a: null, b: false, c: 0 })).toEqual({ a: null, b: false, c: 0 })
  })

  it('returns empty object for null', () => {
    expect(omitUndefined(null)).toEqual({})
  })

  it('returns empty object for undefined', () => {
    expect(omitUndefined(undefined)).toEqual({})
  })

  it('returns empty object for arrays', () => {
    expect(omitUndefined([1, 2] as any)).toEqual({})
  })
})
