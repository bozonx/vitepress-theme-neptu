---
title: Уровни конфигурации, конфиг первого уровня и шаблоны строк
description: 'Три уровня конфигурации и системные поля: srcDir, base, siteUrl, primaryLocale, repo, head, vite, markdown, sitemap, хуки, Pagefind, GA4 и perPage. А так же шаблоны строк'
authorId: ivan-k
date: 2026-08-04
category: { name: 'Настройка', slug: 'configuration' }
tags: [config]
descrAsPreview: true
---

Каждый из 3х уровней конфига имеет свою роль, хотя в конечном итоге все они смерживаются в один
большой конфиг.

Смыл разделения на уровни в том чтобы, во первых, отделить конфиг связанный с системными настройками, которые настраивает разработчик от конфига который настраивает администратор блога, а во вторых разделить конфиг на глобальный и локализованный, чтобы не дублировать одни и теже параметры для каждой локали, что особенно полезно когда блог имеет много языков контента.

Конфиг 1го уровня написан на Typescript, что удобно для разработчика, особенно для использования переменных окрежения, а конфиги 2го и 3го уровней, предназначенные для администратора, они в формате YAML, который легко редактировать даже не программисту через какую-нибудь CMS, например Sveltia CMS, Decap CMS и подобные.

Разделение ролей позволяет избежать путаницы когда администратор может случайно испортить системные настройки, а разработчику позволяет сосредоточиться только на системных настройках, не отвлекаясь на представление.

```text
1. .vitepress/config.ts            разработчик: код, сборка, интеграции
   → 2. src/site.yaml              администратор: общее для всех локалей
     → 3. src/<locale>/_site.yaml  администратор: одна локаль и её отличия
```

## Какой файл редактировать

| Что меняется | Файл |
| --- | --- |
| `srcDir`, `base`, `siteUrl`, `primaryLocale`, `repo`, env, Vite/VitePress, плагины, хуки, Pagefind, GA4 и секреты | `.vitepress/config.ts` |
| Оформление и поведение, одинаковые для языков: бренд, sidebar, nav, footer, ленты, SEO, иконки, publisher | `src/site.yaml` |
| Язык, заголовок, описание, переводы, подписи и намеренные отличия одного языка | `src/<locale>/_site.yaml` |
| Профили авторов одной локали | `src/<locale>/_authors.yaml` |

## Уровень 1 — `.vitepress/config.ts`

Это файл разработчика, который представляет из себя расширенние стандартного конфига VitePress.

