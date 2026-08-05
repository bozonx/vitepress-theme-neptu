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
| **sitemap.xml** | карта сайта из `siteUrl`, без `noindex`-страниц | [SEO-механизмы](seo-features) |
| **robots.txt** | со ссылкой на sitemap | [SEO-механизмы](seo-features) |
| **RSS / Atom / JSON** | ленты для каждой локали | [SEO-механизмы](seo-features) |
| **Open Graph + Twitter card** | превью для соцсетей на каждой странице | см. ниже |
| **JSON-LD** | микроразметка `BlogPosting` для постов | [Микроразметка JSON-LD](seo-json-ld) |
| **canonical** | ссылка на первоисточник страницы | [SEO-механизмы](seo-features) |
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
    autoCanonical: true       # авто-canonical по умолчанию
    rss: true
    maxDescriptionLength: 300
  twitterSite: '@your_handle' # twitter:site на каждой странице
```

```yaml
# Для одной страницы — во frontmatter поста (переопределяет глобальное)
seo:
  jsonLd: false
  og: false
```

## Дальше

- [SEO-механизмы](seo-features) — ленты, robots, sitemap, canonical, кросспостинг.
- [Поиск Pagefind](search-pagefind) — индексация, фильтры, исключение из поиска.
- [Микроразметка JSON-LD](seo-json-ld) — расширение схемы под свои нужды.
- [Публикация и деплой](deploy) — как выложить готовый сайт в интернет.
