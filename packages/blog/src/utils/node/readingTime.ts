import { stripMd } from './markdown.ts'
import {
  countWords,
  estimateReadingMinutes,
  DEFAULT_READING_WPM,
} from '../shared/readingTime.ts'

export interface ContentMetrics {
  wordCount: number
  /** Estimated reading time in whole minutes. */
  readingTime: number
}

/**
 * Fenced and indented code, inline code and raw HTML are removed before
 * counting: a long config listing is scrolled past, not read, and letting it
 * inflate the estimate is the most common complaint about naive word counters.
 */
function stripNonProse(content: string): string {
  return content
    .replace(/^```[\s\S]*?^```/gm, ' ')
    .replace(/^~~~[\s\S]*?^~~~/gm, ' ')
    .replace(/`[^`\n]*`/g, ' ')
    .replace(/<[^>]+>/g, ' ')
}

/** Counts words and estimates reading time for a markdown body. */
export function measureMarkdown(
  content: string | null | undefined,
  wpm: number = DEFAULT_READING_WPM
): ContentMetrics {
  if (!content) return { wordCount: 0, readingTime: 0 }

  const plain = stripMd(stripNonProse(content))
  const wordCount = countWords(plain)

  return { wordCount, readingTime: estimateReadingMinutes(wordCount, wpm) }
}
