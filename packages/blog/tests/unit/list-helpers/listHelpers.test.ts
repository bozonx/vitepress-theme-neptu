import { describe, it, expect } from 'vitest'
import {
  makeTagsList,
  makeYearsList,
  makeMonthsList,
  makePostOfMonthList,
  makeAuthorsList,
  type PostLite,
} from '../../../src/list-helpers/listHelpers.ts'

describe('makeTagsList', () => {
  it('returns empty array for empty input', () => {
    expect(makeTagsList([])).toEqual([])
  })

  it('returns empty array for undefined input', () => {
    expect(makeTagsList(undefined as unknown as PostLite[])).toEqual([])
  })

  it('counts tags correctly', () => {
    const posts: PostLite[] = [
      { url: '/a', tags: [{ name: 'foo' }, { name: 'bar' }] },
      { url: '/b', tags: [{ name: 'foo' }] },
      { url: '/c', tags: [{ name: 'baz' }] },
    ]
    const result = makeTagsList(posts)
    expect(result).toHaveLength(3)
    expect(result.find((t) => t.name === 'foo')?.count).toBe(2)
    expect(result.find((t) => t.name === 'bar')?.count).toBe(1)
    expect(result.find((t) => t.name === 'baz')?.count).toBe(1)
  })

  it('skips posts without tags', () => {
    const posts: PostLite[] = [
      { url: '/a', tags: [{ name: 'foo' }] },
      { url: '/b' },
      { url: '/c', tags: [] },
    ]
    expect(makeTagsList(posts)).toHaveLength(1)
  })

  it('skips tags without name', () => {
    const posts: PostLite[] = [{ url: '/a', tags: [{ slug: 'foo' }, { name: 'bar' }] }]
    const result = makeTagsList(posts)
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('bar')
  })

  it('sorts by count descending', () => {
    const posts: PostLite[] = [
      { url: '/a', tags: [{ name: 'rare' }] },
      { url: '/b', tags: [{ name: 'common' }] },
      { url: '/c', tags: [{ name: 'common' }] },
      { url: '/d', tags: [{ name: 'common' }] },
    ]
    const result = makeTagsList(posts)
    expect(result[0].name).toBe('common')
    expect(result[1].name).toBe('rare')
  })

  it('preserves additional tag properties', () => {
    const posts: PostLite[] = [
      { url: '/a', tags: [{ name: 'foo', slug: 'foo-slug', custom: 123 }] },
    ]
    const result = makeTagsList(posts)
    expect(result[0]).toMatchObject({ name: 'foo', slug: 'foo-slug', custom: 123 })
  })
})

describe('makeYearsList', () => {
  it('returns empty array for empty input', () => {
    expect(makeYearsList([])).toEqual([])
  })

  it('groups posts by year and sorts descending', () => {
    const posts: PostLite[] = [
      { url: '/a', date: '2023-01-01' },
      { url: '/b', date: '2024-06-15' },
      { url: '/c', date: '2023-12-31' },
    ]
    const result = makeYearsList(posts)
    expect(result).toEqual([
      { year: 2024, count: 1 },
      { year: 2023, count: 2 },
    ])
  })

  it('handles numeric dates', () => {
    const posts: PostLite[] = [
      { url: '/a', date: Date.parse('2022-05-01') },
      { url: '/b', date: new Date('2022-07-01') },
    ]
    const result = makeYearsList(posts)
    expect(result).toEqual([{ year: 2022, count: 2 }])
  })

  it('skips posts without date', () => {
    const posts: PostLite[] = [
      { url: '/a', date: '2023-01-01' },
      { url: '/b' },
    ]
    expect(makeYearsList(posts)).toEqual([{ year: 2023, count: 1 }])
  })

  it('handles invalid dates gracefully', () => {
    const posts: PostLite[] = [
      { url: '/a', date: 'not-a-date' },
      { url: '/b', date: '2023-01-01' },
    ]
    const result = makeYearsList(posts)
    // Invalid date produces NaN year which is filtered by undefined check
    expect(result).toEqual([{ year: 2023, count: 1 }])
  })
})

