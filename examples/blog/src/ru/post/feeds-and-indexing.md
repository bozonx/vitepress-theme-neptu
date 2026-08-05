---
title: Ленты, robots и sitemap
description: >
  Механизмы индексации всего сайта — ленты RSS/Atom/JSON, автоматические
  robots.txt и sitemap.xml. Настройка в site.yaml и пути к файлам.
authorId: ivan-k
date: 2026-07-11
category: { name: 'SEO', slug: 'seo' }
tags: [seo, config]
descrAsPreview: true
---

Помимо отдельных постов, тема генерирует файлы для поисковых систем и
ридеров-подписок. Здесь — ленты, robots и sitemap. Общая карта SEO — в
[обзоре](seo-overview); поиск вынесен в [отдельную статью](search-pagefind),
а переключатели и canonical — в [SEO-переключатели и canonical](seo-toggles-canonical).

## Ленты (RSS / Atom / JSON)

Включены по умолчанию. Ссылки выводятся в сайдбаре (RSS + Atom) и в `<head>`
каждой страницы. Настраиваются в `src/site.yaml`:

```yaml
themeConfig:
  feeds:
    maxPosts: 50
    formats: ['rss', 'atom', 'json']
    fullContent: false
```

Пути к файлам для каждой локали: `/ru/feed.rss`, `/ru/feed.atom`, `/ru/feed.json`.

По умолчанию каждый элемент содержит описание или автоматически созданное
превью. `fullContent: true` дополнительно включает безопасный HTML всей статьи.
Относительные ссылки и изображения становятся абсолютными. Feed renderer не
исполняет пользовательские Vue-компоненты и опциональные Markdown-плагины; если
на них построена основная часть статьи, лучше оставить режим превью.

## robots.txt

Если в `public/` нет своего `robots.txt`, тема генерирует его при сборке:

```text
User-agent: *
Allow: /

Sitemap: https://<siteUrl>/sitemap.xml
```

URL sitemap берётся из `siteUrl`. Свой файл положите в `public/robots.txt` — тема
его не тронет (но предупредит, если в нём нет директивы `Sitemap:`).

## sitemap.xml

Собирается автоматически из `siteUrl`. Страницы с `robots: noindex` (заданным через
`head`) исключаются и из sitemap. Служебные списки (`recent/`, `popular/`,
`archive/`, `tags/`, `authors/`) в карту сайта не попадают.

Посты и страницы без перевода включаются наравне с остальными — переведённая
версия не требуется. Вложенные посты (`post/my-article/index.md`) попадают в
sitemap по своему папочному адресу.

## Что вынесено в отдельные посты

Остальные SEO-механизмы разобраны детально в своих постах:

- **Поиск Pagefind** — [индексация и настройка](search-pagefind).
- **Микроразметка JSON-LD** — [расширение схемы под свои нужды](json-ld).
- **Канонические ссылки и кросспостинг** — [SEO-переключатели и canonical](seo-toggles-canonical).
- **Связывание переводов и hreflang** — [связь локалей между собой](i18n-hreflang).
