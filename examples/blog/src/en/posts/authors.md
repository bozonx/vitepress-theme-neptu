---
title: Authors
description: >
  How authors are configured in _authors.yaml, linked to posts via authorId,
  and how the theme generates author pages and cards automatically.
authorId: ivan-k
date: 2026-07-14
category: writing
tags: [authors, config, seo]
descriptionAsPreview: true
translations:
  ru: /ru/posts/authors
---

Authors are managed through a YAML registry and linked to posts via a simple `authorId` field. The theme automatically generates author pages, author cards in post footers, and relevant SEO metadata.

## Author registry

Authors are defined in `_authors.yaml` per locale:

```yaml
# src/en/_authors.yaml
- id: 'ivan-k'
  name: 'Ivan K'
  description: 'Maintainer of the theme.'
  image: 'https://api.dicebear.com/10.x/avataaars/svg?seed=Ivan'
  imageWidth: 800
  imageHeight: 800
  twitterHandle: 'neptu_blog'
  links:
    - type: 'github'
      url: 'https://github.com/bozonx/vitepress-theme-neptu'
      title: 'GitHub'
    - type: 'website'
      url: 'https://myblog.org'
      title: 'Website'
```

## Available fields

| Field | Required | Description |
| --- | --- | --- |
| `id` | Yes | Unique identifier, used in post frontmatter as `authorId` |
| `name` | Yes | Display name |
| `description` | No | Short bio, shown on author page and card |
| `image` | No | Avatar URL |
| `imageWidth` | No | Image width in pixels (avoids layout shift) |
| `imageHeight` | No | Image height in pixels |
| `twitterHandle` | No | Used for `twitter:creator` meta tag on this author's posts |
| `links` | No | Array of social/profile links |

### Link types

Each link has a `type`, `url` and `title`:

| Type | Icon |
| --- | --- |
| `github` | GitHub icon |
| `website` | Globe icon |
| `twitter` | Twitter/X icon |
| `linkedin` | LinkedIn icon |
| `email` | Email icon |

## Linking authors to posts

In post frontmatter:

```yaml
---
authorId: ivan-k
---
```

If the `authorId` is not found in `_authors.yaml`, the author block is not rendered. Make sure to specify the ID exactly.

## What the theme generates

### Author pages

The theme automatically creates a page for each author at `/authors/<id>/1`, listing all their posts sorted by date.

### Author cards

An author card appears in the post footer, showing the avatar, name, description and social links.

### SEO metadata

- **Twitter:** `twitter:creator` meta tag from `twitterHandle`
- **Open Graph:** `article:author` from the author's name
- **JSON-LD:** `Person` schema embedded in the post's JSON-LD

## Multiple authors

The theme currently supports one author per post via the `authorId` field. If a post has multiple contributors, credit additional authors in the post body text.

## Guest authors

If an author is a one-time contributor not in `_authors.yaml`, simply omit the `authorId` field and credit them in the post body:

```md
Our freelance correspondent [John Doe](https://example.com).
```

## What's next

- [All frontmatter fields](frontmatter) — complete frontmatter reference
- [Lists and pages](lists-and-pages) — author list pages
