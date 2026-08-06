import { describe, it, expect } from 'vitest'
import {
  DEFAULT_TOC_LEVEL,
  flattenTocHeaders,
  hasEnoughHeadings,
  isTocEnabled,
  resolveTocLevels,
  type TocHeader,
} from '../../../../src/utils/shared/toc.ts'
import type { ThemeConfig } from '../../../../src/types.d.ts'

const headers: TocHeader[] = [
  {
    level: 2,
    title: 'First',
    link: '#first',
    children: [
      {
        level: 3,
        title: 'Nested',
        link: '#nested',
        children: [{ level: 4, title: 'Deep', link: '#deep' }],
      },
    ],
  },
  { level: 2, title: 'Second', link: '#second' },
]

describe('resolveTocLevels', () => {
  it('falls back to h2-h3', () => {
    expect(resolveTocLevels(undefined)).toEqual(DEFAULT_TOC_LEVEL)
  })

  it('expands a single level into a one-level range', () => {
    expect(resolveTocLevels(2)).toEqual([2, 2])
  })

  it("treats 'deep' as h2-h6", () => {
    expect(resolveTocLevels('deep')).toEqual([2, 6])
  })

  it('normalises a reversed tuple', () => {
    expect(resolveTocLevels([4, 2])).toEqual([2, 4])
  })
})

describe('flattenTocHeaders', () => {
  it('flattens the tree in document order', () => {
    expect(flattenTocHeaders(headers).map((i) => i.title)).toEqual([
      'First',
      'Nested',
      'Second',
    ])
  })

  it('drops levels outside the range', () => {
    expect(flattenTocHeaders(headers, [2, 2]).map((i) => i.title)).toEqual([
      'First',
      'Second',
    ])
  })

  it('keeps a deep heading whose parent was filtered out', () => {
    // The nesting is structural, not a reason to hide the child: a page may
    // legitimately jump from h2 straight into h4.
    expect(flattenTocHeaders(headers, [4, 4]).map((i) => i.title)).toEqual([
      'Deep',
    ])
  })

  it('reports depth relative to the shallowest kept level', () => {
    expect(flattenTocHeaders(headers, [3, 4]).map((i) => i.depth)).toEqual([
      0, 1,
    ])
  })

  it('skips entries with no title or anchor', () => {
    const broken: TocHeader[] = [
      { level: 2, title: '', link: '#empty' },
      { level: 2, title: 'No link', link: '' },
    ]
    expect(flattenTocHeaders(broken)).toEqual([])
  })

  it('returns an empty list for missing headers', () => {
    expect(flattenTocHeaders(undefined)).toEqual([])
    expect(flattenTocHeaders([])).toEqual([])
  })
})

describe('isTocEnabled', () => {
  const theme = {} as ThemeConfig

  it('is on for posts by default', () => {
    expect(isTocEnabled(theme, { layout: 'post' })).toBe(true)
    expect(isTocEnabled(theme, {})).toBe(true)
  })

  it('is off for utility and plain pages by default', () => {
    expect(isTocEnabled(theme, { layout: 'page' })).toBe(false)
    expect(isTocEnabled(theme, { layout: 'tag' })).toBe(false)
    expect(isTocEnabled(theme, { layout: 'archive' })).toBe(false)
  })

  it('never renders on the home page', () => {
    expect(isTocEnabled(theme, { layout: 'home', toc: true })).toBe(false)
  })

  it('honours the master switch', () => {
    expect(isTocEnabled({ toc: { enabled: false } } as ThemeConfig, {})).toBe(
      false
    )
  })

  it('lets frontmatter override the default', () => {
    expect(isTocEnabled(theme, { layout: 'page', toc: true })).toBe(true)
    expect(isTocEnabled(theme, { layout: 'post', toc: false })).toBe(false)
  })

})

describe('hasEnoughHeadings', () => {
  it('drops a table of contents with too few entries', () => {
    expect(hasEnoughHeadings(2, {} as ThemeConfig)).toBe(false)
    expect(hasEnoughHeadings(3, {} as ThemeConfig)).toBe(true)
  })

  it('honours a custom threshold', () => {
    const theme = { toc: { minHeadings: 5 } } as ThemeConfig
    expect(hasEnoughHeadings(4, theme)).toBe(false)
    expect(hasEnoughHeadings(5, theme)).toBe(true)
  })

  it('treats 0 as no threshold', () => {
    expect(hasEnoughHeadings(1, { toc: { minHeadings: 0 } } as ThemeConfig)).toBe(
      true
    )
  })
})
