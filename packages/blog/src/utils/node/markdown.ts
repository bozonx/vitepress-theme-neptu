import grayMatter from 'gray-matter'
import rehypeExternalLinks from 'rehype-external-links'
import html from 'rehype-stringify'
import { remark } from 'remark'
import remarkRehype from 'remark-rehype'
import strip from 'strip-markdown'
import { truncateText } from '../shared/string.ts'
import { removeTitleFromMd } from '../shared/markdown.ts'

const SAFE_URL_PROTOCOLS = new Set([
  'http:',
  'https:',
  'mailto:',
  'tel:',
])

interface RehypeNode {
  type: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: RehypeNode[]
}

function sanitizeNodeTree(node: RehypeNode): void {
  if (!node || typeof node !== 'object') return

  if (node.type === 'element' && typeof node.tagName === 'string') {
    node.properties ||= {}

    if (node.tagName === 'a') {
      const href = typeof node.properties.href === 'string' ? node.properties.href.trim() : ''
      if (!isSafeUrl(href)) {
        delete node.properties.href
      } else if (isExternalUrl(href)) {
        node.properties.rel = ['noopener', 'noreferrer']
      }
    }

    if (node.tagName === 'img') {
      const src = typeof node.properties.src === 'string' ? node.properties.src.trim() : ''
      if (!isSafeUrl(src)) delete node.properties.src
    }
  }

  if (Array.isArray(node.children)) {
    node.children.forEach((child) => sanitizeNodeTree(child))
  }
}

function absolutizeContentUrls(node: RehypeNode, baseUrl: string): void {
  if (!node || typeof node !== 'object') return

  if (node.type === 'element' && node.properties) {
    for (const property of ['href', 'src'] as const) {
      const value = node.properties[property]
      if (typeof value !== 'string' || !isSafeUrl(value)) continue
      try {
        node.properties[property] = new URL(value, baseUrl).toString()
      } catch {
        delete node.properties[property]
      }
    }
  }

  node.children?.forEach((child) => absolutizeContentUrls(child, baseUrl))
}

function absolutizeContentUrlsPlugin(baseUrl: string) {
  return (tree: RehypeNode) => absolutizeContentUrls(tree, baseUrl)
}

function sanitizeHtmlTree() {
  return (tree: RehypeNode) => {
    sanitizeNodeTree(tree)
  }
}


function isExternalUrl(value: string): boolean {
  return /^(?:https?:)?\/\//i.test(value)
}

function isSafeUrl(value: string): boolean {
  if (!value) return false
  if (value.startsWith('#') || value.startsWith('/')) return true
  if (value.startsWith('./') || value.startsWith('../')) return true

  try {
    const parsed = new URL(value, 'https://example.com')
    return SAFE_URL_PROTOCOLS.has(parsed.protocol)
  } catch {
    return false
  }
}

export function stripMd(mdContent: string | null | undefined): string {
  if (!mdContent) return mdContent ?? ''

  return remark().use(strip).processSync(mdContent).toString()
}

export function mdToHtml(mdContent: string | null | undefined): string {
  if (!mdContent) return mdContent ?? ''

  // Check if markdown contains a single paragraph only
  const paragraphs = mdContent
    .trim()
    .split(/\n\s*\n/)
    .filter((p) => p.trim())

  // Convert markdown to HTML
  const processed = remark()
    .use(remarkRehype)
    .use(rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] })
    .use(sanitizeHtmlTree)
    .use(html)
    .processSync(mdContent)
    .toString()

  // Strip outer <p> tags for a single paragraph
  if (paragraphs.length === 1) {
    return processed.replace(/^<p>|<\/p>$/g, '')
  }

  return processed
}

/** Renders safe feed HTML and makes article-relative links and images absolute. */
export function mdToFeedHtml(
  mdContent: string | null | undefined,
  articleUrl: string
): string {
  if (!mdContent) return mdContent ?? ''

  return remark()
    .use(remarkRehype)
    .use(rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] })
    .use(absolutizeContentUrlsPlugin, articleUrl)
    .use(sanitizeHtmlTree)
    .use(html)
    .processSync(mdContent)
    .toString()
}

export interface ParsedMd {
  frontmatter: Record<string, unknown>
  content: string
}

export function parseMdFile(
  rawContent: string,
  sourceName = 'Markdown document'
): ParsedMd {
  try {
    const { data, content } = grayMatter(rawContent)

    return { frontmatter: data as Record<string, unknown>, content }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to parse frontmatter in ${sourceName}: ${message}`, {
      cause: error,
    })
  }
}

export function extractDescriptionFromMd(
  rawContent: string,
  maxLength: number,
  markAtTheEnd?: boolean,
  sourceName?: string
): string {
  const { content } = parseMdFile(rawContent, sourceName)

  return extractDescriptionFromContent(content, maxLength, markAtTheEnd)
}

export function extractDescriptionFromContent(
  content: string,
  maxLength: number,
  markAtTheEnd?: boolean
): string {
  const mdContentNoHeader = removeTitleFromMd(content)
  const stripped = stripMd(mdContentNoHeader)

  return truncateText(stripped, maxLength, { respectWords: true, markAtTheEnd })
}
