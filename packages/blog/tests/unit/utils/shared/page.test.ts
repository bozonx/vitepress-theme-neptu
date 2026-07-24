import { describe, it, expect } from 'vitest'
import {
  isPost,
  isHomePage,
  isPage,
  isUtilPage,
  isPopularRoute,
  isAuthorPage,
  resolveArticlePreview,
  resolveBodyMarker,
} from '../../../../src/utils/shared/page.ts'
import type { ThemeConfig } from '../../../../src/types.d.ts'

describe('isPost', () => {
  it('returns true for explicit layout post', () => {
    expect(isPost({ layout: 'post' })).toBe(true)
  })

  it('returns true when layout is undefined', () => {
    expect(isPost({})).toBe(true)
  })

  it('returns false for other layouts', () => {
    expect(isPost({ layout: 'home' })).toBe(false)
    expect(isPost({ layout: 'page' })).toBe(false)
    expect(isPost({ layout: 'tag' })).toBe(false)
  })

  it('returns undefined for null input', () => {
    expect(isPost(null)).toBeUndefined()
  })

  it('returns undefined for undefined input', () => {
    expect(isPost(undefined)).toBeUndefined()
  })
})

describe('isHomePage', () => {
  it('returns true for layout home', () => {
    expect(isHomePage({ layout: 'home' })).toBe(true)
  })

  it('returns false for other layouts', () => {
    expect(isHomePage({ layout: 'post' })).toBe(false)
    expect(isHomePage({})).toBe(false)
  })

  it('returns false for null', () => {
    expect(isHomePage(null)).toBe(false)
  })
})

describe('isPage', () => {
  it('returns true for layout page', () => {
    expect(isPage({ layout: 'page' })).toBe(true)
  })

  it('returns false for other layouts', () => {
    expect(isPage({ layout: 'post' })).toBe(false)
    expect(isPage({})).toBe(false)
  })

  it('returns false for null', () => {
    expect(isPage(null)).toBe(false)
  })
})

describe('isUtilPage', () => {
  it('returns true for util layouts', () => {
    expect(isUtilPage({ layout: 'util' })).toBe(true)
    expect(isUtilPage({ layout: 'tag' })).toBe(true)
    expect(isUtilPage({ layout: 'archive' })).toBe(true)
    expect(isUtilPage({ layout: 'author' })).toBe(true)
  })

  it('returns false for other layouts', () => {
    expect(isUtilPage({ layout: 'post' })).toBe(false)
    expect(isUtilPage({})).toBe(false)
  })

  it('returns false for null', () => {
    expect(isUtilPage(null)).toBe(false)
  })
})

describe('isPopularRoute', () => {
  it('detects popular route path', () => {
    expect(isPopularRoute('/en/popular/1')).toBe(true)
  })

  it('returns false for non-popular paths', () => {
    expect(isPopularRoute('/en/post/hello')).toBe(false)
  })
})

describe('isAuthorPage', () => {
  it('returns true for author page path', () => {
    expect(isAuthorPage('en/authors/john/1.md')).toBe(true)
  })

  it('returns false for author index page', () => {
    expect(isAuthorPage('en/authors/index.md')).toBe(false)
  })

  it('returns false for null filePath', () => {
    expect(isAuthorPage(null)).toBe(false)
  })

  it('returns false for unrelated paths', () => {
    expect(isAuthorPage('en/post/hello.md')).toBe(false)
  })

  it('matches locale with hyphen', () => {
    expect(isAuthorPage('zh-CN/authors/john/1.md')).toBe(true)
  })
})

describe('resolveArticlePreview', () => {
  it('returns previewText if present', () => {
    expect(resolveArticlePreview({ previewText: 'Preview' })).toBe('Preview')
  })

  it('returns description when descrAsPreview is true', () => {
    expect(resolveArticlePreview({ description: 'Desc', descrAsPreview: true })).toBe('Desc')
  })

  it('prefers previewText over description', () => {
    expect(
      resolveArticlePreview({ previewText: 'Preview', description: 'Desc', descrAsPreview: true })
    ).toBe('Preview')
  })

  it('returns undefined when nothing matches', () => {
    expect(resolveArticlePreview({})).toBeUndefined()
  })

  it('returns undefined when descrAsPreview is true but no description', () => {
    expect(resolveArticlePreview({ descrAsPreview: true })).toBeUndefined()
  })

  it('treats blank previewText as explicit absence', () => {
    expect(
      resolveArticlePreview({ previewText: '   ', description: 'Desc', descrAsPreview: true })
    ).toBeUndefined()
  })

  it('trims previewText and description', () => {
    expect(resolveArticlePreview({ previewText: '  Preview  ' })).toBe('Preview')
    expect(resolveArticlePreview({ description: '  Desc  ', descrAsPreview: true })).toBe('Desc')
  })
})

describe('resolveBodyMarker', () => {
  const theme: ThemeConfig = {
    search: { provider: 'pagefind', options: { bodyMarker: 'marker' } },
  } as any

  it('returns bodyMarker for regular post', () => {
    expect(resolveBodyMarker(theme, { layout: 'post' })).toBe('marker')
  })

  it('returns undefined when bodyMarker is missing', () => {
    expect(resolveBodyMarker({} as ThemeConfig, { layout: 'post' })).toBeUndefined()
  })

  it('returns undefined for util page without searchIncluded', () => {
    expect(resolveBodyMarker(theme, { layout: 'tag' })).toBeUndefined()
  })

  it('returns bodyMarker for util page with searchIncluded true', () => {
    expect(resolveBodyMarker(theme, { layout: 'tag', searchIncluded: true })).toBe('marker')
  })

  it('returns undefined for util page with searchIncluded false', () => {
    expect(resolveBodyMarker(theme, { layout: 'tag', searchIncluded: false })).toBeUndefined()
  })
})
