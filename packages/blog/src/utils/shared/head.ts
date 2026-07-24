import type { HeadConfig } from 'vitepress'

/**
 * Checks whether a VitePress `head` array contains a `<meta name="robots" content="...noindex...">` directive.
 *
 * Supports the standard VitePress `HeadConfig` tuple format:
 * `['meta', { name: 'robots', content: 'noindex' }]`
 */
export function hasNoIndex(head: unknown): boolean {
  if (!Array.isArray(head)) return false

  return head.some((item: unknown) => {
    if (!Array.isArray(item) || item.length < 2) return false

    const [tag, attrs] = item as HeadConfig

    if (tag !== 'meta') return false
    if (!attrs || typeof attrs !== 'object') return false

    const name = (attrs as Record<string, string>).name
    const content = (attrs as Record<string, string>).content

    if (name !== 'robots' || !content) return false

    return content.toLowerCase().includes('noindex')
  })
}
