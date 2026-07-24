import { safeGetYear, safeGetMonth } from './listHelpers.ts'

interface PostWithDate {
  date: string | number | Date
  tags?: Array<{ name?: string; slug?: string } | string>
  authorId?: string
  [key: string]: unknown
}

export function makeAllPostsParams(
  posts: PostWithDate[],
  perPage: number
): Array<{ params: { page: number } }> {
  const dates = posts.map((item) => item.date)
  const res: Array<{ params: { page: number } }> = []

  for (let i = 0; i < dates.length; i += perPage) {
    const page = i / perPage + 1

    res.push({ params: { page } })
  }

  return res
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

  for (const [year, yearDates] of Object.entries(postsByYear)) {
    for (let i = 0; i < yearDates.length; i += perPage) {
      const page = i / perPage + 1

      res.push({ params: { page, year: Number(year) } })
    }
  }

  return res
}

export function makeMonthsParams(
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
    const splat = item.split('-')
    const year = Number(splat[0])
    const month = Number(splat[1])

    return { params: { year, month } }
  })
}

export function makeTagsParams(
  posts: PostWithDate[],
  perPage: number
): Array<{ params: { slug: string; name: string; page: number } }> {
  const tagsCount: Record<string, { name: string; count: number }> = {}

  for (const item of posts) {
    const tags = item.tags

    if (!tags?.length) continue

    for (const tag of tags) {
      const tagName = (typeof tag === 'object' ? tag.name : tag) || (tag as string)
      const tagSlug = (typeof tag === 'object' ? tag.slug : tag) || (tag as string)

      if (typeof tagsCount[tagSlug] === 'undefined') {
        tagsCount[tagSlug] = { name: tagName, count: 1 }
      } else {
        tagsCount[tagSlug]!.count++
      }
    }
  }

  const res: Array<{ params: { slug: string; name: string; page: number } }> = []

  for (const slug of Object.keys(tagsCount)) {
    const { name, count } = tagsCount[slug]!

    for (let i = 0; i < Math.ceil(count / perPage); i++) {
      res.push({ params: { slug, name, page: i + 1 } })
    }
  }

  return res
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

  for (const id of Object.keys(authorPostCount)) {
    for (let i = 0; i < authorPostCount[id]!; i += perPage) {
      const page = i / perPage + 1

      res.push({ params: { id, page } })
    }
  }

  return res
}
