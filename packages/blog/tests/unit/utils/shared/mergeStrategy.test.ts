import { describe, it, expect } from 'vitest'
import { mergeAuthorsById, mergeSocialMediaSharesByName } from '../../../../src/utils/shared/mergeStrategy.ts'

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

describe('mergeSocialMediaSharesByName', () => {
  it('returns child list when parent is empty', () => {
    const child = [{ name: 'telegram', icon: 't', title: 'T', urlTemplate: 'x' }]
    expect(mergeSocialMediaSharesByName([], child)).toEqual(child)
    expect(mergeSocialMediaSharesByName(undefined, child)).toEqual(child)
  })

  it('returns parent list when child is empty', () => {
    const parent = [{ name: 'telegram', icon: 't', title: 'T', urlTemplate: 'x' }]
    expect(mergeSocialMediaSharesByName(parent, [])).toEqual(parent)
    expect(mergeSocialMediaSharesByName(parent, undefined)).toEqual(parent)
  })

  it('overrides fields on same name, preserves parent order', () => {
    const parent = [
      { name: 'telegram', icon: 'old', title: 'Telegram', urlTemplate: 'a' },
      { name: 'x', icon: 'x', title: 'X', urlTemplate: 'b' },
    ]
    const child = [{ name: 'telegram', icon: 'new' }]
    const result = mergeSocialMediaSharesByName(parent, child as any)
    expect(result).toEqual([
      { name: 'telegram', icon: 'new', title: 'Telegram', urlTemplate: 'a' },
      { name: 'x', icon: 'x', title: 'X', urlTemplate: 'b' },
    ])
  })

  it('appends new child entries in child order', () => {
    const parent = [{ name: 'telegram', icon: 't', title: 'T', urlTemplate: 'a' }]
    const child = [
      { name: 'reddit', icon: 'r', title: 'Reddit', urlTemplate: 'c' },
      { name: 'x', icon: 'x', title: 'X', urlTemplate: 'd' },
    ]
    expect(mergeSocialMediaSharesByName(parent, child)).toEqual([
      { name: 'telegram', icon: 't', title: 'T', urlTemplate: 'a' },
      { name: 'reddit', icon: 'r', title: 'Reddit', urlTemplate: 'c' },
      { name: 'x', icon: 'x', title: 'X', urlTemplate: 'd' },
    ])
  })

  it('keeps entries without name untouched', () => {
    const parent = [{ icon: 'no-name' } as any, { name: 'telegram', icon: 't', title: 'T', urlTemplate: 'a' }]
    const child = [{ name: 'telegram', icon: 'new' }]
    const result = mergeSocialMediaSharesByName(parent, child as any)
    expect(result).toEqual([
      { icon: 'no-name' },
      { name: 'telegram', icon: 'new', title: 'T', urlTemplate: 'a' },
    ])
  })

  it('child entries with same name appear only once (after parent)', () => {
    const parent = [{ name: 'telegram', icon: 'old', title: 'T', urlTemplate: 'a' }]
    const child = [{ name: 'telegram', icon: 'new', title: 'T2', urlTemplate: 'b' }]
    expect(mergeSocialMediaSharesByName(parent, child)).toEqual([
      { name: 'telegram', icon: 'new', title: 'T2', urlTemplate: 'b' },
    ])
  })

  it('preserves enabled: false from child', () => {
    const parent = [{ name: 'vk', icon: 'v', title: 'VK', urlTemplate: 'a' }]
    const child = [{ name: 'vk', enabled: false }]
    const result = mergeSocialMediaSharesByName(parent, child as any)
    expect(result).toEqual([
      { name: 'vk', icon: 'v', title: 'VK', urlTemplate: 'a', enabled: false },
    ])
  })
})
