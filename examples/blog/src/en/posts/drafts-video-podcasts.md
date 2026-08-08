---
title: Drafts, reading time, video button and podcasts
description: >
  How to use draft: true to hide posts, configure reading time, add video
  links, and integrate podcast lists.
authorId: ivan-k
date: 2026-07-09
category: writing
tags: [drafts, reading-time, video, podcasts]
descriptionAsPreview: true
translations:
  ru: /ru/posts/drafts-video-podcasts
---

## Drafts

A post marked as `draft: true` is built — the URL works for preview — but excluded from lists, RSS, sitemap, search and marked `noindex`.

```yaml
---
draft: true
date: 2026-07-24
---
```

In `vitepress dev` drafts are visible by default. In production (`vitepress build`), drafts are hidden from all public lists and feeds but remain accessible via direct URL.

This is useful for:
- Previewing a post before publication
- Sharing a draft link with a reviewer
- Keeping work-in-progress content in the same repository

## Reading time

Reading time is calculated automatically based on the post's word count. It appears as a badge next to the date in the post header.

### Configuration

```yaml
# src/site.yaml
themeConfig:
  readingTime:
    enabled: true           # default: true
    wordsPerMinute: 200      # default: 200
    layouts: [post]          # which layouts show the badge
```

### Per-post override

```yaml
---
readingTime: false  # disable for this post
---
```

Or override the global `readingTime.layouts` list — the per-post value takes precedence.

## Video button

A "Watch video" button can be added to the top of a post via frontmatter:

```yaml
---
videoLink: https://www.youtube.com/watch?v=dQw4w9WgXcQ
videoLinkLang: EN
---
```

- `videoLink` — external URL (YouTube, Vimeo, etc.)
- `videoLinkLang` — short label next to the button (e.g.: EN, RU)

The button appears in the post's top bar, next to the date and reading time.

## Podcasts

A podcast dropdown can be added to the top of a post, listing episodes on multiple platforms:

```yaml
---
podcastLang: EN
podcasts:
  spotify: https://open.spotify.com/episode/...
  applepodcasts: https://podcasts.apple.com/episode/...
  youtube: https://www.youtube.com/watch?v=...
---
```

- `podcastLang` — short label next to the dropdown button
- `podcasts` — a map of platform name → episode URL

The keys are arbitrary platform names. The theme renders them as a dropdown list in the post's top bar.

## What's next

- [All frontmatter fields](frontmatter) — complete frontmatter reference
- [Covers, images and media](covers-images-media) — media components
