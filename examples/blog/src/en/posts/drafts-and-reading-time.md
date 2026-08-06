---
title: Drafts and reading time
description: >
  Keep unfinished posts out of lists, feeds, the sitemap and search, and show a
  reading-time estimate — including the matching JSON-LD properties.
date: 2025-05-20T10:00:00Z
authorId: ivan-k
category: Writing
tags:
  - guide
  - frontmatter
descrAsPreview: true
translations:
  ru: /ru/post/drafts-and-reading-time
---

# Drafts and reading time

Two small features almost every blog needs: writing a post without publishing
it, and a reading-time estimate in the article header.

## Drafts

Add `draft: true` to the frontmatter and the post disappears from every public
surface of the blog:

```yaml
---
title: Not ready yet
date: 2026-08-01T10:00:00Z
authorId: ivan-k
draft: true
---
```

Filtering the post list alone would not be enough — the page is still built, so
a draft is removed from five places at once:

| Surface | What happens |
|---------|--------------|
| Post lists | Absent from recent, popular, archive, tags, authors and similar posts |
| RSS / Atom / JSON | Left out of the feeds |
| `sitemap.xml` | Left out of the sitemap |
| Search (Pagefind) | Not indexed |
| `<head>` | Gets `<meta name="robots" content="noindex, nofollow">`; JSON-LD, hreflang and canonical are skipped |

### The page stays reachable by direct URL

That is deliberate: the draft's HTML is built and served at its own URL, it is
merely unlisted and marked `noindex`. So you can preview a draft exactly as it
will look in production and send the link out for review without publishing it.

To keep a file out of the build entirely, use the standard VitePress
`srcExclude`:

```ts
// .vitepress/config.ts
export default async () => defineBlogConfig({
  srcExclude: ['**/*.draft.md'],
})
```

### Drafts are visible in the dev server

By default drafts **show** in `vitepress dev` and **disappear** in
`vitepress build`. An author sees unfinished posts in the normal lists while
writing, and cannot ship them by accident.

The switch follows `NODE_ENV`. Override it explicitly if you need to:

```yaml
# src/site.yaml
themeConfig:
  drafts:
    showDrafts: false  # hide drafts even in dev
```

`showDrafts: true` brings drafts back into every list and feed, production
builds included. Use it only for an internal preview deployment.

### The badge

While a draft is visible, a badge is rendered next to it — in the post header
and in list items. It also stays on the draft's own page in a production build:
it is the one visible sign that the article is not published.

The wording is translated through `t.draftLabel` and `t.draftTitle`.

## Reading time and word count

Both are computed at build time from the markdown source. Fenced code, inline
code and raw HTML are excluded — a long config listing is scrolled past, not
read.

CJK scripts are not written with spaces, so their characters are counted
individually and converted to "words" at a ratio of 2.

### Configuration

```yaml
# src/site.yaml
themeConfig:
  readingTime:
    enabled: true      # default
    wpm: 200           # words per minute
    layouts: ['post']  # where the badge is rendered
```

The estimate is never zero: any non-empty text is at least "1 min".

A single page can override the layout list:

```yaml
---
title: A long utility page
layout: page
readingTime: true
---
```

### In post lists

List cards do not show the reading time by default — turn it on separately:

```yaml
themeConfig:
  postList:
    showReadingTime: true
```

### SEO

When the reading time is known, two properties are added to the article's
JSON-LD (`BlogPosting`):

```json
{
  "@type": "BlogPosting",
  "wordCount": 218,
  "timeRequired": "PT1M"
}
```

In the markup the badge is a `<time datetime="PT1M">` element — the same
ISO 8601 duration as `timeRequired`.

### Custom layouts

The post data the theme passes to lists (`PostLite`) now carries `wordCount`,
`readingTime` and `draft`. On the post page itself the same values live in
`page.wordCount` and `page.readingTime`.

The ready-made components can be dropped into your own layout:

```vue
<script setup lang="ts">
import { PostReadingTime, PostDraftBadge } from 'vitepress-theme-neptu/components'
</script>

<template>
  <PostReadingTime />
  <PostDraftBadge />
</template>
```
