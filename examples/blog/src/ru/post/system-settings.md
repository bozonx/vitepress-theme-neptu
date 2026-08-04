---
title: Системные настройки
description: >
  Настройки вне themeConfig и системные поля внутри него: srcDir, base, siteUrl,
  repo, head, vite, markdown, sitemap, хуки, поиск Pagefind, GA4 и perPage.
authorId: ivan-k
date: 2026-08-04
category: { name: 'Настройка', slug: 'configuration' }
tags: [config]
descrAsPreview: true
---

Системные настройки живут в `.vitepress/config.ts` — единственном файле
разработчика. Это обычный `BlogUserConfig` / VitePress config. Полный список
стандартных полей VitePress остаётся в [справочнике
VitePress](https://vitepress.dev/reference/site-config). В теме здесь размещаются
только проводка и интеграции.

## Поля вне themeConfig

| Поле | Назначение |
| --- | --- |
| `srcDir` | Корень контента и автообнаружения локалей. |
| `base` | Публичный подкаталог, например `/blog/`. |
| `siteUrl` | Абсолютный URL для sitemap, лент, canonical, Open Graph и JSON-LD. |
| `head` | Внешние ассеты и метаданные. |
| `vite`, `markdown`, `sitemap` | Обычные настройки VitePress/Vite. |
| `transformPageData`, `transformHead`, `buildEnd` | Пользовательские хуки после хуков темы. |

## Системные поля внутри themeConfig

Некоторые поля живут внутри `themeConfig`, но относятся к системным — их нельзя
задавать в YAML, они требуют кода или секретов.

| Поле | Назначение |
| --- | --- |
| `themeConfig.repo` | Репозиторий исходников; задаёт edit-link и ссылки на репозиторий. |
| `themeConfig.search` | Провайдер Pagefind, опции UI и индексация при сборке. |
| `themeConfig.popularPosts.enabled`, `.dataSource` | GA4; интеграция выключена по умолчанию, credentials и env остаются здесь. |
| `themeConfig.perPage` | Build-time параметр пагинации (см. ниже). |

## Пример

```ts
export default async () => defineBlogConfig({
  srcDir: path.resolve(__dirname, '../'),
  base: process.env.VITEPRESS_BASE || '/',
  siteUrl: process.env.SITE_URL || 'https://example.com',
  themeConfig: {
    repo: 'https://github.com/acme/my-blog',
    search: { provider: 'pagefind', options: { bodyMarker: 'data-pagefind-body' } },
    popularPosts: {
      enabled: true,
      dataSource: { provider: 'ga4', propertyId: process.env.GA_PROPERTY_ID },
    },
  },
})
```

## perPage — только в config.ts

В отличие от остальных полей `themeConfig`, `perPage` **нельзя** задавать в
`site.yaml` или `_site.yaml`. Это build-time параметр: генераторы путей
(`*.paths.js`) импортируют его на этапе сборки для расчёта маршрутов пагинации.
Значение в YAML рассинхронизирует сгенерированные маршруты и рантайм.
Настраивайте `perPage` только в `.vitepress/config.ts`:

```ts
export const PER_PAGE = 10

export default async () => defineBlogConfig({
  themeConfig: {
    perPage: PER_PAGE,
  },
})
```

Схема отклоняет `perPage` в YAML и выводит предупреждение при сборке.

## editLink

Укажите `repo` в `.vitepress/config.ts`. Тема сама построит `editLink.pattern`
для GitHub, GitLab, Bitbucket, Gitea, Forgejo и Codeberg, предполагая ветку
`main` и каталог `src/`. Обычно в локали достаточно задать `editLink.text`;
`editLink.pattern` нужен только для нестандартной ветки или пути к исходникам.

Остальные настройки — в [Настройки themeConfig](themeconfig-settings) и
[Уровни конфигурации](config-layers).
