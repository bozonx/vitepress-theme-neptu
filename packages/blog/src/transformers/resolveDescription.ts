import fs from 'node:fs'
import path from 'node:path'

import { DEFAULT_ENCODING } from '../constants.ts'
import { isPost, isPage } from '../utils/shared/index.ts'
import { extractDescriptionFromMd } from '../utils/node/index.ts'
import type { ExtendedPageData, ExtendedSiteConfig } from '../types.d.ts'

/**
 * Preserve VitePress's resolved page description (frontmatter.description or
 * frontmatter.head) and generate an excerpt only when it is absent.
 *
 * @param readFile — optional file reader for dependency injection in tests.
 */
export function resolveDescription(
  pageData: ExtendedPageData,
  { siteConfig }: { siteConfig: ExtendedSiteConfig },
  readFile: (filePath: string) => string = (filePath) => fs.readFileSync(filePath, DEFAULT_ENCODING)
): void {
  const existingDescription =
    typeof pageData.description === 'string' ? pageData.description.trim() : ''
  if (existingDescription) {
    pageData.description = existingDescription
    return
  }

  if (!isPost(pageData.frontmatter) && !isPage(pageData.frontmatter)) return

  try {
    if (!siteConfig.srcDir) return

    const rawContent = readFile(path.join(siteConfig.srcDir, pageData.filePath))

    const localeIndex = pageData.filePath.split('/')[0]
    const localeTheme = localeIndex
      ? siteConfig.site?.locales?.[localeIndex]?.themeConfig
      : undefined
    const configuredMaxLength = Number(localeTheme?.seo?.maxDescriptionLength)
    const fallbackMaxLength = Number(
      siteConfig.userConfig.themeConfig?.seo?.maxDescriptionLength
    )
    const maxDescriptionLength =
      Number.isFinite(configuredMaxLength) && configuredMaxLength >= 0
        ? configuredMaxLength
        : Number.isFinite(fallbackMaxLength) && fallbackMaxLength >= 0
          ? fallbackMaxLength
          : 300

    pageData.description = extractDescriptionFromMd(
      rawContent,
      maxDescriptionLength,
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
