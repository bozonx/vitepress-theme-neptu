import { describe, it, expect } from 'vitest'
import {
  makeAllPostsParams,
  makeYearPostsParams,
  makeMonthsParams,
  makeTagsParams,
  makeAuthorsParams,
} from '../../../src/list-helpers/makeListParams.ts'

describe('makeAllPostsParams', () => {
  it('returns empty array for empty posts', () => {
    expect(makeAllPostsParams([], 10)).toEqual([])
  })

  it('creates single page when posts fit within perPage', () => {
    const posts = [{ date: '2023-01-01' }]
    expect(makeAllPostsParams(posts, 10)).toEqual([{ params: { page: 1 } }])
  })

  it('creates multiple pages when posts exceed perPage', () => {
    const posts = Array.from({ length: 25 }, (_, i) => ({ date: `2023-01-${i + 1}` }))
    expect(makeAllPostsParams(posts, 10)).toEqual([
      { params: { page: 1 } },
      { params: { page: 2 } },
      { params: { page: 3 } },
    ])
  })

  it('works with perPage of 1', () => {
    const posts = Array.from({ length: 3 }, (_, i) => ({ date: `2023-01-0${i + 1}` }))
    expect(makeAllPostsParams(posts, 1)).toEqual([
      { params: { page: 1 } },
      { params: { page: 2 } },
      { params: { page: 3 } },
    ])
  })
})

describe('makeYearPostsParams', () => {
  it('returns empty array for empty posts', () => {
    expect(makeYearPostsParams([], 10)).toEqual([])
  })

  it('creates params grouped by year', () => {
    const posts = [
      { date: '2023-01-01' },
      { date: '2023-02-01' },
      { date: '2024-01-01' },
    ]
    expect(makeYearPostsParams(posts, 10)).toEqual([
      { params: { page: 1, year: 2023 } },
      { params: { page: 1, year: 2024 } },
    ])
  })

  it('creates multiple pages within the same year', () => {
    const posts = Array.from({ length: 25 }, (_, i) => ({ date: `2023-01-${(i % 28) + 1}` }))
    const result = makeYearPostsParams(posts, 10)
    expect(result).toEqual([
      { params: { page: 1, year: 2023 } },
      { params: { page: 2, year: 2023 } },
      { params: { page: 3, year: 2023 } },
    ])
  })

  it('separates pagination per year', () => {
    const posts = [
      ...Array.from({ length: 12 }, (_, i) => ({ date: `2023-01-${i + 1}` })),
      ...Array.from({ length: 5 }, (_, i) => ({ date: `2024-01-${i + 1}` })),
    ]
    const result = makeYearPostsParams(posts, 10)
    const year2023 = result.filter((r) => r.params.year === 2023)
    const year2024 = result.filter((r) => r.params.year === 2024)
    expect(year2023).toEqual([
      { params: { page: 1, year: 2023 } },
      { params: { page: 2, year: 2023 } },
    ])
    expect(year2024).toEqual([{ params: { page: 1, year: 2024 } }])
  })
})

describe('makeMonthsParams', () => {
  it('returns empty array for empty posts', () => {
    expect(makeMonthsParams([])).toEqual([])
  })

  it('creates unique year-month combinations', () => {
    const posts = [
      { date: '2023-01-01' },
      { date: '2023-01-15' },
      { date: '2023-02-01' },
      { date: '2024-01-01' },
    ]
    const result = makeMonthsParams(posts)
    expect(result).toHaveLength(3)
    expect(result).toContainEqual({ params: { year: 2023, month: 1 } })
    expect(result).toContainEqual({ params: { year: 2023, month: 2 } })
    expect(result).toContainEqual({ params: { year: 2024, month: 1 } })
  })

  it('handles numeric dates', () => {
    const posts = [
      { date: Date.parse('2023-06-15') },
    ]
    expect(makeMonthsParams(posts)).toEqual([{ params: { year: 2023, month: 6 } }])
  })
})

describe('makeTagsParams', () => {
  it('returns empty array for empty posts', () => {
    expect(makeTagsParams([], 10)).toEqual([])
  })

  it('creates params per tag with pagination', () => {
    const posts = [
      { date: '2023-01-01', tags: [{ name: 'foo', slug: 'foo' }] },
      { date: '2023-01-02', tags: [{ name: 'foo', slug: 'foo' }] },
      { date: '2023-01-03', tags: [{ name: 'bar', slug: 'bar' }] },
    ]
    const result = makeTagsParams(posts, 10)
    expect(result).toHaveLength(2)
    expect(result).toContainEqual({ params: { slug: 'foo', name: 'foo', page: 1 } })
    expect(result).toContainEqual({ params: { slug: 'bar', name: 'bar', page: 1 } })
  })

  it('handles string tags', () => {
    const posts = [
      { date: '2023-01-01', tags: ['foo', 'bar'] },
      { date: '2023-01-02', tags: ['foo'] },
    ]
    const result = makeTagsParams(posts, 10)
    expect(result).toContainEqual({ params: { slug: 'foo', name: 'foo', page: 1 } })
    expect(result).toContainEqual({ params: { slug: 'bar', name: 'bar', page: 1 } })
  })

  it('skips posts without tags', () => {
    const posts = [
      { date: '2023-01-01', tags: [{ name: 'foo', slug: 'foo' }] },
      { date: '2023-01-02' },
    ]
    expect(makeTagsParams(posts, 10)).toHaveLength(1)
  })
})

describe('makeAuthorsParams', () => {
  it('returns empty array for empty posts', () => {
    expect(makeAuthorsParams([], 10)).toEqual([])
  })

  it('creates params per author with pagination', () => {
    const posts = [
      { date: '2023-01-01', authorId: 'alice' },
      { date: '2023-01-02', authorId: 'alice' },
      { date: '2023-01-03', authorId: 'bob' },
    ]
    const result = makeAuthorsParams(posts, 1)
    expect(result).toHaveLength(3)
    expect(result.filter((r) => r.params.id === 'alice')).toEqual([
      { params: { id: 'alice', page: 1 } },
      { params: { id: 'alice', page: 2 } },
    ])
    expect(result.filter((r) => r.params.id === 'bob')).toEqual([
      { params: { id: 'bob', page: 1 } },
    ])
  })

  it('skips posts without authorId', () => {
    const posts = [
      { date: '2023-01-01', authorId: 'alice' },
      { date: '2023-01-02' },
    ]
    expect(makeAuthorsParams(posts, 10)).toHaveLength(1)
  })
})
