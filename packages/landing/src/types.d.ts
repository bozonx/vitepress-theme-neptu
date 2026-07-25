/// <reference types="vite/client" />
import type { Theme } from 'vitepress'
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
} from 'vitepress-theme-neptu-blog'

export type {
  Author,
  BlogUserConfig,
  DeepPartial,
  ExtendedPageData,
  ExtendedSiteConfig,
  I18n,
  LocaleDefinition,
  SeoConfig,
  ThemeConfig,
}

/**
 * User config for the landing theme. Structurally identical to
 * {@link BlogUserConfig} — the landing reuses the blog's utilities,
 * transformers, and YAML loading pipeline. Blog-specific themeConfig
 * fields (perPage, postList, popularPosts, feeds, …) are all optional
 * and simply ignored by the landing layout.
 */
export type LandingUserConfig = BlogUserConfig

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
  themeConfig: Partial<ThemeConfig> & {
    seo: NonNullable<ThemeConfig['seo']>
    t: I18n
  }
  vite: NonNullable<LandingUserConfig['vite']> & {
    ssr: NonNullable<NonNullable<LandingUserConfig['vite']>['ssr']>
  }
}

declare const theme: Theme
export default theme
