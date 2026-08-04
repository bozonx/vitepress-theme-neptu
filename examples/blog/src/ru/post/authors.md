---
title: Авторы
description: >
  Как authorId связывает пост с записью в _authors.yaml, тема строит страницу
  автора, подставляет карточку в футер, выводит мета-теги twitter:creator и
  article:author, а также генерирует JSON-LD Person.
authorId: ivan-k
date: 2026-08-04
category: { name: 'Контент', slug: 'writing' }
tags: [frontmatter, config]
descrAsPreview: true
---

Автор фигурирует в следующих местах:

- В футере поста выводится автор поста по `authorId`, указанным в frontmatter поста
- На странице списка авторов, выводятся карточки авторов, а на странице самого автора отображается его список постов
- В мета-тегах `twitter:creator` и `article:author` для SEO и соцсетей
- В JSON-LD `Person` для структурированных данных

## Как добавить автора

```yaml
# в frontmatter поста
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

## Авторы для всех локалей (`site.yaml`)

Файл `src/site.yaml` — общий слой для всех локалей. Авторов можно объявить
прямо в нём под `themeConfig.authors`:

```yaml
# src/site.yaml
themeConfig:
  authors:
    - id: 'ivan-k'
      name: 'Иван К'
      description: 'Мейнтейнер темы.'
      image: 'https://…/avatar.jpg'
      twitterHandle: 'neptu_blog'
      links:
        - type: 'github'
          url: 'https://github.com/…'
          title: 'GitHub'
```

Эти записи применяются ко всем локалям. Локальный `_authors.yaml` и
`_site.yaml themeConfig.authors` имеют приоритет для совпадающего `id` —
значения полей локального автора переопределяют общие поле-за-полем.

## Файл `_authors.yaml`

Файл — массив профилей. Обязателен только `id`; остальные поля: `name`,
`description`, `avatar`, `image`, `imageWidth`, `imageHeight`, `twitterHandle`,
`links[]` (`type`, `url`, `title`). Пример и комментарии находятся рядом в
шаблоне.

Поле `image` используется для портрета на странице автора и в карточке автора.
`avatar` предусмотрен в схеме для компактных превью в списках, но в текущей
версии темы компоненты используют только `image`. `imageWidth` и `imageHeight`
определяются автоматически по URL изображения, но можно задать их вручную.

`description` рендерится как HTML — поддерживает Markdown-разметку.

### Слияние записей

Записи сливаются с `themeConfig.authors` по `id`; отдельный `_authors.yaml` имеет
приоритет для совпадающего поля.

Если `_site.yaml` использует `extends`, авторы также сливаются по `id` через всю
цепочку наследования: каждая запись `_authors.yaml` текущей локали имеет приоритет
над `_site.yaml themeConfig.authors` того же уровня, а затем результат
объединяется с родительскими уровнями по тому же правилу (child переопределяет
parent поле-за-полем).

### Шаблонные подстановки

Поля автора поддерживают шаблонные переменные `${theme.*}`, `${config.*}` и
`${t.*}` — те же, что и в `_site.yaml`. Подстановки применяются после слияния
всех слоёв конфигурации.

## Страница автора

Тема автоматически строит страницу автора по адресу `authors/<id>/` со списком
его постов. Эта страница доступна из сайдбара (если включена секция `authors`) и
из карточки автора в футере поста.

Доступна и страница популярных постов автора по адресу
`authors/<id>/popular/` — она использует сортировку по популярности вместо
хронологической.

Включается в сайдбаре:

```yaml
# src/<локаль>/_site.yaml
themeConfig:
  sidebar:
    authors: true
  # иконка секции авторов в сайдбаре (по умолчанию — встроенная)
  authorsIcon: 'lucide/users'
```

Все авторы перечислены на странице [`authors/`](../authors/).

## Карточка автора в футере

Карточка отображается в подвале поста, если у поста задан `authorId` и в
`postFooter` включён блок `author` (по умолчанию включён). Подробнее о составе
подвала — в [Настройки themeConfig](themeconfig-settings).

## SEO

Для постов с `authorId` тема генерирует следующие мета-теги и структурированные
данные:

- **`twitter:creator`** — из `twitterHandle` автора. Помогает Twitter/X
  связывать статью с автором в карточках-превью.
- **`article:author`** — Open Graph-тег с абсолютным URL страницы автора.
- **JSON-LD `Person`** — структурированные данные на странице автора: имя,
  описание, портрет (`ImageObject`), ссылки (`sameAs`) и URL.
- **JSON-LD `article.author`** — объект `Person` (имя + URL) в структурированных
  данных статьи.

Site-level `twitterSite` (общий для всего блога, не автора) задаётся отдельно в
`themeConfig.twitterSite` и выводится как мета-тег `twitter:site`.
