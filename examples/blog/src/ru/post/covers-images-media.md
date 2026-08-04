---
title: Обложки, картинки и медиа
description: >
  Обложки постов — локальные и внешние, coverAlt / coverDescr / coverWidth /
  coverHeight, и медиа-компоненты: YouTube, видео, аудио, скачивание.
authorId: ivan-k
cover: https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop
coverWidth: 1200
coverHeight: 800
coverAlt: Горный пейзаж на закате
coverDescr: "Закат над горными вершинами. Фото [Jeremy Bishop](https://unsplash.com/@jeremybishop) на Unsplash."
date: 2026-08-04
category: { name: 'Контент', slug: 'writing' }
tags: [media, frontmatter, components]
descrAsPreview: true
---

Изображение выше — это **обложка** поста, полностью заданная во frontmatter.
Тема также глобально регистрирует четыре медиа-компонента, доступных в любом
markdown без импорта.

## Внешняя обложка

Для внешнего URL тема не может измерить файл, поэтому вы укажете
`coverWidth` / `coverHeight` самостоятельно во избежание сдвига вёрстки.

```yaml
cover: https://images.unsplash.com/photo-1501785888041-...
coverWidth: 1200
coverHeight: 800
coverAlt: Горный пейзаж на закате
coverDescr: "Подпись с **markdown** и [ссылками](https://example.com)."
```

## Локальная обложка

Поместите файл в `src/public/img/` и сошлитесь на него с префиксом `/img/`. Тема
читает файл во время сборки и определяет размеры автоматически.

```yaml
cover: /img/my-post-cover.jpg
# coverWidth/coverHeight не нужны — измеряются автоматически
```

Обложку можно также положить рядом с markdown-файлом или в папку на статью —
см. [Где хранить изображения и медиа](media-asset-placement) для всех трёх
способов.

```yaml
# рядом с .md-файлом
cover: ./cover.jpg

# или в подпапке media (папка на статью)
cover: ./media/cover.jpg
```

## Медиа-компоненты

Тема регистрирует четыре медиа-компонента глобально, поэтому их можно вставлять
в любой markdown-файл без импортов. Ниже каждый показан вживую, а следом —
тег, который его породил.

### YoutubeVideo

Адаптивный ролик 16:9. Передайте `id` видео (то, что после `?v=`).

<YoutubeVideo id="dQw4w9WgXcQ" />

```md
<YoutubeVideo id="dQw4w9WgXcQ" />
```

### VideoFile

Плеер для локального видео с нативными контролами.

<VideoFile
  url="/media/sample-video.mp4"
  filename="Big Buck Bunny — пример видео (MP4)"
/>

```md
<VideoFile url="/media/sample-video.mp4" filename="Пример видео (MP4)" />
```

### AudioFile

Аудиоплеер со ссылкой на скачивание.

<AudioFile
  url="https://www.w3schools.com/html/horse.mp3"
  filename="Пример аудио (horse.mp3)"
/>

```md
<AudioFile url="https://example.com/episode.mp3" filename="Выпуск 1" />
```

### FileDownload

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
