import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineBlogConfig } from 'vitepress-theme-neptu/configs'
import type { BlogUserConfig, ThemeConfig } from 'vitepress-theme-neptu'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// =============================================================================
// Developer-level Constants & Dynamic Integrations
//
// In vitepress-theme-neptu, configuration is layered:
//   1. Developer Layer (.vitepress/config.ts) — secrets, env vars, dynamic hooks
//   2. Shared admin layer (src/site.yaml) — safe settings shared by all locales
//   3. Locale admin layer (src/<locale>/_site.yaml) — identity, translations and local overrides
//
// `config.ts` is intentionally not a second copy of the YAML settings. Keep
// VitePress wiring, environment-dependent integrations and build-time code here.
// =============================================================================

/**
 * Number of posts per page in archive/tag/author listings.
 * Exported here because path generators (`*.paths.js`) import it at build time
 * to compute pagination routes. Also passed to `themeConfig.perPage` below so
 * the runtime UI stays in sync with the generated pages.
 */
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

      // Favicon & web app manifest (place assets in src/public/img/)
      // ['link', { rel: 'icon', sizes: '192x192', href: `${base}img/android-chrome-192x192.png`.replace(/\/+/g, '/') }],
      // ['link', { rel: 'apple-touch-icon', sizes: '192x192', href: `${base}img/android-chrome-192x192.png`.replace(/\/+/g, '/') }],
      ['link', { rel: 'manifest', href: `${base}site.webmanifest`.replace(/\/+/g, '/') }],

      // Pagefind UI assets (pagefind-ui.css / pagefind-ui.js) are loaded lazily
      // by the search modal on first open — nothing to add here.

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
      /** Source repository — used to derive edit links and GitHub links. */
      repo: 'https://github.com/your-username/my-blog',

      /** Pagination — must match the `PER_PAGE` constant above (used by paths.js). */
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
    },
  }

  return defineBlogConfig(config)
}
