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

## Extending the schema

The `jsonLd` frontmatter field is YAML that gets **merged** into the generated
schema — so you only specify what differs or what the theme can't infer. This
post upgrades its type to `TechArticle` and adds two fields:

### How it's done

```yaml
# Note the quoted "@type" — a bare @ is invalid YAML.
jsonLd: |
  "@type": TechArticle
  proficiencyLevel: Beginner
  dependencies: VitePress, vitepress-theme-neptu
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
