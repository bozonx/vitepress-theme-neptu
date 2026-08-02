import fs from 'node:fs'
import path from 'node:path'

import { DEFAULT_ENCODE } from '../constants.ts'
import { isPost } from '../utils/shared/page.ts'
import { parseMdFile } from '../utils/node/markdown.ts'
import { measureMarkdown } from '../utils/node/readingTime.ts'
import { DEFAULT_READING_WPM } from '../utils/shared/readingTime.ts'
import type {
  ExtendedPageData,
  ExtendedSiteConfig,
  ReadingTimeConfig,
} from '../types.d.ts'

export interface AddReadingTimeOptions {
  siteConfig: ExtendedSiteConfig
  readingTime?: ReadingTimeConfig | null
}

/**
 * Puts `wordCount` and `readingTime` on the post's own page data.
 *
 * List items get these from `makePreviewItem`, but a post page is rendered
 * from `pageData`, which never carries the markdown body. The source file is
 * read once more here so both surfaces agree on the numbers, and so the SEO
 * transformers can emit `wordCount` / `timeRequired` without a second pass.
 */
export function addReadingTime(
  pageData: ExtendedPageData,
  options: AddReadingTimeOptions
): void {
  const { siteConfig, readingTime: config } = options

  if (config?.enabled === false) return
  if (!isPost(pageData.frontmatter)) return
  if (!pageData.filePath) return

  const srcDir = siteConfig.srcDir

  if (!srcDir) return

  try {
    const raw = fs.readFileSync(
      path.join(srcDir, pageData.filePath),
      DEFAULT_ENCODE
    )
    const { content } = parseMdFile(raw, pageData.filePath)
    const metrics = measureMarkdown(content, config?.wpm ?? DEFAULT_READING_WPM)

    pageData.wordCount = metrics.wordCount
    pageData.readingTime = metrics.readingTime
  } catch {
    // A missing or unreadable source file is not worth failing a build over —
    // the badge and the JSON-LD properties are simply omitted.
  }
}
