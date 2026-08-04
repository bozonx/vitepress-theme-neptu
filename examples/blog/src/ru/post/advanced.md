---
title: Хуки, слоты и свои макеты
description: >
  Расширение темы без форка: трансформ-хуки сборки, слоты макета поста и
  обвязки страницы, замена подвала и футера, собственный макет статьи.
authorId: ivan-k
date: 2026-07-07
category: { name: 'Расширение', slug: 'advanced' }
tags: [advanced]
descrAsPreview: true
---

Всё, что описано в предыдущих статьях, — встроенное поведение, настраиваемое
через YAML. Эта страница о том, что делать, когда настроек не хватает:
**хуки сборки**, **слоты макета** и **собственные макеты**. Форк темы для этого
не нужен.

Справочник того, что можно импортировать (компоненты, composables, утилиты), —
в [Справочнике компонентов](components).

## Пользовательские трансформ-хуки

Тема предоставляет стандартные хуки VitePress в конфигурации, которую вы передаёте в
`defineBlogConfig`. Ваши хуки выполняются **после** встроенных трансформеров, поэтому вы расширяете,
а не заменяете их:

```ts
// .vitepress/config.ts
export default async () => defineBlogConfig({
  siteUrl: 'https://myblog.org',

  async transformPageData(pageData, ctx) {
    // Встроенные трансформеры уже выполнились (размеры изображений, заголовок,
    // мета-теги, описание). Добавьте или измените поля здесь.
    pageData.frontmatter.customField = 'value'
  },

  async transformHead(ctx) {
    return [['meta', { name: 'custom', content: 'value' }]]
  },

  async buildEnd(siteConfig) {
    // Выполняется после генерации RSS / robots.txt темой.
  },
})
```

Порядок выполнения для `transformPageData`:

1. Встроенные: `collectImageDimensions` → `transformTitle` → `transformPageMeta` → `resolveDescription`
2. Ваш хук

