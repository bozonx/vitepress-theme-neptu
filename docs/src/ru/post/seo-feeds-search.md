---
title: Ленты, поиск и SEO-переключатели
description: Механизмы всего сайта — ленты RSS/Atom/JSON, поиск Pagefind, популярные посты через GA4, robots.txt, sitemap и глобальные переключатели SEO.
date: 2025-02-15T09:00:00Z
authorId: ivan-k
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
```

Пути к файлам для каждой локали: `/ru/feed.rss`, `/ru/feed.atom`, `/ru/feed.json`.

## Поиск (Pagefind)

Поиск работает на [Pagefind](https://pagefind.app): он индексирует уже собранный
сайт. За это отвечают два элемента конфигурации:

```ts
// .vitepress/config.ts — ресурсы и провайдер
head: [
  ['link', { rel: 'stylesheet', href: '/pagefind/pagefind-ui.css' }],
  ['script', { src: '/pagefind/pagefind-ui.js' }],
],
themeConfig: {
  search: { provider: 'pagefind', options: { bodyMarker: 'data-pagefind-body' } },
},
```

Индекс строится из production-сборки, поэтому поиск работает после `npm run build`, а
не в режиме dev. Исключить пост из индекса можно через `searchIncluded: false` — см.
[Превью и поиск](preview-and-search).

## Популярные посты (Google Analytics 4)

Секция сайдбара «Популярное» и список [`popular/1`](../popular/1) заполняются на
основе реальных просмотров из GA4 — **на этапе сборки**. Статистика запрашивается
один раз и «запекается» в статические страницы: никаких клиентских запросов к
Google API, приватный ключ используется только на сервере сборки.

Функция отключена, пока не заданы учётные данные через переменные окружения:

```ts
// .vitepress/config.ts
export const popularPosts = {
  enabled: Boolean(process.env.GA_PROPERTY_ID && process.env.GA_CREDENTIALS_JSON),
  sortBy: 'pageviews', // 'pageviews' | 'uniquePageviews' | 'avgTimeOnPage'
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

Система устойчива к сбоям: если сеть недоступна или ключ неверен, тема выводит
предупреждение, **сборка продолжается**, а сортировка популярных откатывается к дате.
Для локального предпросмотра без GA поставьте `enabled: true` — покажутся свежие посты.
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
`head`) исключаются и из sitemap.

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
