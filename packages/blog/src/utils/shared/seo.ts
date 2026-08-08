import type {
  ExtendedPageData,
  ExtendedSiteConfig,
  SeoConfig,
  ThemeConfig,
} from '../../types.d.ts'

/**
 * Resolves a single `seo.*` setting through the one shared layer order:
 * page frontmatter → locale `themeConfig` → root `themeConfig`.
 *
 * The keys of `frontmatter.seo` are exactly the keys of `themeConfig.seo` and
 * mean the same thing at every layer, so a page always wins over its locale
 * and a locale always wins over the site.
 */
export function resolveSeoSetting<K extends keyof SeoConfig>(
  key: K,
  pageData: ExtendedPageData | undefined,
  siteConfig: ExtendedSiteConfig
): SeoConfig[K] | undefined {
  const pageValue = pageData?.frontmatter?.seo?.[key]
  if (pageValue !== undefined) return pageValue

  const localeIndex = pageData?.filePath?.split('/')[0]
  const localeThemeConfig = localeIndex
    ? (siteConfig.site?.locales?.[localeIndex]?.themeConfig as
        | ThemeConfig
        | undefined)
    : undefined

  const localeValue = localeThemeConfig?.seo?.[key]
  if (localeValue !== undefined) return localeValue

  return siteConfig.userConfig?.themeConfig?.seo?.[key]
}

/**
 * Whether an SEO feature is enabled for a page. Every feature is on unless a
 * layer explicitly sets it to `false`.
 */
export function isSeoEnabled(
  key: keyof SeoConfig,
  pageData: ExtendedPageData | undefined,
  siteConfig: ExtendedSiteConfig
): boolean {
  return resolveSeoSetting(key, pageData, siteConfig) !== false
}
