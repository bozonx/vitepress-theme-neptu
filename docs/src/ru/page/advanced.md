---
title: Расширенные возможности — хуки, слоты и внешний контент
description: >
  Расширение темы без форка — пользовательские трансформ-хуки, слоты макета поста,
  composables, кастомизация футера и синхронизация контента из CMS или API перед сборкой.
layout: page
translations:
  en: /en/page/advanced
---

# Расширенные возможности — хуки, слоты и внешний контент

Всё, что описано выше, касается встроенного поведения. На этой странице — механизмы на случай,
если нужно большее: **хуки жизненного цикла**, **слоты макета**, **composables** и
**внешний контент**.

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
`vitepress-theme-neptu-blog/components`, поэтому вы можете собрать собственный макет поста,
сохранив общий интерфейс темы:

```vue
<script setup lang="ts">
import {
  PostDate, PostAuthor, PostImage, PostTags,
  PostSocialShare, PostSimilarList, PostFooter,
} from 'vitepress-theme-neptu-blog/components'
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

> Используйте `layout: CustomPost` только если компонент должен заменить всю страницу целиком.
> Для частичных изменений предпочтительнее слоты (см. ниже).

### Доступные компоненты поста

| Компонент | Назначение |
|-----------|------------|
| `PostDate` | Дата публикации |
| `PostAuthor` | Имя автора и ссылка |
| `PostImage` | Обложка с размерами |
| `PostTags` | Список тегов и ссылка «все теги» |
| `PostSocialShare` | Кнопки поделиться в соцсетях |
| `PostSimilarList` | Похожие посты по тегам |
| `PostFooter` | Подвал поста: пожертвование, комментарии, подкаст |
| `PostTopBar` | Верхние действия (видео/подкаст) |
| `PostVideoLink` | Кнопка внешнего видео |
| `PostDonateLink` | Призыв к пожертвованию |
| `PostComments` | Ссылка на комментарии |
| `PodcastDropdown` | Выбор платформы подкаста |
| `PodcastIcon` | Иконка платформы подкаста |

## Слоты макета поста

Если нужно добавить лишь небольшие фрагменты UI в стандартный макет поста, используйте слоты
вместо полной замены компонента:

```vue
<!-- .vitepress/theme/Layout.vue -->
<script setup>
import Theme from 'vitepress-theme-neptu-blog'
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

Подвал каждого поста управляется через `themeConfig.postFooter` — упорядоченный массив ключей блоков.
Уберите ключ, чтобы скрыть блок; измените порядок, чтобы поменять расположение:

```ts
// .vitepress/config.ts
export default async () => defineBlogConfig({
  themeConfig: {
    postFooter: [
      'author',
      'donate',
      'comments',
      'social-share',
      'edit-link',
      'tags',
      'similar',
      'popular-link',
    ],
  },
})
```

Поддерживаемые ключи:

| Ключ | Блок |
|------|------|
| `author` | `PostAuthor` |
| `donate` | `PostDonateLink` |
| `comments` | `PostComments` |
| `social-share` | `PostSocialShare` |
| `edit-link` | `EditLink` |
| `tags` | `PostTags` |
| `similar` | `PostSimilarList` |
| `popular-link` | Ссылка на страницу популярных постов (только если `popularPosts.enabled: true`) |

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

## Composables

Используйте логику темы в своих Vue-компонентах, импортируя из
`vitepress-theme-neptu-blog/composables`:

```vue
<script setup lang="ts">
import { useLightbox, useBreakpoint } from 'vitepress-theme-neptu-blog/composables'

const { isOpen, open, close } = useLightbox()
const { isMobile } = useBreakpoint()
</script>
```

### Доступные composables

| Composable | Описание |
|------------|----------|
| `useUiTheme()` | Типизированный доступ к `themeConfig` |
| `useLightbox()` | Управление лайтбоксом изображений |
| `useBreakpoint()` | Реактивные проверки mobile/tablet/desktop |
| `useScrollY()` | Реактивный `window.scrollY` |
| `useContentLangs()` | Разрешение контент/UI локали |
| `useToTheTop()` | Логика видимости кнопки «наверх» |
| `useSwipeDrawer()` | Свайп-жесты для мобильного сайдбара |

## Утилиты разметки

Импортируйте вспомогательные функции из `vitepress-theme-neptu-blog/utils`:

```ts
import {
  isPage,
  isUtilPage,
  isPost,
  resolveArticlePreview,
} from 'vitepress-theme-neptu-blog/utils'

function myHelper(frontmatter) {
  if (isPage(frontmatter)) {
    return 'page'
  }
  if (isPost(frontmatter)) {
    return resolveArticlePreview(frontmatter)
  }
}
```

### Доступные утилиты

