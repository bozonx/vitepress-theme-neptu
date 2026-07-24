---
title: Компоненты
description: Категории компонентов темы — макеты, посты, утилиты и doc-components для использования в markdown.
date: 2025-06-26T10:00:00Z
authorId: ivan-k
tags:
  - guide
  - components
---

# Компоненты

Компоненты темы организованы по назначению.

## Категории

- **`layout-parts/`** — части макета (SideBar, TopBar, Footer, LayoutAside).
- **`post/`** — компоненты отображения поста (PostAuthor, PostDate, PostTags, PostComments).
- **`utility/`** — компоненты утилитарных страниц (HomeHero, Authors, AllTagsList, Years).
- **`doc-components/`** — компоненты для использования прямо в markdown (AudioFile, FileDownload, YoutubeVideo).

## Компоненты макета

| Компонент | Описание |
|-----------|----------|
| `HomeHero` | Hero-баннер для главной страницы |
| `AllTagsList` | Облако тегов |
| `NeptuAuthors` | Страница со списком авторов |
| `NeptuYears` | Архив по годам |
| `PopularPostsList` | Виджет популярных постов |
| `RecentList` | Виджет свежих постов |
| `TagPostsList` | Посты, отфильтрованные по тегу |
| `MonthPostsList` | Посты, отфильтрованные по месяцу |
| `PageFindSearch` | Интеграция поиска Pagefind |
| `Pagination` | Пагинация списков |

## Doc-компоненты

Эти компоненты зарегистрированы глобально и могут использоваться в любом `.md`-файле.

### AudioFile

```vue
<AudioFile
  url="/audio/sample.mp3"
  filename="Sample Audio.mp3"
  autoplay
  :show-controls="true"
/>
```

**Props**

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `url` | `string` | обязателен | URL аудиофайла |
| `filename` | `string` | `''` | Имя файла для скачивания |
| `class` | `string` | `''` | CSS-классы |
| `disabled` | `boolean` | `false` | Отключить плеер |
| `autoplay` | `boolean` | `false` | Автовоспроизведение |
| `showControls` | `boolean` | `true` | Показывать элементы управления |

**Слоты**

| Слот | Описание |
|------|----------|
| `default` | Пользовательское описание аудио |

Поддерживаемые форматы: MP3, WAV, OGG, FLAC, AAC, M4A, WMA.

### FileDownload

```vue
<FileDownload
  url="/files/manual.pdf"
  filename="manual.pdf"
  type="PDF"
  button-text="Скачать инструкцию"
/>
```

**Props**

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `url` | `string` | обязателен | URL файла |
| `filename` | `string` | `''` | Имя файла для скачивания |
| `type` | `string` | `''` | Метка типа файла (например `PDF`) |
| `buttonText` | `string` | `'Download'` | Текст кнопки |
| `class` | `string` | `''` | CSS-классы |
| `disabled` | `boolean` | `false` | Отключить кнопку |

**Слоты**

| Слот | Описание |
|------|----------|
| `default` | Пользовательское отображение имени файла (поддерживает HTML) |

Автоопределение иконок для: PDF, DOC/DOCX, XLS/XLSX, PPT/PPTX, TXT, ZIP/RAR/7Z,
изображений, видео, аудио, JSON, JS, TS, HTML, CSS, XML.

### YoutubeVideo

См. отдельный пакет: [vitepress-youtube-embed](https://github.com/miletorix/vitepress-youtube-embed)

```vue
<YoutubeVideo id="dQw4w9WgXcQ" />
```
