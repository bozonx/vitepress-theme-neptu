/** Safely parse a date string/number into a timestamp. Returns 0 for invalid values. */
export function safeGetTime(date: string | number | Date | null | undefined): number {
  if (!date) return 0
  const time = new Date(date).getTime()
  return Number.isFinite(time) ? time : 0
}

const EXCLUDED_WORDS = [
  'de', 'г', 'г.', 'of', 'van', 'der', 'den', 'del',
  'da', 'di', 'du', 'des', 'von', 'zu', 'zur',
  'the', 'a', 'an', 'in', 'on', 'at',
]

/** Determine whether a token represents a year. */
export function isYearToken(item: string): boolean {
  const cleanItem = item.replace(/[^\d]/g, '')
  return cleanItem.length === 4 && /^\d{4}$/.test(cleanItem)
}

/** Determine whether a token represents a month name. */
export function isMonthNameToken(item: string): boolean {
  const cleanItem = item.replace(/[^\p{L}\p{N}]/gu, '').toLowerCase()
  return (
    cleanItem.length >= 3 &&
    !EXCLUDED_WORDS.includes(cleanItem) &&
    /^[^\d.\-,\s]{3,}$/.test(item)
  )
}

const warnedInvalidTags = new Set<string>()

/**
 * `lang` reaches this module straight from user config (`_site.yaml`), where a
 * typo like `en_US` instead of `en-US` is easy to make. `toLocaleDateString`
 * answers a structurally invalid tag with a `RangeError`, which would abort the
 * whole SSR build over one character — so the tag is validated first and a bad
 * one degrades to the runtime default instead of throwing.
 *
 * A well-formed but unknown tag (`xx-YY`) is left alone: `Intl` resolves it to
 * its own fallback without complaining.
 */
function toValidLocaleTag(lang?: string): string | undefined {
  if (!lang) return undefined

  try {
    Intl.DateTimeFormat.supportedLocalesOf(lang)
    return lang
  } catch {
    if (!warnedInvalidTags.has(lang)) {
      warnedInvalidTags.add(lang)
      console.warn(
        `[neptu-blog] Invalid language tag "${lang}" — dates fall back to the ` +
          'default locale. Use an IETF tag such as `en-US`.'
      )
    }
    return undefined
  }
}

/** Resets the "invalid language tag" warning state. Used by tests. */
export function resetLocaleTagWarnings(): void {
  warnedInvalidTags.clear()
}

export function formatReadableDate(
  rawDate: string | number | Date | null | undefined,
  lang?: string,
  toTimeZone: string = 'UTC'
): string | undefined {
  if (!rawDate) return

  const date = new Date(rawDate)
  const time = date.getTime()
  if (!Number.isFinite(time)) return

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: toTimeZone,
  }

  try {
    return date.toLocaleDateString(toValidLocaleTag(lang), options)
  } catch {
    // An unsupported `timeZone` is the only remaining RangeError source. A
    // rendered post is worth more than a perfectly zoned date.
    return date.toLocaleDateString(toValidLocaleTag(lang), {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
}
