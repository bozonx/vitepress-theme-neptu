---
title: Уровни конфигурации и системные настройки
description: 'Три уровня конфигурации и системные поля: srcDir, base, siteUrl, repo, head, vite, markdown, sitemap, хуки, Pagefind, GA4 и perPage.'
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
| `srcDir`, `base`, `siteUrl`, `repo`, env, Vite/VitePress, плагины, хуки, Pagefind, GA4 и секреты | `.vitepress/config.ts` |
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
    // Например, `/blog/` превратит `/post/intro` в `/blog/post/intro`.
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

    // Настройки sitemap
    sitemap: {
      // hostname и transformItems задаются темой автоматически из siteUrl
      // transformItems: (items) => items,
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

    // Локали: если опустить — автообнаружение из srcDir
    // Явное указание для продвинутых/ручных сценариев:
    // locales: {
    //   en: { lang: 'en-US', title: 'My Blog', description: '...' },
    //   ru: { lang: 'ru-RU', title: 'Мой блог', description: '...' },
    // },

    // ── Системные поля внутри themeConfig ─────────────────────────────

    themeConfig: {
      // Build-time параметр пагинации (нельзя в YAML)
      perPage: PER_PAGE,

      // Репозиторий исходников; задаёт edit-link и ссылки на репозиторий
      repo: 'https://github.com/acme/my-blog',

      // Провайдер Pagefind, опции UI и индексация при сборке
      search: {
        provider: 'pagefind',
        options: {
          bodyMarker: 'data-pagefind-body',
          // translations: { ... },       // UI-переводы поиска
          // locales: { ... },            // переводы по локали
        },
        index: {
          // enabled: true,               // false — пропустить индексацию
          // glob: '**/*.html',           // кастомный glob
          // rootSelector: 'html',
          // excludeSelectors: ['nav'],
          // forceLanguage: 'en',
          // includeCharacters: '<>$',
          // keepIndexUrl: false,
          // verbose: false,
          // logfile: undefined,
        },
      },

      // GA4; интеграция выключена по умолчанию,
      // credentials и env остаются здесь
      popularPosts: {
        enabled: true,
        sortBy: 'pageviews',
        dataSource: {
          provider: 'ga4',
          propertyId: process.env.GA_PROPERTY_ID,
          credentialsJson: process.env.GA_CREDENTIALS_JSON,
          dataPeriodDays: 30,
          dataLimit: 1000,
        },
      },
    },
  }

  return defineBlogConfig(config)
}
```

> Полный список стандартных полей VitePress остаётся в [справочнике VitePress](https://vitepress.dev/reference/site-config)

## `perPage` — только в `config.ts`

В отличие от остальных полей `themeConfig`, `perPage` **нельзя** задавать в `site.yaml` или `_site.yaml`. Это build-time параметр: генераторы путей (`*.paths.js`) импортируют его на этапе сборки для расчёта маршрутов пагинации. Значение в YAML рассинхронизирует сгенерированные маршруты и рантайм. Настраивайте `perPage` только в `.vitepress/config.ts`:

```ts
export const PER_PAGE = 10

export default async () => defineBlogConfig({
  themeConfig: {
    perPage: PER_PAGE,
  },
})
```

Схема отклоняет `perPage` в YAML и выводит предупреждение при сборке.

## Уровень 2 — `src/site.yaml`

В этом файле один рабочий ключ верхнего уровня: `themeConfig`. Это полный самодокументирующий справочник безопасных общих настроек. Укажите здесь значение по умолчанию для всех локалей; не копируйте его в каждый язык.

В `themeConfig` документированы группы: общие (`blogTitle`, переключатели, `defaultColorTheme`, `defaultStylePreset`), главная (`home`), списки (`postList`, `postFooter`), иконки, sidebar, `nav`, donate, edit link, footer, publisher, authors, social sharing, feeds, SEO, `popularPosts.sortBy` и переводы `t`. Каждое поле прокомментировано прямо в `packages/blog/template/src/site.yaml`.

Укажите `repo` в `.vitepress/config.ts`. Тема сама построит `editLink.pattern`
для GitHub, GitLab, Bitbucket, Gitea, Forgejo и Codeberg, предполагая ветку
`main` и каталог `src/`. Обычно в локали достаточно задать `editLink.text`;
`editLink.pattern` нужен только для нестандартной ветки или пути к исходникам.

Объекты объединяются рекурсивно, массивы заменяются целиком. Исключение — `authors`: записи объединяются по стабильному `id`.

## Уровень 3 — `src/<locale>/_site.yaml`

Это настройки одной локали. Допустимые поля верхнего уровня ровно такие:

| Поле | Назначение |
| --- | --- |
| `lang` | IETF-тег: `ru-RU`, `en-US`. |
| `title` | Название сайта на этом языке. |
| `titleTemplate` | Шаблон заголовка страницы с `:title`. |
| `description` | Локализованное SEO/feed-описание. |
| `extends` | Имя папки родительской локали, например `en`; не путь к файлу. |
| `themeConfig` | Любая безопасная настройка второго уровня как локальное переопределение. |

```yaml
# src/ru/_site.yaml
extends: en
lang: ru-RU
title: Пример блога
description: Заметки для русскоязычных читателей.
themeConfig:
  blogTitle: Пример блога
  langMenuLabel: Сменить язык
  nav:
    links:
      - text: О блоге
        href: page/about
