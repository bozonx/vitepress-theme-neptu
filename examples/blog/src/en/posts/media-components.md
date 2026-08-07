---
title: Media Components — YouTube, Video, Audio, Download
description: >
  Four components are auto-registered by the theme and usable in any markdown
  file with no imports: YouTubeVideo, VideoFile, AudioFile, FileDownload.
date: 2025-03-10T10:00:00Z
authorId: ivan-k
cover: https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop
coverWidth: 1200
coverHeight: 675
coverAlt: Audio equipment and a mixing board
category: media
tags:
  - media
descriptionAsPreview: true
translations:
  ru: /ru/posts/media-components
---

The theme registers four media components globally, so you can drop them into any
markdown file without importing anything. Each is rendered live below, followed
by the exact tag that produced it.

## YouTubeVideo

Responsive 16:9 YouTube embed. Pass the video `id` (the part after `?v=`).

<YouTubeVideo id="dQw4w9WgXcQ" />

### How it's done

```md
<YouTubeVideo id="dQw4w9WgXcQ" />
```

## VideoFile

Inline player for a local/self-hosted video. Native controls: seek, volume,
fullscreen, picture-in-picture.

<VideoFile
  url="/media/sample-video.mp4"
  filename="Big Buck Bunny — sample video (MP4)"
/>

### How it's done

```md
<VideoFile url="/media/sample-video.mp4" filename="Sample video (MP4)" />
```

Place the file in `src/public/media/` and reference it with a leading `/media/`.

## AudioFile

Inline audio player with a download link.

<AudioFile
  url="/media/horse.mp3"
  filename="Sample audio (horse.mp3)"
/>

### How it's done

```md
<AudioFile url="https://example.com/episode.mp3" filename="Episode 1" />
```

## FileDownload

A styled download button for any file.

<FileDownload
  url="/media/sample.pdf"
  filename="Sample PDF"
/>

### How it's done

```md
<FileDownload url="https://example.com/archive.zip" filename="Source code" />
```

## Mixing them

You can combine all four in one post — e.g. a tutorial with a `<VideoFile>`
screencast, a related `<YouTubeVideo>` talk, an `<AudioFile>` podcast version,
and a `<FileDownload>` for the sample project.
