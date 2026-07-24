import { describe, it, expect, vi } from 'vitest'
import { transformPageMeta } from '../../../src/transformers/transformPageMeta.ts'
import type { ExtendedPageData } from '../../../src/types.d.ts'

vi.mock('../../../src/utils/shared/index.ts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../src/utils/shared/index.ts')>()
  return {
    ...actual,
    transliterate: vi.fn((str: string, _lang?: string) => str.toLowerCase().replace(/\s+/g, '-')),
  }
})

vi.mock('../../../src/utils/node/index.ts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../src/utils/node/index.ts')>()
  return {
    ...actual,
    mdToHtml: vi.fn((md: string) => `<p>${md}</p>`),
  }
})

describe('transformPageMeta', () => {
  function createPageData(overrides: Partial<ExtendedPageData> = {}): ExtendedPageData {
    return {
      filePath: 'en/test.md',
      frontmatter: {
        layout: 'post',
        tags: ['Foo', 'Bar Baz'],
        ...overrides.frontmatter,
      },
      ...overrides,
    } as ExtendedPageData
  }

  it('does nothing for non-post pages', () => {
    const pageData = createPageData({ frontmatter: { layout: 'page' } })
    transformPageMeta(pageData)
    expect(pageData.frontmatter.tags).toBeUndefined()
  })

  it('transforms string tags to objects with slug', () => {
    const pageData = createPageData()
    transformPageMeta(pageData)
    expect(pageData.frontmatter.tags).toEqual([
      { name: 'Foo', slug: 'foo' },
      { name: 'Bar Baz', slug: 'bar-baz' },
    ])
  })

  it('skips transformation for tag objects', () => {
    const pageData = createPageData({
      frontmatter: {
        layout: 'post',
        tags: [{ name: 'Foo', slug: 'custom-slug' }],
      },
    })
    transformPageMeta(pageData)
    expect(pageData.frontmatter.tags).toEqual([{ name: 'Foo', slug: 'custom-slug' }])
  })

  it('normalizes object tags without slug', () => {
    const pageData = createPageData({
      filePath: 'en/post/hello.md',
      frontmatter: {
        layout: 'post',
        tags: [{ name: 'Foo Bar' } as any],
      },
    })
    transformPageMeta(pageData)
    expect(pageData.frontmatter.tags).toEqual([{ name: 'Foo Bar', slug: 'foo-bar' }])
  })

  it('transforms coverDescr markdown to HTML', () => {
    const pageData = createPageData({
      frontmatter: {
        layout: 'post',
        coverDescr: 'Some **bold** text',
      },
    })
    transformPageMeta(pageData)
    expect(pageData.frontmatter.coverDescr).toBe('<p>Some **bold** text</p>')
  })

  it('does nothing when coverDescr is absent', () => {
    const pageData = createPageData()
    transformPageMeta(pageData)
    expect(pageData.frontmatter.coverDescr).toBeUndefined()
  })

  it('handles empty tags array', () => {
    const pageData = createPageData({
      frontmatter: {
        layout: 'post',
        tags: [],
      },
    })
    transformPageMeta(pageData)
    expect(pageData.frontmatter.tags).toEqual([])
  })

  it('handles missing tags', () => {
    const pageData = createPageData({
      frontmatter: {
        layout: 'post',
      },
    })
    transformPageMeta(pageData)
    expect(pageData.frontmatter.tags).toBeUndefined()
  })

})
