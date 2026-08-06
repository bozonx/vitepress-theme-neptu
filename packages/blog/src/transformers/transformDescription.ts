import { interpolateMustache } from '../utils/shared/index.ts'
import type { ExtendedPageData, ExtendedSiteConfig } from '../types.d.ts'

/**
 * Resolves the theme's dynamic-route description syntax before VitePress and
 * the excerpt fallback consume `pageData.description`.
 */
export function transformDescription(
  pageData: ExtendedPageData,
  { siteConfig }: { siteConfig: ExtendedSiteConfig }
): void {
  if (pageData.filePath.indexOf('/') < 0) return

  const description = pageData.frontmatter.description
  if (typeof description !== 'string' || !description.includes('{{')) return

  const localeIndex = pageData.filePath.split('/')[0]!
  const resolvedDescription = interpolateMustache(
    description,
    {
      theme: siteConfig.site?.locales?.[localeIndex]?.themeConfig,
      params: pageData.params || {},
    },
    { eval: true }
  )

  pageData.frontmatter.description = resolvedDescription
  pageData.description = resolvedDescription
}