```

Общее значение оставляйте на уровне 2. Здесь переопределение должно быть осознанным: другой текст, язык, локальный URL или действительно отличающийся интерфейс.

### Точечные переопределения `themeConfig`

Объекты объединяются рекурсивно между уровнями, поэтому можно переопределять отдельные подключи, не переписывая весь блок. Укажите только то, что отличается для этой локали — остальное унаследуется от уровня 2.

```yaml
# src/en/_site.yaml — переопределяем только нужные подключи
themeConfig:
  # Скрыть превью на карточках постов, остальное из site.yaml сохраняется
  postList:
    showPreview: false

  # Другой порядок блоков в подвале поста для этой локали
  postFooter:
    - author
    - tags
    - social-share
```

Это работает для любого вложенного ключа `themeConfig`: `sidebar`, `nav`, `footer`, `donate`, `editLink`, `socialMediaShares`, `seo`, `feeds` и т. д. Полный справочник параметров — в `packages/blog/template/src/site.yaml`; не дублируйте параметры, уже определённые там.

## Авторы — `_authors.yaml`

Файл — массив профилей. Обязателен только `id`; остальные поля: `name`, `description`, `image`, `imageWidth`, `imageHeight`, `twitterHandle`, `links[]` (`type`, `url`, `title`). Пример и комментарии находятся рядом в шаблоне. Записи сливаются с `themeConfig.authors` по `id`; отдельный `_authors.yaml` имеет приоритет для совпадающего поля.

## Шаблоны и валидация YAML

Только YAML поддерживает подстановки до разбора:

| Шаблон | Значение |
| --- | --- |
| `${theme.key}` | объединённое значение темы. |
| `${site.title}` | итоговое название сайта для локали. |
| `${t.key}` | встроенный или переопределённый перевод. |
| `${config.siteUrl}` | URL из `config.ts`. |
| `${localeIndex}` | имя текущей папки локали. |

Файлы подключают `site.schema.json` и `authors.schema.json` для автодополнения в редакторе. Схемы перечисляют все публичные поля Neptu; неизвестные поля сохраняются для совместимости с будущими расширениями VitePress. TypeScript-варианты `site.ts`, `_site.ts`, `_authors.ts` имеют приоритет над YAML; для них есть `defineSiteConfig`, `defineLocaleConfig`, `defineAuthorsList`.

## Пользовательские поля в `themeConfig`

В `themeConfig` можно добавлять **любые собственные поля** — они проходят через весь конвейер слияния и доступны в рантайме через `useUiTheme()`. Объекты рекурсивно объединяются между уровнями, массивы заменяются целиком.

```yaml
# src/site.yaml
themeConfig:
  myCustomField: "hello"
  myCustomConfig:
    featureEnabled: true
    apiUrl: "https://api.example.com"
```

Доступ в Vue-компоненте:

```vue
<script setup lang="ts">
import { useUiTheme } from 'vitepress-theme-neptu/composables'

const { theme } = useUiTheme()
console.log(theme.value.myCustomField)   // "hello"
console.log(theme.value.myCustomConfig)  // { featureEnabled: true, apiUrl: "..." }
</script>
```

Поля можно задавать на любом уровне: `config.ts`, `site.yaml` или `_site.yaml`. Значения сливаются по приоритету — от низкого к высокому.
