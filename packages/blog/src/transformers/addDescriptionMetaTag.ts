import type { HeadConfig } from 'vitepress'
import type { ExtendedPageData, ExtendedSiteConfig } from '../types.d.ts'

export interface AddDescriptionMetaTagContext {
  head: HeadConfig[]
  pageData: ExtendedPageData
  siteConfig: ExtendedSiteConfig
}

function normalizeText(value: unknown): string | undefined {
  if (typeof value !== 'string') return
  const normalized = value.trim()
  return normalized || undefined
}

/** Adds <meta name="description"> independently of OG settings. */
export function addDescriptionMetaTag({
  head,
  pageData,
  siteConfig,
}: AddDescriptionMetaTagContext): void {
  const filePath = pageData.filePath || ''
  const localeIndex = filePath.split('/')[0]
  const langConfig =
    localeIndex && filePath.includes('/')
      ? siteConfig.site.locales[localeIndex]
      : undefined

  const description =
    normalizeText(pageData.frontmatter?.description) ||
    normalizeText(pageData.description) ||
    (langConfig ? normalizeText(langConfig.description) : undefined)

  if (description) {
    head.push(['meta', { name: 'description', content: description }])
  }
}
