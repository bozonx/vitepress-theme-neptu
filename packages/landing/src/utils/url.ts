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
 * URL schemes that are safe to render in `href`.
 *
 * Any other scheme (`javascript:`, `data:`, `vbscript:`, …) is stripped to
 * prevent XSS when the link source is a CMS or a semi-trusted author.
 */
const SAFE_SCHEMES = new Set(['http:', 'https:', 'mailto:', 'tel:'])

/** Returns `true` when the URL is external **and** uses a safe scheme. */
export const isSafeExternalUrl = (url?: string): boolean => {
  if (!isExternalUrl(url)) return false
  // Protocol-relative URLs (`//example.com`) are always safe.
  if (/^\/\//.test(url!)) return true
  try {
    return SAFE_SCHEMES.has(new URL(url!).protocol.toLowerCase())
  } catch {
    return false
  }
}

/** Returns the URL unchanged if it is safe, `undefined` if it is dangerous. */
export const sanitizeUrl = (url?: string): string | undefined => {
  if (!url) return url
  if (isAnchorUrl(url)) return url
  if (isExternalUrl(url)) return isSafeExternalUrl(url) ? url : undefined
  return url
}

/**
 * Resolves a link or an asset path against the site `base`.
 *
 * External URLs and anchors are returned untouched; `undefined` stays
 * `undefined` so it can be bound straight to an optional attribute.
 * Dangerous schemes (`javascript:`, `data:`, …) are stripped to `undefined`.
 */
export function resolveUrl(url: string): string
export function resolveUrl(url: string | undefined): string | undefined
export function resolveUrl(url?: string): string | undefined {
  const safe = sanitizeUrl(url)
  if (!safe || isExternalUrl(safe) || isAnchorUrl(safe)) return safe
  return withBase(safe)
}

/** `_blank` for external links, `undefined` for local ones. */
export const externalTarget = (url?: string): '_blank' | undefined =>
  /^(?:https?:)?\/\//i.test(url ?? '') ? '_blank' : undefined