| Утилита | Описание |
|---------|----------|
| `isPost(frontmatter)` | true для постов (`layout: post` или без layout) |
| `isPage(frontmatter)` | true для `layout: page` |
| `isUtilPage(frontmatter)` | true для `util`, `tag`, `archive`, `author` |
| `isHomePage(frontmatter)` | true для `layout: home` |
| `resolveArticlePreview(frontmatter)` | Получение текста превью из frontmatter |
| `resolveBodyMarker(theme, frontmatter)` | Разрешение маркера тела Pagefind |
| `isPopularRoute(path, theme)` | Проверка, является ли маршрут списком популярных |
| `isAuthorPage(filePath, siteConfig)` | Проверка, является ли путь страницей автора |

## Предупреждения при сборке

`defineBlogConfig` выводит предупреждения в консоль для частых ошибок конфигурации:

- Отсутствует `siteUrl` — SEO-функции могут генерировать битые URL.
- Пустые `locales` — тема требует хотя бы одну локаль.

Эти предупреждения появляются только при запуске сборки / dev-сервера.

## Внешний контент (CMS / API)

Вспомогательные функции постов в теме читают **локальные `.md` файлы**. Если ваш контент хранится в
CMS, API или на другом сайте, синхронизируйте его в локальный markdown *перед* сборкой VitePress
— после этого сгенерированные файлы ведут себя точно так же, как написанные вручную посты (превью,
ленты, архив, похожие посты).

```json
// package.json
{
  "scripts": {
    "prebuild": "node scripts/sync-remote-posts.mjs",
    "build": "vitepress build src && pnpm pagefind"
  }
}
```

Ваш `sync-remote-posts.mjs` получает внешний контент и записывает файлы вида
`src/ru/post/<slug>.md` с фронтматером, который ожидает тема (`title`,
`date`, `authorId`, `tags`, …). Поскольку `prebuild` выполняется первым, только что
записанные посты индексируются при каждой сборке.

### Конвертация удалённого HTML

Если источник отдаёт HTML, преобразуйте его в Markdown в том же prebuild-шаге:

```js
// scripts/sync-html-posts.mjs
import fs from 'node:fs/promises'
import TurndownService from 'turndown'

const response = await fetch('https://example.com/article.html')
if (!response.ok) {
  throw new Error(`Failed to fetch remote HTML: ${response.status}`)
}

const html = await response.text()
const markdown = new TurndownService().turndown(html)

await fs.mkdir('src/ru/post', { recursive: true })
await fs.writeFile(
  'src/ru/post/imported-article.md',
  `---
title: Импортированная статья
date: 2026-05-09
tags: [imported]
---

${markdown}
`
)
```

Установите конвертер в проект сайта, а не в пакет темы:

```sh
pnpm add -D turndown
```

### Пользовательские data-лоадеры

Можно написать собственный VitePress data-лоадер. По умолчанию тема отслеживает
`./post/*.md` и передаёт файлы в `loadPostsDataFromFiles`:

```ts
// src/ru/loadPosts.data.ts
import { loadPostsDataFromFiles } from 'vitepress-theme-neptu-blog/list-helpers/node'

export default {
  watch: ['./post/*.md'],
  async load(watchedFiles: string[]) {
    return {
      posts: await loadPostsDataFromFiles(watchedFiles),
    }
  },
}
```

Для большинства сценариев внешнего контента всё равно генерируйте локальные `.md` файлы.
VitePress может построить страницы постов только для файлов, которые известны во время сборки.
Возврат дополнительных элементов из data-лоадера наполняет списки, но не создаёт
соответствующие markdown-страницы.

### Встраивание внешнего контента

Если нужно лишь отобразить внешний контент внутри существующего поста, используйте
iframe или пользовательский Vue-компонент в markdown:

```md
<iframe
  src="https://example.com/embed"
  width="100%"
  height="420"
  loading="lazy"
  sandbox="allow-scripts allow-same-origin"
></iframe>
```

Предпочитайте компонент-обёртку, если встраивание переиспользуется:

```vue
<!-- .vitepress/theme/ExternalEmbed.vue -->
<script setup lang="ts">
defineProps<{ src: string; title?: string }>()
</script>

<template>
  <iframe
    :src="src"
    :title="title"
    width="100%"
    height="420"
    loading="lazy"
    sandbox="allow-scripts allow-same-origin"
  />
</template>
```

Зарегистрируйте его в теме сайта:

```ts
// .vitepress/theme/index.ts
import Theme from 'vitepress-theme-neptu-blog'
import ExternalEmbed from './ExternalEmbed.vue'

export default {
  ...Theme,
  enhanceApp(ctx) {
    Theme.enhanceApp?.(ctx)
    ctx.app.component('ExternalEmbed', ExternalEmbed)
  },
}
```

Затем используйте в markdown:

```md
<ExternalEmbed src="https://example.com/embed" title="Внешний контент" />
```

Встраивайте только доверенные источники. Настройте `sandbox`, разрешённые домены и
Content Security Policy согласно требованиям провайдера контента.
