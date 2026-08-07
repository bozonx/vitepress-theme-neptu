import type { PostLite, TaxonomyEntry } from '../types.d.ts'
import { safeGetTime } from '../utils/shared/date.ts'

export type { PostLite }

interface AuthorLite {
  id: string
  name?: string
  [key: string]: unknown
}

/** Safely extract the year from a date. Returns undefined for missing or unparsable dates. */
export function safeGetYear(date: string | number | Date | undefined): number | undefined {
  if (!date) return undefined
  const parsed = new Date(date)
  const year = parsed.getUTCFullYear()
  return Number.isFinite(year) ? year : undefined
}

/** Safely extract the month (1-based) from a date. */
export function safeGetMonth(date: string | number | Date | undefined): number | undefined {
  if (!date) return undefined
  const parsed = new Date(date)
  const month = parsed.getUTCMonth() + 1
  return Number.isFinite(month) ? month : undefined
}

/**
 * Tags and categories are the same data model with different URLs, so every
 * helper below works on either. The kind is the frontmatter field name, which
 * is also the first URL segment of the corresponding list pages.
 */
export type TaxonomyKind = 'tags' | 'categories'

/** Reads one taxonomy off a post. Values are already normalized by `makePreviewItem`. */
function readTaxonomy(post: PostLite, kind: TaxonomyKind): TaxonomyEntry[] {
  const value = post[kind]
  return Array.isArray(value) ? (value as TaxonomyEntry[]) : []
}

/**
 * Counts posts per taxonomy entry, most used first. Entries are keyed by slug —
 * the slug is what URLs and filtering use, so two spellings of one slug must
 * collapse into a single item.
 */
export function makeTaxonomyList(
  allPosts: PostLite[] = [],
  kind: TaxonomyKind
): Array<TaxonomyEntry & { count: number }> {
  // A `Map` rather than an object literal: slugs come from author-written
  // frontmatter, and `constructor` / `toString` / `__proto__` would collide
  // with `Object.prototype` and silently drop the entry from the list.
  const bySlug = new Map<string, TaxonomyEntry & { count: number }>()

  for (const post of allPosts) {
    for (const item of readTaxonomy(post, kind)) {
      // A nameless entry has nothing to render as a chip label — skip it
      // rather than emit an empty pill.
      if (!item.name) continue
      const key = item.slug || item.name
      const existing = bySlug.get(key)

      if (existing) {
        existing.count++
      } else {
        bySlug.set(key, { ...item, count: 1 })
      }
    }
  }

  const res = [...bySlug.values()]

  res.sort((a, b) => b.count - a.count)

  return res
}

/** Posts carrying the given taxonomy slug. */
export function makePostsOfTaxonomyList(
  allPosts: PostLite[] = [],
  kind: TaxonomyKind,
  slug?: string
): PostLite[] {
  if (!slug) return []

  return allPosts.filter((post) =>
    readTaxonomy(post, kind).some((item) => item.slug === slug)
  )
}

export function makeTagsList(
  allPosts: PostLite[] = []
): Array<TaxonomyEntry & { count: number }> {
  return makeTaxonomyList(allPosts, 'tags')
}

export function makeCategoriesList(
  allPosts: PostLite[] = []
): Array<TaxonomyEntry & { count: number }> {
  return makeTaxonomyList(allPosts, 'categories')
}

export function makePostsOfTagList(
  allPosts: PostLite[] = [],
  slug?: string
): PostLite[] {
  return makePostsOfTaxonomyList(allPosts, 'tags', slug)
}

export function makePostsOfCategoryList(
  allPosts: PostLite[] = [],
  slug?: string
): PostLite[] {
  return makePostsOfTaxonomyList(allPosts, 'categories', slug)
}

export function makeYearsList(
  allPosts: PostLite[] = []
): Array<{ year: number; count: number }> {
  const years = new Map<number, number>()

  for (const item of allPosts) {
    const postYear = safeGetYear(item.date)
    if (postYear === undefined) continue

    years.set(postYear, (years.get(postYear) ?? 0) + 1)
  }

  const res = [...years].map(([year, count]) => ({ year, count }))
  res.sort((a, b) => b.year - a.year)

  return res
}

export function makeMonthsList(
  allPosts: PostLite[] = [],
  year: number | string
): Array<{ month: number; count: number }> {
  const curYear = Number(year)
  const months = new Map<number, number>()

  for (const item of allPosts) {
    const postYear = safeGetYear(item.date)
    if (postYear !== curYear) continue

    const postMonth = safeGetMonth(item.date)
    if (postMonth === undefined) continue

    months.set(postMonth, (months.get(postMonth) ?? 0) + 1)
  }

  const res = [...months].map(([month, count]) => ({ month, count }))

  res.sort((a, b) => b.month - a.month)

  return res
}

export function makePostsOfMonthList(
  allPosts: PostLite[] = [],
  year?: number | string,
  month?: number | string
): PostLite[] {
  if (year === undefined || month === undefined) return []
  const curYear = Number(year)
  const curMonth = Number(month)

  return [...allPosts]
    .sort((a, b) => safeGetTime(b.date) - safeGetTime(a.date))
    .filter((item) => {
      const postYear = safeGetYear(item.date)
      if (postYear !== curYear) return false

      const postMonth = safeGetMonth(item.date)
      if (postMonth !== curMonth) return false

      return true
    })
}

export function makeAuthorsList(
  allPosts: PostLite[] = [],
  allAuthors: AuthorLite[] = []
): Array<AuthorLite & { count: number }> {
  // Author ids are author-written, so `constructor` and friends must not be
  // able to collide with `Object.prototype` — see {@link makeTaxonomyList}.
  const authorPosts = new Map<string, number>()

  for (const item of allAuthors) {
    authorPosts.set(item.id, 0)
  }

  for (const item of allPosts) {
    const { authorId } = item
    if (!authorId) continue
    const current = authorPosts.get(authorId)
    if (current !== undefined) authorPosts.set(authorId, current + 1)
  }

  const res = [...authorPosts].map(([id, count]) => {
    const author = allAuthors.find((item) => item.id === id)
    return { ...(author as AuthorLite), count }
  })

  res.sort((a, b) => (a.name || '').localeCompare(b.name || ''))

  return res
}
