---
title: Covers, images and media
description: >
  Post covers — local and external, coverAlt / coverDescription / coverWidth /
  coverHeight, in-text images with lightbox functionality, and media components:
  YouTube, video, audio, downloads.
authorId: ivan-k
cover: https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop
coverWidth: 1200
coverHeight: 800
coverAlt: Mountain landscape at sunset
coverDescription: "Sunset over mountain peaks. Photo by [Jeremy Bishop](https://unsplash.com/@jeremybishop) on Unsplash."
date: 2026-08-04
category: media
tags: [media, frontmatter, components]
descriptionAsPreview: true
translations:
  ru: /ru/posts/covers-images-media
---

The image above is the post **cover**, defined entirely in the frontmatter.
Images inside the article text open in a **lightbox** — click on any of them to test it.
The theme also globally registers four components for embedding media directly into the article body, available in any markdown file without importing.

## Cover

```yaml
cover: https://images.unsplash.com/photo-1501785888041-...
# Option with a local cover
#cover: /img/my-post-cover.jpg
coverWidth: 1200
coverHeight: 800
coverAlt: Mountain landscape at sunset
coverDescription: "Caption with **markdown** and [links](https://example.com)."
```

For local images, specifying dimensions is optional, but for external URLs specifying `coverWidth` / `coverHeight` is recommended to prevent Cumulative Layout Shift (CLS).

Local covers and other media files can be placed not only in `src/public/img/`, but also stored alongside the post; see [Where to store images and media](media-asset-placement) for details.

## In-text images and lightbox

Standard markdown images anywhere in the article text are lazily loaded and become clickable — clicking opens a fullscreen lightbox with zoom support and keyboard navigation.
Try it yourself:

![A cozy cabin in the woods](https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop)

![A quiet lake reflecting the sky](https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=1000&auto=format&fit=crop)

```md
![A cozy cabin in the woods](https://images.unsplash.com/photo-...)
```

> Use <kbd>Esc</kbd> to close, arrow keys to navigate between images, and scroll wheel or double click to zoom.

## Media components

Embed media files with players and download buttons directly into the article body.

### YouTubeVideo

Responsive 16:9 video player. Pass the video `id` (the part after `?v=`).

<YouTubeVideo id="dQw4w9WgXcQ" />

```md
<YouTubeVideo id="dQw4w9WgXcQ" />
```

### VideoFile

Video player for local video with native browser controls.

<VideoFile
  url="/media/sample-video.mp4"
  filename="Big Buck Bunny — video sample (MP4)"
/>

```md
<VideoFile url="/media/sample-video.mp4" filename="Video sample (MP4)" />
```

### AudioFile

Audio player with download link.

<AudioFile
  url="https://www.w3schools.com/html/horse.mp3"
  filename="Audio sample (horse.mp3)"
/>

```md
<AudioFile url="https://example.com/episode.mp3" filename="Episode 1" />
```

### FileDownload

Download button for any file.

<FileDownload
  url="https://www.w3.org/WAI/WCAG21/wcag21.pdf"
  filename="WCAG 2.1 PDF"
/>

```md
<FileDownload url="https://example.com/archive.zip" filename="Source files" />
```

## Props

`VideoFile`, `AudioFile` and `FileDownload` accept the same set of parameters:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `url` | `string` | required | Path to file: site-absolute (`/media/x.mp4`), relative (`./media/x.mp4`), or external URL |
| `filename` | `string` | name from `url` | Display label and filename upon download |
| `containerClass` | `string` | `''` | Additional CSS classes for wrapper |
| `disabled` | `boolean` | `false` | Disable player or button |

`YouTubeVideo` accepts only `id` — the 11-character video identifier.

All three file components have a default slot for a short explanation below the filename:

```md
<FileDownload url="/files/report.pdf" filename="Annual report">
  PDF, 2.4 MB — March 2026 version
</FileDownload>
```

> Paths starting with `/` are automatically prefixed with `base`.

## Supported formats

- **Video:** MP4, WebM, OGV, MOV, M4V — anything the browser can play.
- **Audio:** MP3, WAV, OGG, FLAC, AAC, M4A.
- **Download:** any file. The icon is selected by extension — PDF, DOC/DOCX, XLS/XLSX, PPT/PPTX, TXT, ZIP/RAR/7Z, images, video, audio, JSON, JS, TS, HTML, CSS, XML; other extensions display a generic icon.

---

Next: [Configuration layers, first-level config and string templates](config-layers)
