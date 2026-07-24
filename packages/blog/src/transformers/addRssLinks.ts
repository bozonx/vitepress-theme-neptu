import type { HeadConfig } from 'vitepress'
import {
  getFeedUrl,
  getFormatInfo,
  getRssFormats,
  normalizeSiteUrl,
} from '../utils/node/index.ts'
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
  if (pageData.frontmatter?.seo?.rss === false) return

  if (!isHomePage(pageData.frontmatter)) return

  const rawSiteUrl = siteConfig.userConfig.siteUrl
  if (!rawSiteUrl) {
    console.warn(
      '[addRssLinks] siteUrl is not configured. RSS links were not added.'
    )
    return
  }

  const siteUrl = normalizeSiteUrl(rawSiteUrl)
  const supportedLocales = Object.keys(siteConfig.site.locales)

  const rssFormats = getRssFormats(siteConfig)

  for (const locale of supportedLocales) {
    const localeConfig = siteConfig.site.locales[locale]

    for (const format of rssFormats) {
      const feedUrl = getFeedUrl(siteUrl, locale, format)
      const formatInfo = getFormatInfo(format)
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
