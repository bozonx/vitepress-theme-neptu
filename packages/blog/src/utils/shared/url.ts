import { pathTrimExt } from './string.ts'

export function isExternalUrl(url: string | null | undefined): boolean {
  return Boolean(url && url.match(/^[a-z\d]+:\/\//i))
}

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
  if (isExternalUrl(trimmed)) return trimmed
  if (trimmed.startsWith('//')) return `https:${trimmed}`

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
export function resolveI18Href(
  rawHref: string,
  localeIndex: string
): string {
  const trimmed = String(rawHref).trim()

  if (typeof rawHref !== 'string') return trimmed
  if (!trimmed) return rawHref
  // Main page
  else if (trimmed === '/') return '/' + localeIndex

  const isExternal = isExternalUrl(trimmed)

  if (isExternal) return trimmed
  // Already includes language prefix
  if (trimmed.indexOf('/') === 0) return trimmed
  // Add language prefix — insert a slash between localeIndex and trimmed.
  // Remove leading slash from trimmed to avoid double slashes.
  const cleanHref = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed
  return `/${localeIndex}/${cleanHref}`
}

/** Generates the full URL path from pageData.relativePath. */
export function generatePageUrlPath(relativePath: string): string {
  // Remove file extension
  const cleanPath = pathTrimExt(relativePath)

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
