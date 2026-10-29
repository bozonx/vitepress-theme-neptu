---
title: Where to store images and media
description: >
  Three supported ways to organize media files — the shared public folder,
  alongside the markdown file, or a per-article folder with a media subfolder —
  and how to choose between them.
authorId: ivan-k
translations:
  ru: /ru/posts/media-asset-placement
date: 2026-07-24
category: media
tags: [media]
descriptionAsPreview: true
---

The theme supports three ways to organize images and other media files. All three work for covers (frontmatter `cover`), inline images (markdown `![alt](src)`), and built-in media components. Choose whichever fits your workflow — you can mix them freely.

## 1. Global public folder

The classic VitePress approach. All media lives in `src/public/` and is referenced by an absolute path from the public root.

```text
src/
├─ public/
│  └─ img/
│     ├─ cover.jpg
│     └─ screenshot.png
└─ en/
   └─ posts/
      └─ my-article.md
```

```yaml
# frontmatter
cover: /img/cover.jpg
```

```md
<!-- article body -->
![Screenshot](/img/screenshot.png)
```

**When to use**: small blogs with few images, shared assets used across multiple posts, shared assets for different language versions of posts (such as a common cover for all translations of a post), or when it's simply convenient to keep all media in one folder.

## 2. Alongside the markdown file

Images live next to the `.md` file and are referenced using a relative path.

```text
src/
└─ en/
   └─ posts/
      ├─ my-article.md
      ├─ my-other-article.md
      ├─ cover.jpg
      └─ screenshot.png
```

```yaml
# frontmatter — relative path
cover: ./cover.jpg
```

```md
<!-- article body — relative path -->
![Screenshot](./screenshot.png)
```

**When to use**: when there are few media files and they don't clutter the posts folder. It is also convenient for custom folder structures inside `posts/` where you can group several posts into a subfolder and place their images and media files right alongside.

## 3. Per-article folder with media subfolder

Each article gets its own directory. The markdown file is named `index.md`, and media files live in a subfolder (usually `media`). The URL remains clean: `/en/posts/my-article/`.

```text
src/
└─ en/
   └─ posts/
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
<!-- article body — relative to index.md -->
![Diagram](./media/diagram.svg)
![Photo](./media/photo.png)
```

**When to use**: articles with many images, long-reads with numerous screenshots, or when you want to move an article (text + media) as a single self-contained folder.

## Media path features and behavior

- All three approaches can be combined within a single blog.
- With any approach, even with a per-article media folder, you can create nested structures — sub-articles.
- All three approaches receive automatic `width`/`height` attributes for covers and standalone images in the text (those wrapped in `<figure>`).
- The theme's built-in components (`YouTubeVideo`, `VideoFile`, `AudioFile`, `FileDownload`) work with all three approaches. Specify the `url` using the same logic: `<VideoFile url="/media/demo.mp4" />` or `<VideoFile url="./media/demo.mp4" />`.
- Standard media file extensions are handled: images (`png`, `jpg`, `jpeg`, `gif`, `svg`, `webp`, `avif`, `ico`, `bmp`), video (`mp4`, `webm`, `ogv`, `mov`, `m4v`), audio (`mp3`, `wav`, `ogg`, `oga`, `m4a`, `flac`, `aac`), and `pdf`. The `public/` directory and hidden dot-prefixed utility directories are not affected.

::: tip Hashing and caching
Files stored alongside articles do not have content hashes in their names — just like files from `public/`. If you replace an image keeping the same filename, a visitor may need to hard-refresh the page. For frequently updated images, include a version in the filename: `diagram-v2.svg`.
:::

---

Next: [Covers, images and media](covers-images-media)
