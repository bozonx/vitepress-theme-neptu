/** Safely parse a date string/number into a timestamp. Returns 0 for invalid values. */
export function safeGetTime(date: string | number | Date | null | undefined): number {
  if (!date) return 0
  const time = new Date(date).getTime()
  return Number.isFinite(time) ? time : 0
}

const EXCLUDED_WORDS = [
  'de', 'г', 'г.', 'of', 'van', 'der', 'den', 'del',
  'da', 'di', 'du', 'des', 'von', 'zu', 'zur',
  'the', 'a', 'an', 'in', 'on', 'at', 'word-break',
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
    /^[^\d.\-,]{3,}$/.test(item)
  )
}

export function formatReadableDate(
  rawDate: string | number | Date | null | undefined,
  lang?: string,
  toTimeZone: string = 'UTC'
): string | undefined {
  if (!rawDate) return

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: toTimeZone,
  }

  return new Date(rawDate).toLocaleDateString(lang, options)
}
