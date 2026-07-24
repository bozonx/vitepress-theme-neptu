import { describe, it, expect, vi } from 'vitest'
import { sortPosts, sortSimilarPosts } from '../../../../src/utils/shared/sorting.ts'

describe('sortPosts', () => {
  it('returns empty array for null', () => {
    expect(sortPosts(null as any)).toEqual([])
  })

  it('returns empty array for undefined', () => {
    expect(sortPosts(undefined as any)).toEqual([])
  })

  it('returns empty array for non-array', () => {
    expect(sortPosts('foo' as any)).toEqual([])
  })

  it('sorts by date descending', () => {
    const posts = [
      { date: '2024-01-01', url: 'a' },
      { date: '2024-03-01', url: 'b' },
      { date: '2024-02-01', url: 'c' },
    ]
    const result = sortPosts(posts)
    expect(result.map((p) => p.url)).toEqual(['b', 'c', 'a'])
  })

  it('handles numeric dates', () => {
    const posts = [
      { date: 1700000000000, url: 'a' },
      { date: 1800000000000, url: 'b' },
    ]
    expect(sortPosts(posts).map((p) => p.url)).toEqual(['b', 'a'])
  })

  it('handles invalid dates by treating them as epoch 0', () => {
    const posts = [
      { date: '2024-01-01', url: 'a' },
      { date: 'invalid', url: 'b' },
    ]
    expect(sortPosts(posts).map((p) => p.url)).toEqual(['a', 'b'])
  })

  it('sorts by popularity when sortByPopularity is true and sortBy is provided', () => {
    const posts = [
      { date: '2024-01-01', url: 'a', analyticsStats: { views: 100 } },
      { date: '2024-01-02', url: 'b', analyticsStats: { views: 200 } },
      { date: '2024-01-03', url: 'c' },
    ]
    expect(sortPosts(posts, 'views', true).map((p) => p.url)).toEqual(['b', 'a', 'c'])
  })

  it('warns and returns original when sortByPopularity is true without sortBy', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const posts = [{ url: 'a' }]
    expect(sortPosts(posts, undefined, true)).toEqual(posts)
    expect(warnSpy).toHaveBeenCalled()
    warnSpy.mockRestore()
  })

  it('falls back to date sort when one post lacks analyticsStats', () => {
    const posts = [
      { date: '2024-01-02', url: 'a', analyticsStats: { views: 10 } },
      { date: '2024-01-01', url: 'b' },
    ]
    expect(sortPosts(posts, 'views', true).map((p) => p.url)).toEqual(['a', 'b'])
  })

  it('does not mutate original array', () => {
    const posts = [{ date: '2024-01-01', url: 'a' }]
    sortPosts(posts)
    expect(posts).toEqual([{ date: '2024-01-01', url: 'a' }])
  })
})

describe('sortSimilarPosts', () => {
  const posts = [
    { url: 'a', date: '2024-01-01', tags: [{ slug: 'js' }, { slug: 'ts' }], analyticsStats: { v: 10 } },
    { url: 'b', date: '2024-01-02', tags: [{ slug: 'js' }], analyticsStats: { v: 20 } },
    { url: 'c', date: '2024-01-03', tags: [{ slug: 'ts' }], analyticsStats: { v: 5 } },
    { url: 'd', date: '2024-01-04', tags: [{ slug: 'rust' }] },
    { url: 'current', date: '2024-01-05', tags: [{ slug: 'js' }, { slug: 'ts' }], analyticsStats: { v: 99 } },
  ]

  it('returns empty array for null posts', () => {
    expect(sortSimilarPosts(null as any, [{ slug: 'js' }], 'current')).toEqual([])
  })

  it('returns empty array for null tags', () => {
    expect(sortSimilarPosts(posts, null as any, 'current')).toEqual([])
  })

  it('excludes current post', () => {
    const result = sortSimilarPosts(posts, [{ slug: 'js' }], 'current')
    expect(result.find((p) => p.url === 'current')).toBeUndefined()
  })

  it('sorts by tag intersection count first', () => {
    const result = sortSimilarPosts(posts, [{ slug: 'js' }, { slug: 'ts' }], 'current')
    expect(result[0].url).toBe('a')
  })

  it('counts duplicate tag slugs only once', () => {
    const duplicatedTagsPosts = [
      { url: 'a', date: '2024-01-01', tags: [{ slug: 'js' }, { slug: 'js' }] },
      { url: 'b', date: '2024-01-02', tags: [{ slug: 'js' }] },
      { url: 'current', date: '2024-01-03', tags: [{ slug: 'js' }] },
    ]

    const result = sortSimilarPosts(
      duplicatedTagsPosts,
      [{ slug: 'js' }, { slug: 'js' }],
      'current'
    )

    expect(result.map((p) => p.url)).toEqual(['b', 'a'])
  })

  it('sorts by popularity when tag count is equal', () => {
    const result = sortSimilarPosts(posts, [{ slug: 'js' }], 'current', 'v')
    expect(result.map((p) => p.url)).toEqual(['b', 'a'])
  })

  it('sorts by date when tags and popularity are equal', () => {
    const result = sortSimilarPosts(posts, [{ slug: 'ts' }], 'current')
    expect(result.map((p) => p.url)).toEqual(['c', 'a'])
  })

  it('returns empty array when no tag overlap', () => {
    const result = sortSimilarPosts(posts, [{ slug: 'python' }], 'current')
    expect(result).toEqual([])
  })

  it('respects limit', () => {
    const result = sortSimilarPosts(posts, [{ slug: 'js' }], 'current', undefined, 1)
    expect(result).toHaveLength(1)
  })

  it('skips posts without tags', () => {
    const extended = [...posts, { url: 'e', date: '2024-01-06' }]
    const result = sortSimilarPosts(extended, [{ slug: 'js' }], 'current')
    expect(result.find((p) => p.url === 'e')).toBeUndefined()
  })

  it('excludes current post when URLs differ by trailing slash', () => {
    const result = sortSimilarPosts(posts, [{ slug: 'js' }], 'current/')
    expect(result.find((p) => p.url === 'current')).toBeUndefined()
  })

  it('excludes current post when URL has .html extension', () => {
    const result = sortSimilarPosts(posts, [{ slug: 'js' }], 'current.html')
    expect(result.find((p) => p.url === 'current')).toBeUndefined()
  })

  it('prefers posts with stats over posts without when tag count is equal', () => {
    const extended = [
      ...posts,
      { url: 'f', date: '2024-01-06', tags: [{ slug: 'js' }] },
    ]
    const result = sortSimilarPosts(extended, [{ slug: 'js' }], 'current', 'v')
    // b (stats=20) > a (stats=10) > f (no stats)
    expect(result.map((p) => p.url)).toEqual(['b', 'a', 'f'])
  })
})
