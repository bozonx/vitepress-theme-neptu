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
  // Off in the starter so the first build is warning-free. Turn it on once
  // GA_PROPERTY_ID and GA_CREDENTIALS_JSON are set — the ranking is fetched at
  // build time and baked into static pages, so no Google request is made in the
  // browser. Then also switch on `sidebar.popular` in src/site.yaml.
  // Without GA4 data the theme warns and falls back to the latest posts.
  enabled: false,
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

    /**
     * Primary locale key (folder name) — used as the `x-default` target in
     * hreflang tags and as the source of title/description for the root
     * language selector page at `/`. Defaults to `en` if it exists, otherwise
     * the first locale alphabetically. Only relevant for multi-language sites.
     */
    // primaryLocale: 'en',

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

      /**
       * Search (Pagefind). The index is built automatically at the end of
       * `vitepress build`; the UI assets are loaded lazily by the search modal.
       * UI translations are localised via `t.searchUI` in site.yaml / _site.yaml.
       * Set `enabled: false` to disable search entirely, e.g. to run the
       * Pagefind CLI yourself. Docs: https://pagefind.app
       */
      search: {
        enabled: true,
      },

      /** Popular posts metrics configuration (GA4). */
      popularPosts,

      /**
       * Table of contents, built from the page headings.
       * Shown in the right-hand aside column above 1550px and as a
       * collapsible block above the article on narrower viewports.
       */
      // toc: {
      //   enabled: true,
      //   position: 'auto',   // 'auto' | 'aside' | 'top'
      //   minHeadings: 3,     // hide the TOC on short articles; 0 disables the threshold
      //   collapsed: true,    // start state of the collapsible block
      //   level: [2, 3],      // range, a single number, or 'deep'
      //   layouts: ['post'],
      //   label: 'On this page',  // defaults to the `tocLabel` translation
      // },

      /**
       * Layouts that render the right-hand aside column, visible from 1550px.
       * Supported keys: 'post', 'page', 'util', 'tag', 'category', 'archive',
       * 'author', plus any custom `contentLayout` name.
       * Per-page frontmatter `aside: true | false` overrides this list.
       */
      // asideLayouts: ['post', 'util', 'tag', 'category', 'archive', 'author'],

      /**
       * Ad slots. The theme supplies placement, reserved height, the "ad"
       * label and the consent wiring — the network snippet stays yours and is
       * registered as a global component (see `theme/index.ts`).
       */
      // ads: {
      //   enabled: true,
      //   component: 'AdUnit',
      //   layouts: ['post'],
      //   aside: true,          // slot in the aside column
      //   afterContent: false,  // slot below the article
      //   requireConsent: false,
      //   label: 'Advertisement',  // defaults to the `adLabel` translation
      //   inContent: {
      //     enabled: true,
      //     anchor: 'heading',  // 'heading' | 'paragraph'
      //     start: 2, every: 3, max: 2, minBlocks: 6,
      //   },
      //   minHeight: { aside: 600, 'in-content': 280, 'after-content': 280 },
      // },

      /**
       * Google Consent Mode v2 defaults, emitted as the first script on the
       * page so tags that load later obey them. The theme ships no banner:
       * Google ads in the EEA/UK require a certified CMP (IAB TCF 2.2), which
       * this config sits underneath rather than replaces.
       */
      // consent: {
      //   enabled: true,
      //   waitForUpdate: 500,
      //   // region: ['ES', 'US-CA'],
      //   // storageKey: 'neptu-consent',
      //   // Initial granted/denied state before the CMP answers.
      //   // defaults: {
      //   //   analytics: false, ads: false, adUserData: false,
      //   //   adPersonalization: false, functional: true,
      //   // },
      // },
    },
  }

  return defineBlogConfig(config)
}
