import { describe, it, expect } from 'vitest'
import { markDraftPage } from '../../../src/transformers/markDraftPage.ts'
import { hasNoIndex } from '../../../src/utils/shared/head.ts'
import type { ExtendedPageData } from '../../../src/types.d.ts'

function makePageData(
  frontmatter: Record<string, unknown> = {}
): ExtendedPageData {
  return {
    frontmatter,
    filePath: 'en/post/a.md',
    relativePath: 'en/post/a.md',
  } as unknown as ExtendedPageData
}

describe('markDraftPage', () => {
  it('leaves a published post untouched', () => {
    const pageData = makePageData({ title: 'Published' })

    markDraftPage(pageData, { includeDrafts: false })

    expect(pageData.frontmatter.head).toBeUndefined()
    expect(pageData.frontmatter.searchIncluded).toBeUndefined()
  })

  it('marks a hidden draft noindex and drops it from search', () => {
    const pageData = makePageData({ draft: true })

    markDraftPage(pageData, { includeDrafts: false })

    expect(pageData.frontmatter.searchIncluded).toBe(false)
    expect(hasNoIndex(pageData.frontmatter.head)).toBe(true)
  })

  it('keeps existing head entries', () => {
    const pageData = makePageData({
      draft: true,
      head: [['meta', { name: 'author', content: 'Someone' }]],
    })

    markDraftPage(pageData, { includeDrafts: false })

    expect(pageData.frontmatter.head).toHaveLength(2)
    expect(hasNoIndex(pageData.frontmatter.head)).toBe(true)
  })

  it('does not duplicate an existing robots directive', () => {
    const pageData = makePageData({
      draft: true,
      head: [['meta', { name: 'robots', content: 'noindex' }]],
    })

    markDraftPage(pageData, { includeDrafts: false })

    expect(pageData.frontmatter.head).toHaveLength(1)
  })

  it('is a no-op while drafts are visible', () => {
    const pageData = makePageData({ draft: true })

    markDraftPage(pageData, { includeDrafts: true })

    expect(pageData.frontmatter.head).toBeUndefined()
    expect(pageData.frontmatter.searchIncluded).toBeUndefined()
  })
})
