import { slugify } from './string.ts'
import type { CategoryDefinition, Tag } from '../../types.d.ts'

/**
 * The per-locale category registry as loaded from
 * `<srcDir>/<locale>/_categories.{yaml,ts}`.
 */
export type CategoryRegistry = readonly CategoryDefinition[]

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

    const slug = slugify(name, lang)

    return {
      id: slug,
      name,
      slug,
    }
  }

  if (!value || typeof value !== 'object') return

  const record = value as Record<string, unknown>
  const name = typeof record.name === 'string' ? normalizeTagName(record.name) : undefined
  const rawSlug = typeof record.slug === 'string' ? normalizeTagName(record.slug) : undefined
  const rawId = typeof record.id === 'string' ? normalizeTagName(record.id) : undefined

  if (!name && !rawSlug && !rawId) return

  const slug = rawSlug || slugify(name || rawId || '', lang)

  return {
    ...record,
    id: rawId || slug,
    name: name || rawSlug || rawId || '',
    slug,
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
 * Turns one registry entry into the `{ id, name, slug }` shape every consumer
 * downstream reads.
 *
 * `name` and `slug` both default to `id`: a slug equal to the id is identical
 * in every locale, so the language switcher can map the category page across
 * locales without any extra configuration. A locale that wants a translated
 * URL sets `slug` explicitly.
 */
function categoryFromRegistry(entry: CategoryDefinition): Tag {
  const id = entry.id.trim()
  const name = typeof entry.name === 'string' ? normalizeTagName(entry.name) : undefined
  const slug = typeof entry.slug === 'string' ? normalizeTagName(entry.slug) : undefined

  return {
    ...entry,
    id,
    name: name || id,
    slug: slug || id,
  } as Tag
}

/**
 * Looks a frontmatter value up in the registry.
 *
 * `id` is the documented way to reference a category. `slug` and `name` are
 * accepted too so that a blog written before the registry existed
 * (`category: 'Настройка'`) keeps resolving to the same entry once that
 * category is declared.
 */
function findInRegistry(
  registry: CategoryRegistry,
  value: string
): CategoryDefinition | undefined {
  return (
    registry.find((entry) => entry?.id === value) ||
    registry.find((entry) => entry?.slug === value) ||
    registry.find((entry) => entry?.name === value)
  )
}

/**
 * Resolves a single `category`/`categories` frontmatter value.
 *
 * A string is looked up in the registry. When it is not found — or when there
 * is no registry at all — it falls back to the pre-registry behavior of
 * treating the string as a display name and transliterating it into a slug,
 * so existing blogs keep building.
 */
export function normalizeCategory(
  value: unknown,
  lang?: string,
  registry?: CategoryRegistry
): Tag | undefined {
  if (typeof value === 'string') {
    const key = normalizeTagName(value)
    if (!key) return

    const entry = registry?.length ? findInRegistry(registry, key) : undefined
    if (entry) return categoryFromRegistry(entry)

    if (registry?.length) {
      console.warn(
        `[vitepress-theme-neptu] Unknown category "${key}"${
          lang ? ` in locale "${lang}"` : ''
        } — no entry with this id in _categories.yaml. Falling back to a slug derived from the value.`
      )
    }
  }

  // Inline `{ name, slug }` objects and unregistered strings share the tag
  // data model, so they share its normalizer.
  return normalizeTag(value, lang)
}

/**
 * Categories share the tag data model (`{ id, name, slug }`). The difference
 * is where the name and slug come from: a category is declared once per locale
 * in `_categories.yaml` and posts reference it by `id`, while a tag carries its
 * own name in the frontmatter.
 *
 * A post may declare `category: 'getting-started'` as sugar for a single-entry
 * `categories` list. Always returns an array so downstream code has one shape
 * to handle. Entries are de-duplicated by `id`, which keeps `category` +
 * `categories` overlap from producing a doubled chip.
 */
export function normalizeCategories(
  categoryValue: unknown,
  categoriesValue: unknown,
  lang?: string,
  registry?: CategoryRegistry
): Tag[] {
  const values = [
    ...(categoryValue === undefined || categoryValue === null
      ? []
      : [categoryValue]),
    ...(Array.isArray(categoriesValue) ? categoriesValue : []),
  ]
  const result: Tag[] = []

  for (const value of values) {
    const normalized = normalizeCategory(value, lang, registry)
    if (!normalized) continue
    if (result.some((item) => item.id === normalized.id)) continue
    result.push(normalized)
  }

  return result
}
