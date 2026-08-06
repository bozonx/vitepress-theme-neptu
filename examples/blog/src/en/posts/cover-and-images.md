---
title: Cover Images & Lightbox
description: >
  Local vs external cover images, coverAlt / coverDescription / coverWidth / coverHeight,
  and how body images open in a zoomable lightbox.
date: 2025-04-20T09:00:00Z
authorId: ivan-k
cover: https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop
coverWidth: 1200
coverHeight: 800
coverAlt: Mountain landscape at sunset
coverDescription: "A sunset over mountain peaks. Photo by [Jeremy Bishop](https://unsplash.com/@jeremybishop) on Unsplash."
category: Media
tags:
  - frontmatter
  - cover
  - media
descrAsPreview: true
translations:
  ru: /ru/posts/cover-and-images
---

The image above is this post's **cover**, set entirely from frontmatter. Below,
the images inside the body open in a **lightbox** — click one to try it.

## External cover

For a remote URL the theme can't measure the file, so you supply
`coverWidth` / `coverHeight` yourself to prevent layout shift.

### How it's done

```yaml
cover: https://images.unsplash.com/photo-1501785888041-...
coverWidth: 1200
coverHeight: 800
coverAlt: Mountain landscape at sunset
coverDescription: "Caption with **markdown** and [links](https://example.com)."
```

## Local cover

Put the file in `src/public/img/` and reference it with a leading `/img/`. The
theme reads the file at build time and fills in the dimensions for you.

```yaml
cover: /img/my-post-cover.jpg
# no coverWidth/coverHeight needed — measured automatically
```

You can also co-locate the cover next to the markdown file or in a
folder-per-article layout — see [Where to Put Images & Media](media-asset-placement)
for all three approaches.

```yaml
# co-located next to the .md file
cover: ./cover.jpg

# or in a media subfolder (folder-per-article layout)
cover: ./media/cover.jpg
```

## Body images & the lightbox

Ordinary markdown images anywhere in the body are lazy-loaded and become
clickable — clicking opens a full-screen, zoomable, keyboard-navigable lightbox
(mounted globally by the theme). Try it:

![A cozy cabin in the woods](https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop)

![A calm lake reflecting the sky](https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=1000&auto=format&fit=crop)

### How it's done

Nothing special — just standard markdown. The lightbox and lazy-loading are on
by default:

```md
![A cozy cabin in the woods](https://images.unsplash.com/photo-...)
```

Use <kbd>Esc</kbd> to close, arrow keys to move between images, and scroll or
double-click to zoom.
