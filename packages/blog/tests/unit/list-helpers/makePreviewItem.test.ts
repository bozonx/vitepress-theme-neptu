import { describe, expect, it, vi } from 'vitest'

const { readFileSyncMock, existsSyncMock } = vi.hoisted(() => ({
  readFileSyncMock: vi.fn(),
  existsSyncMock: vi.fn(() => false),
}))

vi.mock('node:fs', () => ({
  default: { readFileSync: readFileSyncMock, existsSync: existsSyncMock },
  readFileSync: readFileSyncMock,
  existsSync: existsSyncMock,
}))

vi.mock('../../../src/utils/node/image.ts', () => ({
  getImageDimensions: vi.fn(() => null),
}))

import { makePreviewItem } from '../../../src/list-helpers/makePreviewItem.ts'

describe('makePreviewItem', () => {
  it('builds a folder URL for a folder-per-article post', () => {
    readFileSyncMock.mockReturnValue(`---
title: Folder post
---

Body`)

    const item = makePreviewItem('/tmp/site/src/en/posts/my-article/index.md', {
      srcDir: '/tmp/site/src',
    })

    expect(item.url).toBe('/en/posts/my-article/')
  })

  it('keeps nested posts in their own subfolder URL', () => {
    readFileSyncMock.mockReturnValue(`---
title: Nested post
---

Body`)

    const item = makePreviewItem('/tmp/site/src/en/posts/2026/trip/day-one.md', {
      srcDir: '/tmp/site/src',
    })

    expect(item.url).toBe('/en/posts/2026/trip/day-one')
  })

  it('turns a co-located cover into a site-root path', () => {
    readFileSyncMock.mockReturnValue(`---
title: Folder post
cover: ./media/cover.jpg
---

Body`)

    const item = makePreviewItem('/tmp/site/src/en/posts/my-article/index.md', {
      srcDir: '/tmp/site/src',
    })

    expect(item.cover).toBe('/en/posts/my-article/media/cover.jpg')
    expect(item.frontmatter.cover).toBe('/en/posts/my-article/media/cover.jpg')
  })

  it('leaves a public cover path untouched', () => {
    readFileSyncMock.mockReturnValue(`---
title: Public cover
cover: /img/cover.jpg
---

Body`)

    const item = makePreviewItem('/tmp/site/src/en/posts/hello.md', {
      srcDir: '/tmp/site/src',
    })

    expect(item.cover).toBe('/img/cover.jpg')
  })

  it('normalizes string and object tags from frontmatter', () => {
    readFileSyncMock.mockReturnValue(`---
title: Hello
tags:
  - Vue
  - name: Web Dev
    slug: web-dev-custom
---

Body content`)

    const item = makePreviewItem('/tmp/site/src/en/posts/hello.md')

    expect(item.tags).toEqual([
      { name: 'Vue', slug: 'vue' },
      { name: 'Web Dev', slug: 'web-dev-custom' },
    ])
  })

  it('includes file path in frontmatter parsing errors', () => {
    readFileSyncMock.mockReturnValue(`---
title: [
---

Body content`)

    expect(() => makePreviewItem('/tmp/site/src/en/posts/broken.md')).toThrow(
      'Failed to parse frontmatter in /tmp/site/src/en/posts/broken.md'
    )
  })

  it('respects custom maxPreviewLength', () => {
    readFileSyncMock.mockReturnValue(`---
title: Hello
---

This is a very long body content that should be truncated according to the custom maxPreviewLength parameter passed to the function.`)

    const item = makePreviewItem('/tmp/site/src/en/posts/hello.md', { maxPreviewLength: 20 })

    expect(item.preview).toBeDefined()
    expect(item.preview!.length).toBeLessThanOrEqual(20)
    expect(item.preview).toMatch(/\u2026$/)
  })

  it('uses previewText as-is without adding ellipsis', () => {
    readFileSyncMock.mockReturnValue(`---
title: Hello
previewText: Custom preview.
---

Body content`)

    const item = makePreviewItem('/tmp/site/src/en/posts/hello.md', { maxPreviewLength: 10 })

    expect(item.preview).toBe('Custom preview.')
  })

  it('exposes the featured flag to post collections', () => {
    readFileSyncMock.mockReturnValue(`---
title: Hello
featured: true
---

Body content`)

    const item = makePreviewItem('/tmp/site/src/en/posts/hello.md')

    expect(item.featured).toBe(true)
  })

  it('keeps SEO description out of a card unless descriptionAsPreview opts in', () => {
    readFileSyncMock.mockReturnValue(`---
title: Hello
description: Search-engine summary.
---

Independent body excerpt.`)

    const item = makePreviewItem('/tmp/site/src/en/posts/hello.md')

    expect(item.preview).toBe('Independent body excerpt.')
  })

  it('uses description as a card preview only when descriptionAsPreview is true', () => {
    readFileSyncMock.mockReturnValue(`---
title: Hello
description: Search-engine summary.
descriptionAsPreview: true
---

Independent body excerpt.`)

    const item = makePreviewItem('/tmp/site/src/en/posts/hello.md')

    expect(item.preview).toBe('Search-engine summary.')
  })
})
