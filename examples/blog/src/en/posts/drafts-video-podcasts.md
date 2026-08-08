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

A podcast dropdown can be added to the top of a post, listing episodes on multiple platforms.
`podcasts` is a **list**, not a map: menu items appear in exactly the order you write them.

```yaml
---
podcastLang: EN
podcasts:
  - applepodcasts: https://podcasts.apple.com/episode/...
  - spotify: https://open.spotify.com/episode/...
  - youtube: https://www.youtube.com/watch?v=...
  - youtubemusic: https://music.youtube.com/...
  - rss: https://example.com/podcast/rss
  - site: https://example.com/episode-1
---
```

- `podcastLang` — short label next to the dropdown button
- `podcasts` — ordered list of `<platform id>: <episode URL>` pairs

### Custom platforms

The theme has 15 built-in platforms: `site`, `rss`, `applepodcasts`, `spotify`,
`youtube`, `youtubemusic`, `amazonmusic`, `castbox`, `deezer`, `iheartradio`,
`tunein`, `pocketcasts`, `overcast`, `podcastaddict`, `podcastindex`.

Anything else goes into the `themeConfig.podcastPlatforms` registry, which
supplies the label and icon for every post at once — and can override a
built-in platform under the same id:

```yaml
# src/site.yaml
themeConfig:
  podcastPlatforms:
    podbean:
      label: Podbean
      icon: simple-icons:podbean       # any Iconify name
    zvuk:
      label: { ru: Звук, en: Zvuk }    # per-locale labels
      iconUrl: /icons/zvuk.svg         # or your own file from public/
```

::: warning Iconify icons and offline builds
The theme ships an offline icon bundle that only covers the built-in
platforms. An `icon` name outside that bundle is fetched from
`api.iconify.design` in the reader's browser — it is missing from the SSR
output and never appears without network access. Use `iconUrl` with your own
file, or register the icon yourself with `addIcon()` in your `enhanceApp`.
:::

For a one-off platform not worth a config entry, describe the item inline:

```yaml
podcasts:
  - spotify: https://open.spotify.com/episode/...
  - id: podimo
    url: https://podimo.com/...
    label: Podimo
    iconUrl: /icons/podimo.svg
```

An id found in neither the registry nor the built-in list still renders a
working link: the label is derived from the id (`player-fm` → `Player Fm`) and
the icon falls back to a generic `mdi:podcast`.

## What's next

- [All frontmatter fields](frontmatter) — complete frontmatter reference
- [Covers, images and media](covers-images-media) — media components
