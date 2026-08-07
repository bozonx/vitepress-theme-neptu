import { describe, it, expect, vi } from 'vitest'
import {
  normalizeTag,
  normalizeTags,
  normalizeCategories,
} from '../../../../src/utils/shared/tags.ts'

describe('normalizeTag', () => {
  it('turns a string into a name/slug pair', () => {
    expect(normalizeTag('Web Development')).toEqual({
      id: 'web-development',
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
      { id: 'ok', name: 'ok', slug: 'ok' },
    ])
  })
})

describe('normalizeCategories', () => {
  it('always returns an array', () => {
    expect(normalizeCategories(undefined, undefined)).toEqual([])
  })

  it('folds the `category` sugar into the list', () => {
    expect(normalizeCategories('Frontend', undefined)).toEqual([
      { id: 'frontend', name: 'Frontend', slug: 'frontend' },
    ])
  })

  it('puts the `category` sugar first, then the list', () => {
    const result = normalizeCategories('Frontend', ['Backend'])
    expect(result.map((item) => item.slug)).toEqual(['frontend', 'backend'])
  })

  // Declaring the same value both ways must not render a doubled chip.
  it('de-duplicates by id', () => {
    const result = normalizeCategories('Frontend', [
      { name: 'Frontend', slug: 'frontend' },
    ])
    expect(result).toHaveLength(1)
  })

  it('slugifies non-latin names', () => {
    expect(normalizeCategories('Разработка', undefined, 'ru')).toEqual([
      { id: 'razrabotka', name: 'Разработка', slug: 'razrabotka' },
    ])
  })
})

describe('normalizeCategories with a registry', () => {
  const registry = [
    { id: 'getting-started', name: 'Начало работы' },
    { id: 'configuration', name: 'Настройка', slug: 'nastrojka' },
  ]

  it('resolves an id to the locale name, defaulting the slug to the id', () => {
    expect(normalizeCategories('getting-started', undefined, 'ru', registry)).toEqual([
      { id: 'getting-started', name: 'Начало работы', slug: 'getting-started' },
    ])
  })

  it('keeps an explicit per-locale slug', () => {
    expect(normalizeCategories('configuration', undefined, 'ru', registry)).toMatchObject([
      { id: 'configuration', slug: 'nastrojka' },
    ])
  })

  // A blog written before the registry existed referenced categories by name.
  it('still resolves a legacy name reference', () => {
    expect(normalizeCategories('Настройка', undefined, 'ru', registry)).toMatchObject([
      { id: 'configuration', name: 'Настройка' },
    ])
  })

  // An unknown id must not break the build — it degrades to the old behavior.
  it('falls back to a slugified name for an unknown id', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(normalizeCategories('Прочее', undefined, 'ru', registry)).toEqual([
      { id: 'prochee', name: 'Прочее', slug: 'prochee' },
    ])
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  // Same category reached by id and by name is still one chip.
  it('de-duplicates entries that resolve to the same id', () => {
    const result = normalizeCategories('configuration', ['Настройка'], 'ru', registry)
    expect(result).toHaveLength(1)
  })
})
