import { describe, it, expect } from 'vitest'
import {
  makeTagsList,
  makeCategoriesList,
  makePostsOfCategoryList,
  makePostsOfTagList,
  makeYearsList,
  makeMonthsList,
  makePostsOfMonthList,
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
    expect(result[0]!.name).toBe('bar')
  })

  it('sorts by count descending', () => {
    const posts: PostLite[] = [
      { url: '/a', tags: [{ name: 'rare' }] },
      { url: '/b', tags: [{ name: 'common' }] },
      { url: '/c', tags: [{ name: 'common' }] },
      { url: '/d', tags: [{ name: 'common' }] },
    ]
    const result = makeTagsList(posts)
    expect(result[0]!.name).toBe('common')
    expect(result[1]!.name).toBe('rare')
  })

  it('preserves additional tag properties', () => {
    const posts: PostLite[] = [
      { url: '/a', tags: [{ name: 'foo', slug: 'foo-slug', custom: 123 }] },
    ]
    const result = makeTagsList(posts)
    expect(result[0]).toMatchObject({ name: 'foo', slug: 'foo-slug', custom: 123 })
  })
})

describe('makeCategoriesList', () => {
  it('returns empty array for empty input', () => {
    expect(makeCategoriesList([])).toEqual([])
  })

  it('counts categories and sorts by count descending', () => {
    const posts: PostLite[] = [
      { url: '/a', categories: [{ name: 'Frontend', slug: 'frontend' }] },
      { url: '/b', categories: [{ name: 'Frontend', slug: 'frontend' }] },
      { url: '/c', categories: [{ name: 'Backend', slug: 'backend' }] },
      { url: '/d' },
    ]
    const result = makeCategoriesList(posts)
    expect(result).toHaveLength(2)
    expect(result[0]).toMatchObject({ slug: 'frontend', count: 2 })
    expect(result[1]).toMatchObject({ slug: 'backend', count: 1 })
  })

  // The slug is the routing key, so entries sharing one must not split in two.
  it('collapses entries that share a slug', () => {
    const posts: PostLite[] = [
      { url: '/a', categories: [{ name: 'Frontend', slug: 'frontend' }] },
      { url: '/b', categories: [{ name: 'frontend', slug: 'frontend' }] },
    ]
    const result = makeCategoriesList(posts)
    expect(result).toHaveLength(1)
    expect(result[0]!.count).toBe(2)
  })

  it('does not mix tags into the category list', () => {
    const posts: PostLite[] = [
      {
        url: '/a',
        tags: [{ name: 'vue', slug: 'vue' }],
        categories: [{ name: 'Frontend', slug: 'frontend' }],
      },
    ]
    expect(makeCategoriesList(posts).map((item) => item.slug)).toEqual(['frontend'])
    expect(makeTagsList(posts).map((item) => item.slug)).toEqual(['vue'])
  })
})

