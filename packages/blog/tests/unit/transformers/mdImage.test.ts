import { describe, it, expect, vi } from 'vitest'
import * as nodeUtils from '../../../src/utils/node/index.ts'
import { mdImage } from '../../../src/transformers/mdImage.ts'

vi.mock('../../../src/utils/node/index.ts', () => ({
  getImageDimensions: vi.fn(),
}))

function createMockToken(type: string, tag: string, nesting: number, attrs?: [string, string][], content?: string) {
  const token: Record<string, any> = {
    type,
    tag,
    nesting,
    attrGet: (name: string) => attrs?.find((a) => a[0] === name)?.[1] || null,
    attrPush: vi.fn((attr: [string, string]) => { attrs?.push(attr) }),
    attrSet: vi.fn(),
    attrs: attrs ? [...attrs] : [],
    content: content || '',
    children: undefined,
    block: false,
  }
  return token
}

function createMockState(tokens: any[]) {
  return {
    Token: function (type: string, tag: string, nesting: number) {
      return createMockToken(type, tag, nesting)
    },
    tokens,
  }
}

function createMd() {
  const md: Record<string, any> = {}
  md.core = {
    ruler: {
      before: (_ref: string, _name: string, fn: any) => {
        md._rule = fn
      },
    },
  }
  return md
}

describe('mdImage', () => {
  it('wraps standalone image in figure with lightbox', () => {
    vi.mocked(nodeUtils.getImageDimensions).mockReturnValue({ width: 100, height: 200 })

    const imageToken = createMockToken('image', 'img', 0, [['src', 'img.png'], ['alt', 'My image']])
    const inlineToken = createMockToken('inline', '', 0)
    inlineToken.children = [imageToken]

    const tokens = [
      createMockToken('paragraph_open', 'p', 1),
      inlineToken,
      createMockToken('paragraph_close', 'p', -1),
    ]

    const md = createMd()
    mdImage(md, { srcDir: '/src' })
    md._rule(createMockState(tokens))

    expect(tokens[0].type).toBe('figure_open')
    expect(tokens[0].tag).toBe('figure')
    expect(tokens[2].type).toBe('figure_close')
    expect(tokens[2].tag).toBe('figure')

    expect(imageToken.attrPush).toHaveBeenCalledWith(['tabindex', '0'])
    expect(inlineToken.children.length).toBeGreaterThan(1)
  })

  it('handles linked images without duplicating link', () => {
    vi.mocked(nodeUtils.getImageDimensions).mockReturnValue(null)

    const imageToken = createMockToken('image', 'img', 0, [['src', 'img.png']])
    const linkOpen = createMockToken('link_open', 'a', 1, [['href', 'https://example.com']])
    const linkClose = createMockToken('link_close', 'a', -1)
    const inlineToken = createMockToken('inline', '', 0)
    inlineToken.children = [linkOpen, imageToken, linkClose]

    const tokens = [
      createMockToken('paragraph_open', 'p', 1),
      inlineToken,
      createMockToken('paragraph_close', 'p', -1),
    ]

    const md = createMd()
    mdImage(md, { srcDir: '/src' })
    md._rule(createMockState(tokens))

    expect(linkOpen.attrPush).toHaveBeenCalledWith(['class', 'lightbox'])
    expect(inlineToken.children.length).toBeGreaterThanOrEqual(3)
  })

  it('adds image dimensions when available', () => {
    vi.mocked(nodeUtils.getImageDimensions).mockReturnValue({ width: 640, height: 480 })

    const imageToken = createMockToken('image', 'img', 0, [['src', 'pic.jpg']])
    const inlineToken = createMockToken('inline', '', 0)
    inlineToken.children = [imageToken]

    const tokens = [
      createMockToken('paragraph_open', 'p', 1),
      inlineToken,
      createMockToken('paragraph_close', 'p', -1),
    ]

    const md = createMd()
    mdImage(md, { srcDir: '/src' })
    md._rule(createMockState(tokens))

    expect(imageToken.attrPush).toHaveBeenCalledWith(['width', '640'])
    expect(imageToken.attrPush).toHaveBeenCalledWith(['height', '480'])
  })

  it('adds lazy loading to non-standalone paragraphs but skips figure', () => {
    const imageToken = createMockToken('image', 'img', 0, [['src', 'img.png']])
    const inlineToken = createMockToken('inline', '', 0)
    inlineToken.children = [imageToken]

    const tokens = [
      createMockToken('div_open', 'div', 1),
      inlineToken,
      createMockToken('div_close', 'div', -1),
    ]

    const md = createMd()
    mdImage(md, {})
    md._rule(createMockState(tokens))

    expect(tokens[0].type).toBe('div_open')
    expect(imageToken.attrPush).toHaveBeenCalledWith(['loading', 'lazy'])
    expect(imageToken.attrPush).toHaveBeenCalledWith(['decoding', 'async'])
  })

  it('does nothing for non-image inline content', () => {
    const inlineToken = createMockToken('inline', '', 0)
    inlineToken.children = [createMockToken('text', '', 0)]

    const tokens = [
      createMockToken('paragraph_open', 'p', 1),
      inlineToken,
      createMockToken('paragraph_close', 'p', -1),
    ]

    const md = createMd()
    mdImage(md, {})
    md._rule(createMockState(tokens))

    expect(tokens[0].type).toBe('paragraph_open')
  })

  it('does nothing without srcDir', () => {
    vi.mocked(nodeUtils.getImageDimensions).mockClear()

    const imageToken = createMockToken('image', 'img', 0, [['src', 'img.png']])
    const inlineToken = createMockToken('inline', '', 0)
    inlineToken.children = [imageToken]

    const tokens = [
      createMockToken('paragraph_open', 'p', 1),
      inlineToken,
      createMockToken('paragraph_close', 'p', -1),
    ]

    const md = createMd()
    mdImage(md, {})
    md._rule(createMockState(tokens))

    expect(nodeUtils.getImageDimensions).not.toHaveBeenCalled()
  })
})
