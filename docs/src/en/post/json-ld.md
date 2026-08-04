---
title: JSON-LD Structured Data
description: >
  The theme emits Article JSON-LD for every post automatically. The jsonLd
  frontmatter field lets you extend or override the generated schema.
date: 2024-12-05T14:00:00Z
authorId: maria-editor
category: SEO
tags:
  - seo
  - json-ld
descrAsPreview: true
jsonLd: |
  "@type": TechArticle
  proficiencyLevel: Beginner
  dependencies: VitePress, vitepress-theme-neptu
translations:
  ru: /ru/post/json-ld
---

Open your browser's dev tools on this page and look in `<head>` for a
`<script type="application/ld+json">`. That block was generated automatically
from this post's frontmatter — **and** extended by the custom `jsonLd` field
shown below.

## What you get for free

Tags land in `keywords` and categories in `articleSection` — as an array rather
than one comma-joined string, so the values stay discrete. When a post has a
category, a `BreadcrumbList` joins the post schema in the same `@graph`, mirroring
the four steps the reader sees in the visible trail: home → categories → category
→ post. Google requires the two to match, so a post without a category gets
neither. See [Categories and tags](categories-and-tags).

For every post the theme builds an `Article` schema from `title`, `description`,
`date`, `authorId`, and `cover`. You usually don't need to write any JSON-LD at
all.

## Extending or replacing the schema

The `jsonLd` frontmatter field supports two modes depending on how you write it:

- **YAML object** (inline or block scalar) → **deep-merged** into the generated
  schema. You only specify what differs or what the theme can't infer. Nested
  objects are merged recursively, arrays are replaced.
- **JSON string** → **full replacement**. The auto-generated schema is discarded
  entirely; you take full control.

This post uses a YAML block scalar to upgrade its type to `TechArticle` and add
two fields:

### How it's done

```yaml
# Note the quoted "@type" — a bare @ is invalid YAML.
jsonLd: |
  "@type": TechArticle
  proficiencyLevel: Beginner
  dependencies: VitePress, vitepress-theme-neptu
```

For a full override, use a JSON string:

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

## Turning it off

Per page:

```yaml
seo:
  jsonLd: false
```

Globally, in `src/site.yaml`:

```yaml
themeConfig:
  seo:
    jsonLd: false
```

For the other SEO features (OG, canonical, hreflang, RSS) and their toggles, see
[Feeds, Search & SEO Toggles](../page/seo-feeds-search).
