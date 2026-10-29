---
title: Configuration layers, first-level config and string templates
description: 'Three configuration levels and system fields: srcDir, base, siteUrl, primaryLocale, repo, head, vite, markdown, sitemap, hooks, Pagefind, GA4 and perPage. As well as string templates'
authorId: ivan-k
date: 2026-08-04
category: configuration
tags: [config]
descriptionAsPreview: true
translations:
  ru: /ru/posts/config-layers
---

Each of the three configuration levels has its own role, although ultimately they are all merged into a single comprehensive configuration.

The rationale for splitting into levels is twofold: first, to separate system-level settings configured by the developer from content and presentation settings configured by the blog administrator; second, to separate global settings from localized ones so you do not duplicate identical parameters across every locale — which is especially beneficial when the blog supports multiple content languages.

The level 1 config is written in TypeScript, which is convenient for developers (especially for using environment variables), while the level 2 and level 3 configs intended for the administrator are in YAML format, which is easily editable even by non-programmers via CMS tools such as Sveltia CMS, Decap CMS, and similar.

This separation of roles prevents confusion: the administrator cannot accidentally break system settings, and the developer can focus on system configuration without getting distracted by presentation details.

```text
1. .vitepress/config.ts            developer: code, build, integrations
   → 2. src/site.yaml              administrator: shared across all locales
     → 3. src/<locale>/_site.yaml  administrator: specific locale and its overrides
```

## Which file to edit

| What is being changed | File |
| --- | --- |
| `srcDir`, `base`, `siteUrl`, `primaryLocale`, `repo`, env, Vite/VitePress, plugins, hooks, Pagefind, GA4 and secrets | `.vitepress/config.ts` |
| Appearance and behavior shared across languages: brand, sidebar, nav, footer, feeds, SEO, icons, publisher | `src/site.yaml` |
| Language, title, description, translations, labels and intentional differences for a single language | `src/<locale>/_site.yaml` |
| Author profiles for a single locale | `src/<locale>/_authors.yaml` |
| Categories for a single locale | `src/<locale>/_categories.yaml` |

## Level 1 — `.vitepress/config.ts`

This is the developer's configuration file, representing an extension of the standard VitePress config.

