import { stripExtension } from './string.ts'

/** `https://…`, `//…` or any other scheme (`mailto:`, `tel:`). */
export function isExternalUrl(url: string | null | undefined): boolean {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(url ?? '')
}

/** In-page anchor — never prefixed. */
export const isAnchorUrl = (url?: string): boolean =>
  (url ?? '').startsWith('#')

/**
 * URL schemes that are safe to render in `href`.
 *
 * Any other scheme (`javascript:`, `data:`, `vbscript:`, …) is stripped to
 * prevent XSS when the link source is a CMS or a semi-trusted author.
 */
const SAFE_SCHEMES = new Set(['http:', 'https:', 'mailto:', 'tel:'])

/**
 * Strips control characters and leading/trailing whitespace that browsers
 * remove before parsing `href` — without this, `java\nscript:alert(1)` would
 * bypass the scheme check because `isExternalUrl` sees `java\nscript:` as a
 * non-matching scheme while the browser executes it as `javascript:`.
 */
function normalizeForUrlCheck(url: string): string {
  return url.replace(/[\u0000-\u0020]/g, '').trim()
}

/** Returns `true` when the URL is external **and** uses a safe scheme. */
export const isSafeExternalUrl = (url?: string): boolean => {
  if (!isExternalUrl(url)) return false
  const normalized = normalizeForUrlCheck(url!)
  // Protocol-relative URLs (`//example.com`) are always safe.
  if (/^\/\//.test(normalized)) return true
  try {
    return SAFE_SCHEMES.has(new URL(normalized).protocol.toLowerCase())
  } catch {
    return false
  }
}

/** Returns the URL unchanged if it is safe, `undefined` if it is dangerous. */
export const sanitizeUrl = (url?: string): string | undefined => {
  if (!url) return url
  if (isAnchorUrl(url)) return url
  // Normalize before checking so browser-stripped control characters cannot
  // hide a dangerous scheme (e.g. `java\tscript:` → `javascript:`).
  const normalized = normalizeForUrlCheck(url)
  if (isExternalUrl(normalized)) return isSafeExternalUrl(normalized) ? normalized : undefined
  return url
}

/** `_blank` for external links, `undefined` for local ones. */
export const externalLinkTarget = (url?: string): '_blank' | undefined =>
  /^(?:https?:)?\/\//i.test(url ?? '') ? '_blank' : undefined

export function normalizeSiteUrl(siteUrl: string | null | undefined): string | undefined {
  if (typeof siteUrl !== 'string') return

  const trimmed = siteUrl.trim()
  if (!trimmed) return

  return trimmed.replace(/\/+$/, '')
}

export function makeAbsoluteUrl(
  siteUrl: string | null | undefined,
  rawUrl: string | null | undefined
): string | undefined {
  if (typeof rawUrl !== 'string') return

  const trimmed = rawUrl.trim()
  const normalizedSiteUrl = normalizeSiteUrl(siteUrl)

  if (!trimmed || !normalizedSiteUrl) return
  // Protocol-relative URLs must be normalized before the isExternalUrl check,
  // since isExternalUrl now matches `//` as well.
  if (trimmed.startsWith('//')) return `https:${trimmed}`
  if (isExternalUrl(trimmed)) return trimmed

  const baseUrl = `${normalizedSiteUrl}/`
  const relativeUrl = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed

  try {
    return new URL(relativeUrl, baseUrl).toString()
  } catch {
    return
  }
}

export function replaceRelativePathLocale(
  relativePath: string | null | undefined,
  localeIndex: string
): string | undefined {
  if (typeof relativePath !== 'string') return

  const segments = relativePath.split('/')
  if (segments.length < 2 || !segments[0]) return

  return [localeIndex, ...segments.slice(1)].join('/')
}

/**
 * Resolves URLs for multilingual sites by adding a language prefix to
 * internal links.
 */
export function resolveI18nHref(
  rawHref: string,
  localeIndex: string
): string {
  if (typeof rawHref !== 'string') {
    return rawHref === null || rawHref === undefined ? '' : String(rawHref).trim()
  }
  const trimmed = rawHref.trim()

  if (!trimmed) return rawHref
  // Main page
  if (trimmed === '/') return !localeIndex || localeIndex === 'root' ? '/' : '/' + localeIndex

  const isExternal = isExternalUrl(trimmed)

  if (isExternal) return trimmed
  // Already includes language prefix
  if (trimmed.startsWith('/')) return trimmed
  return `/${localeIndex}/${trimmed}`
}

/** Generates the full URL path from pageData.relativePath. */
export function generatePageUrlPath(relativePath: string): string {
  // Remove file extension
  const cleanPath = stripExtension(relativePath)

  // Remove trailing /index
  let finalPath = cleanPath.replace(/\/index$/, '')

  if (finalPath === 'index') finalPath = ''

  return finalPath
}

/**
 * Normalizes a URL path for safe comparison by stripping `.html` and
 * trailing slashes.
 */
export function normalizeUrlPath(url: string | null | undefined): string {
  if (typeof url !== 'string') return ''

  return url
    .replace(/\.html$/i, '')
    .replace(/\/+$/, '')
}
