---
title: Full-Featured Post — Every Frontmatter Field
description: >
  The kitchen-sink post: cover, author, tags, preview override, video button,
  podcast dropdown, and comment link, all enabled so you can see them together.
date: 2025-05-15T12:00:00Z
authorId: ivan-k

# --- Cover ---------------------------------------------------------------
cover: https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1200&auto=format&fit=crop
coverWidth: 1200
coverHeight: 800
coverAlt: A tidy desk with a keyboard, notebook and plant
coverDescr: "coverDescr supports **markdown** and [links](https://unsplash.com)."

# --- Taxonomy ------------------------------------------------------------
# One category files the post in the hierarchy and drives the breadcrumbs.
category: Writing
tags:
  - frontmatter
  - guide

# --- List preview --------------------------------------------------------
# Reuse `description` as the post-list preview (instead of an auto excerpt).
descrAsPreview: true
# previewText: "Or set explicit preview text — use one or the other, not both."

# --- Footer links --------------------------------------------------------
commentLink: https://github.com/bozonx/vitepress-theme-neptu/discussions

# --- Video button (top of post) ------------------------------------------
videoLink: https://www.youtube.com/watch?v=dQw4w9WgXcQ
videoLinkLang: EN

# --- Podcast dropdown ----------------------------------------------------
podcastLang: EN
podcasts:
  spotify: https://open.spotify.com/
  applepodcasts: https://podcasts.apple.com/
  youtube: https://www.youtube.com/
translations:
  ru: /ru/post/full-featured
---

This is the **kitchen-sink** post. Every optional frontmatter field is turned on
so you can see, in one place, how the theme renders each one. Look around: the
cover and its caption are above, the author block, tags, comment link, video
button and podcast dropdown are all wired from the frontmatter.

## What's on this page

| Feature | Field(s) | Where it shows |
| --- | --- | --- |
| Cover image + caption | `cover`, `coverWidth/Height`, `coverAlt`, `coverDescr` | top of post |
| Author block | `authorId` | post footer |
| Tags | `tags` | header + footer |
| List preview | `descrAsPreview` | post-list cards |
| Video button | `videoLink`, `videoLinkLang` | top of post |
| Podcast dropdown | `podcasts`, `podcastLang` | top of post |
| Comment link | `commentLink` | post footer |

## How it's done

```yaml
---
title: Full-Featured Post — Every Frontmatter Field
description: >
  The kitchen-sink post: cover, author, tags, preview override…
date: 2025-05-15T12:00:00Z
authorId: ivan-k

cover: https://images.unsplash.com/photo-...
coverWidth: 1200
coverHeight: 800
coverAlt: A tidy desk with a keyboard, notebook and plant
coverDescr: "coverDescr supports **markdown** and [links](...)."

tags: [frontmatter, guide]
descrAsPreview: true

commentLink: https://github.com/.../discussions
videoLink: https://www.youtube.com/watch?v=dQw4w9WgXcQ
videoLinkLang: EN

podcastLang: EN
podcasts:
  spotify: https://open.spotify.com/
  applepodcasts: https://podcasts.apple.com/
  youtube: https://www.youtube.com/
---
```

## Fields that aren't shown here

A few options only make sense in isolation, so they have their own demos:

- `searchIncluded`, `previewText` → [Preview & Search](preview-and-search)
- `canonical`, per-page `seo` toggles → [Canonical & cross-posting](canonical-crosspost)
- `jsonLd` → [JSON-LD](json-ld)
- `translations` → [i18n & hreflang](i18n-hreflang)

## Post body

Everything from here down is ordinary markdown, just to give the post realistic
length in the listings.

```ts
// Code blocks are styled by the theme.
const greet = (name: string) => `Hello, ${name}!`
console.log(greet('world'))
```

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vehicula metus
vitae mi feugiat, sed convallis diam feugiat. Suspendisse potenti.
