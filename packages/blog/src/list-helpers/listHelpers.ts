import type { PostLite, TaxonomyEntry } from '../types.d.ts'
import { safeGetTime } from '../utils/shared/date.ts'

export type { PostLite }

interface AuthorLite {
  id: string
  name?: string
  [key: string]: unknown
}

/** Safely extract the year from a date. Returns undefined only for truly missing dates. */
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

export type CategoryInfo = TaxonomyEntry

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
  const bySlug: Record<string, TaxonomyEntry & { count: number }> = {}

  for (const post of allPosts) {
    for (const item of readTaxonomy(post, kind)) {
      // A nameless entry has nothing to render as a chip label — skip it
      // rather than emit an empty pill.
      if (!item.name) continue
      const key = item.slug || item.name

      if (typeof bySlug[key] === 'undefined') {
        bySlug[key] = { ...item, count: 1 }
      } else {
        bySlug[key]!.count++
      }
    }
  }

  const res = Object.keys(bySlug).map((key) => bySlug[key]!)

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
): Array<CategoryInfo & { count: number }> {
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
  const years: Record<number, number> = {}

  for (const item of allPosts) {
    const postYear = safeGetYear(item.date)
    if (postYear === undefined) continue

    if (typeof years[postYear] === 'undefined') {
      years[postYear] = 1
    } else {
      years[postYear]!++
    }
  }

  const res = Object.keys(years).map((year) => ({
    year: Number(year),
    count: years[Number(year)]!,
  }))
  res.sort((a, b) => b.year - a.year)

  return res
}

export function makeMonthsList(
  allPosts: PostLite[] = [],
  year: number | string
): Array<{ month: number; count: number }> {
  const curYear = Number(year)
  const months: Record<number, number> = {}

  for (const item of allPosts) {
    const postYear = safeGetYear(item.date)
    if (postYear !== curYear) continue

    const postMonth = safeGetMonth(item.date)
    if (postMonth === undefined) continue

    if (typeof months[postMonth] === 'undefined') {
      months[postMonth] = 1
    } else {
      months[postMonth]!++
    }
  }

  const res = Object.keys(months).map((month) => ({
    month: Number(month),
    count: months[Number(month)]!,
  }))

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

  return allPosts
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
  const authorPosts: Record<string, number> = {}

  for (const item of allAuthors) {
    authorPosts[item.id] = 0
  }

  for (const item of allPosts) {
    if (item.authorId && typeof authorPosts[item.authorId] === 'number') {
      authorPosts[item.authorId]!++
    }
  }

  const res = Object.keys(authorPosts).map((id) => {
    const author = allAuthors.find((item) => item.id === id)
    return { ...(author as AuthorLite), count: authorPosts[id]! }
  })

  res.sort((a, b) => (a.name || '').localeCompare(b.name || ''))

  return res
}
