import { describe, it, expect } from 'vitest'
import {
  filterSitemap,
  type SitemapItem,
} from '../../../src/transformers/filterSitemap.ts'

describe('filterSitemap', () => {
  it('returns empty array for empty input', () => {
    expect(filterSitemap([])).toEqual([])
  })

  it('filters out items without url or links', () => {
    const items: SitemapItem[] = [
      { url: 'en/', links: [] },
      { url: '', links: [] },
      { url: '', links: [] },
      { url: '', links: [] } as SitemapItem,
    ]
    expect(filterSitemap(items)).toEqual([{ url: 'en/', links: [] }])
  })

  it('filters out items starting with /', () => {
    const items: SitemapItem[] = [
      { url: '/en/', links: [] },
      { url: 'en/', links: [] },
    ]
    expect(filterSitemap(items)).toEqual([{ url: 'en/', links: [] }])
  })

  it('keeps root locale paths', () => {
    const items: SitemapItem[] = [
      { url: 'en/', links: [] },
      { url: 'ru/', links: [] },
    ]
    expect(filterSitemap(items)).toEqual(items)
  })

  it('keeps root locale paths with non-latin characters', () => {
    const items: SitemapItem[] = [
      { url: 'рус/', links: [] },
      { url: '中文/', links: [] },
    ]
    expect(filterSitemap(items)).toEqual(items)
  })

  it('keeps post directory paths', () => {
    const items: SitemapItem[] = [
      { url: 'en/post/hello', links: [] },
      { url: 'en/post/tag/foo', links: [] },
    ]
    expect(filterSitemap(items)).toEqual(items)
  })

  it('keeps post directory paths with non-latin locale', () => {
    const items: SitemapItem[] = [
      { url: 'рус/post/hello', links: [] },
      { url: '中文/post/tag/foo', links: [] },
    ]
    expect(filterSitemap(items)).toEqual(items)
  })

  it('keeps page directory paths', () => {
    const items: SitemapItem[] = [
      { url: 'en/page/2', links: [] },
      { url: 'en/page/99', links: [] },
    ]
    expect(filterSitemap(items)).toEqual(items)
  })

  it('keeps page directory paths with non-latin locale', () => {
    const items: SitemapItem[] = [
      { url: 'рус/page/2', links: [] },
      { url: '中文/page/99', links: [] },
    ]
    expect(filterSitemap(items)).toEqual(items)
  })

  it('keeps custom content paths', () => {
    const items: SitemapItem[] = [
      { url: 'en/about', links: [] },
      { url: 'en/projects/my-app', links: [] },
      { url: 'en/docs/guide', links: [] },
    ]
    expect(filterSitemap(items)).toEqual(items)
  })

  it('filters out utility routes', () => {
    const items: SitemapItem[] = [
      { url: 'en/tags', links: [] },
      { url: 'en/tags/foo', links: [] },
      { url: 'en/archive', links: [] },
      { url: 'en/archive/2024', links: [] },
      { url: 'en/authors', links: [] },
      { url: 'en/authors/john', links: [] },
      { url: 'en/popular', links: [] },
      { url: 'en/recent', links: [] },
    ]
    expect(filterSitemap(items)).toEqual([])
  })

  it('filters out utility routes with non-latin locale', () => {
    const items: SitemapItem[] = [
      { url: 'рус/tags', links: [] },
      { url: '中文/archive', links: [] },
    ]
    expect(filterSitemap(items)).toEqual([])
  })

  it('filters out links without url in root pages', () => {
    const items: SitemapItem[] = [
      {
        url: 'en/',
        links: [{ url: 'https://example.com/en/' }, { href: 'not-url' }, {}],
      },
    ]
    const result = filterSitemap(items)
    expect(result[0].links).toEqual([{ url: 'https://example.com/en/' }])
  })

  it('does not filter links for non-root pages', () => {
    const items: SitemapItem[] = [
      {
        url: 'en/post/hello',
        links: [
          { url: 'https://example.com/en/post/hello' },
          { href: 'not-url' },
        ],
      },
    ]
    const result = filterSitemap(items)
    expect(result[0].links).toHaveLength(2)
  })

  it('preserves other item properties', () => {
    const items: SitemapItem[] = [
      { url: 'en/', links: [], changefreq: 'daily', priority: 1.0 },
    ]
    expect(filterSitemap(items)).toEqual(items)
  })

  it('filters out user-defined noindex pages', () => {
    const items: SitemapItem[] = [
      { url: 'en/private-page', links: [] },
      { url: 'en/public-page', links: [] },
      { url: 'en/another-private/', links: [] },
    ]
    const noIndexUrls = new Set(['en/private-page', 'en/another-private/'])
    expect(filterSitemap(items, noIndexUrls)).toEqual([
      { url: 'en/public-page', links: [] },
    ])
  })

  it('does not filter when noIndexUrls is not provided', () => {
    const items: SitemapItem[] = [
      { url: 'en/private-page', links: [] },
      { url: 'en/public-page', links: [] },
    ]
    expect(filterSitemap(items)).toEqual(items)
  })
})
