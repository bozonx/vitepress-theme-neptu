import { describe, expect, it } from 'vitest'

import { resolveMediaPaths } from '../../../src/transformers/resolveMediaPaths.ts'

function makePageData(cover: string | undefined, relativePath: string) {
  return { frontmatter: { cover }, relativePath } as never
}

describe('resolveMediaPaths', () => {
  it('resolves a cover inside a media subfolder', () => {
    const pageData = makePageData(
      './media/cover.jpg',
      'ru/post/my-article/index.md'
    )

    resolveMediaPaths(pageData)

    expect((pageData as { frontmatter: { cover?: string } }).frontmatter.cover)
      .toBe('/ru/post/my-article/media/cover.jpg')
  })

  it('resolves a bare co-located cover', () => {
    const pageData = makePageData('cover.jpg', 'ru/post/my-article.md')

    resolveMediaPaths(pageData)

    expect((pageData as { frontmatter: { cover?: string } }).frontmatter.cover)
      .toBe('/ru/post/cover.jpg')
  })

  it('leaves public and external covers untouched', () => {
    const pageData = makePageData('/img/cover.jpg', 'ru/post/a.md')
    resolveMediaPaths(pageData)
    expect((pageData as { frontmatter: { cover?: string } }).frontmatter.cover)
      .toBe('/img/cover.jpg')

    const external = makePageData('https://cdn.example.com/c.jpg', 'ru/post/a.md')
    resolveMediaPaths(external)
    expect((external as { frontmatter: { cover?: string } }).frontmatter.cover)
      .toBe('https://cdn.example.com/c.jpg')
  })

  it('does nothing without a cover', () => {
    const pageData = makePageData(undefined, 'ru/post/a.md')
    expect(() => resolveMediaPaths(pageData)).not.toThrow()
  })
})
