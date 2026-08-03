import { transliterate } from './string.ts'
import type { Tag } from '../../types.d.ts'

function normalizeTagName(value: string): string | undefined {
  const normalized = value.trim()
  return normalized || undefined
}

export function normalizeTag(
  value: unknown,
  lang?: string
): Tag | undefined {
  if (typeof value === 'string') {
    const name = normalizeTagName(value)
    if (!name) return

    return {
      name,
      slug: transliterate(name, lang),
    }
  }

  if (!value || typeof value !== 'object') return

  const record = value as Record<string, unknown>
  const name = typeof record.name === 'string' ? normalizeTagName(record.name) : undefined
  const rawSlug = typeof record.slug === 'string' ? normalizeTagName(record.slug) : undefined

  if (!name && !rawSlug) return

  return {
    ...record,
    name: name || rawSlug || '',
    slug: rawSlug || transliterate(name || '', lang),
  } as Tag
}

export function normalizeTags(
  values: unknown,
  lang?: string
): Tag[] | undefined {
  if (values === undefined) return undefined
  if (!Array.isArray(values)) return []

  return values
    .map((value) => normalizeTag(value, lang))
    .filter((value): value is Tag => !!value)
}

/**
 * Categories share the tag data model (`{ name, slug }`), so they share the
 * normalizer too. The only difference is the input shape: a post may declare
 * `category: 'Frontend'` as sugar for a single-entry `categories` list.
 *
 * Always returns an array so downstream code has one shape to handle. Entries
 * are de-duplicated by slug, which keeps `category` + `categories` overlap from
 * producing a doubled chip.
 */
export function normalizeCategories(
  categoryValue: unknown,
  categoriesValue: unknown,
  lang?: string
): Tag[] {
  const values = [
    ...(categoryValue === undefined || categoryValue === null
      ? []
      : [categoryValue]),
    ...(Array.isArray(categoriesValue) ? categoriesValue : []),
  ]
  const result: Tag[] = []

  for (const value of values) {
    const normalized = normalizeTag(value, lang)
    if (!normalized) continue
    if (result.some((item) => item.slug === normalized.slug)) continue
    result.push(normalized)
  }

  return result
}
