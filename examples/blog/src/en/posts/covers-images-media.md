---
title: Covers, images and media
description: >
  Post covers (local/external, dimensions, alt text), in-text images with
  lightbox functionality, and media components for YouTube, video, audio and
  file downloads.
authorId: ivan-k
date: 2026-07-16
category: media
tags: [covers, images, media, components]
descriptionAsPreview: true
translations:
  ru: /ru/posts/covers-images-media
---

## Post covers

A cover is the main image shown at the top of a post and in post list cards. It's set via frontmatter:

```yaml
cover: https://images.unsplash.com/photo-...
coverWidth: 1200
coverHeight: 800
coverAlt: A description of the image
coverDescription: "Photo by [Author](https://unsplash.com) on Unsplash."
```

### Cover fields

| Field | Required | Description |
| --- | --- | --- |
| `cover` | No | URL or co-located path to the cover image |
| `coverWidth` | No | Image width in pixels (required for external URLs to avoid CLS) |
| `coverHeight` | No | Image height in pixels |
| `coverAlt` | No | Alt text for `<img>` and `og:image:alt`. Plain text. |
| `coverDescription` | No | Caption below the cover. Supports markdown. |

For local images (co-located), `coverWidth` and `coverHeight` are auto-detected. For external URLs (`https://...`), you must specify them manually to prevent layout shift.

### Cover in post lists

Covers automatically appear in post list cards. If no cover is set, the card shows a placeholder or the post's first paragraph.

## In-text images

Images in markdown are automatically:
- Lazy-loaded (`loading="lazy"`)
- Given `width` and `height` attributes (for local images)
- Made clickable — opens a fullscreen lightbox with zoom

```md
![A cozy cabin](https://images.unsplash.com/photo-...)
```

No special syntax needed — just standard markdown image syntax.

## Media components

The theme registers five Vue components globally — use them in any `.md` file without import:

### YouTubeVideo

```html
<YouTubeVideo id="dQw4w9WgXcQ" />
```

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | String | Yes | YouTube video ID |

### VideoFile

```html
<VideoFile url="/media/sample.mp4" filename="Sample video (MP4)" />
```

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | String | Yes | URL to the video file |
| `filename` | String | No | Display label |

Supported formats: MP4, WebM, OGG.

### AudioFile

```html
<AudioFile url="/media/podcast.mp3" filename="Episode 1 (MP3)" />
```

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | String | Yes | URL to the audio file |
| `filename` | String | No | Display label and download link text |

Supported formats: MP3, OGG, WAV.

### FileDownload

```html
<FileDownload url="/files/report.pdf" filename="Annual Report (PDF)" />
```

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | String | Yes | URL to the file |
| `filename` | String | No | Display label and download link text |

### NeptuAd

```html
<NeptuAd />
```

Places an ad block at a specific location in the article. See [Ad blocks](ads) for details.

## What's next

- [Where to store images and media](media-asset-placement) — file placement strategies
- [Components reference](components) — all exported components
