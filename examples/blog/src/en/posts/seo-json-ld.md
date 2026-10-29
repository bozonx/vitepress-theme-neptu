---
title: JSON-LD microdata
description: >
  The theme automatically generates BlogPosting JSON-LD structured data for every post. The
  jsonLd frontmatter field allows extending or replacing the generated schema.
authorId: maria-editor
jsonLd: |
  "@type": TechArticle
  proficiencyLevel: Beginner
  dependencies: VitePress, vitepress-theme-neptu
translations:
  ru: /ru/posts/seo-json-ld
date: 2026-07-10
category: seo
tags: [seo]
descriptionAsPreview: true
---

Open your browser's developer tools on this page and locate the `<script type="application/ld+json">` tag inside `<head>`. This block was assembled automatically from the article's frontmatter — **and** extended by the `jsonLd` field shown below.

## What works automatically

For each post, the theme builds a `BlogPosting` schema (a subtype of `Article`) based on `title`, `description`, `date`, `authorId`, and `cover`. Typically, you do not need to write JSON-LD manually at all.

Alongside the post schema, an `Organization` entry for the publisher is added to the same `@graph` — its data is read from `themeConfig.publisher`:

```yaml
# src/site.yaml
themeConfig:
  publisher:
    name: 'My Blog'
    url: '${config.siteUrl}'
    logo: '/img/logo.webp'   # preferably square, 112×112px or larger
```

Without `publisher`, the schema remains valid, but search engines will not recognize who publishes the content.

Tags are mapped to `keywords`, and categories to `articleSection` (as an array, rather than a comma-separated string, keeping values distinct).

If the post has a category, a `BreadcrumbList` is added to the same `@graph` — representing the same four steps the reader sees in the visible breadcrumbs: Home → Categories → Category → Post. The structured data is built from the identical data as visible breadcrumbs: Google requires them to match. Without a category there are no breadcrumbs — and `BreadcrumbList` is not emitted either. See [Categories and tags](categories-and-tags).

## Extending or replacing the schema

The `jsonLd` frontmatter field supports two modes depending on the format:

- **YAML object** → recursively merged with the theme's auto-generated JSON-LD object. Deep-merge is used for all fields except arrays, which are replaced.
- **JSON string** → **complete replacement**. The auto-generated schema is discarded entirely; you assume full control.

This post uses a YAML block scalar to change the type to `TechArticle` and add two fields:

### How to do this

```yaml
# Note the quotes around "@type" — an unquoted @ sign is invalid in YAML.
jsonLd: |
  "@type": TechArticle
  proficiencyLevel: Beginner
  dependencies: VitePress, vitepress-theme-neptu
```

For complete replacement, use a JSON string:

```yaml
jsonLd: '{"@context":"https://schema.org","@type":"FAQPage","name":"FAQ"}'
```

## Nested objects and arrays

```yaml
jsonLd: |
  isPartOf:
    "@type": Blog
    name: My Blog
    url: https://myblog.org
```

```yaml
jsonLd: |
  isPartOf:
    - "@type": WebSite
      name: Main Website
      url: https://myblog.org
    - "@type": Blog
      name: My Blog
      url: https://myblog.org/blog
```

## Disabling microdata

For an individual page in frontmatter:

```yaml
seo:
  jsonLd: false
```

Globally in `src/site.yaml`:

```yaml
themeConfig:
  seo:
    jsonLd: false
```

For other SEO features (OG, canonical, hreflang, RSS) and their toggles, see the [SEO overview](seo-features).

---

Next: [Analytics and popular posts](analytics)
