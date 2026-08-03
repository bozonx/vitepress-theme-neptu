---
title: Внешний контент — CMS, API и свои data-лоадеры
description: >
  Как подтянуть статьи из CMS или API: синхронизация в локальный markdown перед
  сборкой, конвертация HTML, собственные data-лоадеры и встраивание чужих
  страниц.
authorId: ivan-k
date: 2026-07-06
category: { name: 'Расширение', slug: 'advanced' }
tags: [advanced]
descrAsPreview: true
---

Вспомогательные функции постов в теме читают **локальные `.md` файлы**. Если ваш контент хранится в
CMS, API или на другом сайте, синхронизируйте его в локальный markdown *перед* сборкой VitePress
— после этого сгенерированные файлы ведут себя точно так же, как написанные вручную посты (превью,
ленты, архив, похожие посты).

## Синхронизация перед сборкой

```json
// package.json
{
  "scripts": {
    "prebuild": "node scripts/sync-remote-posts.mjs",
    "build": "vitepress build src"
  }
}
```

Ваш `sync-remote-posts.mjs` получает внешний контент и записывает файлы вида
`src/ru/post/<slug>.md` с фронтматером, который ожидает тема (`title`,
`date`, `authorId`, `tags`, …). Поскольку `prebuild` выполняется первым, только что
записанные посты индексируются при каждой сборке.

## Конвертация удалённого HTML

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
npm install -D turndown
# или: pnpm add -D turndown / yarn add -D turndown
```

## Пользовательские data-лоадеры

Можно написать собственный VitePress data-лоадер. По умолчанию тема отслеживает
`./post/*.md` и передаёт файлы в `loadPostsDataFromFiles`:

```ts
// src/ru/loadPosts.data.ts
import { loadPostsDataFromFiles } from 'vitepress-theme-neptu/list-helpers/node'

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

## Встраивание внешнего контента

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
import Theme from 'vitepress-theme-neptu'
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
