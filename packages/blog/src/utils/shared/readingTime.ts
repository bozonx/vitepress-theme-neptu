/**
 * Word counting and reading-time estimation.
 *
 * Both are computed at build time from the markdown source and travel with the
 * post (`wordCount` / `readingTime` on `PostLite` and on `pageData`), so no
 * client-side measuring happens.
 */

import { isHomePage, resolveLayoutKey } from './page.ts'
import type { PostFrontmatter, ThemeConfig } from '../../types.d.ts'

/** Words per minute assumed for an average reader of latin-script prose. */
export const DEFAULT_READING_WPM = 200

/**
 * Layouts that show the reading-time badge unless
 * `themeConfig.readingTime.layouts` says otherwise. Posts only: listing pages
 * have no prose of their own.
 */
export const DEFAULT_READING_TIME_LAYOUTS = ['post']

/**
 * CJK ranges (hiragana/katakana, CJK ideographs, hangul). These scripts are
 * written without spaces, so whitespace splitting would count a whole sentence
 * as a single word. Each character is counted on its own instead.
 */
const CJK_REGEXP =
  /[぀-ヿ㐀-䶿一-鿿豈-﫿ｦ-ﾟ가-힯]/g

/**
 * A CJK character carries more meaning than a latin word, so reading is slower
 * per character than per word. The usual approximation is ~2.4 characters per
 * "word" of equivalent reading effort; 2 keeps the arithmetic simple and errs
 * towards a slightly longer estimate.
 */
const CJK_CHARS_PER_WORD = 2

/**
 * Counts words in a plain-text string (markdown syntax is expected to be
 * stripped by the caller).
 */
export function countWords(text: string | null | undefined): number {
  if (!text) return 0

  const cjkMatches = text.match(CJK_REGEXP)
  const cjkCount = cjkMatches?.length ?? 0
  const withoutCjk = cjkCount ? text.replace(CJK_REGEXP, ' ') : text
  const latinCount = withoutCjk
    .split(/\s+/)
    .filter((token) => /[\p{L}\p{N}]/u.test(token)).length

  return latinCount + Math.round(cjkCount / CJK_CHARS_PER_WORD)
}

/**
 * Reading time in whole minutes. Never returns 0 for a non-empty text — a
 * "0 min read" badge reads like a bug.
 */
export function estimateReadingMinutes(
  wordCount: number,
  wpm: number = DEFAULT_READING_WPM
): number {
  if (!Number.isFinite(wordCount) || wordCount <= 0) return 0

  const safeWpm = Number.isFinite(wpm) && wpm > 0 ? wpm : DEFAULT_READING_WPM

  return Math.max(1, Math.round(wordCount / safeWpm))
}

/**
 * Whether the reading-time badge belongs on the current page.
 * Frontmatter `readingTime` wins over `themeConfig.readingTime.layouts`.
 */
export function isReadingTimeEnabled(
  theme: ThemeConfig | null | undefined,
  frontmatter: PostFrontmatter | null | undefined
): boolean {
  if (isHomePage(frontmatter)) return false
  if (theme?.readingTime?.enabled === false) return false
  if (typeof frontmatter?.readingTime === 'boolean') return frontmatter.readingTime

  const layouts = theme?.readingTime?.layouts ?? DEFAULT_READING_TIME_LAYOUTS

  return layouts.includes(resolveLayoutKey(frontmatter))
}

/**
 * Formats minutes as an ISO 8601 duration for schema.org `timeRequired`.
 * Returns `undefined` for a zero/invalid duration so the property can be
 * omitted from the JSON-LD payload entirely.
 */
export function toIsoDuration(minutes: number): string | undefined {
  if (!Number.isFinite(minutes) || minutes <= 0) return undefined

  return `PT${Math.round(minutes)}M`
}
