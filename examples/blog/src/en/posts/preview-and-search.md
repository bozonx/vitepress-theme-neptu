---
title: List Previews & the Search Index
description: >
  Control what shows in post-list cards (previewText / descriptionAsPreview /
  maxPreviewLength) and whether a post is included in Pagefind search.
date: 2025-01-08T08:00:00Z
authorId: ivan-k
category: SEO
tags:
  - frontmatter
  - preview
previewText: "This card's text was set explicitly with previewText — notice it differs from the first paragraph of the post body."
translations:
  ru: /ru/posts/preview-and-search
---

Post-list cards (like the ones on **Recent**, **Tags**, and **Author** pages)
show a short preview. By default the theme generates that preview from the start
of the post body, but you can override it — and this very post does. Open the
[Recent list](../recent/1) and find this post to compare its card text with the
paragraph you're reading now.

## Three ways to control the preview

**1. Auto (default).** Do nothing — the theme excerpts the body up to
`maxPreviewLength` characters.

**2. Reuse the description.** Set `descriptionAsPreview: true` to use the frontmatter
`description` as the card text (most demo posts do this).

**3. Explicit text.** Set `previewText` to write the card copy by hand. Use
`descriptionAsPreview` **or** `previewText`, not both.

### How it's done

```yaml
# This post uses explicit preview text:
previewText: "This card's text was set explicitly with previewText…"

# Alternatively:
# descriptionAsPreview: true
```

## Preview length

The excerpt cap lives in code because the data loader reads it at build time:

```ts
// .vitepress/config.ts
export const postList = { maxPreviewLength: 300 }
```

Visual card toggles (show/hide date, tags, thumbnail, author) live in YAML:

```yaml
# src/site.yaml
themeConfig:
  postList:
    showDate: true
    showTags: true
    showThumbnail: true
    showPreview: true
    showAuthor: true
```

## Excluding a post from search

Search is powered by Pagefind. To keep a post out of the index, set:

```yaml
searchIncluded: false
```

The post still renders and appears in listings; it just won't come up in search
results. See [Feeds, Search & SEO Toggles](../pages/seo-feeds-search) for how the
whole search pipeline is wired.
