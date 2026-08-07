import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
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
  const registry = [
    { id: 'frontend', name: 'Frontend' },
    { id: 'backend', name: 'Backend' },
    { id: 'configuration', name: 'Настройка', slug: 'nastrojka' },
  ]

  it('always returns an array', () => {
    expect(normalizeCategories(undefined, undefined)).toEqual([])
  })

  it('folds the `category` sugar into the list', () => {
    expect(normalizeCategories('frontend', undefined, 'en', registry)).toEqual([
      { id: 'frontend', name: 'Frontend', slug: 'frontend' },
    ])
  })

  it('puts the `category` sugar first, then the list', () => {
    const result = normalizeCategories('frontend', ['backend'], 'en', registry)
    expect(result.map((item) => item.id)).toEqual(['frontend', 'backend'])
  })

  // Declaring the same category both ways must not render a doubled chip.
  it('de-duplicates by id', () => {
    const result = normalizeCategories('frontend', ['frontend'], 'en', registry)
    expect(result).toHaveLength(1)
  })

  // `name` and `slug` live in the registry, so the id alone is enough.
  it('defaults name and slug to the id', () => {
    const result = normalizeCategories('x', undefined, 'en', [{ id: 'x' }])
    expect(result).toEqual([{ id: 'x', name: 'x', slug: 'x' }])
  })

  it('keeps an explicit per-locale slug', () => {
    expect(normalizeCategories('configuration', undefined, 'ru', registry)).toMatchObject([
      { id: 'configuration', name: 'Настройка', slug: 'nastrojka' },
    ])
  })

  // Re-running over already-resolved frontmatter must be a no-op, not a loss.
  it('is idempotent over resolved entries', () => {
    const once = normalizeCategories('frontend', undefined, 'en', registry)
    expect(normalizeCategories(undefined, once, 'en', registry)).toEqual(once)
  })
})

describe('normalizeCategories rejects anything but a registered id', () => {
  const registry = [{ id: 'configuration', name: 'Настройка' }]
  let warn: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })
  afterEach(() => {
    warn.mockRestore()
  })

  // A typo used to invent a one-post category. Now it is reported instead.
  it('drops an unknown id and warns', () => {
    expect(normalizeCategories('typo', undefined, 'ru', registry)).toEqual([])
    expect(warn).toHaveBeenCalledOnce()
  })

  it('drops a display name — the registry is the only place names live', () => {
    expect(normalizeCategories('Настройка', undefined, 'ru', registry)).toEqual([])
    expect(warn).toHaveBeenCalledOnce()
  })

  it('drops the inline `{ name, slug }` form', () => {
    expect(
      normalizeCategories({ name: 'Настройка', slug: 'setup' }, undefined, 'ru', registry)
    ).toEqual([])
    expect(warn).toHaveBeenCalledOnce()
  })

  // Without a registry there is nothing any value could resolve against.
  it('drops everything when there is no registry', () => {
    expect(normalizeCategories('configuration', undefined, 'ru')).toEqual([])
    expect(warn).toHaveBeenCalledOnce()
  })
})