describe('makeMonthsList', () => {
  it('returns empty array for empty input', () => {
    expect(makeMonthsList([], 2023)).toEqual([])
  })

  it('groups posts by month for the specified year', () => {
    const posts: PostLite[] = [
      { url: '/a', date: '2023-01-15' },
      { url: '/b', date: '2023-01-20' },
      { url: '/c', date: '2023-03-01' },
      { url: '/d', date: '2024-01-01' },
    ]
    const result = makeMonthsList(posts, 2023)
    expect(result).toEqual([
      { month: 3, count: 1 },
      { month: 1, count: 2 },
    ])
  })

  it('accepts string year parameter', () => {
    const posts: PostLite[] = [{ url: '/a', date: '2023-06-01' }]
    expect(makeMonthsList(posts, '2023')).toEqual([{ month: 6, count: 1 }])
  })

  it('sorts months descending', () => {
    const posts: PostLite[] = [
      { url: '/a', date: '2023-01-01' },
      { url: '/b', date: '2023-12-01' },
      { url: '/c', date: '2023-06-01' },
    ]
    const result = makeMonthsList(posts, 2023)
    expect(result.map((m) => m.month)).toEqual([12, 6, 1])
  })

  it('skips posts without date', () => {
    const posts: PostLite[] = [{ url: '/a' }, { url: '/b', date: '2023-05-01' }]
    expect(makeMonthsList(posts, 2023)).toEqual([{ month: 5, count: 1 }])
  })
})

describe('makePostOfMonthList', () => {
  it('returns empty array for empty input', () => {
    expect(makePostOfMonthList([], 2023, 1)).toEqual([])
  })

  it('filters posts by year and month', () => {
    const posts: PostLite[] = [
      { url: '/a', date: '2023-01-15' },
      { url: '/b', date: '2023-01-20' },
      { url: '/c', date: '2023-02-01' },
      { url: '/d', date: '2024-01-01' },
    ]
    const result = makePostOfMonthList(posts, 2023, 1)
    expect(result).toHaveLength(2)
    expect(result.map((p) => p.url)).toEqual(['/b', '/a'])
  })

  it('sorts posts by date descending', () => {
    const posts: PostLite[] = [
      { url: '/a', date: '2023-01-10' },
      { url: '/b', date: '2023-01-20' },
      { url: '/c', date: '2023-01-05' },
    ]
    const result = makePostOfMonthList(posts, 2023, 1)
    expect(result.map((p) => p.url)).toEqual(['/b', '/a', '/c'])
  })

  it('accepts string year and month', () => {
    const posts: PostLite[] = [{ url: '/a', date: '2023-06-15' }]
    expect(makePostOfMonthList(posts, '2023', '6')).toHaveLength(1)
  })

  it('excludes posts with invalid dates', () => {
    const posts: PostLite[] = [
      { url: '/a', date: 'not-a-date' },
      { url: '/b', date: '2023-01-01' },
    ]
    expect(makePostOfMonthList(posts, 2023, 1)).toHaveLength(1)
  })
})

describe('makeAuthorsList', () => {
  it('returns empty array for empty inputs', () => {
    expect(makeAuthorsList([], [])).toEqual([])
  })

  it('counts posts per author', () => {
    const authors = [{ id: 'alice' }, { id: 'bob' }]
    const posts: PostLite[] = [
      { url: '/a', authorId: 'alice' },
      { url: '/b', authorId: 'alice' },
      { url: '/c', authorId: 'bob' },
    ]
    const result = makeAuthorsList(posts, authors)
    expect(result).toHaveLength(2)
    expect(result.find((a) => a.id === 'alice')?.count).toBe(2)
    expect(result.find((a) => a.id === 'bob')?.count).toBe(1)
  })

  it('includes authors with zero posts', () => {
    const authors = [{ id: 'alice' }, { id: 'bob' }]
    const posts: PostLite[] = [{ url: '/a', authorId: 'alice' }]
    const result = makeAuthorsList(posts, authors)
    expect(result.find((a) => a.id === 'bob')?.count).toBe(0)
  })

  it('ignores posts with unknown authorId', () => {
    const authors = [{ id: 'alice' }]
    const posts: PostLite[] = [
      { url: '/a', authorId: 'alice' },
      { url: '/b', authorId: 'unknown' },
    ]
    const result = makeAuthorsList(posts, authors)
    expect(result).toHaveLength(1)
    expect(result[0].count).toBe(1)
  })

  it('ignores posts without authorId', () => {
    const authors = [{ id: 'alice' }]
    const posts: PostLite[] = [{ url: '/a' }, { url: '/b', authorId: 'alice' }]
    const result = makeAuthorsList(posts, authors)
    expect(result[0].count).toBe(1)
  })

  it('sorts by name alphabetically', () => {
    const authors = [
      { id: 'b', name: 'Bob' },
      { id: 'a', name: 'Alice' },
      { id: 'c', name: 'Charlie' },
    ]
    const result = makeAuthorsList([], authors)
    expect(result.map((a) => a.id)).toEqual(['a', 'b', 'c'])
  })

  it('preserves author properties', () => {
    const authors = [{ id: 'alice', name: 'Alice', avatar: 'a.jpg' }]
    const result = makeAuthorsList([], authors)
    expect(result[0]).toMatchObject({ id: 'alice', name: 'Alice', avatar: 'a.jpg' })
  })
})