describe('makePostsOfCategoryList', () => {
  const posts: PostLite[] = [
    { url: '/a', categories: [{ name: 'Frontend', slug: 'frontend' }] },
    {
      url: '/b',
      categories: [
        { name: 'Frontend', slug: 'frontend' },
        { name: 'Backend', slug: 'backend' },
      ],
    },
    { url: '/c', categories: [{ name: 'Backend', slug: 'backend' }] },
    { url: '/d' },
  ]

  it('filters by slug', () => {
    expect(makePostsOfCategoryList(posts, 'frontend').map((p) => p.url)).toEqual([
      '/a',
      '/b',
    ])
  })

  it('returns empty array without a slug', () => {
    expect(makePostsOfCategoryList(posts)).toEqual([])
  })

  it('ignores names — only the slug is a valid key', () => {
    expect(makePostsOfCategoryList(posts, 'Frontend')).toEqual([])
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

describe('makePostsOfMonthList', () => {
  it('returns empty array for empty input', () => {
    expect(makePostsOfMonthList([], 2023, 1)).toEqual([])
  })

  it('filters posts by year and month', () => {
    const posts: PostLite[] = [
      { url: '/a', date: '2023-01-15' },
      { url: '/b', date: '2023-01-20' },
      { url: '/c', date: '2023-02-01' },
      { url: '/d', date: '2024-01-01' },
    ]
    const result = makePostsOfMonthList(posts, 2023, 1)
    expect(result).toHaveLength(2)
    expect(result.map((p) => p.url)).toEqual(['/b', '/a'])
  })

  it('sorts posts by date descending', () => {
    const posts: PostLite[] = [
      { url: '/a', date: '2023-01-10' },
      { url: '/b', date: '2023-01-20' },
      { url: '/c', date: '2023-01-05' },
    ]
    const result = makePostsOfMonthList(posts, 2023, 1)
    expect(result.map((p) => p.url)).toEqual(['/b', '/a', '/c'])
  })

  it('accepts string year and month', () => {
    const posts: PostLite[] = [{ url: '/a', date: '2023-06-15' }]
    expect(makePostsOfMonthList(posts, '2023', '6')).toHaveLength(1)
  })

  it('excludes posts with invalid dates', () => {
    const posts: PostLite[] = [
      { url: '/a', date: 'not-a-date' },
      { url: '/b', date: '2023-01-01' },
    ]
    expect(makePostsOfMonthList(posts, 2023, 1)).toHaveLength(1)
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
    expect(result[0]!.count).toBe(1)
  })

  it('ignores posts without authorId', () => {
    const authors = [{ id: 'alice' }]
    const posts: PostLite[] = [{ url: '/a' }, { url: '/b', authorId: 'alice' }]
    const result = makeAuthorsList(posts, authors)
    expect(result[0]!.count).toBe(1)
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
    const authors = [{ id: 'alice', name: 'Alice', image: 'a.jpg' }]
    const result = makeAuthorsList([], authors)
    expect(result[0]).toMatchObject({ id: 'alice', name: 'Alice', image: 'a.jpg' })
  })
})

// Slugs and author ids come from author-written frontmatter, so names that
// collide with `Object.prototype` must not disappear from the lists.
const PROTO_KEYS = ['constructor', 'toString', 'valueOf', 'hasOwnProperty', '__proto__']

describe('Object.prototype key collisions', () => {
  it.each(PROTO_KEYS)('makeTagsList keeps a tag slugged "%s"', (slug) => {
    const posts: PostLite[] = [
      { url: '/a', tags: [{ id: slug, name: slug, slug }] },
      { url: '/b', tags: [{ id: 'ok', name: 'Ok', slug: 'ok' }] },
    ]
    const result = makeTagsList(posts)
    expect(result.map((item) => item.slug).sort()).toEqual([slug, 'ok'].sort())
  })

  it.each(PROTO_KEYS)('makeTagsList counts repeats of "%s"', (slug) => {
    const posts: PostLite[] = [
      { url: '/a', tags: [{ id: slug, name: slug, slug }] },
      { url: '/b', tags: [{ id: slug, name: slug, slug }] },
    ]
    expect(makeTagsList(posts)[0]).toMatchObject({ slug, count: 2 })
  })

  it.each(PROTO_KEYS)('makeCategoriesList keeps a category slugged "%s"', (slug) => {
    const posts: PostLite[] = [{ url: '/a', categories: [{ id: slug, name: slug, slug }] }]
    expect(makeCategoriesList(posts)).toHaveLength(1)
  })

  it.each(PROTO_KEYS)('makeAuthorsList counts posts for author id "%s"', (id) => {
    const result = makeAuthorsList([{ url: '/a', authorId: id }], [{ id, name: id }])
    expect(result).toHaveLength(1)
    expect(result[0]!.count).toBe(1)
  })

  it('makePostsOfTagList filters by a prototype-named slug', () => {
    const posts: PostLite[] = [
      { url: '/a', tags: [{ id: 'c', name: 'C', slug: 'constructor' }] },
      { url: '/b', tags: [{ id: 'ok', name: 'Ok', slug: 'ok' }] },
    ]
    expect(makePostsOfTagList(posts, 'constructor').map((p) => p.url)).toEqual(['/a'])
  })
})
