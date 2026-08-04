---
title: Авторы
description: >
  Как authorId связывает пост с записью в _authors.yaml, тема строит страницу
  автора, подставляет карточку в футер и выводит мета-тег twitter:creator.
authorId: ivan-k
date: 2026-08-04
category: { name: 'Контент', slug: 'writing' }
tags: [frontmatter, config]
descrAsPreview: true
---

`authorId` связывает пост с записью в `_authors.yaml`. Затем тема отображает
карточку автора в футере, ссылается на страницу со списком постов автора и выводит
мета-тег `twitter:creator` из `twitterHandle` автора.

## Как это сделать

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

## Файл `_authors.yaml`

Файл — массив профилей. Обязателен только `id`; остальные поля: `name`,
`description`, `avatar`, `image`, `imageWidth`, `imageHeight`, `twitterHandle`,
`links[]` (`type`, `url`, `title`). Пример и комментарии находятся рядом в
шаблоне.

Записи сливаются с `themeConfig.authors` по `id`; отдельный `_authors.yaml` имеет
приоритет для совпадающего поля.

## Страница автора

Тема автоматически строит страницу автора по адресу `authors/<id>/` со списком
его постов. Эта страница доступна из сайдбара (если включена секция `authors`) и
из карточки автора в футере поста.

Включается в сайдбаре:

```yaml
# src/<локаль>/_site.yaml
themeConfig:
  sidebar:
    authors: true
```

Все авторы перечислены на странице [`authors/`](../authors/).

## Карточка автора в футере

Карточка отображается в подвале поста, если у поста задан `authorId` и в
`postFooter` включён блок `author` (по умолчанию включён). Подробнее о составе
подвала — в [Настройки themeConfig](themeconfig-settings).

## SEO

Из `twitterHandle` автора тема подставляет мета-тег `twitter:creator` в
`<head>` постов этого автора. Это помогает Twitter/X связывать статью с
автором в карточках-превью.
