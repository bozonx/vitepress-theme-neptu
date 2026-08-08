---
title: Where to store images and media
description: >
  Three methods for organizing media files: a global public folder, alongside
  markdown files, or in a dedicated media subfolder per article.
authorId: ivan-k
date: 2026-07-15
category: media
tags: [media, images, structure]
descriptionAsPreview: true
translations:
  ru: /ru/posts/media-asset-placement
---

The theme supports three methods for placing media assets (images, videos, audio) in your blog. All three work with automatic `width`/`height` attributes and built-in media components.

## Method 1: Global `public` folder

Place files in `src/public/` — they're copied to the site root as-is:

```text
src/
├─ public/
│  ├─ img/
│  │  ├─ logo.webp
│  │  └─ hero-bg.jpg
│  └─ media/
│     └─ sample.mp3
```

Reference them with absolute paths starting from the site root:

```md
![Logo](/img/logo.webp)
```

**Use case:** shared assets used across multiple posts — logos, icons, background images, favicon.

## Method 2: Alongside markdown

Place media files next to the `.md` file:

```text
src/en/posts/
├─ my-article.md
├─ cover.jpg
└─ diagram.png
```

Reference them with relative paths:

```md
![Diagram](./diagram.png)
```

Or in frontmatter:

```yaml
cover: ./cover.jpg
```

The theme resolves relative paths to site-root paths at build time. `./cover.jpg` becomes `/en/posts/my-article/cover.jpg` in the built site.

**Use case:** simple posts with a few images that don't need a separate folder.

## Method 3: Per-article `media` subfolder

For posts organized as folders, use a `media/` subfolder:

```text
src/en/posts/
├─ my-article/
│  ├─ index.md
│  └─ media/
│     ├─ cover.jpg
│     ├─ photo1.jpg
│     └─ video.mp4
```

Reference them the same way as method 2:

```md
![Photo](./media/photo1.jpg)
```

```yaml
cover: ./media/cover.jpg
```

**Use case:** media-heavy articles with many images, videos or audio files. Keeps everything for one article in one place.

## How paths are resolved

All three methods support automatic `width`/`height` attribute injection. The theme reads image dimensions at build time and adds them to `<img>` tags to prevent Cumulative Layout Shift (CLS).

| Method | Source path | Built path |
| --- | --- | --- |
| `public/` | `/img/logo.webp` | `/img/logo.webp` |
| Alongside MD | `./cover.jpg` | `/en/posts/my-article/cover.jpg` |
| `media/` subfolder | `./media/photo1.jpg` | `/en/posts/my-article/media/photo1.jpg` |

## Which method to choose

- **`public/`** — for site-wide shared assets (logos, icons, favicons)
- **Alongside MD** — for simple posts with 1-3 images
- **`media/` subfolder** — for media-heavy articles with many files

All three methods work seamlessly with the built-in media components (`YouTubeVideo`, `VideoFile`, `AudioFile`, `FileDownload`) and cover images.

## What's next

- [Covers, images and media](covers-images-media) — cover configuration and media components
- [Project structure](project-structure) — overall folder structure
