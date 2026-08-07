import { safeGetYear, safeGetMonth } from './listHelpers.ts'
import type { TaxonomyKind } from './listHelpers.ts'
import { normalizeTag } from '../utils/shared/tags.ts'
import type { Tag } from '../types.d.ts'

interface PostWithDate {
  date: string | number | Date
  tags?: Array<{ name?: string; slug?: string } | string>
  /** Already resolved against `_categories.yaml` by `makePreviewItem`. */
  categories?: Array<Partial<Tag>>
  authorId?: string
  [key: string]: unknown
}

export function makeAllPostsParams(
  posts: PostWithDate[],
  perPage: number
): Array<{ params: { page: number } }> {
  const step = Math.max(1, perPage)
  const res: Array<{ params: { page: number } }> = []

  // An empty blog still needs its first list page to exist.
  if (posts.length === 0) {
    res.push({ params: { page: 1 } })
    return res
  }

  for (let i = 0; i < posts.length; i += step) {
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
  const postCountByYear = new Map<number, number>()

  for (const post of posts) {
    const year = safeGetYear(post.date)
    if (year === undefined) continue

    postCountByYear.set(year, (postCountByYear.get(year) ?? 0) + 1)
  }

  const res: Array<{ params: { page: number; year: number } }> = []

  const step = Math.max(1, perPage)
  for (const [year, count] of postCountByYear) {
    for (let i = 0; i < count; i += step) {
      const page = i / step + 1

      res.push({ params: { page, year } })
    }
  }

  return res
}

export function makeYearMonthParams(
  posts: PostWithDate[]
): Array<{ params: { year: number; month: number } }> {
  // Year and month are kept as a numeric pair rather than a `"${year}-${month}"`
  // string, so nothing has to be parsed back out — a negative (BC) year would
  // otherwise split on its own leading dash.
  const seen = new Map<string, { year: number; month: number }>()

  for (const post of posts) {
    const year = safeGetYear(post.date)
    const month = safeGetMonth(post.date)
    if (year === undefined || month === undefined) continue

    seen.set(`${year}|${month}`, { year, month })
  }

  return [...seen.values()].map(({ year, month }) => ({
    params: { year, month },
  }))
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
 * Reads one taxonomy off a post as `{ id, name, slug }` entries.
 *
 * Tags are authored in the frontmatter, so a raw string still has to go through
 * the normalizer here — that keeps a hand-assembled post list from producing
 * routes no link can reach.
 *
 * Categories cannot be normalized at this point: their name and slug live in
 * `_categories.yaml`, which this helper has no access to. Posts coming from
 * `loadPostsData` are already resolved against the registry, so the entries are
 * read as they are; anything not yet resolved is skipped rather than guessed at.
 */
function readTaxonomyEntries(
  post: PostWithDate,
  kind: TaxonomyKind,
  lang?: string
): Tag[] {
  if (kind === 'tags') {
    return (post.tags || []).flatMap((value) => {
      const item = normalizeTag(value, lang)
      return item ? [item] : []
    })
  }

  return (post.categories || []).flatMap((value) => {
    if (!value || typeof value !== 'string') {
      const item = value as Partial<Tag> | undefined
      if (item?.id && item.name && item.slug) return [item as Tag]
    }
    return []
  })
}

/** Builds `[slug]/[page]` route params for a taxonomy (tags or categories). */
export function makeTaxonomyParams(
  posts: PostWithDate[],
  kind: TaxonomyKind,
  perPage: number,
  lang?: string
): Array<{ params: TaxonomyRouteParams }> {
  // Slugs come from author-written frontmatter, so a `Map` is required: with a
  // plain object, a slug like `constructor` or `toString` would hit
  // `Object.prototype` and the route would never be emitted.
  const counts = new Map<string, { name: string; id: string; count: number }>()

  for (const post of posts) {
    for (const item of readTaxonomyEntries(post, kind, lang)) {
      if (!item.slug || !item.name) continue

      const existing = counts.get(item.slug)
      if (existing) {
        existing.count++
      } else {
        counts.set(item.slug, {
          name: item.name,
          id: (item.id as string) || item.slug,
          count: 1,
        })
      }
    }
  }

  const res: Array<{ params: TaxonomyRouteParams }> = []

  const step = Math.max(1, perPage)
  for (const [slug, { name, id, count }] of counts) {
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
  // Author ids are author-written — see the note in `makeTaxonomyParams`.
  const authorPostCount = new Map<string, number>()
  const res: Array<{ params: { id: string; page: number } }> = []

  for (const id of authorIds) {
    authorPostCount.set(id, (authorPostCount.get(id) ?? 0) + 1)
  }

  const step = Math.max(1, perPage)
  for (const [id, count] of authorPostCount) {
    for (let i = 0; i < count; i += step) {
      const page = i / step + 1

      res.push({ params: { id, page } })
    }
  }

  return res
}