Нужно запуститься **до** встроенных трансформеров? Используйте [`extends`](https://vitepress.dev/reference/site-config#extends)
в VitePress — хуки из этой конфигурации срабатывают первыми.

## Пользовательский макет поста

Каждый строительный блок поста экспортируется из
`vitepress-theme-neptu/components`, поэтому вы можете собрать собственный макет поста,
сохранив общий интерфейс темы:

```vue
<script setup lang="ts">
import {
  PostDate, PostAuthor, PostImage, PostTags,
  PostSocialShare, PostSimilarList, PostFooter,
} from 'vitepress-theme-neptu/components'
</script>

<template>
  <article>
    <PostDate />
    <PostAuthor />
    <PostImage />
    <div class="vp-doc"><Content /></div>
    <PostTags />
    <PostSocialShare />
    <PostSimilarList />
    <PostFooter />
  </article>
</template>
```

Затем подключите компонент в `.vitepress/theme/index.ts` как глобальный и используйте в frontmatter:

```yaml
---
layout: post
contentLayout: CustomPost
---
```

Разница между двумя полями:

- **`contentLayout`** заменяет только центральную колонку. Сайдбар, верхняя
  панель, оглавление и правая колонка остаются от темы — это то, что нужно в
  большинстве случаев.
- **`layout`** с именем вашего компонента заменяет страницу целиком, вместе с
  обвязкой.

Если правки точечные, не заменяйте макет вовсе — используйте слоты (ниже).

Полный список экспортируемых частей поста (`PostDate`, `PostAuthor`,
`PostImage`, `PostTags`, `PostSocialShare`, `PostSimilarList`, `PostFooter`,
`PostTopBar`, `PostVideoLink`, `PostDonateLink`, `PostComments`,
`PostNavigation`, `PostCategories` и другие) —
в [Справочнике компонентов](components).

## Слоты макета поста

Если нужно добавить лишь небольшие фрагменты UI в стандартный макет поста, используйте слоты
вместо полной замены компонента:

```vue
<!-- .vitepress/theme/Layout.vue -->
<script setup>
import Theme from 'vitepress-theme-neptu'
const { Layout } = Theme
</script>

<template>
  <Layout>
    <template #post-header-before>
      <BreadcrumbNav />
    </template>

    <template #post-content-after>
      <NewsletterSignup />
    </template>
  </Layout>
</template>
```

Доступные слоты внутри стандартного макета поста (`PageContent.vue`):

| Слот | Расположение |
|------|--------------|
| `post-header-before` | До `<header>` (заголовок, дата, topbar) |
| `post-header-after` | После `<header>` |
| `post-content-before` | До markdown `<Content />` |
| `post-content-after` | После markdown `<Content />` |
| `post-footer` | Заменяет весь блок `<PostFooter />` |

Эти слоты есть только у постов. На страницах с `layout: page` и служебных
(`util`, `tag`, `archive`, `author`) выводится лишь `<Content />`, поэтому
`post-*` слоты там не рендерятся.

### Слоты общего макета

Кроме содержимого поста, слоты есть и у обвязки страницы — сайдбара, шапки,
правой колонки и футера. Они передаются в тот же `<Layout>`:

| Слот | Расположение |
|------|--------------|
| `aside` | Правая колонка (реклама, промо) — от 1550px |
| `sidebar-top` | Вверху левого сайдбара, над навигацией |
| `sidebar-middle` | В середине левого сайдбара |
| `sidebar-bottom` | Внизу левого сайдбара, под ссылками |
| `sub-sidebar` | Дополнительная секция сайдбара |
| `nav-bar-content-before` | В верхней панели, перед её содержимым |
| `footer` | Заменяет футер сайта целиком |

Правая колонка настраивается отдельно — какие страницы её показывают, как
подключить рекламу и как поменять размеры, описано в
[Оглавлении и правой колонке](toc-and-aside).

## Кастомизация футера сайта

Футер сайта задаётся через `themeConfig.footer`:

```ts
// .vitepress/config.ts
export default async () => defineBlogConfig({
  themeConfig: {
    footer: {
      message: 'Выпущено под лицензией MIT.',
      copyright: 'Copyright 2026',
      links: [{ text: 'GitHub', href: 'https://github.com/...' }],
    },
  },
})
```

Чтобы полностью заменить футер, используйте слот `footer` в своём `Layout.vue`:

```vue
<template>
  <Layout>
    <template #footer>
      <MySiteFooter />
    </template>
  </Layout>
</template>
```

Когда слот `footer` предоставлен, встроенный футер темы и его отступы не выводятся.
Чтобы убрать футер полностью — не задавайте `themeConfig.footer` и не предоставляйте слот `footer`.

## Кастомизация подвала поста

Состав и порядок блоков подвала задаются массивом `themeConfig.postFooter` —
он разобран в [Подвале поста](post-footer-and-sharing). Здесь — что делать,
когда перестановки блоков мало.

### Замена всего подвала

Используйте слот `post-footer` в своём `Layout.vue`:

```vue
<template>
  <Layout>
    <template #post-footer>
      <MyCustomFooter />
    </template>
  </Layout>
</template>
```

### Переопределение отдельных блоков

`PostFooter` предоставляет именованный слот для каждого ключа блока. Передайте свой контент,
чтобы переопределить один блок, не трогая остальные:

```vue
<template>
  <Layout>
    <template #donate>
      <MyCustomDonate />
    </template>
  </Layout>
</template>
```

> Именованные слоты проксируются через `NeptuLayout` → `DefaultLayout` → `PageContent` → `PostFooter`,
> поэтому их можно использовать прямо из вашего `Layout.vue`.

## Предупреждения при сборке

`defineBlogConfig` выводит предупреждения в консоль для частых ошибок конфигурации:

- Отсутствует `siteUrl` — SEO-функции могут генерировать битые URL.
- Пустые `locales` — тема требует хотя бы одну локаль.

Эти предупреждения появляются только при запуске сборки / dev-сервера.

## Что дальше

- [Справочник компонентов](components) — что можно импортировать из темы.
- [Внешний контент](external-content) — контент из CMS или API.
- [Рекламные блоки](ads) — свой компонент в слотах темы.
