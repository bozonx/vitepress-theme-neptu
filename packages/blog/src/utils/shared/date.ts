const EXCLUDED_WORDS = [
  'de', 'г', 'г.', 'of', 'van', 'der', 'den', 'del',
  'da', 'di', 'du', 'des', 'von', 'zu', 'zur',
  'the', 'a', 'an', 'in', 'on', 'at', 'word-break',
]

/** Determine whether a token represents a year. */
export function isYear(item: string): boolean {
  const cleanItem = item.replace(/[^\d]/g, '')
  return cleanItem.length === 4 && /^\d{4}$/.test(cleanItem)
}

/** Determine whether a token represents a month name. */
export function isMonth(item: string): boolean {
  const cleanItem = item.replace(/[^\wа-яё]/gi, '').toLowerCase()
  return (
    cleanItem.length >= 3 &&
    !EXCLUDED_WORDS.includes(cleanItem) &&
    /^[^\d.\-,]{3,}$/.test(item)
  )
}

export function makeHumanDate(
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
