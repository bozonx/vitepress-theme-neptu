import { interpolateMustache } from '../utils/shared/index.ts'
import type { ExtendedPageData, ExtendedSiteConfig } from '../types.d.ts'

/**
 * Resolve the theme's dynamic-route title syntax. Static titles are left to
 * VitePress so its native Markdown-to-text title inference remains intact.
 */
export function transformTitle(
  pageData: ExtendedPageData,
  { siteConfig }: { siteConfig: ExtendedSiteConfig }
): void {
  // Root-level files have no locale prefix, so there's no locale context to resolve template data.
  if (pageData.filePath.indexOf('/') < 0) return

  const title = pageData.frontmatter.title
  if (typeof title !== 'string' || !title.includes('{{')) return

  const localeIndex = pageData.filePath.split('/')[0]!

  const options = {
    theme: siteConfig.site?.locales?.[localeIndex]?.themeConfig,
    params: pageData.params || {},
  }

  const resolvedTitle = interpolateMustache(
    title,
    options,
    { eval: true }
  )
  pageData.frontmatter.title = resolvedTitle
  pageData.title = resolvedTitle
}
