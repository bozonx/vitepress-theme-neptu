---
title: Как работает SEO — обзор
description: >
  Карта SEO-механизмов темы: что генерируется автоматически при сборке, где это
  настраивается и как отключить любую функцию.
authorId: ivan-k
date: 2026-07-12
category: { name: 'SEO', slug: 'seo' }
tags: [seo]
descrAsPreview: true
---

Тема Neptu закрывает все технические аспекты SEO за вас: достаточно задать `siteUrl` — и при сборке появляется полный набор SEO механизмов позволяющий полностью закрыть тему SEO для вашего блога.

Задайте `siteUrl` в конфиге 1го уровня без завершающего слэша:

```ts
// .vitepress/config.ts
siteUrl: 'https://myblog.org'
```

## Что генерируется автоматически

При сборке для всего сайта создаётся:

| Механизм | Что делает | Подробнее |
| --- | --- | --- |
| **sitemap.xml** | карта сайта из `siteUrl`, без `noindex`-страниц | [Ленты и поиск](seo-feeds-search) |
| **robots.txt** | со ссылкой на sitemap | [Ленты и поиск](seo-feeds-search) |
| **RSS / Atom / JSON** | ленты для каждой локали | [Ленты и поиск](seo-feeds-search) |
| **Open Graph + Twitter card** | превью для соцсетей на каждой странице | [Ленты и поиск](seo-feeds-search) |
| **JSON-LD** | микроразметка `BlogPosting` для постов | [Микроразметка JSON-LD](json-ld) |
| **canonical** | ссылка на первоисточник страницы | [Канонические ссылки и кросспостинг](canonical-crosspost) |
| **hreflang** | связь переведённых версий | [Связывание переводов и hreflang](i18n-hreflang) |

## Как отключить любую функцию

Все SEO-функции включены по умолчанию. Выключаются они в двух местах:

```yaml
# Глобально — src/site.yaml
themeConfig:
  seo:
    og: true
    jsonLd: true
    hreflang: true
    canonical: true
    rss: true
```

```yaml
# Для одной страницы — во frontmatter поста (переопределяет глобальное)
seo:
  jsonLd: false
```

## Дальше

- [Ленты, поиск и SEO-переключатели](seo-feeds-search) — RSS, Pagefind, популярные посты, robots, sitemap.
- [Микроразметка JSON-LD](json-ld) — расширение схемы под свои нужды.
- [Канонические ссылки и кросспостинг](canonical-crosspost) — перепубликация без потери позиций.
- [Публикация и деплой](deploy) — как выложить готовый сайт в интернет.
