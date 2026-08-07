import { getImageDimensions } from '../utils/node/index.ts'

export interface MdImageOptions {
  srcDir?: string
}

interface MarkdownToken {
  type: string
  tag?: string
  content?: string
  children?: MarkdownToken[]
  attrGet(name: string): string | null
  attrPush(attr: [string, string | undefined]): void
}

interface MdImageEnv {
  relativePath?: string
}

interface MdImageState {
  tokens: MarkdownToken[]
  Token: new (type: string, tag: string, nesting: number) => MarkdownToken
  env?: MdImageEnv
}

interface MdImageMarkdown {
  core: {
    ruler: {
      before(target: string, name: string, fn: (state: MdImageState) => void): void
    }
  }
}

/**
 * Markdown-it plugin that wraps standalone images in `<figure>` tags with
 * captions (similar to @mdit/plugin-figure). Also reads image dimensions and
 * injects width/height attributes.
 */
export function mdImage(md: unknown, { srcDir }: MdImageOptions = {}): void {
  const markdown = md as MdImageMarkdown

  markdown.core.ruler.before('linkify', 'figure', (state) => {
    const tokens = state.tokens

    // The first image of a page is a likely LCP candidate, so it is left to
    // load eagerly; everything below it is deferred.
    let seenFirstImage = false

    // Bounded to leave one token on each side, so a standalone image always has
    // its surrounding paragraph tokens to turn into `<figure>`.
    for (let i = 1; i < tokens.length - 1; i++) {
      const token = tokens[i]
      const prevToken = tokens[i - 1]
      const nextToken = tokens[i + 1]
      if (!token || !prevToken || !nextToken) continue

      const children = token.children
      if (token.type !== 'inline' || !children || children.length === 0) continue

      const [first, second, third] = children

      const hasOnlyImage =
        (children.length === 1 && first?.type === 'image') ||
        (children.length === 3 &&
          first?.type === 'link_open' &&
          second?.type === 'image' &&
          third?.type === 'link_close')

      const isStandaloneParagraph =
        prevToken.type === 'paragraph_open' &&
        nextToken.type === 'paragraph_close'

      for (const child of children) {
        if (child.type !== 'image') continue

        if (seenFirstImage) {
          child.attrPush(['loading', 'lazy'])
        } else {
          seenFirstImage = true
          child.attrPush(['fetchpriority', 'high'])
        }
        child.attrPush(['decoding', 'async'])
      }

      if (!hasOnlyImage || !isStandaloneParagraph) continue

      // `hasOnlyImage` already established which slot holds the image.
      const imageToken = children.length === 1 ? first : second
      if (!imageToken) continue

      const imageSrc = imageToken.attrGet('src')

      if (imageSrc && srcDir) {
        const dimensions = getImageDimensions(
          imageSrc,
          srcDir,
          state.env?.relativePath
        )

        if (dimensions) {
          imageToken.attrPush(['width', dimensions.width.toString()])
          imageToken.attrPush(['height', dimensions.height.toString()])
        }
      }

      if (children.length === 3) {
        first?.attrPush(['class', 'lightbox'])
      } else {
        const linkOpen = new state.Token('link_open', 'a', 1)
        if (imageSrc) {
          linkOpen.attrPush(['href', imageSrc])
        }
        linkOpen.attrPush(['class', 'lightbox'])

        const linkClose = new state.Token('link_close', 'a', -1)

        children.splice(0, 1, linkOpen, imageToken, linkClose)
      }

      prevToken.type = 'figure_open'
      prevToken.tag = 'figure'

      nextToken.type = 'figure_close'
      nextToken.tag = 'figure'

      const caption = imageToken.attrGet('alt') || imageToken.content

      if (caption) {
        const figcaptionOpen = new state.Token(
          'figcaption_open',
          'figcaption',
          1
        )

        const figcaptionText = new state.Token('text', '', 0)
        figcaptionText.content = caption

        const figcaptionClose = new state.Token(
          'figcaption_close',
          'figcaption',
          -1
        )

        children.push(figcaptionOpen, figcaptionText, figcaptionClose)
      }

      imageToken.attrPush(['tabindex', '0'])
    }
  })
}