::: tip
You can also see an example configuration [here](https://github.com/bozonx/vitepress-theme-neptu/blob/main/packages/blog/template/src/.vitepress/config.ts).
:::

```ts
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineBlogConfig } from 'vitepress-theme-neptu/configs'
import type { BlogUserConfig } from 'vitepress-theme-neptu'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Build-time pagination parameter — imported by path generators
export const PER_PAGE = 15

export default async () => {
  const base = process.env.VITEPRESS_BASE || '/'
  const assetUrl = (path: string) => `${base}${path.replace(/^\//, '')}`

  const config: BlogUserConfig = {
    /////// Standard VitePress fields

    // Root of content and locale auto-discovery
    // Modify only if you have renamed or relocated the src/ directory
    srcDir: path.resolve(__dirname, '../'),

    base,

    // Absolute URL of the site root (with protocol, without path).
    // Does not affect routing or internal links — used exclusively
    // to build full URLs in sitemaps, RSS/Atom feeds, canonical tags,
    // Open Graph, JSON-LD, and robots.txt. Needed so search engines and social platforms
    // know the canonical address of pages.
    // Unlike `base`, this is always a full URL: `https://example.com`.
    // If `base` is set (site is not at domain root), the path from `base` is automatically
    // appended to `siteUrl` for all SEO links — do not duplicate the path manually.
    siteUrl: process.env.SITE_URL || 'https://example.com',

    // Primary site locale (folder name, e.g. 'en', 'ru').
    // Determines x-default in hreflang and title/description of the root
    // language selector page. Defaults to 'en' if present, otherwise
    // the first locale alphabetically. Relevant only for multi-language sites.
    // primaryLocale: 'en',

    // External assets and metadata injected into the <head> of the final HTML document
    head: [
      ['meta', { name: 'format-detection', content: 'telephone=no' }],
      ['link', { rel: 'icon', type: 'image/svg+xml', href: assetUrl('/favicon.svg') }],
      ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: assetUrl('/img/favicon-32x32.png') }],
      ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: assetUrl('/img/favicon-16x16.png') }],
      ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: assetUrl('/img/apple-touch-icon.png') }],
      ['link', { rel: 'shortcut icon', href: assetUrl('/favicon.ico') }],
      ['link', { rel: 'manifest', href: assetUrl('/site.webmanifest') }],
    ],

    // Vite options, useful for adding custom Vite plugins
    // Documentation: https://vitepress.dev/reference/site-config#vite
    // Full options list: https://vite.dev/config/
    vite: {
      // Additional Vite plugins on top of what the theme includes
      // plugins: [...],
      ssr: {
        // noExternal already includes 'vitepress-theme-neptu'
        // noExternal: [...],
      },
      build: {
        // chunkSizeWarningLimit: 1500,
      },
    },

    // Markdown options
    // Documentation: https://vitepress.dev/reference/site-config#markdown
    // Adding markdown-it plugins: https://vitepress.dev/reference/site-config#markdown-config
    markdown: {
      // image: { lazyLoading: true } — already enabled by the theme
      // headers: { level: [2, 3, 4, 5, 6] } — already enabled by the theme
      // externalLinks: { target: '_blank' } — already enabled by the theme
      // config: (md) => { /* additional markdown-it plugins */ },
    },

    // Sitemap settings — uses the standard VitePress generator,
    // but the theme automatically configures `hostname` from `siteUrl` and wraps
    // `transformItems` to filter utility routes (tags, archive,
    // authors, popular, recent, featured) and prefix URLs with base path.
    // Documentation: https://vitepress.dev/reference/site-config#sitemap
    // Note: overriding `transformItems` disables the theme's filtering.
    sitemap: {
      // transformItems: (items) => items,  // replaces theme filtering
    },

    // Custom build hooks — executed after theme hooks
    // Documentation: https://vitepress.dev/reference/site-config#build-hooks
    transformPageData: async (pageData) => {
      // Augment or mutate pageData after theme processing
      // return { ...pageData }
    },
    transformHead: async (context) => {
      // Add tags to <head> after theme processing
      // return [['meta', { name: 'foo', content: 'bar' }]]
    },
    buildEnd: async (siteConfig) => {
      // Called at the end of the build, after generating feeds, robots.txt, and index
    },

    /////// Neptu blog options

    themeConfig: {
      // Build-time pagination parameter
      perPage: PER_PAGE,

      // Source repository; determines edit-link and repository links. Optional
      repo: 'https://github.com/acme/my-blog',

      // Pagefind search — the theme's built-in search provider.
      // The index is built automatically at the end of `vitepress build`, and the UI bundle
      // is lazy-loaded from `/pagefind/`. No extra build steps are required.
      // Modal translations are configured via `t.searchUI` in the theme's i18n system.
      // Pagefind documentation: https://pagefind.app
      search: {
        // enabled: true,               // false — disable search and indexing
      },

      // Popular posts based on Google Analytics 4 data.
      // The integration is disabled by default — set `enabled: true`
      // once the service account and property are configured.
      // Credentials and propertyId are read from environment variables to
      // avoid storing secrets in the repository.
      // Requires GA4 Data API and a service account with read access to analytics.
      // Documentation: https://developers.google.com/analytics/devguides/reporting/data/v1
      popularPosts: {
        enabled: true,
        // Sort popular posts by GA4 page views
        sortBy: 'pageviews',
        dataSource: {
          // The single supported analytics provider
          // provider: 'ga4',
          // GA4 property ID (format: properties/123456789)
          propertyId: process.env.GA_PROPERTY_ID,
          // GA4 service account JSON key (full file contents as a string)
          credentialsJson: process.env.GA_CREDENTIALS_JSON,
          // Data collection window in days (default: 30)
          dataPeriodDays: 30,
          // Maximum number of rows in the GA4 report (default: 1000)
          dataLimit: 1000,
        },
      },
    },
  }

  return defineBlogConfig(config)
}
```

> Note that unlike standard VitePress, locales are not explicitly configured in the Neptu blog config. In fact, defining them here is strongly discouraged, as locales are discovered automatically based on the directory structure where `src/` contains subfolders for each locale.

> For the full list of standard VitePress options, consult the [VitePress configuration reference](https://vitepress.dev/reference/site-config).

## String templates

All YAML configs support string interpolation.

| Variable | Contents | Example |
| --- | --- | --- |
| `${theme.*}` | merged `themeConfig` | `${theme.sidebar.sidebarTitle}` |
| `${site.*}` | final locale site object (`title`, `description`, `lang`, etc.) | `${site.title}` |
| `${t.*}` | translations object (`theme.t`) — built-in or overridden keys | `${t.editLink}` |
| `${config.*}` | entire `BlogUserConfig` from `config.ts` | `${config.siteUrl}` |
| `${localeIndex}` | current locale folder name (e.g. `en`, `ru`) | `${localeIndex}` |

Interpolation runs in **two passes**:

1. **During YAML parsing** — context `{ config, theme, t, localeIndex }`. The `site` variable is not yet available at this stage. Unresolved placeholders remain intact in the text.
2. **After merging all levels** — context is augmented with `site`, and remaining placeholders (including `${site.*}`) are resolved from the final config.

## Custom fields in `themeConfig`

You can add **any custom fields** to `themeConfig` — they pass through the entire merge pipeline and are accessible at runtime via `useThemeConfig()`. Objects are merged recursively across levels; arrays are replaced completely.

Level 1 — `config.ts`, environment variable:

```ts
// .vitepress/config.ts
export default async () => {
  const config: BlogUserConfig = {
    themeConfig: {
      apiUrl: process.env.API_URL,
    },
  }
  return defineBlogConfig(config)
}
```

Level 2 — `src/site.yaml`, substitution from `${config.*}` and a new field:

```yaml
# src/site.yaml
themeConfig:
  # substitution from config.ts (level 1)
  endpoint: "${config.themeConfig.apiUrl}/v2/posts"
  # new field defined at level 2
  featureEnabled: true
```

Access in a Vue component:

```vue
<script setup lang="ts">
import { useThemeConfig } from 'vitepress-theme-neptu/composables'

const { theme } = useThemeConfig()
console.log(theme.value.apiUrl)        // "https://api.example.com"
console.log(theme.value.endpoint)      // "https://api.example.com/v2/posts"
console.log(theme.value.featureEnabled) // true
</script>
```

> Custom fields can be defined at any level: `config.ts`, `site.yaml`, or `_site.yaml`. Values are merged by priority — from lowest to highest.

## Level 2 and level 3

The subsequent configuration levels reside in the files:
- `src/site.yaml` — level 2
- `src/<locale>/_site.yaml` — level 3

For details on configuring them, see [themeConfig settings](themeconfig-settings).

---

Next: [themeConfig settings — configuration levels 2 and 3](themeconfig-settings)
