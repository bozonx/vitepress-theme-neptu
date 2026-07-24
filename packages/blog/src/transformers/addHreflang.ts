import type { HeadConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import {
  generatePageUrlPath,
  getFrontmatterTranslations,
  makeAbsoluteUrl,
  normalizeSiteUrl,
  pickExistingTranslationRelativePath,
  resolveTranslationRelativePathCandidates,
} from '../utils/shared/index.ts'
import type {
  ExtendedPageData,
  ExtendedSiteConfig,
  LocaleDefinition,
} from '../types.d.ts'

export interface AddHreflangContext {
  head: HeadConfig[]
  pageData?: ExtendedPageData
  siteConfig: ExtendedSiteConfig
}

/** Adds hreflang link tags to the page head for multilingual SEO. */
export function addHreflang({
  head,
  pageData,
  siteConfig,
}: AddHreflangContext): void {
  if (pageData?.frontmatter?.seo?.hreflang === false) return

  const siteUrl = normalizeSiteUrl(siteConfig.userConfig.siteUrl)
  if (!siteUrl || !pageData) return

  const locales = siteConfig.site.locales
  if (!locales || Object.keys(locales).length <= 1) return

  const relativePath = pageData.relativePath
  const srcDir = siteConfig.srcDir
  const translations = getFrontmatterTranslations(pageData.frontmatter)

  const alternates = Object.entries(locales).flatMap(([code, locale]) => {
    const localeRelativePath = pickExistingTranslationRelativePath(
      resolveTranslationRelativePathCandidates(
        relativePath,
        code,
        translations
      ),
      {
        fileExists: srcDir
          ? (candidate) => fs.existsSync(path.join(srcDir, candidate))
          : undefined,
      }
    )
    if (!localeRelativePath) return []

    const url = makeAbsoluteUrl(
      siteUrl,
      generatePageUrlPath(localeRelativePath)
    )
    if (!url) return []

    const lang = (locale as LocaleDefinition).lang || code

    return [
      {
        code,
        tag: [
          'link',
          { rel: 'alternate', hreflang: lang, href: url },
        ] as HeadConfig,
      },
    ]
  })

  if (alternates.length <= 1) return

  const defaultAlternate =
    alternates.find(
      (alternate) => alternate.code === Object.keys(locales)[0]
    ) || alternates[0]

  head.push(...alternates.map((alternate) => alternate.tag), [
    'link',
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: defaultAlternate.tag[1].href,
    },
  ])
}
