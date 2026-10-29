---
title: How SEO works — overview and mechanisms
description: >
  A roadmap of the theme's SEO mechanisms: what is generated automatically at build time,
  where it is configured, and how to disable any feature. RSS/Atom/JSON feeds,
  automatic robots.txt and sitemap.xml, canonical links and cross-posting.
authorId: ivan-k
date: 2026-07-12
category: seo
tags: [seo, config]
descriptionAsPreview: true
translations:
  ru: /ru/posts/seo-features
---

The Neptu theme handles all technical aspects of SEO for you: specify `siteUrl` — and the build generates a full suite of SEO mechanisms that completely cover your blog's SEO needs.

Set `siteUrl` in your level 1 configuration without a trailing slash:

```ts
// .vitepress/config.ts
siteUrl: 'https://myblog.org'
```

## What is generated automatically

At build time, the following is created for the entire site:

| Mechanism | What it does | Details |
| --- | --- | --- |
| **sitemap.xml** | site map derived from `siteUrl`, excluding `noindex` pages | [sitemap.xml](#sitemapxml) |
| **robots.txt** | includes reference to sitemap | [robots.txt](#robotstxt) |
| **RSS / Atom / JSON** | feeds for each locale | [Feeds](#feeds-rss-atom-json) |
| **Open Graph + Twitter card** | social media previews on every page | see below |
| **JSON-LD** | `BlogPosting` structured data for posts | [JSON-LD microdata](seo-json-ld) |
| **canonical** | link to the original source of the page | [Canonical links](#canonical-links-canonical) |
| **hreflang** | connects translated versions across languages | [Linking translations and hreflang](i18n-hreflang) |

## How to disable any feature

All SEO features are enabled by default. They can be disabled in two places:

```yaml
# Globally — src/site.yaml
themeConfig:
  seo:
    og: true
    jsonLd: true
    hreflang: true
    canonical: true           # self-canonical on every page
    rss: true
    maxDescriptionLength: 300
  twitterSite: '@your_handle' # twitter:site on every page
```

```yaml
# For a single page — in post frontmatter (overrides global config)
seo:
  jsonLd: false
  og: false
```

## Feeds (RSS / Atom / JSON)

Enabled by default. Links are rendered in the sidebar (RSS + Atom) and in the `<head>` of every page. Configured in `src/site.yaml`:

```yaml
themeConfig:
  feeds:
    maxPosts: 50
    formats: ['rss', 'atom', 'json']
    fullContent: false
```

File paths for each locale: `/en/feed.rss`, `/en/feed.atom`, `/en/feed.json`.

`fullContent: true` additionally includes sanitized HTML of the entire article. Relative links and images are converted to absolute URLs. The feed renderer does not execute custom Vue components or optional Markdown plugins; if the core content depends heavily on them, keeping the preview mode is recommended.

## robots.txt

Behavior depends on whether a custom `robots.txt` exists in `public/`:

- **No file** — the theme generates `robots.txt` during the build:

  ```text
  User-agent: *
  Allow: /

  Sitemap: https://<siteUrl>/sitemap.xml
  ```

  The sitemap URL is derived from `siteUrl`.

- **File exists** — the theme does not generate or modify it. VitePress copies `public/robots.txt` to the output directory as-is. If the file lacks a `Sitemap:` directive, the build logs a warning suggesting you add `Sitemap: https://<siteUrl>/sitemap.xml`.

## sitemap.xml

Built automatically using `siteUrl`. Pages with `robots: noindex` (configured via `head`) are excluded from the sitemap. Utility list pages (`recent/`, `popular/`, `archive/`, `tags/`, `authors/`) are omitted from the site map.

Posts and pages without translations are included on equal footing — a translated counterpart is not required. Nested posts (`posts/my-article/index.md`) are added to the sitemap under their clean folder URL.

## Canonical links (canonical)

A canonical link instructs search engines which URL is the original, authoritative version of the page, preventing penalties for duplicate content.

### Default behavior

When `seo.canonical: true` (default), every page automatically receives a canonical link pointing to itself, so in most situations you don't need to do anything.

If you disabled `seo.canonical` globally but want *this particular page* to link to itself, specify `self`:

```yaml
canonical: "self"
```

### Cross-posting: external canonical

If you publish an article on your blog that originally appeared elsewhere, specify a canonical link to the original publication — search engines will attribute search rank to the primary source without penalizing your copy as duplicate content.

```yaml
# In post frontmatter
canonical: "https://example.com/articles/original-post"
```

> Use this setting when syndicating your own content, migrating from an older domain, or re-publishing with permission.

### Disabling for a single page

```yaml
seo:
  canonical: false
```

### Disabling globally

```yaml
# src/site.yaml
themeConfig:
  seo:
    # Do not add self-canonical automatically. Pages with an explicit
    # `canonical` field in frontmatter will still receive their link.
    canonical: false
```

The same can be defined for a specific locale in `<locale>/_site.yaml` — settings resolve along the chain: frontmatter → locale → site.

### How configuration levels resolve

| `themeConfig.seo.canonical` | frontmatter `seo.canonical` | frontmatter `canonical` | result |
| --- | --- | --- | --- |
| `true` (default) | — | — | self |
| `true` | — | `<url>` | `<url>` |
| `true` | `false` | any | nothing |
| `false` | — | — | nothing |
| `false` | — | `<url>` / `self` | `<url>` / self |
| `false` | `true` | — | self |

## Further reading

- [JSON-LD microdata](seo-json-ld) — extending the schema for your needs.
- [Linking translations and hreflang](i18n-hreflang) — connecting locales with one another.
- [Pagefind search](search-pagefind) — indexing and excluding from search.
- [Publishing and deployment](deploy) — publishing the finished site online.

---

Next: [JSON-LD microdata](seo-json-ld)
