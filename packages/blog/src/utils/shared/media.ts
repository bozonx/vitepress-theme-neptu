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

    if (url.includes('.') && url.length > 3) {
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
export function extractFilenameFromUrl(url: string, fallback: string): string {
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
