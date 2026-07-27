/**
 * URL helpers shared by every block and primitive.
 *
 * Local paths must go through `withBase()` or they break on sites deployed
 * under a sub-path (`base: '/project/'`). External URLs, anchors, `mailto:` and
 * `tel:` links must not. Keeping the rule in one place is what stops the two
 * from drifting apart across the block library.
 */
import { withBase } from 'vitepress'

/** `https://…`, `//…` or any other scheme (`mailto:`, `tel:`). */
export const isExternalUrl = (url?: string): boolean =>
  /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(url ?? '')

/** In-page anchor — never prefixed. */
export const isAnchorUrl = (url?: string): boolean => (url ?? '').startsWith('#')

/**
 * Resolves a link or an asset path against the site `base`.
 *
 * External URLs and anchors are returned untouched; `undefined` stays
 * `undefined` so it can be bound straight to an optional attribute.
 */
export function resolveUrl(url: string): string
export function resolveUrl(url: string | undefined): string | undefined
export function resolveUrl(url?: string): string | undefined {
  if (!url || isExternalUrl(url) || isAnchorUrl(url)) return url
  return withBase(url)
}

/** `_blank` for external links, `undefined` for local ones. */
export const externalTarget = (url?: string): '_blank' | undefined =>
  /^(?:https?:)?\/\//i.test(url ?? '') ? '_blank' : undefined
