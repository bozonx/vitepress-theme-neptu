import fs from 'node:fs'
import path from 'node:path'

import { DEFAULT_ENCODE } from '../constants.ts'
import { isPost, isPage } from '../utils/shared/index.ts'
import { extractDescriptionFromMd } from '../utils/node/index.ts'
import type { ExtendedPageData, ExtendedSiteConfig } from '../types.d.ts'

/**
 * If description = "" in frontmatter, set description from content for posts
 * and pages.
 *
 * @param readFile — optional file reader for dependency injection in tests.
 */
export function resolveDescription(
  pageData: ExtendedPageData,
  { siteConfig }: { siteConfig: ExtendedSiteConfig },
  readFile: (filePath: string) => string = (filePath) => fs.readFileSync(filePath, DEFAULT_ENCODE)
): void {
  if (!isPost(pageData.frontmatter) && !isPage(pageData.frontmatter)) return

  const description = (pageData.frontmatter.description as string)?.trim() || ''
  if (description) {
    pageData.description = description
    return
  }

  try {
    if (!siteConfig.srcDir) return

    const rawContent = readFile(path.join(siteConfig.srcDir, pageData.filePath))

    pageData.description = extractDescriptionFromMd(
      rawContent,
      siteConfig.userConfig.themeConfig?.seo?.maxDescriptionLength || 300,
      undefined,
      pageData.filePath
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.warn(
      `Failed to resolve description for ${pageData.filePath}:`,
      message
    )
  }
}
