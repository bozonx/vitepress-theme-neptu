import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineBlogConfig } from 'vitepress-theme-neptu-blog/configs'
import type { BlogUserConfig, ThemeConfig } from 'vitepress-theme-neptu-blog'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// =============================================================================
// Developer-level Constants & Dynamic Integrations
//
// In vitepress-theme-neptu-blog, configuration is layered:
//   1. Developer Layer (.vitepress/config.ts) — secrets, env vars, dynamic hooks
//   2. Admin Layer (src/site.yaml & src/<locale>/_site.yaml) — pure presentation, nav, sidebar
// =============================================================================

/** Number of posts rendered per pagination page. */
export const PER_PAGE = 15

/**
 * Build-time post preview options.
 * `maxPreviewLength` is used by data loaders at build time.
 */
export const postList = {
  maxPreviewLength: 300,
}

/**
 * Popular posts via Google Analytics 4 (GA4).
 * Reads GA_PROPERTY_ID and GA_CREDENTIALS_JSON environment variables.
 */
export const popularPosts = {
  enabled: Boolean(
    process.env.GA_PROPERTY_ID && process.env.GA_CREDENTIALS_JSON
  ),
  sortBy: 'pageviews', // 'pageviews' | 'uniquePageviews' | 'avgTimeOnPage'
  dataSource: {
    provider: 'ga4' as const,
    propertyId: process.env.GA_PROPERTY_ID,
    credentialsJson: process.env.GA_CREDENTIALS_JSON,
    // dataPeriodDays: 30,  // days of GA data to fetch (default: 30)
    // dataLimit: 1000,     // max posts returned from GA (default: 1000)
  },
} satisfies NonNullable<ThemeConfig['popularPosts']>

export default async () => {
  const base = process.env.VITEPRESS_BASE || '/'

  const config: BlogUserConfig = {
    // -------------------------------------------------------------------------
    // VitePress & Core Site Options
    // -------------------------------------------------------------------------

    /** Root directory containing markdown content and YAML config layers. */
    srcDir: path.resolve(__dirname, '../'),

    /** Base public URL path (e.g. '/blog/' if hosted in a subfolder). */
    base,

    /**
     * Absolute public site URL (no trailing slash).
     * Used for canonical links, sitemap, RSS/Atom feeds, OpenGraph, JSON-LD, hreflang.
     */
    siteUrl: process.env.SITE_URL || 'https://example.com',

    /** Head meta tags and external asset links injected into HTML `<head>`. */
    head: [
      ['meta', { name: 'format-detection', content: 'telephone=no' }],

      // Pagefind search UI stylesheets & scripts (built during production build)
      ['link', { rel: 'stylesheet', href: `${base}/pagefind/pagefind-ui.css`.replace(/\/+/g, '/') }],
      ['script', { src: `${base}/pagefind/pagefind-ui.js`.replace(/\/+/g, '/') }],

      // Example: Google Analytics 4 tracking script injection
      // ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX' }],
      // ['script', {}, `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-XXXXXXXXXX');`],
    ],

    // -------------------------------------------------------------------------
    // Vite & Markdown Options (Optional Customizations)
    // -------------------------------------------------------------------------

    // vite: {
    //   plugins: [],
    // },
    // markdown: {
    //   lineNumbers: true,
    // },

    // -------------------------------------------------------------------------
    // Custom VitePress Lifecycle Hooks (Extending Theme Transformers)
    // -------------------------------------------------------------------------

    // async transformPageData(pageData, ctx) {
    //   pageData.frontmatter.customField = 'value'
    // },
    // async transformHead(ctx) {
    //   return [['meta', { name: 'custom', content: 'value' }]]
    // },
    // async buildEnd(siteConfig) {
    //   // Custom post-build logic
    // },

    // -------------------------------------------------------------------------
    // Theme Configuration (`themeConfig`)
    //
    // Note: Admin-editable presentation (nav, sidebar, footer, social shares, icons,
    // authors) belongs in `src/site.yaml` or `src/<locale>/_site.yaml`.
    // Keep this block focused on code-bound, environment-driven settings.
    // -------------------------------------------------------------------------
    themeConfig: {
      /** Repository link — used for edit-links and referenced in site.yaml via `${theme.repo}`. */
      repo: 'https://github.com/your-username/my-blog',

      /** Posts rendered per page. */
      perPage: PER_PAGE,

      /** Search provider integration (Pagefind). */
      search: {
        provider: 'pagefind',
        options: {
          bodyMarker: 'data-pagefind-body',
        },
      },

      /** Popular posts metrics configuration (GA4). */
      popularPosts,

      /** Max tags count displayed in sidebar tag cloud widget. */
      // sidebarTagsCount: 20,

      /** Number of similar posts to display in post footer. */
      // similarPostsCount: 5,

      /**
       * RSS / Atom feed output settings.
       */
      // feeds: {
      //   maxPosts: 50,
      //   formats: ['rss', 'atom'],
      // },

      /**
       * Default post list display parameters (can be overridden in site.yaml).
       */
      // postList: {
      //   showDate: true,
      //   showTags: true,
      //   showThumbnail: true,
      //   showPreview: true,
      //   showAuthor: true,
      //   maxPreviewLength: 300,
      // },

      /**
       * Ordered array of post footer feature blocks.
       * Supported keys: 'author', 'donate', 'comments', 'social-share', 'edit-link', 'tags', 'similar', 'popular-link'.
       * Omit any key to hide that block, or reorder them.
       */
      // postFooter: [
      //   'author',
      //   'donate',
      //   'comments',
      //   'social-share',
      //   'edit-link',
      //   'tags',
      //   'similar',
      //   'popular-link',
      // ],

      /**
       * SEO metadata & OpenGraph defaults.
       */
      // seo: {
      //   ogImage: '/images/og-default.png',
      //   twitterCard: 'summary_large_image',
      // },

      /**
       * Global i18n label overrides (merged over theme defaults).
       * Per-locale translation overrides belong in `src/<locale>/_site.yaml` under `themeConfig.t`.
       */
      // t: {
      //   popularPosts: 'Popular Articles',
      // },
    },
  }

  return defineBlogConfig(config)
}
