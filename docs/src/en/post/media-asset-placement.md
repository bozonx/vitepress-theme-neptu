---
title: Where to Put Images & Media
description: >
  Three supported approaches for placing media files — shared public directory,
  co-located next to the markdown file, or folder-per-article with a media
  subfolder — and which one to choose.
date: 2025-07-30T19:00:00Z
authorId: ivan-k
category: Media
tags:
  - media
  - guide
descrAsPreview: true
translations:
  ru: /ru/post/media-asset-placement
---

The theme supports three ways to organize images and other media files. All
three work for both cover images (frontmatter `cover`) and body images
(markdown `![alt](src)`). Pick the one that fits your workflow.

## 1. Shared public directory

The classic VitePress approach. All media lives under `src/public/` and is
referenced with an absolute path starting from the public root.

```text
src/
├─ public/
│  └─ img/
│     ├─ cover.jpg
│     └─ screenshot.png
└─ en/
   └─ post/
      └─ my-article.md
```

```yaml
# frontmatter
cover: /img/cover.jpg
```

```md
<!-- body -->
![Screenshot](/img/screenshot.png)
```

**When to use**: small blogs with few images, shared assets across posts
(logos, icons), or when you prefer a single media folder.

## 2. Co-located next to the markdown file

Images sit right next to the `.md` file and are referenced with a relative
path. The theme reads dimensions automatically at build time.

```text
src/
└─ en/
   └─ post/
      ├─ my-article.md
      ├─ cover.jpg
      └─ screenshot.png
```

```yaml
# frontmatter — relative path
cover: ./cover.jpg
```

```md
<!-- body — relative path -->
![Screenshot](./screenshot.png)
```

**When to use**: tutorials with screenshots, posts where you want everything
in one place. Deleting the `.md` file also deletes its images.

## 3. Folder-per-article with a media subfolder

Each article gets its own directory. The markdown file is `index.md` and
media lives in a subfolder (commonly named `media`). With `cleanUrls: true`
(enabled by default), the URL stays clean: `/en/post/my-article/`.

```text
src/
└─ en/
   └─ post/
      └─ my-article/
         ├─ index.md
         └─ media/
            ├─ cover.jpg
            ├─ diagram.svg
            └─ photo.png
```

```yaml
# frontmatter — relative to index.md
cover: ./media/cover.jpg
```

```md
<!-- body — relative to index.md -->
![Diagram](./media/diagram.svg)
![Photo](./media/photo.png)
```

**When to use**: image-heavy articles, long-form posts with many screenshots,
when you want the whole article (text + media) portable as a single folder.

## Comparison

| Approach | Path style | Portable | Auto dimensions | Best for |
|---|---|---|---|---|
| Public directory | `/img/foo.png` | No | Yes | Small blogs, shared assets |
| Co-located | `./foo.png` | Yes | Yes | Tutorials, single-file posts |
| Folder-per-article | `./media/foo.png` | Yes | Yes | Image-heavy, long-form |

All three approaches get automatic `width`/`height` injection for both cover
images and standalone body images (those wrapped in `<figure>`).

## Mix and match

You are not locked into one approach. A common pattern:

- **Shared assets** (logo, favicon, default OG image) in `src/public/`
- **Article media** co-located or in a folder-per-article

```md
<!-- shared logo from public -->
![Site logo](/img/logo.svg)

<!-- local screenshot co-located with the article -->
![Step 1](./screenshot-1.png)
```

## Media components

The theme's built-in components (`YoutubeVideo`, `VideoFile`, `AudioFile`,
`FileDownload`) also work with all three approaches. For local files, use
absolute paths from the public directory:

```md
<VideoFile url="/media/demo.mp4" filename="Demo video" />
```

For co-located video/audio, reference the file with a relative path the same
way as images — VitePress resolves it at build time.

## Recommendation

- **Starting out**: use `src/public/` — simplest, no surprises.
- **Growing blog with many images**: switch to co-located or
  folder-per-article for new posts. Existing posts in `public/` keep working.
- **Team / CMS workflow**: folder-per-article makes reviews and imports
  easier — each article is self-contained.
