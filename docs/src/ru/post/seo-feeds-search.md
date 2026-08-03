---
title: Ленты, поиск и SEO-переключатели
description: Механизмы всего сайта — ленты RSS/Atom/JSON, поиск Pagefind, популярные посты через GA4, robots.txt, sitemap и глобальные переключатели SEO.
date: 2025-02-15T09:00:00Z
authorId: ivan-k
category: { name: 'SEO', slug: 'seo' }
tags:
  - seo
  - guide
descrAsPreview: true
---

# Ленты, поиск и SEO-переключатели

Помимо отдельных постов, тема настраивает механизмы уровня всего сайта. Здесь —
ленты, поиск, популярные посты, robots и sitemap. Общая карта SEO — в
[обзоре](seo-overview); микроразметка и canonical вынесены в отдельные посты.

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

## Поиск (Pagefind)

Поиск работает на [Pagefind](https://pagefind.app): он индексирует уже собранный
сайт. **Pagefind входит в состав темы** — ставить его отдельно, добавлять шаг
сборки или подключать скрипты в `head` не нужно. Достаточно одного элемента
конфигурации:

```ts
// .vitepress/config.ts
themeConfig: {
  search: { provider: 'pagefind', options: { bodyMarker: 'data-pagefind-body' } },
},
```

Что тема делает за вас:

- **Индексация.** По окончании `vitepress build` (хук `buildEnd`) тема сама
  строит индекс и кладёт его в `<outDir>/pagefind`. Build-скрипт остаётся
  обычным: `vitepress build src`.
- **Загрузка UI.** `pagefind-ui.css` и `pagefind-ui.js` подгружаются модалкой
  поиска при первом открытии. Это экономит ~135 КБ на каждой загрузке страницы
  и избавляет dev-режим от 404 на ещё не существующие файлы индекса.

Индекс строится только из production-сборки, поэтому поиск работает после
`npm run build` + `npm run preview`, а не в dev — при открытии поиска в dev
будет понятное предупреждение в консоли.

Индексируется только текст статьи: блоки автора, комментариев, шаринга, похожих
постов и ссылки «Популярное» помечены `data-pagefind-ignore` и не попадают в
сниппеты. Теги поста доступны как фильтр `tag`, а дата — как сортировка `date`.
Исключить пост из индекса можно через `searchIncluded: false` — см.
[Превью и поиск](preview-and-search).

### Настройка индексации

Параметры индексации задаются в `search.index` и передаются в Pagefind:

```ts
themeConfig: {
  search: {
    provider: 'pagefind',
    options: { bodyMarker: 'data-pagefind-body' },
    index: {
      // enabled: false,             // не индексировать (например, чтобы запускать CLI вручную)
      // glob: '**/*.html',          // какие файлы индексировать
      // excludeSelectors: ['.ads'], // что игнорировать помимо data-pagefind-ignore
      // forceLanguage: 'ru',        // индексировать весь сайт как один язык
      // verbose: true,              // подробный лог индексации
    },
  },
},
```

Если нужны флаги, которых нет в `search.index`, поставьте `enabled: false` и
вызывайте [Pagefind CLI](https://pagefind.app/docs/config-options/) сами после
сборки.

## Популярные посты (Google Analytics 4)

Секция сайдбара «Популярное» и список [`popular/1`](../popular/1) заполняются на
основе реальных просмотров из GA4 — **на этапе сборки**. Статистика запрашивается
один раз и «запекается» в статические страницы: никаких клиентских запросов к
Google API, приватный ключ используется только на сервере сборки.

Интеграция включена по умолчанию. Учётные данные передаются через переменные окружения:

```ts
// .vitepress/config.ts
export const popularPosts = {
  enabled: true,
  sortBy: 'pageviews', // 'pageviews' | 'uniquePageviews' | 'avgTimeOnPage'
  fallback: 'latest', // значение по умолчанию; также доступно 'hide'
  dataSource: {
    provider: 'ga4',
    propertyId: process.env.GA_PROPERTY_ID,
    credentialsJson: process.env.GA_CREDENTIALS_JSON,
  },
}
```

### Настройка доступа к GA4

1. Создайте **Service Account** в [Google Cloud Console](https://console.cloud.google.com/) и скачайте JSON-ключ.
2. Скопируйте `client_email` из ключа и добавьте его в **Google Analytics 4** как пользователя с ролью **Viewer**.
3. Передайте данные через переменные окружения (никогда не коммитьте ключ в репозиторий):

```bash
GA_PROPERTY_ID=123456789
GA_CREDENTIALS_JSON='{"type": "service_account", ...}'
```

Система устойчива к сбоям: если данных нет, сеть недоступна или ключ неверен,
тема выводит предупреждение, **сборка продолжается**, а список получает последние
посты. Заголовок при этом меняется на «Последние». Установите `fallback: 'hide'`,
чтобы скрыть такой список, или `enabled: false`, чтобы полностью отключить
функции популярных постов.
Как передать секреты в CI — в посте [Публикация и деплой](deploy).

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

## SEO-переключатели

Все SEO-функции включены по умолчанию. Выключаются глобально в `src/site.yaml` или
для отдельной страницы во frontmatter через ключ `seo`:

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
# Для одной страницы — во frontmatter (переопределяет глобальное)
seo:
  jsonLd: false
  og: false
```

## Что вынесено в отдельные посты

Три SEO-механизма разобраны детально в своих постах — здесь только упоминаем:

- **Микроразметка JSON-LD** — [расширение схемы под свои нужды](json-ld).
- **Canonical и кросспостинг** — [указание первоисточника](canonical-crosspost).
- **Hreflang** — [связь переводов между локалями](i18n-hreflang).
