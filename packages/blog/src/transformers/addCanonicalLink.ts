import type { HeadConfig } from 'vitepress'
import {
  generatePageUrlPath,
  makeAbsoluteUrl,
  resolveEffectiveSiteUrl,
} from '../utils/shared/index.ts'
import { hasNoIndex } from '../utils/shared/head.ts'
import { resolveSeoSetting } from '../utils/shared/seo.ts'

import type { ExtendedPageData, ExtendedSiteConfig } from '../types.d.ts'

export interface AddCanonicalLinkContext {
  page: string
  head: HeadConfig[]
  pageData: ExtendedPageData
  siteConfig: ExtendedSiteConfig
}

function resolveCanonicalUrl(
  canonicalValue: unknown,
  page: string,
  siteConfig: ExtendedSiteConfig
): string | null {
  if (canonicalValue === 'self') {
    const siteUrl = resolveEffectiveSiteUrl(
      siteConfig.userConfig.siteUrl,
      siteConfig.site.base
    )
    if (!siteUrl) {
      console.warn(
        'Canonical link not added: siteUrl not configured in siteConfig'
      )
      return null
    }
    return makeAbsoluteUrl(siteUrl, generatePageUrlPath(page)) || null
  }

  if (typeof canonicalValue === 'string') {
    try {
      const trimmedCanonicalUrl = canonicalValue.trim()
      new URL(trimmedCanonicalUrl)
      return trimmedCanonicalUrl
    } catch {
      console.warn(`Invalid canonical URL in ${page}: ${canonicalValue}`)
      return null
    }
  }

  return null
}

/**
 * Adds a canonical link to the page head.
 *
 * `seo.canonical: false` in the page's own frontmatter emits nothing at all.
 * Otherwise an explicit `canonical` frontmatter value (an absolute URL or
 * `'self'`) is always honoured, and a page without one gets a self-canonical
 * unless `seo.canonical` is disabled for its locale or the site.
 */
export function addCanonicalLink({
  page,
  head,
  pageData,
  siteConfig,
}: AddCanonicalLinkContext): void {
  if (!page || page.indexOf('/') < 0) {
    return
  }

  if (!pageData?.frontmatter) return

  // A page opting out beats everything, including its own explicit URL.
  if (pageData.frontmatter.seo?.canonical === false) return

  // Skip noindex pages (e.g. drafts) so canonical is never emitted for them,
  // even when this transformer is called outside the default transformHead
  // pipeline.
  if (hasNoIndex(pageData.frontmatter?.head)) return

  try {
    const canonicalValue = pageData.frontmatter.canonical
    const autoEnabled =
      resolveSeoSetting('canonical', pageData, siteConfig) !== false

    let canonicalUrl: string | null = null

    if (canonicalValue) {
      canonicalUrl = resolveCanonicalUrl(canonicalValue, page, siteConfig)
    } else if (autoEnabled) {
      canonicalUrl = resolveCanonicalUrl('self', page, siteConfig)
    }

    if (canonicalUrl) {
      head.push(['link', { rel: 'canonical', href: canonicalUrl }])
    }
  } catch (error) {
    console.error(
      `Error adding canonical link for ${page}:`,
      (error as Error).message
    )
  }
}
