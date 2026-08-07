import locales from '../../configs/blogLocalesBase/index.ts'
import type { I18nTranslations } from '../../types.d.ts'

type LocalesMap = Record<string, { t: I18nTranslations; [key: string]: unknown }>
const DEFAULT_LOCALE = 'en'

export function resolveBaseLocaleKey(
  localeIndex: string | undefined,
  map: Record<string, unknown>
): string {
  if (!localeIndex) return DEFAULT_LOCALE
  if (map[localeIndex]) return localeIndex

  const shortLocale = localeIndex.split('-')[0]
  if (shortLocale && map[shortLocale]) return shortLocale

  // Look for any regional variant of the short locale
  // (e.g., 'es' matches 'es-419', 'zh' matches 'zh-CN' or 'zh-Hans')
  for (const key of Object.keys(map)) {
    if (key.startsWith(shortLocale + '-')) return key
  }

  return DEFAULT_LOCALE
}

export function resolveTranslationsByFilePath(filePath?: string): { t: I18nTranslations; [key: string]: unknown } {
  const map = locales as unknown as LocalesMap
  // `DEFAULT_LOCALE` is always present in the bundled map, so it is the one
  // lookup that is safe to treat as total.
  const fallback = map[DEFAULT_LOCALE]!
  if (!filePath) return fallback

  const segments = filePath?.split('/').filter(Boolean) ?? []
  const localeIndex = segments[0] ?? ''

  return map[resolveBaseLocaleKey(localeIndex, map)] ?? fallback
}

/**
 * Select the correct plural form for a given count.
 * Supports English (2 forms) and Russian (3 forms) out of the box.
 */
export function pluralize(count: number, forms: string[]): string {
  const n = Math.abs(count)
  const len = forms.length

  // A caller can hand over a short list; falling back to the first form beats
  // rendering `undefined` next to a number.
  const form = (index: number): string => forms[index] ?? forms[0] ?? ''

  if (len === 2) {
    return n === 1 ? form(0) : form(1)
  }

  if (len >= 3) {
    const lastTwo = n % 100
    if (lastTwo >= 11 && lastTwo <= 14) return form(2)
    const lastDigit = n % 10
    if (lastDigit === 1) return form(0)
    if (lastDigit >= 2 && lastDigit <= 4) return form(1)
    return form(2)
  }

  return form(0)
}
