import { describe, expect, it } from 'vitest'

import {
  isContentRelativePath,
  resolveContentMediaPath,
  resolveSidebarLogo,
} from '../../../../src/utils/shared/media.ts'

describe('isContentRelativePath', () => {
  it('accepts explicitly relative paths', () => {
    expect(isContentRelativePath('./cover.jpg')).toBe(true)
    expect(isContentRelativePath('../shared/cover.jpg')).toBe(true)
  })

  it('rejects site-root paths, URLs and non-paths', () => {
    expect(isContentRelativePath('/img/cover.jpg')).toBe(false)
    expect(isContentRelativePath('https://example.com/a.png')).toBe(false)
    expect(isContentRelativePath('//example.com/a.png')).toBe(false)
    expect(isContentRelativePath('data:image/png;base64,AAA')).toBe(false)
    expect(isContentRelativePath('#anchor')).toBe(false)
    expect(isContentRelativePath('')).toBe(false)
    expect(isContentRelativePath(undefined)).toBe(false)
  })

  it('leaves icon names alone', () => {
    expect(isContentRelativePath('fa6-solid:bolt')).toBe(false)
    expect(isContentRelativePath('fa6-solid:bolt', { allowBare: true })).toBe(
      false
    )
  })

  it('accepts bare paths only with allowBare', () => {
    expect(isContentRelativePath('media/cover.jpg')).toBe(false)
    expect(isContentRelativePath('media/cover.jpg', { allowBare: true })).toBe(
      true
    )
  })
})

describe('resolveContentMediaPath', () => {
  it('resolves a media subfolder against a folder-per-article layout', () => {
    expect(
      resolveContentMediaPath('./media/cover.jpg', 'ru/post/my-article/index.md')
    ).toBe('/ru/post/my-article/media/cover.jpg')
  })

  it('resolves a file sitting next to the post', () => {
    expect(resolveContentMediaPath('./cover.jpg', 'ru/post/my-article.md')).toBe(
      '/ru/post/cover.jpg'
    )
  })

  it('resolves paths in deeply nested folders', () => {
    expect(
      resolveContentMediaPath('./near.png', 'ru/post/2026/trip/day-one.md')
    ).toBe('/ru/post/2026/trip/near.png')
  })

  it('walks up with ..', () => {
    expect(
      resolveContentMediaPath('../shared/cover.jpg', 'ru/post/a/index.md')
    ).toBe('/ru/post/shared/cover.jpg')
  })

  it('resolves bare paths when allowBare is set', () => {
    expect(
      resolveContentMediaPath('media/cover.jpg', 'ru/post/a/index.md', {
        allowBare: true,
      })
    ).toBe('/ru/post/a/media/cover.jpg')
  })

  it('returns site-root paths, URLs and empty values unchanged', () => {
    expect(resolveContentMediaPath('/img/c.jpg', 'ru/post/a.md')).toBe(
      '/img/c.jpg'
    )
    expect(
      resolveContentMediaPath('https://example.com/c.jpg', 'ru/post/a.md')
    ).toBe('https://example.com/c.jpg')
    expect(resolveContentMediaPath(undefined, 'ru/post/a.md')).toBeUndefined()
  })

  it('returns the value unchanged without a markdown path', () => {
    expect(resolveContentMediaPath('./c.jpg', undefined)).toBe('./c.jpg')
  })
})

describe('resolveSidebarLogo', () => {
  it('uses a single string for both appearances', () => {
    expect(resolveSidebarLogo('/img/logo.svg')).toEqual({
      light: '/img/logo.svg',
      dark: '/img/logo.svg',
      alt: '',
    })
  })

  it('keeps a separate source per appearance', () => {
    expect(
      resolveSidebarLogo({
        light: '/img/light.svg',
        dark: '/img/dark.svg',
        alt: 'Blog',
      })
    ).toEqual({ light: '/img/light.svg', dark: '/img/dark.svg', alt: 'Blog' })
  })

  it('falls back to the other side when one is missing', () => {
    expect(resolveSidebarLogo({ light: '/img/light.svg' })).toEqual({
      light: '/img/light.svg',
      dark: '/img/light.svg',
      alt: '',
    })
    expect(resolveSidebarLogo({ dark: '/img/dark.svg' })).toEqual({
      light: '/img/dark.svg',
      dark: '/img/dark.svg',
      alt: '',
    })
  })

  it('returns undefined for empty or unusable values', () => {
    expect(resolveSidebarLogo(undefined)).toBeUndefined()
    expect(resolveSidebarLogo('')).toBeUndefined()
    expect(resolveSidebarLogo({})).toBeUndefined()
    expect(resolveSidebarLogo(42)).toBeUndefined()
  })
})
