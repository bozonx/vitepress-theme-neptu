---
title: Медиа-компоненты — YouTube, видео, аудио, скачивание
description: >
  Тема глобально регистрирует четыре компонента, доступных в любом markdown без
  импорта: YoutubeVideo, VideoFile, AudioFile, FileDownload.
date: 2025-06-15T10:00:00Z
authorId: ivan-k
cover: https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop
coverWidth: 1200
coverHeight: 675
coverAlt: Аудиооборудование и микшерный пульт
category: { name: 'Медиа', slug: 'media' }
tags:
  - media
descrAsPreview: true
translations:
  en: /en/post/media-components
---

Тема регистрирует четыре медиа-компонента глобально, поэтому их можно вставлять
в любой markdown-файл без импортов. Ниже каждый показан вживую, а следом —
тег, который его породил.

## YoutubeVideo

Адаптивный ролик 16:9. Передайте `id` видео (то, что после `?v=`).

<YoutubeVideo id="dQw4w9WgXcQ" />

```md
<YoutubeVideo id="dQw4w9WgXcQ" />
```

## VideoFile

Плеер для локального видео с нативными контролами.

<VideoFile
  url="/media/sample-video.mp4"
  filename="Big Buck Bunny — пример видео (MP4)"
/>

```md
<VideoFile url="/media/sample-video.mp4" filename="Пример видео (MP4)" />
```

## AudioFile

Аудиоплеер со ссылкой на скачивание.

<AudioFile
  url="https://www.w3schools.com/html/horse.mp3"
  filename="Пример аудио (horse.mp3)"
/>

```md
<AudioFile url="https://example.com/episode.mp3" filename="Выпуск 1" />
```

## FileDownload

Оформленная кнопка скачивания любого файла.

<FileDownload
  url="https://www.w3.org/WAI/WCAG21/wcag21.pdf"
  filename="WCAG 2.1 PDF"
/>

```md
<FileDownload url="https://example.com/archive.zip" filename="Исходники" />
```
