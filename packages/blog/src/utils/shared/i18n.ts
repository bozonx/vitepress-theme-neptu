import locales from '../../configs/blogLocalesBase/index.ts'
import type { I18n } from '../../types.d.ts'

type LocalesMap = Record<string, { t: I18n; [key: string]: unknown }>
const DEFAULT_LOCALE = 'en'

export function resolveBaseLocaleKey(
  localeIndex: string | undefined,
  map: Record<string, unknown>
): string {
  if (!localeIndex) return DEFAULT_LOCALE
  if (map[localeIndex]) return localeIndex

  const shortLocale = localeIndex.split('-')[0]
  if (shortLocale && map[shortLocale]) return shortLocale

  if (shortLocale === 'es' && map['es-419']) return 'es-419'
  if (shortLocale === 'zh' && map['zh-CN']) return 'zh-CN'
  if (shortLocale === 'zh' && map['zh-Hans']) return 'zh-Hans'

  return DEFAULT_LOCALE
}

export function resolveTranslationsByFilePath(filePath?: string): { t: I18n; [key: string]: unknown } {
  const map = locales as unknown as LocalesMap
  if (!filePath) return map[DEFAULT_LOCALE]

  const segments = filePath?.split('/').filter(Boolean) ?? []
  const localeIndex = segments[0] ?? ''

  return map[resolveBaseLocaleKey(localeIndex, map)]
}

/**
 * Select the correct plural form for a given count.
 * Supports English (2 forms) and Russian (3 forms) out of the box.
 */
export function pluralize(count: number, forms: string[]): string {
  const n = Math.abs(count)
  const len = forms.length

  if (len === 2) {
    return n === 1 ? forms[0] : forms[1]
  }

  if (len >= 3) {
    const lastTwo = n % 100
    if (lastTwo >= 11 && lastTwo <= 14) return forms[2]
    const lastDigit = n % 10
    if (lastDigit === 1) return forms[0]
    if (lastDigit >= 2 && lastDigit <= 4) return forms[1]
    return forms[2]
  }

  return forms[0] ?? ''
}
