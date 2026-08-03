import { describe, it, expect } from 'vitest'
import {
  normalizeTag,
  normalizeTags,
  normalizeCategories,
} from '../../../../src/utils/shared/tags.ts'

describe('normalizeTag', () => {
  it('turns a string into a name/slug pair', () => {
    expect(normalizeTag('Web Development')).toEqual({
      name: 'Web Development',
      slug: 'web-development',
    })
  })

  it('keeps an explicit slug', () => {
    expect(normalizeTag({ name: 'Frontend', slug: 'fe' })).toMatchObject({
      name: 'Frontend',
      slug: 'fe',
    })
  })

  it('drops empty values', () => {
    expect(normalizeTag('   ')).toBeUndefined()
    expect(normalizeTag(null)).toBeUndefined()
    expect(normalizeTag({})).toBeUndefined()
  })
})

describe('normalizeTags', () => {
  it('returns undefined when the field is absent', () => {
    expect(normalizeTags(undefined)).toBeUndefined()
  })

  it('drops unusable entries', () => {
    expect(normalizeTags(['ok', '', null])).toEqual([
      { name: 'ok', slug: 'ok' },
    ])
  })
})

describe('normalizeCategories', () => {
  it('always returns an array', () => {
    expect(normalizeCategories(undefined, undefined)).toEqual([])
  })

  it('folds the `category` sugar into the list', () => {
    expect(normalizeCategories('Frontend', undefined)).toEqual([
      { name: 'Frontend', slug: 'frontend' },
    ])
  })

  it('puts the `category` sugar first, then the list', () => {
    const result = normalizeCategories('Frontend', ['Backend'])
    expect(result.map((item) => item.slug)).toEqual(['frontend', 'backend'])
  })

  // Declaring the same value both ways must not render a doubled chip.
  it('de-duplicates by slug', () => {
    const result = normalizeCategories('Frontend', [
      { name: 'Frontend', slug: 'frontend' },
    ])
    expect(result).toHaveLength(1)
  })

  it('slugifies non-latin names', () => {
    expect(normalizeCategories('Разработка', undefined, 'ru')).toEqual([
      { name: 'Разработка', slug: 'razrabotka' },
    ])
  })
})
