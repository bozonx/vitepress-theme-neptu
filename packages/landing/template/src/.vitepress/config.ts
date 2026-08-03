import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineLandingConfig } from 'vitepress-theme-neptu-landing/configs'
import type { LandingUserConfig } from 'vitepress-theme-neptu-landing'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// =============================================================================
// Developer-level Constants & Dynamic Integrations
//
// In vitepress-theme-neptu-landing, configuration is layered:
//   1. Developer Layer (.vitepress/config.ts) — secrets, env vars, dynamic hooks
//   2. Shared admin layer (src/site.yaml) — safe settings shared by all locales
//   3. Locale admin layer (src/<locale>/_site.yaml) — identity, translations and local overrides
//
// `config.ts` is intentionally not a second copy of the YAML settings. Keep
// VitePress wiring, environment-dependent integrations and build-time code here.
// =============================================================================

export default async () => {
  const base = process.env.VITEPRESS_BASE || '/'
  // Prefix a public asset path with `base` while avoiding double slashes.
  const assetUrl = (p: string) => `${base}${p.replace(/^\//, '')}`

  const config: LandingUserConfig = {
    // -------------------------------------------------------------------------
    // VitePress & Core Site Options
    // -------------------------------------------------------------------------

    /** Root directory containing markdown content and YAML config layers. */
    srcDir: path.resolve(__dirname, '../'),

    /** Base public URL path (e.g. '/landing/' if hosted in a subfolder). */
    base,

    /**
     * Absolute public site URL (no trailing slash).
     * Used for canonical links, sitemap, OpenGraph, JSON-LD, hreflang.
     */
    siteUrl: process.env.SITE_URL || 'https://example.com',

    /** Head meta tags and external asset links injected into HTML `<head>`. */
    head: [
      ['meta', { name: 'format-detection', content: 'telephone=no' }],

      // Favicon (place assets in src/public/img/)
      ['link', { rel: 'icon', type: 'image/svg+xml', href: assetUrl('/img/logo.svg') }],
      ['link', { rel: 'manifest', href: assetUrl('/site.webmanifest') }],

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
    // Note: Admin-editable presentation (logo, theme axes, nav, sidebar, footer,
    // publisher, icons, i18n labels) belongs in `src/site.yaml` or
    // `src/<locale>/_site.yaml`.
    // Keep this block focused on code-bound, environment-driven settings.
    // -------------------------------------------------------------------------
    themeConfig: {
      /** Source repository — used to derive edit links and GitHub links. */
      repo: 'https://github.com/your-username/my-landing',

      /**
       * Search provider.
       *
       * The landing theme ships no search of its own — the box comes from the
       * VitePress default theme. `local` (MiniSearch, zero infrastructure) is
       * the sensible default for a landing plus a handful of doc pages. For
       * larger sites switch to Algolia DocSearch.
       * See https://vitepress.dev/reference/default-theme-search
       */
      search: {
        provider: 'local',
      },
    },
  }

  return defineLandingConfig(config)
}
