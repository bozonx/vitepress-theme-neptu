---
title: Welcome — Start Here
description: >
  A one-page tour of this demo blog and how each post documents a feature of the
  theme. Read this first.
date: 2025-06-10T09:00:00Z
authorId: ivan-k
cover: https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop
coverWidth: 1200
coverHeight: 800
coverAlt: A laptop and a cup of coffee on a wooden desk
coverDescription: "Photo by [Alejandro Escamilla](https://unsplash.com/@alejandroescamilla) on Unsplash."
category: Getting Started
tags:
  - guide
descrAsPreview: true
translations:
  ru: /ru/posts/welcome
---

Welcome! This whole site is a **living manual** for
[vitepress-theme-neptu](https://github.com/bozonx/vitepress-theme-neptu).
Instead of separate docs, each post and page here *is* the documentation: you see
a feature rendered, then the exact frontmatter or config that produced it.

## How to read a demo post

Every feature post follows the same shape:

1. The feature, rendered live (this post's cover image above is an example).
2. A **“How it's done”** section with the source you'd copy into your own file.

For instance, the cover image at the top of this post came from:

## How it's done

```yaml
cover: https://images.unsplash.com/photo-1499750310107-...
coverWidth: 1200
coverHeight: 800
coverAlt: A laptop and a cup of coffee on a wooden desk
coverDescription: "Photo by [Alejandro Escamilla](https://unsplash.com/@...) on Unsplash."
```

## The tour

**Frontmatter**
- [Full-featured post](full-featured) — every field, turned on at once.
- [Cover images & lightbox](cover-and-images) — local vs external covers, body images.
- [Author, video & podcast](author-video-podcast) — author block, video button, podcast dropdown.
- [Preview & search](preview-and-search) — control list previews and the search index.
- [Footer, sharing & similar](post-footer-and-sharing) — the block stack below every post.

**Media**
- [Media components](media-components) — YouTube, local video, audio, file download.

**SEO**
- [JSON-LD](json-ld) — automatic structured data + custom overrides.
- [Canonical & cross-posting](canonical-crosspost) — avoid duplicate-content penalties.
- [i18n & hreflang](i18n-hreflang) — this post exists in Russian too.

**Configuration** (in the `pages/*` section)
- [Config layers](../pages/config-layers) · [Color themes & fonts](../pages/color-themes) ·
  [Nav, sidebar & footer](../pages/nav-sidebar-footer) ·
  [Feeds, search & SEO toggles](../pages/seo-feeds-search) ·
  [Advanced: hooks & external content](../pages/advanced)

## Explore the layouts

The sidebar links to every generated listing layout — **Recent**, **Popular**,
**Archive** (by year → month), **Authors**, and the **Tags** cloud. Switch
languages with the toggle in the top bar.
