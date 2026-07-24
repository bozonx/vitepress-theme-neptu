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
site. Two pieces wire it up:

```ts
// .vitepress/config.ts — assets + provider
head: [
  ['link', { rel: 'stylesheet', href: '/pagefind/pagefind-ui.css' }],
  ['script', { src: '/pagefind/pagefind-ui.js' }],
],
themeConfig: {
  search: { provider: 'pagefind', options: { bodyMarker: 'data-pagefind-body' } },
},
```

The index is built from the production output, so search works after a full
build (`pnpm build && pnpm pagefind`), not in dev. Exclude a single post from
the index with `searchIncluded: false` in its frontmatter — see
[Preview & Search](../post/preview-and-search).

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
