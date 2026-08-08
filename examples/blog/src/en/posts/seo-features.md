---
title: How SEO works — overview and mechanisms
description: >
  An overview of the theme's automatic SEO features: sitemap, robots.txt,
  RSS/Atom/JSON feeds, Open Graph, JSON-LD, canonical links and hreflang.
authorId: ivan-k
date: 2026-07-21
category: seo
tags: [seo, sitemap, rss, og]
descriptionAsPreview: true
translations:
  ru: /ru/posts/seo-features
---

The theme generates all essential SEO features automatically. You don't need plugins or configuration — just set `siteUrl` and everything works.

## Prerequisite: `siteUrl`

```ts
// .vitepress/config.ts
export default async () => defineBlogConfig({
  siteUrl: 'https://myblog.org',
})
```

Without `siteUrl`, most SEO features won't generate correct absolute URLs. Set it before publishing.

## Generated features

### sitemap.xml

A `sitemap.xml` file is generated in the build output. It includes all public pages with their `lastmod` dates.

### robots.txt

A `robots.txt` file is generated referencing the sitemap. Drafts are excluded.

### RSS / Atom / JSON feeds

Three feed formats are generated:

| Feed | Path | Content type |
| --- | --- | --- |
| RSS 2.0 | `/rss.xml` | All public posts |
| Atom | `/atom.xml` | All public posts |
| JSON Feed | `/feed.json` | All public posts |

Feed links are added to `<head>` on the home page.

### Open Graph and Twitter cards

Each post page includes:
- `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- `article:published_time`, `article:author`, `article:section`

### JSON-LD

Each post page includes `BlogPosting` structured data. See [JSON-LD microdata](seo-json-ld) for details.

### Canonical links

Each page includes a `<link rel="canonical">` tag. By default, a self-canonical is generated. Override with the `canonical` frontmatter field.

### hreflang

For multilingual sites, `<link rel="alternate">` tags with `hreflang` attributes are generated. See [Linking translations and hreflang](i18n-hreflang).

## Disabling features

### Globally

```yaml
# src/site.yaml
themeConfig:
  seo:
    sitemap: false
    robots: false
    rss: false
    og: false
    jsonLd: false
    hreflang: false
    canonical: false
    autoCanonical: false
```

### Per page

```yaml
---
seo:
  og: false
  jsonLd: false
  rss: false
---
```

## What's next

- [JSON-LD microdata](seo-json-ld) — extending the schema
- [Linking translations and hreflang](i18n-hreflang) — multilingual SEO
