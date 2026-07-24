import type { PostLite } from '../types.d.ts'

export type { PostLite }

export interface TagInfo {
  name?: string
  slug?: string
  count?: number
  [key: string]: unknown
}

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

/** Safely parse a date into a timestamp. Returns 0 for invalid values. */
function safeDateTime(date: string | number | Date | undefined): number {
  if (!date) return 0
  const time = new Date(date).getTime()
  return Number.isFinite(time) ? time : 0
}

export function makeTagsList(allPosts: PostLite[] = []): Array<TagInfo & { count: number }> {
  const tags: Record<string, TagInfo & { count: number }> = {}

  for (const item of allPosts) {
    if (!item.tags?.length) continue

    for (const tagItem of item.tags) {
      if (!tagItem.name) continue
      if (typeof tags[tagItem.name] === 'undefined') {
        tags[tagItem.name] = { ...tagItem, count: 1 }
      } else {
        tags[tagItem.name]!.count++
      }
    }
  }

  const res = Object.keys(tags).map((name) => tags[name]!)

  res.sort((a, b) => b.count - a.count)

  return res
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

export function makePostOfMonthList(
  allPosts: PostLite[] = [],
  year?: number | string,
  month?: number | string
): PostLite[] {
  if (year === undefined || month === undefined) return []
  const curYear = Number(year)
  const curMonth = Number(month)

  return allPosts
    .sort((a, b) => safeDateTime(b.date) - safeDateTime(a.date))
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
