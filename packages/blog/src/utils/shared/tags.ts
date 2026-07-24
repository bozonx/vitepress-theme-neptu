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
