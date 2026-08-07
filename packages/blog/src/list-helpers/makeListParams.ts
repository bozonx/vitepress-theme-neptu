import { safeGetYear, safeGetMonth } from './listHelpers.ts'
import type { TaxonomyKind } from './listHelpers.ts'
import { normalizeTag } from '../utils/shared/tags.ts'

interface PostWithDate {
  date: string | number | Date
  tags?: Array<{ name?: string; slug?: string } | string>
  category?: { name?: string; slug?: string } | string
  categories?: Array<{ name?: string; slug?: string } | string>
  authorId?: string
  [key: string]: unknown
}

export function makeAllPostsParams(
  posts: PostWithDate[],
  perPage: number
): Array<{ params: { page: number } }> {
  const step = Math.max(1, perPage)
  const dates = posts.map((item) => item.date)
  const res: Array<{ params: { page: number } }> = []

  if (dates.length === 0) {
    res.push({ params: { page: 1 } })
    return res
  }

  for (let i = 0; i < dates.length; i += step) {
    const page = i / step + 1

    res.push({ params: { page } })
  }

  return res
}

export function makeFeaturedPostsParams(
  posts: PostWithDate[],
  perPage: number
): Array<{ params: { page: number } }> {
  const featured = posts.filter((item) => item.featured === true)
  return makeAllPostsParams(featured, perPage)
}

export function makeYearPostsParams(
  posts: PostWithDate[],
  perPage: number
): Array<{ params: { page: number; year: number } }> {
  const dates = posts.map((item) => item.date)

  const postsByYear: Record<number, Array<string | number | Date>> = {}

  for (const date of dates) {
    const year = safeGetYear(date)
    if (year === undefined) continue

    if (!postsByYear[year]) {
      postsByYear[year] = []
    }

    postsByYear[year]!.push(date)
  }

  const res: Array<{ params: { page: number; year: number } }> = []

  const step = Math.max(1, perPage)
  for (const [year, yearDates] of Object.entries(postsByYear)) {
    for (let i = 0; i < yearDates.length; i += step) {
      const page = i / step + 1

      res.push({ params: { page, year: Number(year) } })
    }
  }

  return res
}

export function makeYearMonthParams(
  posts: PostWithDate[]
): Array<{ params: { year: number; month: number } }> {
  const monthCount: Record<string, number> = {}
  const dates = posts.map((item) => item.date)

  for (const date of dates) {
    const year = safeGetYear(date)
    const month = safeGetMonth(date)
    if (year === undefined || month === undefined) continue
    const yearMonth = `${year}-${month}`

    if (typeof monthCount[yearMonth] === 'undefined') {
      monthCount[yearMonth] = 1
    } else {
      monthCount[yearMonth]!++
    }
  }

  return Object.keys(monthCount).map((item) => {
    const parts = item.split('-')
    const year = Number(parts[0])
    const month = Number(parts[1])

    return { params: { year, month } }
  })
}

export interface TaxonomyRouteParams {
  slug: string
  name: string
  /**
   * Language-independent key of the entry. For categories it is the `id` from
   * `_categories.yaml`; the language switcher reads it off `params` to find
   * the matching slug in another locale.
   */
  id: string
  page: number
}

/**
 * Builds `[slug]/[page]` route params for a taxonomy (tags or categories).
 *
 * Posts arriving from `loadPostsData` already carry normalized entries, so the
 * category ids resolved against `_categories.yaml` reach the route params
 * untouched. Raw frontmatter still goes through the normalizer, which keeps a
 * hand-assembled post list from producing routes no link can reach.
 */
export function makeTaxonomyParams(
  posts: PostWithDate[],
  kind: TaxonomyKind,
  perPage: number,
  lang?: string
): Array<{ params: TaxonomyRouteParams }> {
  const counts: Record<string, { name: string; id: string; count: number }> = {}

  for (const post of posts) {
    const raw =
      kind === 'categories'
        ? [
            ...(post.category === undefined || post.category === null
              ? []
              : [post.category]),
            ...(post.categories || []),
          ]
        : post.tags || []

    for (const value of raw) {
      const item = normalizeTag(value, lang)
      if (!item?.slug || !item.name) continue

      if (typeof counts[item.slug] === 'undefined') {
        counts[item.slug] = {
          name: item.name,
          id: (item.id as string) || item.slug,
          count: 1,
        }
      } else {
        counts[item.slug]!.count++
      }
    }
  }

  const res: Array<{ params: TaxonomyRouteParams }> = []

  const step = Math.max(1, perPage)
  for (const slug of Object.keys(counts)) {
    const { name, id, count } = counts[slug]!

    for (let i = 0; i < Math.ceil(count / step); i++) {
      res.push({ params: { slug, name, id, page: i + 1 } })
    }
  }

  return res
}

export function makeCategoriesParams(
  posts: PostWithDate[],
  perPage: number,
  lang?: string
): Array<{ params: TaxonomyRouteParams }> {
  return makeTaxonomyParams(posts, 'categories', perPage, lang)
}

export function makeTagsParams(
  posts: PostWithDate[],
  perPage: number,
  lang?: string
): Array<{ params: TaxonomyRouteParams }> {
  return makeTaxonomyParams(posts, 'tags', perPage, lang)
}

export function makeAuthorsParams(
  posts: PostWithDate[],
  perPage: number
): Array<{ params: { id: string; page: number } }> {
  const authorIds = posts
    .map((item) => item.authorId)
    .filter((item): item is string => Boolean(item))
  const authorPostCount: Record<string, number> = {}
  const res: Array<{ params: { id: string; page: number } }> = []

  for (const id of authorIds) {
    if (authorPostCount[id]) {
      authorPostCount[id]!++
    } else {
      authorPostCount[id] = 1
    }
  }

  const step = Math.max(1, perPage)
  for (const id of Object.keys(authorPostCount)) {
    for (let i = 0; i < authorPostCount[id]!; i += step) {
      const page = i / step + 1

      res.push({ params: { id, page } })
    }
  }

  return res
}
