const NON_PATH_PREFIX = /^([a-z][a-z0-9+.-]*:|\/\/|#|\?)/i

/**
 * True when `value` is a path pointing at a file inside the content tree
 * (co-located media), rather than a site-root path or an external URL.
 *
 * With `allowBare` a path without a leading `./` (e.g. `media/cover.jpg`) also
 * counts. Use it for fields that can only ever hold a path, such as `cover`.
 */
export function isContentRelativePath(
  value: unknown,
  { allowBare = false }: { allowBare?: boolean } = {}
): value is string {
  if (typeof value !== 'string' || !value) return false
  if (value.startsWith('/') || NON_PATH_PREFIX.test(value)) return false
  if (value.startsWith('./') || value.startsWith('../')) return true

  return allowBare
}

/**
 * Turns a path relative to a Markdown file into a site-root path.
 *
 * `./media/cover.jpg` inside `ru/posts/my-article/index.md`
 * becomes `/ru/posts/my-article/media/cover.jpg`.
 *
 * Needed wherever the value is consumed away from its own page — list
 * previews, RSS items, `og:image`, JSON-LD — since a relative path would
 * otherwise resolve against whatever page is being rendered. Site-root
 * paths, external URLs and `data:` URIs are returned unchanged.
 */
export function resolveContentMediaPath(
  value: unknown,
  mdRelativePath: string | undefined,
  options: { allowBare?: boolean } = {}
): unknown {
  if (!mdRelativePath || !isContentRelativePath(value, options)) return value

  const mdDir = mdRelativePath.replace(/\\/g, '/').split('/').slice(0, -1)
  const segments: string[] = [...mdDir]

  for (const segment of value.replace(/\\/g, '/').split('/')) {
    if (!segment || segment === '.') continue
    else if (segment === '..') segments.pop()
    else segments.push(segment)
  }

  return '/' + segments.join('/')
}

/**
 * Encodes a URL by encoding individual path segments while preserving
 * the overall URL structure. Works for both absolute and relative URLs.
 */
export function encodeMediaUrl(url: string): string {
  if (!url) return url

  try {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const urlObj = new URL(url)
      urlObj.pathname = urlObj.pathname
        .split('/')
        .map((segment: string) => (segment ? encodeURIComponent(segment) : segment))
        .join('/')
      return urlObj.toString()
    }

    return url
      .split('/')
      .map((segment) => (segment ? encodeURIComponent(segment) : segment))
      .join('/')
  } catch {
    return url
  }
}

/**
 * Validates a URL for safe use in audio/video/download components.
 * Allows absolute URLs, relative paths, data: and blob: URIs.
 */
export function isValidMediaUrl(url: unknown): boolean {
  if (!url || typeof url !== 'string') {
    return false
  }

  try {
    new URL(url)
    return true
  } catch {
    if (url.startsWith('/')) {
      return true
    }

    const urlPattern = /^(https?:\/\/|\.\/|\/|data:|blob:)/i
    if (urlPattern.test(url)) {
      return true
    }

    // Relative paths: require at least one segment with a file extension
    // to avoid accepting arbitrary strings like "...." or "a.b" as media URLs
    if (/^[^/]+\.[a-z0-9]+$/i.test(url)) {
      return true
    }

    return false
  }
}

/**
 * Triggers a file download by creating a temporary `<a>` element.
 * Falls back to opening the URL in a new tab on error.
 */
export function downloadFile(url: string, filename: string): void {
  try {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.target = '_blank'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch {
    window.open(url, '_blank')
  }
}

/**
 * Extracts the filename from a URL, optionally falling back to a
 * default name when the URL has no recognizable filename segment.
 */
export function getLastPathSegment(url: string, fallback: string): string {
  return url.split('/').pop() || fallback
}

/**
 * Maps a `MediaError.code` to a human-readable i18n key from the
 * provided labels object. Returns the fallback message when the error
 * code is unrecognized or the error object is missing.
 */
export function getMediaErrorMessage(
  error: MediaError | null | undefined,
  labels: {
    aborted: string
    network: string
    decode: string
    notSupported: string
    unknown: string
  },
  fallback: string
): string {
  if (!error) return fallback

  switch (error.code) {
    case error.MEDIA_ERR_ABORTED:
      return labels.aborted
    case error.MEDIA_ERR_NETWORK:
      return labels.network
    case error.MEDIA_ERR_DECODE:
      return labels.decode
    case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
      return labels.notSupported
    default:
      return labels.unknown
  }
}

/** Normalised sidebar logo: one source per appearance plus its alt text. */
export interface ResolvedSidebarLogo {
  light: string
  dark: string
  alt: string
}

/**
 * Normalises `themeConfig.sidebar.logoSrc`, which accepts either a single path
 * used for both appearances or `{ light, dark }`.
 *
 * A missing side falls back to the other one, so a half-filled object still
 * renders a logo instead of a broken image.
 */
export function resolveSidebarLogo(
  value: unknown
): ResolvedSidebarLogo | undefined {
  if (typeof value === 'string') {
    return value ? { light: value, dark: value, alt: '' } : undefined
  }

  if (!value || typeof value !== 'object') return undefined

  const { light, dark, alt } = value as Record<string, unknown>
  const lightSrc = typeof light === 'string' ? light : ''
  const darkSrc = typeof dark === 'string' ? dark : ''

  if (!lightSrc && !darkSrc) return undefined

  return {
    light: lightSrc || darkSrc,
    dark: darkSrc || lightSrc,
    alt: typeof alt === 'string' ? alt : '',
  }
}
