import { mustacheTemplate } from '../utils/shared/index.ts'
import type { ExtendedPageData, ExtendedSiteConfig } from '../types.d.ts'

/**
 * If page.frontmatter.title is a template string, then replace it with the
 * template string.
 */
export function transformTitle(
  pageData: ExtendedPageData,
  { siteConfig }: { siteConfig: ExtendedSiteConfig }
): void {
  // Root-level files have no locale prefix, so there's no locale context to resolve template data.
  if (pageData.filePath.indexOf('/') < 0) return

  if (!pageData.frontmatter.title) return

  const localeIndex = pageData.filePath.split('/')[0]!

  const options = {
    theme: siteConfig.site?.locales?.[localeIndex]?.themeConfig,
    params: pageData.params || {},
  }

  pageData.frontmatter.title = mustacheTemplate(
    pageData.frontmatter.title,
    options,
    { eval: true }
  )
  pageData.title = pageData.frontmatter.title
}
