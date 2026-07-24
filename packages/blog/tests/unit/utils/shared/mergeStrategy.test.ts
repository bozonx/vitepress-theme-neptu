import { describe, it, expect } from 'vitest'
import { mergeAuthorsById } from '../../../../src/utils/shared/mergeStrategy.ts'

describe('mergeAuthorsById', () => {
  it('returns child list when parent is empty', () => {
    const child = [{ id: 'a', name: 'A' }]
    expect(mergeAuthorsById([], child)).toEqual(child)
    expect(mergeAuthorsById(undefined, child)).toEqual(child)
  })

  it('returns parent list when child is empty', () => {
    const parent = [{ id: 'a', name: 'A' }]
    expect(mergeAuthorsById(parent, [])).toEqual(parent)
    expect(mergeAuthorsById(parent, undefined)).toEqual(parent)
  })

  it('overrides fields on same id, preserves parent order', () => {
    const parent = [
      { id: 'a', name: 'A', description: 'old' },
      { id: 'b', name: 'B' },
    ]
    const child = [{ id: 'a', description: 'new' }]
    const result = mergeAuthorsById(parent, child as any)
    expect(result).toEqual([
      { id: 'a', name: 'A', description: 'new' },
      { id: 'b', name: 'B' },
    ])
  })

  it('appends new child entries in child order', () => {
    const parent = [{ id: 'a', name: 'A' }]
    const child = [
      { id: 'c', name: 'C' },
      { id: 'b', name: 'B' },
    ]
    expect(mergeAuthorsById(parent, child)).toEqual([
      { id: 'a', name: 'A' },
      { id: 'c', name: 'C' },
      { id: 'b', name: 'B' },
    ])
  })

  it('keeps entries without id untouched', () => {
    const parent = [{ name: 'NoId' } as any, { id: 'a', name: 'A' }]
    const child = [{ id: 'a', description: 'x' }]
    const result = mergeAuthorsById(parent, child as any)
    expect(result).toEqual([
      { name: 'NoId' },
      { id: 'a', name: 'A', description: 'x' },
    ])
  })

  it('child entries with same id appear only once (after parent)', () => {
    const parent = [{ id: 'a', name: 'A' }]
    const child = [{ id: 'a', name: 'A-new' }]
    expect(mergeAuthorsById(parent, child)).toEqual([
      { id: 'a', name: 'A-new' },
    ])
  })
})
