/// <reference types="vite/client" />
import type { DefaultTheme, Theme } from 'vitepress'
import type {
  BlogUserConfig,
  ThemeConfig,
  I18nTranslations,
  SeoConfig,
  DeepPartial,
  Author,
  LocaleDefinition,
  ExtendedPageData,
  ExtendedSiteConfig,
} from 'vitepress-theme-neptu'

export type {
  Author,
  BlogUserConfig,
  DeepPartial,
  ExtendedPageData,
  ExtendedSiteConfig,
  I18nTranslations,
  LocaleDefinition,
  SeoConfig,
  ThemeConfig,
}

/**
 * Chrome-related options owned by the VitePress default theme, which the
 * landing builds on. Their blog counterparts (`nav`, `sidebar`, `footer`, …)
 * have a different shape, so the default theme's types win for these keys.
 */
export type LandingChromeConfig = Pick<
  DefaultTheme.Config,
  | 'nav'
  | 'sidebar'
  | 'outline'
  | 'aside'
  | 'carbonAds'
  | 'editLink'
  | 'lastUpdated'
  | 'docFooter'
  | 'footer'
  | 'socialLinks'
  | 'logo'
  | 'siteTitle'
  | 'darkModeSwitchLabel'
  | 'sidebarMenuLabel'
  | 'returnToTopLabel'
  | 'langMenuLabel'
  | 'notFound'
  | 'search'
>

/**
 * `themeConfig` of the landing theme — the blog's config plus the default
 * theme's chrome options.
 *
 * The two theme axes (`defaultColorTheme` / `defaultStylePreset` and the
 * `colorPicker` / `stylePicker` flags) are inherited from `ThemeConfig`: both
 * packages share one set of names.
 */
export type LandingThemeConfig = Partial<
  Omit<ThemeConfig, 't' | keyof LandingChromeConfig>
> &
  Partial<LandingChromeConfig> & {
  /** Hero image URL shown on the home page. */
  heroImage?: string
  t?: DeepPartial<I18nTranslations>
}

/**
 * User config for the landing theme. Structurally identical to
 * {@link BlogUserConfig} — the landing reuses the blog's utilities,
 * transformers, and YAML loading pipeline. Blog-specific themeConfig
 * fields (perPage, postList, popularPosts, feeds, …) are all optional
 * and simply ignored by the landing layout.
 */
export type LandingUserConfig = Omit<BlogUserConfig, 'themeConfig'> & {
  themeConfig?: LandingThemeConfig
}

/**
 * Fully resolved config returned by {@link mergeLandingConfig} and
 * {@link defineLandingConfig}. All optional arrays/objects are guaranteed
 * to be present.
 */
export type ResolvedLandingConfig = LandingUserConfig & {
  head: NonNullable<LandingUserConfig['head']>
  locales: NonNullable<LandingUserConfig['locales']>
  markdown: NonNullable<LandingUserConfig['markdown']> & {
    image: NonNullable<NonNullable<LandingUserConfig['markdown']>['image']>
  }
  sitemap: NonNullable<LandingUserConfig['sitemap']> & {
    transformItems: NonNullable<
      NonNullable<LandingUserConfig['sitemap']>['transformItems']
    >
  }
  themeConfig: LandingThemeConfig & {
    seo: NonNullable<ThemeConfig['seo']>
    t: I18nTranslations
  }
  vite: NonNullable<LandingUserConfig['vite']> & {
    ssr: NonNullable<NonNullable<LandingUserConfig['vite']>['ssr']>
  }
}

declare const theme: Theme
export default theme
