/// <reference types="vite/client" />
import type { DefaultTheme, Theme } from 'vitepress'
import type {
  BlogUserConfig,
  ThemeConfig,
  I18n,
  SeoConfig,
  DeepPartial,
  Author,
  LocaleDefinition,
  ExtendedPageData,
  ExtendedSiteConfig,
  PagefindUITranslations,
} from 'vitepress-theme-neptu-blog'

export type {
  Author,
  BlogUserConfig,
  DeepPartial,
  ExtendedPageData,
  ExtendedSiteConfig,
  I18n,
  LocaleDefinition,
  PagefindUITranslations,
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
>

/**
 * `themeConfig` of the landing theme — the blog's config, the default theme's
 * chrome options, plus the two theme-axis defaults used by the landing.
 */
export type LandingThemeConfig = Partial<
  Omit<ThemeConfig, 't' | keyof LandingChromeConfig>
> &
  Partial<LandingChromeConfig> & {
  t?: DeepPartial<I18n>
  /**
   * Color theme applied when the visitor has no saved preference: `blue`,
   * `green`, `purple`, `amber`, `teal`, `rose`, `magenta`, `monochrome`, or the
   * id of your own preset.
   */
  defaultColorTheme?: string
  /**
   * Style preset applied when the visitor has no saved preference: `soft`,
   * `sharp`, `brutal`, `glass`, `editorial`, or the id of your own preset.
   */
  defaultLandingStyle?: string
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
    t: I18n
  }
  vite: NonNullable<LandingUserConfig['vite']> & {
    ssr: NonNullable<NonNullable<LandingUserConfig['vite']>['ssr']>
  }
}

declare const theme: Theme
export default theme