```ts
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineBlogConfig } from 'vitepress-theme-neptu/configs'
import type { BlogUserConfig } from 'vitepress-theme-neptu'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Build-time параметр пагинации — импортируется генераторами путей
export const PER_PAGE = 15

export default async () => {
  const base = process.env.VITEPRESS_BASE || '/'

  const config: BlogUserConfig = {
    /////// Стандартные поля Vitepress

    // Корень контента и автообнаружения локалей
    // Меняйте только в том случае если вы по какой-то причине переименовали или перенести директорию src/
    srcDir: path.resolve(__dirname, '../'),

    // Публичный подкаталог сайта — путь от корня домена до корня блога.
    // Влияет только на внутренние ссылки и пути к ассетам в собранном HTML.
    // Например, `/blog/` превратит `/posts/intro` в `/blog/posts/intro`.
    // Используется когда блог развёрнут не в корне домена, а в подкаталоге.
    // По умолчанию `/` — блог в корне домена.
    base,

    // Абсолютный URL корня сайта (с протоколом, без пути).
    // Не влияет на маршрутизацию или внутренние ссылки — используется только
    // для построения полных URL в sitemap, RSS/Atom лентах, canonical,
    // Open Graph, JSON-LD и robots.txt. Нужен чтобы поисковики и соцсети
    // знали канонический адрес страниц.
    // В отличие от `base`, это всегда полный URL: `https://example.com`.
    siteUrl: process.env.SITE_URL || 'https://example.com',

    // Основная локаль сайта (имя папки, например 'en', 'ru').
    // Определяет x-default в hreflang и title/description корневой
    // страницы выбора языка. По умолчанию — 'en' если она есть, иначе
    // первая локаль по алфавиту. Имеет смысл только для мультиязычных сайтов.
    // primaryLocale: 'en',

    // Внешние ассеты и метаданные, будет вбилжено в тэг <head> итогового HTML документа
    head: [
      ['meta', { name: 'format-detection', content: 'telephone=no' }],
      ['link', { rel: 'icon', type: 'image/svg+xml', href: assetUrl('/favicon.svg') }],
      ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: assetUrl('/img/favicon-32x32.png') }],
      ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: assetUrl('/img/favicon-16x16.png') }],
      ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: assetUrl('/img/apple-touch-icon.png') }],
      ['link', { rel: 'shortcut icon', href: assetUrl('/favicon.ico') }],
      ['link', { rel: 'manifest', href: assetUrl('/site.webmanifest') }],
    ],

    // Настройки Vite, полезны для добавления каких-либо плагинов Vite
    // Документация: https://vitepress.dev/reference/site-config#vite
    // Полный список опций: https://vite.dev/config/
    vite: {
      // Дополнительные Vite-плагины поверх тех, что тема добавляет сама
      // plugins: [...],
      ssr: {
        // noExternal уже включает 'vitepress-theme-neptu'
        // noExternal: [...],
      },
      build: {
        // chunkSizeWarningLimit: 1500,
      },
    },

    // Настройки Markdown
    // Документация: https://vitepress.dev/reference/site-config#markdown
    // Подключение markdown-it плагинов: https://vitepress.dev/reference/site-config#markdown-config
    markdown: {
      // image: { lazyLoading: true } — уже включено темой
      // headers: { level: [2, 3, 4, 5, 6] } — уже включено темой
      // externalLinks: { target: '_blank' } — уже включено темой
      // config: (md) => { /* дополнительные markdown-it плагины */ },
    },

    // Настройки sitemap — используется стандартный генератор VitePress,
    // но тема автоматически задаёт `hostname` из `siteUrl` и оборачивает
    // `transformItems` для фильтрации утилитных маршрутов (tags, archive,
    // authors, popular, recent, featured) и префиксации URL базовым путём.
    // Документация: https://vitepress.dev/reference/site-config#sitemap
    // Внимание: переопределение `transformItems` отключит фильтрацию темы.
    sitemap: {
      // transformItems: (items) => items,  // заменит фильтрацию темы
    },

    // Пользовательские хуки — выполняются после хуков темы
    // Документация: https://vitepress.dev/reference/site-config#build-hooks
    transformPageData: async (pageData) => {
      // Дополнить или изменить pageData после обработки темой
      // return { ...pageData }
    },
    transformHead: async (context) => {
      // Добавить теги в <head> после обработки темой
      // return [['meta', { name: 'foo', content: 'bar' }]]
    },
    buildEnd: async (siteConfig) => {
      // Вызывается в конце сборки, после генерации лент, robots.txt и индекса
    },

    /////// Параметры Neptu blog

    themeConfig: {
      // Build-time параметр пагинации
      perPage: PER_PAGE,

      // Репозиторий исходников; задаёт edit-link и ссылки на репозиторий. Указывать не обязательно
      repo: 'https://github.com/acme/my-blog',

      // Поиск на базе Pagefind — единственный провайдер темы.
      // Индекс строится автоматически в конце `vitepress build`, UI-бандл
      // подгружается лениво из `/pagefind/`. Дополнительных шагов не нужно.
      // Переводы модалки настраиваются через `t.searchUI` в i18n системы темы.
      // Документация Pagefind: https://pagefind.app
      search: {
        // enabled: true,               // false — отключить поиск и индексацию
      },

      // Популярные посты на основе данных Google Analytics 4.
      // Интеграция выключена по умолчанию — включите `enabled: true`,
      // когда сервисный аккаунт и property настроены.
      // Credentials и propertyId берутся из переменных окружения, чтобы
      // не хранить секреты в репозитории.
      // Требуется GA4 Data API и сервисный аккаунт с доступом к чтению
      // аналитики. Документация:
      // https://developers.google.com/analytics/devguides/reporting/data/v1
      popularPosts: {
        enabled: true,
        // Сортировка популярных постов по просмотрам страниц из GA4
        sortBy: 'pageviews',
        dataSource: {
          // Единственный поддерживаемый провайдер аналитики.
          // 'ga4' означает Google Analytics 4 Data API.
          // Значение указывать не обязательно, но в будущем при появлении новых версий, можно будет переключаться между версиями
          // provider: 'ga4',
          // ID ресурса GA4 (формат: properties/123456789)
          propertyId: process.env.GA_PROPERTY_ID,
          // JSON-ключ сервисного аккаунта GA4 (содержимое файла целиком в виде строки)
          credentialsJson: process.env.GA_CREDENTIALS_JSON,
          // Период сбора данных в днях (по умолчанию: 30)
          dataPeriodDays: 30,
          // Максимальное количество строк в отчёте GA4 (по умолчанию: 1000)
          dataLimit: 1000,
        },
      },
    },
  }

  return defineBlogConfig(config)
}
```

> Обратите внимание, что в отличии от Vitepress, в конфиге Neptu blog локали не задаются, более того настоятельно не рекомендуется их задавать, так как они формируются автоматически благодаря строгой файловой структуре где в `src/` содержатся папки по каждой локали.

> Полный список стандартных полей VitePress остаётся в [справочнике VitePress](https://vitepress.dev/reference/site-config)

## Шаблоны строк

Все YAML конфиги поддерживают подстановки строк.

| Переменная | Содержимое | Пример |
| --- | --- | --- |
| `${theme.*}` | объединённый `themeConfig` | `${theme.sidebar.blogTitle}` |
| `${site.*}` | итоговый site-объект локали (`title`, `description`, `lang` и т.д.) | `${site.title}` |
| `${t.*}` | объект переводов (`theme.t`) — встроенные или переопределённые ключи | `${t.editLink}` |
| `${config.*}` | весь `BlogUserConfig` из `config.ts` | `${config.siteUrl}` |
| `${localeIndex}` | имя текущей папки локали (например `en`, `ru`) | `${localeIndex}` |

Подстановка выполняется в **два прохода**:

1. **При парсинге YAML** — контекст `{ config, theme, t, localeIndex }`. Переменная `site` на этом этапе недоступна. Неразрешённые плейсхолдеры остаются в тексте как есть.
2. **После слияния всех уровней** — контекст дополняется `site`, и оставшиеся плейсхолдеры (включая `${site.*}`) подставляются из итогового конфига.

## Пользовательские поля в `themeConfig`

В `themeConfig` можно добавлять **любые собственные поля** — они проходят через весь конвейер слияния и доступны в рантайме через `useUiTheme()`. Объекты рекурсивно объединяются между уровнями, массивы заменяются целиком.

Уровень 1 — `config.ts`, переменная окружения:

```ts
// .vitepress/config.ts
export default async () => {
  const config: BlogUserConfig = {
    themeConfig: {
      apiUrl: process.env.API_URL,
    },
  }
  return defineBlogConfig(config)
}
```

Уровень 2 — `src/site.yaml`, подстановка из `${config.*}` и новое поле:

```yaml
# src/site.yaml
themeConfig:
  # подстановка из config.ts (уровень 1)
  endpoint: "${config.themeConfig.apiUrl}/v2/posts"
  # новое поле, заданное на уровне 2
  featureEnabled: true
```

Доступ в Vue-компоненте:

```vue
<script setup lang="ts">
import { useUiTheme } from 'vitepress-theme-neptu/composables'

const { theme } = useUiTheme()
console.log(theme.value.apiUrl)        // "https://api.example.com"
console.log(theme.value.endpoint)      // "https://api.example.com/v2/posts"
console.log(theme.value.featureEnabled) // true
</script>
```

> Поля можно задавать на любом уровне: `config.ts`, `site.yaml` или `_site.yaml`. Значения сливаются по приоритету — от низкого к высокому.

## Уровень 2 и уровнь 3

Следующие уровни конфига находятся в файлах:
- `src/site.yaml` - 2 уровень
- `src/<locale>/_site.yaml` - 3 уровень

Об их настройке смотрите в [Настройки themeConfig](themeconfig-settings.md)
