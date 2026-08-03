/**
 * URL helpers for landing blocks and primitives.
 *
 * The shared URL safety helpers (`isExternalUrl`, `isAnchorUrl`,
 * `isSafeExternalUrl`, `sanitizeUrl`, `externalTarget`) live in the blog
 * package and are re-exported here so landing-only projects never reach across
 * packages. `resolveUrl` stays local because it depends on VitePress's
 * `withBase`, a runtime import that does not belong in the blog's shared
 * (client + node) utils.
 */
import { withBase } from 'vitepress'
import {
  isExternalUrl,
  isAnchorUrl,
  isSafeExternalUrl,
  sanitizeUrl,
  externalTarget,
} from 'vitepress-theme-neptu/utils'

export { isExternalUrl, isAnchorUrl, isSafeExternalUrl, sanitizeUrl, externalTarget }

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
