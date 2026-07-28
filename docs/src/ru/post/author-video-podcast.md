---
title: Блок автора, кнопка видео и выпадающий список подкастов
description: >
  Как authorId отображает карточку автора и мета-тег twitter:creator, а videoLink
  и podcasts добавляют кнопки с призывом к действию в верхней части поста.
date: 2025-06-10T11:00:00Z
authorId: ivan-k
cover: https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=1200&auto=format&fit=crop
coverWidth: 1200
coverHeight: 800
coverAlt: Микрофон в домашней студии подкастов
tags:
  - frontmatter
  - media
descrAsPreview: true
commentLink: https://github.com/bozonx/vitepress-theme-neptu/discussions
videoLink: https://www.youtube.com/watch?v=dQw4w9WgXcQ
videoLinkLang: RU
podcastLang: RU
podcasts:
  spotify: https://open.spotify.com/
  applepodcasts: https://podcasts.apple.com/
  youtube: https://www.youtube.com/
translations:
  en: /en/post/author-video-podcast
---

Три связанных поля превращают обычную статью в мультиформатный пост. Все они
отображаются на этой странице: **кнопка видео** и **выпадающий список подкастов** вверху,
а также **карточка автора** внизу.

## Автор

`authorId` связывает пост с записью в `_authors.yaml`. Затем тема отображает
карточку автора в футере, ссылается на страницу со списком постов автора и выводит
мета-тег `twitter:creator` из `twitterHandle` автора.

### Как это сделать

```yaml
# в посте
authorId: ivan-k
```

```yaml
# в src/ru/_authors.yaml
- id: 'ivan-k'
  name: 'Иван К'
  description: 'Мейнтейнер темы.'
  image: 'https://…/avatar.jpg'
  twitterHandle: 'neptu_blog'   # → twitter:creator для постов этого автора
  links:
    - type: 'github'
      url: 'https://github.com/…'
      title: 'GitHub'
```

## Кнопка видео

`videoLink` добавляет заметную кнопку в верхней части поста — это удобно, если к статье
прилагается видео.

```yaml
videoLink: https://www.youtube.com/watch?v=dQw4w9WgXcQ
videoLinkLang: RU     # язык метки, отображаемой на кнопке
```

## Выпадающий список подкастов

`podcasts` отображает выпадающий список ссылок на платформы, если пост также
доступен в виде аудио-выпуска.

```yaml
podcastLang: RU
podcasts:
  spotify: https://open.spotify.com/…
  applepodcasts: https://podcasts.apple.com/…
  youtube: https://www.youtube.com/…
```

## Ссылка на обсуждение

`commentLink` добавляет кнопку «Обсуждение» в футер статьи со ссылкой на платформу, где
вы ведете обсуждения (GitHub Discussions, Telegram, ветка форума…).

```yaml
commentLink: https://github.com/…/discussions
```
