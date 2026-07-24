---
title: Ленты, поиск и SEO-переключатели
description: Механизмы сайта — ленты RSS/Atom/JSON, поиск Pagefind, популярные посты через GA4, robots.txt, sitemap и глобальные переключатели SEO.
layout: page
translations:
  en: /en/page/seo-feeds-search
---

# Ленты, поиск и SEO-переключатели

Помимо отдельных постов, тема автоматически настраивает множество механизмов для всего сайта.
На этой странице показано, как они работают и где конфигурируются. Настройки SEO для конкретных постов
(JSON-LD, canonical, OG) описаны в постах с тегом [`seo`](../tags/seo/1).

## Что генерируется автоматически

При сборке тема формирует для всего сайта:

- **`sitemap.xml`** — на основе `siteUrl`, за исключением страниц с `noindex`.
- **`robots.txt`** — со ссылкой на sitemap.
- **Ленты RSS / Atom / JSON** — по одному комплекту для каждой локали.
- **Мета-теги Open Graph + Twitter card** — для каждой страницы.
- **Структурированные данные JSON-LD** — для каждого поста.
- **Ссылки `hreflang`** — между переведенными страницами.
- **Канонические ссылки (canonical)**.

> **Любую из этих функций можно отключить** — глобально в `src/site.yaml` или
> индивидуально в фронтматере поста. См. раздел [SEO-переключатели](#seo-переключатели) ниже.

## Ленты (RSS / Atom / JSON)

Включены по умолчанию. Ссылки отображаются в сайдбаре (RSS + Atom) и в `<head>` каждой
страницы. Настраиваются в `src/site.yaml`:

```yaml
themeConfig:
  feeds:
    maxPosts: 50
    formats: ['rss', 'atom', 'json']
```

Пути к файлам для каждой локали: `/ru/feed.rss`, `/ru/feed.atom`, `/ru/feed.json`.

## Поиск (Pagefind)

Поиск работает на базе [Pagefind](https://pagefind.app), который индексирует собранный
сайт. За функционирование отвечают два элемента:

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

Индекс создаётся из собранных файлов production, поэтому поиск доступен после полной
сборки (`pnpm build && pnpm pagefind`), а не в режиме dev. Исключить отдельный пост из
индекса можно с помощью `searchIncluded: false` в его фронтматере — см.
[Превью и поиск](../post/preview-and-search).

## Популярные посты (Google Analytics 4)

Секция сайдбара «Популярные посты» и список `/ru/popular/1` заполняются на основе реальных
просмотров из GA4 во время сборки. Секция отключена, пока вы не укажете
учетные данные через переменные окружения:

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

Для локального предпросмотра без GA установите `enabled: true` — тема покажет
свежие посты как запасной вариант.

## SEO-переключатели

Все SEO-функции **включены по умолчанию**. Отключить их можно глобально в
`src/site.yaml` или для отдельной страницы в фронтматере через ключ `seo`:

```yaml
# Глобально — src/site.yaml
themeConfig:
  seo:
    og: true
    jsonLd: true
    hreflang: true
    canonical: true
    autoCanonical: true      # авто-каноническая ссылка по умолчанию
    rss: true
    maxDescriptionLength: 300
  twitterSite: '@your_handle'  # twitter:site на каждой странице
```

```yaml
# Для отдельной страницы — в фронтматере поста
seo:
  jsonLd: false   # отключить структурированные данные только для этой страницы
  og: false
```

Установка `robots: noindex` (через `head`) также автоматически исключает страницу из sitemap.

## Канонические ссылки (canonical)

Канонические ссылки помогают поисковым системам определить основную версию страницы и избежать
проблем с дублированным контентом.

По умолчанию каждая страница автоматически получает самоканоническую ссылку
(`themeConfig.seo.autoCanonical: true`). Переопределить можно в frontmatter:

- `canonical: "https://example.com/ru/post/post-slug"` — абсолютный URL
- `canonical: "self"` — авто-генерация ссылки на текущую страницу
- `canonical: "s"` — короткий псевдоним для `"self"`

```yaml
---
title: Мой пост
canonical: "https://example.com/ru/post/post-slug"
# или
canonical: "self"
---
```

### Отключение auto-canonical

```ts
// .vitepress/config.ts
export default async () => defineBlogConfig({
  themeConfig: {
    seo: {
      autoCanonical: false,
    },
  },
})
```

### Отключение canonical на отдельной странице

```yaml
---
seo:
  canonical: false
---
```

### Технические детали

- Трансформер работает только на путях с префиксом локали (например `/ru/`, `/en/`).
- Явные URL валидируются.
- `"self"` и `"s"` требуют настроенного `siteUrl`.
- При использовании явного canonical URL, мета-тег `og:url` синхронизируется с ним.

## Hreflang-ссылки

Тема автоматически добавляет теги `<link rel="alternate">` для мультиязычных страниц.
Трансформер `addHreflang`:

1. Определяет локаль текущей страницы из `pageData.relativePath`.
2. Удаляет сегмент локали из относительного пути.
3. Перестраивает путь для каждой настроенной локали.
4. При наличии `srcDir` пропускает локали, у которых нет исходного файла.
5. Добавляет один `<link rel="alternate">` для каждой существующей локальной версии.
6. Добавляет `x-default`, указывающий на первую существующую локаль.

### Явные переводы в frontmatter

Если `frontmatter.translations` задан, он используется как источник истины:

```yaml
---
title: Привет, мир
translations:
  en: /en/post/hello-world
  'pt-BR': /pt-BR/artigos/ola-mundo
---
```

### Автоматический fallback по пути

Если `translations` не задан, тема использует тот же относительный путь в другой локали:

```text
en/post/hello-world.md
ru/post/hello-world.md
```

### Отключение hreflang

```yaml
# На отдельной странице
---
seo:
  hreflang: false
---
```

```ts
// Глобально
export default async () => defineBlogConfig({
  themeConfig: {
    seo: {
      hreflang: false,
    },
  },
})
```

Frontmatter `seo` всегда переопределяет глобальную настройку.

## JSON-LD структурированные данные

Тема автоматически генерирует JSON-LD для постов, страниц авторов и обычных страниц.

### Автоматический вывод для постов

Страницы постов генерируют схему `BlogPosting` с полями: `headline`, `description`, `url`,
`datePublished`, `dateModified`, `author`, `image` (из `cover`), `keywords` (из тегов),
`publisher`, `inLanguage`, `mainEntityOfPage`, `isPartOf`.

### Пользовательская схема в frontmatter

Используйте `jsonLd` в frontmatter, когда нужны дополнительные поля:

```yaml
---
title: Тестовая JSON-LD страница
description: Демонстрация пользовательского JSON-LD
layout: page
jsonLd: |
  "@type": AboutPage
  speakable:
    "@type": SpeakableSpecification
    cssSelector:
      - h1
      - p.lead
---
```

### Правила слияния

- Для постов/страниц: пользовательские поля объединяются в сгенерированную схему
- Для страниц только с пользовательской схемой: объект становится полным JSON-LD
- Можно использовать массив верхнего уровня — он будет выведен как `@graph`

### Издатель (publisher)

Добавьте `publisher` в `themeConfig` локали:

```yaml
themeConfig:
  publisher:
    name: 'Название сайта'
    url: 'https://yoursite.com'
    logo: '/logo.png'
```

### Отключение JSON-LD

```yaml
# На отдельной странице
---
seo:
  jsonLd: false
---
```

```ts
// Глобально
export default async () => defineBlogConfig({
  themeConfig: {
    seo: {
      jsonLd: false,
    },
  },
})
```

## robots.txt

Тема автоматически генерирует `robots.txt` при сборке, если вы не предоставили свой.

### Поведение по умолчанию

Если в папке `public/` нет `robots.txt`, тема создаёт его в выходной директории:

```text
User-agent: *
Allow: /

Sitemap: https://<your-site-url>/sitemap.xml
```

URL sitemap берётся из `siteUrl` в конфигурации VitePress.

### Пользовательский robots.txt

Поместите свой `robots.txt` в `public/`:

```text
User-agent: *
Disallow: /admin
Allow: /

Sitemap: https://myblog.org/sitemap.xml
```

> Если в пользовательском `robots.txt` нет директивы `Sitemap:`, при сборке выводится предупреждение.

## Сборка с аналитикой (GA4)

Секция «Популярные посты» и список `/ru/popular/1` заполняются из реальных просмотров GA4
во время сборки. Статистика запрашивается один раз и «запекается» в data-лоадеры.

### Почему build-time

- **Быстро** — нет клиентских запросов к Google API.
- **Безопасно** — приватные ключи используются только на сервере сборки.
- **Статично** — полностью статический SSG-вывод.

### Настройка сервисного аккаунта GA4

1. Создайте **Service Account** в [Google Cloud Console](https://console.cloud.google.com/).
2. Создайте JSON-ключ и скачайте его.
3. Скопируйте `client_email` из JSON.
4. Добавьте этот email в **Google Analytics 4** как пользователя с правами **Viewer**.

### Переменные окружения

Никогда не коммитьте JSON-ключ в репозиторий. Используйте `.env` или секреты CI/CD:

```bash
GA_PROPERTY_ID=123456789
GA_CREDENTIALS_JSON='{"type": "service_account", ...}'
```

### Обработка ошибок

Система устойчива к сбоям. Если сеть недоступна, ключ неверен или GA возвращает пустой ответ,
выводится предупреждение и **сборка продолжается**. Посты строятся без статистики,
сортировка популярных постов откатывается к сортировке по дате.

### SPA-навигация и клиентская аналитика

Эта функция — **только build-time**. Она не отправляет события pageview из браузера.

VitePress использует SPA-навигацию, поэтому клиентская аналитика может потребовать
дополнительной настройки для отслеживания смены маршрутов. Если ваш провайдер не отслеживает
SPA-переходы автоматически, подключитесь к роутеру VitePress:

```ts
// .vitepress/theme/index.ts
import Theme from 'vitepress-theme-neptu-blog'

export default {
  ...Theme,
  enhanceApp(ctx) {
    Theme.enhanceApp?.(ctx)

    if (typeof window !== 'undefined') {
      ctx.router.onAfterRouteChange = (to) => {
        window.ym?.(12345678, 'hit', to)
      }
    }
  },
}
```

### Пример CI/CD (GitHub Actions)

Добавьте два секрета в **Settings → Secrets and variables → Actions**:
`GA_PROPERTY_ID` и `GA_CREDENTIALS_JSON`.

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: pnpm install
      - name: Build
        env:
          GA_PROPERTY_ID: ${{ secrets.GA_PROPERTY_ID }}
          GA_CREDENTIALS_JSON: ${{ secrets.GA_CREDENTIALS_JSON }}
        run: pnpm run build
```
