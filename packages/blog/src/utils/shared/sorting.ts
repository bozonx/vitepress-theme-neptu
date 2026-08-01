import { arraysIntersection } from './array.ts'
import { normalizeUrlPath } from './url.ts'


/** Safely parse a date string/number into a timestamp. Returns 0 for invalid values. */
function safeDateTime(date: string | number | Date | null | undefined): number {
  if (!date) return 0
  const time = new Date(date).getTime()
  return Number.isFinite(time) ? time : 0
}

interface SortablePost {
  url?: string
  date?: string | number | Date
  analyticsStats?: Record<string, number>
  tags?: Array<{ slug?: string }>
}

export interface AdjacentPosts<T> {
  /** The older post in the locale's chronological sequence. */
  previous?: T
  /** The newer post in the locale's chronological sequence. */
  next?: T
}

/** Finds the older/newer neighbours of a post without mutating the source list. */
export function findAdjacentPosts<T extends SortablePost>(
  posts: T[] | null | undefined,
  currentPostUrl: string
): AdjacentPosts<T> {
  const sorted = sortPosts(posts)
  const normalizedCurrentUrl = normalizeUrlPath(currentPostUrl)
  const currentIndex = sorted.findIndex(
    (post) => normalizeUrlPath(post.url) === normalizedCurrentUrl
  )

  if (currentIndex < 0) return {}

  return {
    previous: sorted[currentIndex + 1],
    next: sorted[currentIndex - 1],
  }
}

/** Returns explicitly featured posts, newest first. */
export function filterFeaturedPosts<T extends SortablePost & { featured?: boolean }>(
  posts: T[] | null | undefined,
  limit?: number
): T[] {
  const featured = sortPosts(posts).filter((post) => post.featured === true)
  return limit === undefined ? featured : featured.slice(0, Math.max(0, limit))
}

/** Sorts posts by popularity or by date. */
export function sortPosts<T extends SortablePost>(
  posts: T[] | null | undefined,
  sortBy?: string,
  sortByPopularity: boolean = false
): T[] {
  if (!posts || !Array.isArray(posts)) return []

  if (sortByPopularity && !sortBy) {
    console.warn('⚠️ Warning: function sortPosts: sortBy is not defined')
    return posts
  }

  return [...posts].sort((a, b) => {
    if (sortByPopularity && sortBy) {
      // Sort by popularity
      const aHasStats = Number.isFinite(a.analyticsStats?.[sortBy])
      const bHasStats = Number.isFinite(b.analyticsStats?.[sortBy])

      if (aHasStats && bHasStats && a.analyticsStats && b.analyticsStats) {
        const aValue = a.analyticsStats[sortBy] as number
        const bValue = b.analyticsStats[sortBy] as number
        return bValue - aValue
      }

      if (aHasStats && !bHasStats) return -1
      if (!aHasStats && bHasStats) return 1

      return safeDateTime(b.date) - safeDateTime(a.date)
    } else {
      return safeDateTime(b.date) - safeDateTime(a.date)
    }
  })
}

function getTagsIntersection(
  tags1: Array<{ slug?: string }> | undefined,
  tags2: Array<{ slug?: string }> | undefined
): string[] {
  if (!Array.isArray(tags1) || !Array.isArray(tags2)) {
    return []
  }

  const slugs1 = [...new Set(tags1.map((tag) => tag?.slug).filter(Boolean) as string[])]
  const slugs2 = [...new Set(tags2.map((tag) => tag?.slug).filter(Boolean) as string[])]

  return arraysIntersection(slugs1, slugs2)
}

/**
 * Sorts posts to display similar ones. Priority: number of matching
 * tags > popularity > date
 */
export function sortSimilarPosts<T extends SortablePost>(
  posts: T[] | null | undefined,
  currentPostTags: Array<{ slug?: string }> | null | undefined,
  currentPostUrl: string,
  sortBy?: string,
  limit: number = 5
): T[] {
  if (!posts || !Array.isArray(posts)) return []
  if (!currentPostTags || !Array.isArray(currentPostTags)) return []

  const normalizedCurrentUrl = normalizeUrlPath(currentPostUrl)

  const scoredPosts = posts
    .map((post) => {
      const normalizedPostUrl = normalizeUrlPath(post.url)
      const tagIntersection = getTagsIntersection(post.tags, currentPostTags)
      const hasStats =
        sortBy && Number.isFinite(post.analyticsStats?.[sortBy])
      const popularity =
        hasStats && post.analyticsStats ? post.analyticsStats[sortBy] : 0

      return {
        post,
        isCurrent: normalizedPostUrl === normalizedCurrentUrl,
        tagScore: tagIntersection.length,
        hasStats,
        popularity: popularity as number,
        dateTime: safeDateTime(post.date),
      }
    })
    .filter(
      (item) =>
        !item.isCurrent && item.tagScore > 0
    )

  scoredPosts.sort((a, b) => {
    if (a.tagScore !== b.tagScore) {
      return b.tagScore - a.tagScore
    }

    if (a.hasStats !== b.hasStats) {
      return a.hasStats ? -1 : 1
    }

    if (a.popularity !== b.popularity) {
      return b.popularity - a.popularity
    }

    return b.dateTime - a.dateTime
  })

  return scoredPosts.slice(0, limit).map((item) => item.post)
}
