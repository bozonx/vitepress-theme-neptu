import { describe, expect, it } from 'vitest'

import { resolveBlockMedia } from '../../../src/utils/resolveBlockMedia.ts'

const MD_PATH = 'ru/page/pricing/index.md'

describe('resolveBlockMedia', () => {
  it('resolves relative media inside nested block data', () => {
    const blocks = [
      {
        type: 'hero',
        image: './media/hero.svg',
        actions: [{ text: 'Go', link: '/ru/doc' }],
      },
      {
        type: 'cards',
        items: [{ image: '../shared/card.png' }],
      },
    ]

    expect(resolveBlockMedia(blocks, MD_PATH)).toEqual([
      {
        type: 'hero',
        image: '/ru/page/pricing/media/hero.svg',
        actions: [{ text: 'Go', link: '/ru/doc' }],
      },
      {
        type: 'cards',
        items: [{ image: '/ru/page/shared/card.png' }],
      },
    ])
  })

  it('leaves icon names, site-root paths and URLs untouched', () => {
    const blocks = [
      {
        icon: 'fa6-solid:bolt',
        image: '/img/demo/shot-2.svg',
        bg: 'brand',
        link: 'https://example.com/a.png',
        dismissible: true,
      },
    ]

    expect(resolveBlockMedia(blocks, MD_PATH)).toEqual(blocks)
  })

  it('does not touch bare paths', () => {
    expect(resolveBlockMedia([{ image: 'media/hero.svg' }], MD_PATH)).toEqual([
      { image: 'media/hero.svg' },
    ])
  })

  it('returns the value unchanged without a markdown path', () => {
    const blocks = [{ image: './a.png' }]
    expect(resolveBlockMedia(blocks, undefined)).toBe(blocks)
  })

  it('handles missing blocks', () => {
    expect(resolveBlockMedia(undefined, MD_PATH)).toBeUndefined()
  })
})
