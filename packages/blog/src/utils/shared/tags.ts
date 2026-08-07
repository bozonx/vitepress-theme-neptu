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
 * Resolves one `category` / `categories` frontmatter value against the
 * registry.
 *
 * The value is a category `id` and nothing else — there is no way to name a
 * category from inside a post. An id with no matching entry is dropped with a
 * warning rather than invented on the fly: a typo that silently created a
 * one-post category is exactly what the registry exists to prevent, and
 * failing the whole build over one post is worse than skipping its chip.
 *
 * Objects carrying an `id` are accepted so the function is idempotent — it may
 * run over frontmatter that a previous pass already normalized.
 */
export function normalizeCategory(
  value: unknown,
  lang?: string,
  registry?: CategoryRegistry
): Tag | undefined {
  const raw =
    typeof value === 'string'
      ? value
      : value && typeof value === 'object' && typeof (value as Tag).id === 'string'
        ? (value as Tag).id
        : undefined

  const id = raw ? normalizeTagName(raw) : undefined

  if (!id) {
    if (value !== undefined && value !== null && value !== '') {
      console.warn(
        `[vitepress-theme-neptu] Ignoring a category value that is not an id${
          lang ? ` in locale "${lang}"` : ''
        }: ${JSON.stringify(value)}. Declare the category in _categories.yaml and reference it by \`id\`.`
      )
    }
    return
  }

  const entry = registry?.find((item) => item?.id === id)
  if (!entry) {
    console.warn(
      `[vitepress-theme-neptu] Unknown category "${id}"${
        lang ? ` in locale "${lang}"` : ''
      } — no entry with this id in _categories.yaml. Skipping it.`
    )
    return
  }

  return categoryFromRegistry(entry)
}

/**
 * Categories share the tag data model (`{ id, name, slug }`), but not the way
 * they are authored: a category is declared once per locale in
 * `_categories.yaml` and posts reference it by `id`, while a tag carries its
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
