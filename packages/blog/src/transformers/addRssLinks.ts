import type { HeadConfig } from 'vitepress'
import {
  getFeedUrl,
  getFeedFormatInfo,
  resolveRssFormats,
} from '../utils/node/index.ts'
import { resolveEffectiveSiteUrl } from '../utils/shared/url.ts'
import { isHomePage } from '../utils/shared/index.ts'

import type { ExtendedPageData, ExtendedSiteConfig } from '../types.d.ts'

export interface AddRssLinksContext {
  page: string
  head: HeadConfig[]
  pageData: ExtendedPageData
  siteConfig: ExtendedSiteConfig
}

/** Adds RSS feed links to the head of the home page */
export function addRssLinks({
  head,
  pageData,
  siteConfig,
}: AddRssLinksContext): void {
  if (pageData.frontmatter?.seo?.rssLinks === false) return

  if (!isHomePage(pageData.frontmatter)) return

  const rawSiteUrl = siteConfig.userConfig.siteUrl
  if (!rawSiteUrl) {
    console.warn(
      '[addRssLinks] siteUrl is not configured. RSS links were not added.'
    )
    return
  }

  const siteUrl = resolveEffectiveSiteUrl(rawSiteUrl, siteConfig.site.base)!
  const supportedLocales = Object.keys(siteConfig.site.locales)

  const rssFormats = resolveRssFormats(siteConfig)

  for (const locale of supportedLocales) {
    const localeConfig = siteConfig.site.locales[locale]
    if (!localeConfig) continue

    for (const format of rssFormats) {
      const feedUrl = getFeedUrl(siteUrl, locale, format)
      const formatInfo = getFeedFormatInfo(format)
      head.push([
        'link',
        {
          rel: 'alternate',
          type: formatInfo.mimeType,
          title: `${localeConfig.title} - ${formatInfo.title}`,
          href: feedUrl,
          hreflang: localeConfig.lang || locale,
        },
      ])
    }
  }
}
