---
title: JSON-LD microdata
description: >
  How the theme automatically generates JSON-LD microdata for posts, specifically
  BlogPosting schema, and how to extend or replace it.
authorId: ivan-k
date: 2026-07-22
category: seo
tags: [seo, json-ld, schema]
descriptionAsPreview: true
translations:
  ru: /ru/posts/seo-json-ld
---

The theme automatically generates `BlogPosting` JSON-LD structured data for each post. This helps search engines understand the content and enables rich results.

## What's generated

A `<script type="application/ld+json">` tag is added to each post page with a `BlogPosting` schema:

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Post title",
  "description": "Post description",
  "datePublished": "2026-07-29",
  "dateModified": "2026-07-29",
  "author": {
    "@type": "Person",
    "name": "Ivan K",
    "url": "https://myblog.org/authors/ivan-k"
  },
  "image": "https://...",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://myblog.org/en/posts/my-article"
  }
}
```

### Fields used

| JSON-LD field | Source |
| --- | --- |
| `headline` | Post title (from frontmatter or first `#`) |
| `description` | Post description (from frontmatter) |
| `datePublished` | `date` from frontmatter |
| `dateModified` | `date` from frontmatter (or `lastUpdated` if set) |
| `author` | From `authorId` → `_authors.yaml` |
| `image` | From `cover` frontmatter field |
| `mainEntityOfPage` | Built from `siteUrl` + page path |

## Publisher

The `publisher` field is generated from `themeConfig.publisher`:

```yaml
# src/site.yaml
themeConfig:
  publisher:
    name: 'My Blog'
    logo: 'https://myblog.org/img/logo.png'
    url: 'https://myblog.org'
```

This produces an `Organization` schema in the JSON-LD.

## Extending JSON-LD

Use the `jsonLd` frontmatter field to extend the auto-generated schema. A YAML object is deep-merged with the auto-generated schema:

```yaml
---
jsonLd:
  "@type": TechArticle
  proficiencyLevel: Beginner
---
```

Nested objects are merged recursively. This lets you add fields without losing the auto-generated ones.

## Replacing JSON-LD

A JSON string in `jsonLd` completely replaces the auto-generated schema:

```yaml
---
jsonLd: '{"@context":"https://schema.org","@type":"BlogPosting","headline":"Custom"}'
---
```

## Disabling JSON-LD

### Globally

```yaml
# src/site.yaml
themeConfig:
  seo:
    jsonLd: false
```

### Per page

```yaml
---
seo:
  jsonLd: false
---
```

Drafts (`draft: true`) automatically exclude JSON-LD.

## What's next

- [SEO overview](seo-features) — all SEO features
- [All frontmatter fields](frontmatter) — `jsonLd` and `seo` fields
