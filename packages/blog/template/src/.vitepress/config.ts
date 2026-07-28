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
//   2. Admin Layer (src/site.yaml & src/<locale>/_site.yaml) — pure presentation: nav, sidebar,
//      footer, donate, socialMediaShares, publisher, authors, icons, i18n labels
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
    // Note: Admin-editable presentation (nav, sidebar, footer, donate, socialMediaShares,
    // publisher, authors, icons, i18n labels) belongs in `src/site.yaml` or
    // `src/<locale>/_site.yaml`.
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
       * RSS / Atom / JSON feed output settings.
       * Supported formats: 'rss', 'atom', 'json'. Defaults to all three.
       */
      // feeds: {
      //   maxPosts: 50,
      //   formats: ['rss', 'atom', 'json'],
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
       * Toggle individual SEO features or set maxDescriptionLength.
       * All flags default to true; set to false to disable.
       */
      // seo: {
      //   og: true,              // OpenGraph meta tags
      //   jsonLd: true,          // JSON-LD structured data
      //   hreflang: true,        // hreflang alternate language links
      //   canonical: true,       // canonical link tags
      //   autoCanonical: true,   // auto-generate canonical from siteUrl + path
      //   rss: true,            // RSS/Atom feed <link> tags in <head>
      //   maxDescriptionLength: 300,
      // },

      /**
       * Global i18n label overrides (merged over theme defaults).
       * Per-locale translation overrides belong in `src/<locale>/_site.yaml` under `themeConfig.t`.
       */
      // t: {
      //   popularPosts: 'Popular Articles',
      // },

      // -----------------------------------------------------------------------
      // UI Toggles & Display Options
      // -----------------------------------------------------------------------

      /** Show external link icon next to outbound links (default: true). */
      // externalLinkIcon: true,

      /** Enable theme (light/dark) switcher button in sidebar (default: true). */
      // themeSwitcher: true,

      /** Enable i18n-aware routing for locale prefixes (default: true). */
      // i18nRouting: true,

      /** Max number of items in pagination (default: 5). */
      // paginationMaxItems: 5,

      /** Parallax background offset in px for home page (default: 300). */
      // homeBgParallaxOffset: 300,

      // -----------------------------------------------------------------------
      // Sidebar & Branding
      // -----------------------------------------------------------------------

      /** Blog/site name — used as site title and sidebar title fallback. */
      // blogTitle: 'My Blog',

      /** Sidebar logo image URL (displayed above sidebar title). */
      // sidebarLogoSrc: '/logo.png',

      /** Sidebar logo height in px (width auto-scales). */
      // sidebarLogoHeight: 32,

      /** Sidebar menu button label (default: 'Menu'). */
      // sidebarMenuLabel: 'Menu',

      /** Color theme switcher menu label (default: 'Theme'). */
      // colorThemeMenuLabel: 'Theme',

      // -----------------------------------------------------------------------
      // SEO Extras
      // -----------------------------------------------------------------------

      /** Twitter @handle for Twitter card meta tags. */
      // twitterSite: '@yourhandle',

      /** Publisher info for JSON-LD structured data. */
      // publisher: {
      //   name: 'My Company',
      //   url: 'https://example.com',
      //   logo: 'https://example.com/logo.png',
      // },

      // -----------------------------------------------------------------------
      // Landing Page (landing starter only)
      // -----------------------------------------------------------------------

      /** Hero image URL shown on the landing home page. */
      // mainHeroImg: '/images/hero.png',

      /** Optional URL of a companion blog, used by the landing starter. */
      // blogUrl: 'https://example.com/blog',

      // -----------------------------------------------------------------------
      // Custom Icons (override default Iconify icon names)
      // -----------------------------------------------------------------------

      // donateIcon: 'fa6-solid:hand-holding-heart',
      // recentIcon: 'fa6-solid:bolt',
      // popularIcon: 'fa6-solid:star',
      // byDateIcon: 'fa6-solid:calendar-days',
      // authorsIcon: 'mdi:users',
      // rssIcon: 'bi:rss-fill',
      // atomIcon: 'vscode-icons:file-type-atom',
      // youtubeIcon: 'fa6-brands:youtube',
      // tagsIcon: 'fa6-solid:tag',
    },
  }

  return defineBlogConfig(config)
}
