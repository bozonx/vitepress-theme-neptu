---
title: Медиа-компоненты — YouTube, видео, аудио, скачивание
description: >
  Тема глобально регистрирует четыре компонента, доступных в любом markdown без
  импорта: YoutubeVideo, VideoFile, AudioFile, FileDownload.
authorId: ivan-k
cover: https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop
coverWidth: 1200
coverHeight: 675
coverAlt: Аудиооборудование и микшерный пульт
translations:
  en: /en/post/media-components
date: 2026-07-22
category: { name: 'Медиа', slug: 'media' }
tags: [media, components]
descrAsPreview: true
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

## Props

`VideoFile`, `AudioFile` и `FileDownload` принимают один набор параметров:

| Prop | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `url` | `string` | обязателен | Путь к файлу: от корня сайта (`/media/x.mp4`), относительный (`./media/x.mp4`) или внешний URL |
| `filename` | `string` | имя из `url` | Подпись и имя файла при скачивании |
| `containerClass` | `string` | `''` | Дополнительные CSS-классы обёртки |
| `disabled` | `boolean` | `false` | Заблокировать плеер или кнопку |

`YoutubeVideo` принимает только `id` — одиннадцатисимвольный идентификатор
ролика. Некорректный id ничего не рендерит и пишет предупреждение в консоль.

У всех трёх файловых компонентов есть слот по умолчанию — короткое пояснение
под названием файла:

```md
<FileDownload url="/files/report.pdf" filename="Годовой отчёт">
  PDF, 2,4 МБ — версия от марта 2026
</FileDownload>
```

Пути, начинающиеся с `/`, автоматически дополняются значением `base`, поэтому
блог в подпапке работает без правок. Где хранить сами файлы — в статье
[Где хранить изображения и медиа](media-asset-placement).

## Поддерживаемые форматы

- **Видео:** MP4, WebM, OGV, MOV, M4V — всё, что играет браузер.
- **Аудио:** MP3, WAV, OGG, FLAC, AAC, M4A.
- **Скачивание:** любой файл. Иконка подбирается по расширению — PDF,
  DOC/DOCX, XLS/XLSX, PPT/PPTX, TXT, ZIP/RAR/7Z, изображения, видео, аудио,
  JSON, JS, TS, HTML, CSS, XML; для остального выводится нейтральная иконка.

Плееры сообщают об ошибках загрузки текстом и предлагают повторить попытку —
подписи переводятся ключами `t.videoFile`, `t.audioFile` и `t.fileDownload`
(см. [Локали](locales)).
