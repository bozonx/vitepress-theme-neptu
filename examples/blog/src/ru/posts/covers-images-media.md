---
title: Обложки, картинки и медиа
description: >
  Обложки постов — локальные и внешние, coverAlt / coverDescription / coverWidth /
  coverHeight, изображения в тексте с лайтбоксом и медиа-компоненты: YouTube,
  видео, аудио, скачивание.
authorId: ivan-k
cover: https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop
coverWidth: 1200
coverHeight: 800
coverAlt: Горный пейзаж на закате
coverDescription: "Закат над горными вершинами. Фото [Jeremy Bishop](https://unsplash.com/@jeremybishop) на Unsplash."
date: 2026-08-04
category: { name: 'Медиа', slug: 'media' }
tags: [media, frontmatter, components]
descriptionAsPreview: true
---

Изображение выше — это **обложка** поста, полностью заданная во frontmatter.
Изображения в тексте статьи открываются в **лайтбоксе** — нажмите на любое из них, чтобы проверить.
Тема также глобально регистрирует четыре компонента для вставки медиа прямо в тело статьи, доступных в любом markdown файле без импорта.

## Обложка

```yaml
cover: https://images.unsplash.com/photo-1501785888041-...
# Вариант с локальной обложкой
#cover: /img/my-post-cover.jpg
coverWidth: 1200
coverHeight: 800
coverAlt: Горный пейзаж на закате
coverDescription: "Подпись с **markdown** и [ссылками](https://example.com)."
```

Для локальной картинки размеры указывать не обязаетльно, но для внешних URL рекомендуется указать `coverWidth` / `coverHeight` во избежание сдвига вёрстки.

Локальные обложки, да и другие медиа файлы можно загружать не только, например в `src/public/img/`, но и располагать рядом с постом, подробней смотрите в [Где хранить изображения и медиа](media-asset-placement).

## Изображения в тексте и лайтбокс

Обычные картинки в markdown в любом месте текста статьи лениво загружаются и становятся
кликабельными — нажатие открывает полноэкранный лайтбокс с возможностью зума и навигацией с клавиатуры.
Попробуйте сами:

![Уютный домик в лесу](https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop)

![Тихое озеро с отражением неба](https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=1000&auto=format&fit=crop)

```md
![Уютный домик в лесу](https://images.unsplash.com/photo-...)
```

> Используйте <kbd>Esc</kbd> для закрытия, стрелки для перемещения между изображениями и прокрутку или двойной клик для зума.

## Медиа-компоненты

Вставляйте медиа файлы с плеером и кнопкой для скачивания прямо в тело статьи.

### YouTubeVideo

Адаптивный ролик 16:9. Передайте `id` видео (то, что после `?v=`).

<YouTubeVideo id="dQw4w9WgXcQ" />

```md
<YouTubeVideo id="dQw4w9WgXcQ" />
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

Кнопка для скачивания любого файла.

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

`YouTubeVideo` принимает только `id` — одиннадцатисимвольный идентификатор
ролика.

У всех трёх файловых компонентов есть слот по умолчанию — короткое пояснение
под названием файла:

```md
<FileDownload url="/files/report.pdf" filename="Годовой отчёт">
  PDF, 2,4 МБ — версия от марта 2026
</FileDownload>
```

> Пути, начинающиеся с `/`, автоматически дополняются значением `base`.

## Поддерживаемые форматы

- **Видео:** MP4, WebM, OGV, MOV, M4V — всё, что играет браузер.
- **Аудио:** MP3, WAV, OGG, FLAC, AAC, M4A.
- **Скачивание:** любой файл. Иконка подбирается по расширению — PDF,
  DOC/DOCX, XLS/XLSX, PPT/PPTX, TXT, ZIP/RAR/7Z, изображения, видео, аудио,
  JSON, JS, TS, HTML, CSS, XML; для остального выводится нейтральная иконка.
