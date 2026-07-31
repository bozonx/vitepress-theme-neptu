---
title: Feeds, Search & SEO Toggles
description: Site-wide machinery — RSS/Atom/JSON feeds, Pagefind search, popular posts via GA4, robots.txt, sitemap, and the SEO on/off switches.
layout: page
---

# Feeds, Search & SEO Toggles

Beyond individual posts, the theme wires up a lot of site-wide machinery for
free. This page maps out what runs and where to configure it. Per-post SEO
(JSON-LD, canonical, OG) has its own demos — see the posts tagged
[`seo`](../tags/seo/1).

## What's generated automatically

At build time the theme emits, for the whole site:

- **`sitemap.xml`** — from `siteUrl`, excluding `noindex` pages.
- **`robots.txt`** — with a link to the sitemap.
- **RSS / Atom / JSON feeds** — one set per locale.
- **Open Graph + Twitter card** meta on every page.
- **JSON-LD** structured data on every post.
- **`hreflang`** links between translated pages.
- **canonical** links.

> **Every one of these can be turned off** — globally in `src/site.yaml` or
> per-page in a post's frontmatter. See [SEO toggles](#seo-toggles) below.

## Feeds (RSS / Atom / JSON)

Enabled by default. Links appear in the sidebar (RSS + Atom) and in every page
`<head>`. Configure in `src/site.yaml`:

```yaml
themeConfig:
  feeds:
    maxPosts: 50
    formats: ['rss', 'atom', 'json']
```

Output paths per locale: `/en/feed.rss`, `/en/feed.atom`, `/en/feed.json`.

## Search (Pagefind)

Search is powered by [Pagefind](https://pagefind.app), which indexes the built
site. **Pagefind ships with the theme** — no separate install, no extra build
step, no script tags in `head`. One config key wires it up:

```ts
// .vitepress/config.ts
themeConfig: {
  search: { provider: 'pagefind', options: { bodyMarker: 'data-pagefind-body' } },
},
```

What the theme handles for you:

- **Indexing.** At the end of `vitepress build` (the `buildEnd` hook) the theme
  builds the index into `<outDir>/pagefind`. Your build script stays a plain
  `vitepress build src`.
- **UI loading.** `pagefind-ui.css` and `pagefind-ui.js` are fetched by the
  search modal on first open. That keeps ~135 KB off every page load and keeps
  dev free of 404s for index files that do not exist yet.

The index comes from the production output, so search works after
`npm run build` + `npm run preview`, not in dev — opening it in dev logs a
clear console warning.

Only article text is indexed: the author, comments, share, similar-posts and
"Popular" blocks are marked with `data-pagefind-ignore` and never show up in
snippets. Post tags are exposed as the `tag` filter and the post date as the
`date` sort. Exclude a single post with `searchIncluded: false` in its
frontmatter — see [Preview & Search](../post/preview-and-search).

### Tuning the index

Indexing options live under `search.index` and are passed to Pagefind:

```ts
themeConfig: {
  search: {
    provider: 'pagefind',
    options: { bodyMarker: 'data-pagefind-body' },
    index: {
      // enabled: false,             // skip indexing (e.g. to run the CLI yourself)
      // glob: '**/*.html',          // which files to index
      // excludeSelectors: ['.ads'], // extra ignores on top of data-pagefind-ignore
      // forceLanguage: 'en',        // index the whole site as one language
      // verbose: true,              // verbose indexing log
    },
  },
},
```

Need a flag that `search.index` does not expose? Set `enabled: false` and run
the [Pagefind CLI](https://pagefind.app/docs/config-options/) yourself after the
build.

## Popular posts (Google Analytics 4)

The "Popular" sidebar section and `/en/popular/1` listing are populated from
real GA4 pageviews at build time. It stays disabled until you provide
credentials via environment variables:

```ts
// .vitepress/config.ts
export const popularPosts = {
  enabled: Boolean(process.env.GA_PROPERTY_ID && process.env.GA_CREDENTIALS_JSON),
  sortBy: 'pageviews', // 'pageviews' | 'uniquePageviews' | 'avgTimeOnPage'
  dataSource: {
    provider: 'ga4',
    propertyId: process.env.GA_PROPERTY_ID,
    credentialsJson: process.env.GA_CREDENTIALS_JSON,
  },
}
```

For a local preview without GA, set `enabled: true` — the theme falls back to
recent posts.

## SEO toggles

Every SEO feature is **on by default**. Turn features off globally in
`src/site.yaml`, or per-page via the `seo` frontmatter key:

```yaml
# Global — src/site.yaml
themeConfig:
  seo:
    og: true
    jsonLd: true
    hreflang: true
    canonical: true
    autoCanonical: true      # self-referencing canonical by default
    rss: true
    maxDescriptionLength: 300
  twitterSite: '@your_handle'  # twitter:site on every page
```

```yaml
# Per-page — any post's frontmatter
seo:
  jsonLd: false   # disable structured data for this page only
  og: false
```

Setting `robots: noindex` (via `head`) also removes the page from the sitemap
automatically.
