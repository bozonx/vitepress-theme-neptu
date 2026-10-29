---
title: External content — CMS, API and custom data loaders
description: >
  How to pull articles from a CMS or API: syncing to local markdown before the build,
  converting HTML, custom data loaders, and embedding external pages.
authorId: ivan-k
date: 2026-07-06
category: advanced
tags: [advanced]
descriptionAsPreview: true
translations:
  ru: /ru/posts/external-content
---

Post utility functions in the theme read **local `.md` files**. If your content is stored in a CMS, an API, or on another website, synchronize it to local markdown *before* the VitePress build — once written, the generated files behave identically to manually written posts (previews, feeds, archive, similar posts).

## Sync before build

```json
// package.json
{
  "scripts": {
    "prebuild": "node scripts/sync-remote-posts.mjs",
    "build": "vitepress build src"
  }
}
```

Your `sync-remote-posts.mjs` fetches external content and writes files like `src/en/posts/<slug>.md` with the frontmatter expected by the theme (`title`, `date`, `authorId`, `tags`, etc.). Because `prebuild` runs first, the newly written posts are indexed during every build.

## Converting remote HTML

If the data source returns HTML, convert it to Markdown in the same prebuild step:

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

await fs.mkdir('src/en/posts', { recursive: true })
await fs.writeFile(
  'src/en/posts/imported-article.md',
  `---
title: Imported Article
date: 2026-05-09
tags: [imported]
---

${markdown}
`
)
```

Install the converter into your site project, not into the theme package:

```sh
npm install -D turndown
# or: pnpm add -D turndown / yarn add -D turndown
```

## Custom data loaders

You can write a custom VitePress data loader. The starter template watches all posts in the locale, including subfolders, and passes the files to `loadPostsDataFromFiles`:

```ts
// src/en/loadPosts.data.ts
import { POSTS_DIR } from 'vitepress-theme-neptu/constants'
import { loadPostsDataFromFiles } from 'vitepress-theme-neptu/list-helpers/node'

export default {
  // `**/*.md` is essential: with `*.md`, posts in subfolders will not appear in lists
  watch: [`./${POSTS_DIR}/**/*.md`],
  async load(watchedFiles: string[]) {
    return {
      posts: await loadPostsDataFromFiles(watchedFiles),
    }
  },
}
```

For most external content workflows, still generate local `.md` files. VitePress can only generate page routes for files known at build time. Returning extra items from a data loader populates post lists, but will not create the corresponding standalone markdown pages.

## Embedding external content

If you only need to display external content inside an existing post, use an iframe or a custom Vue component in markdown:

```md
<iframe
  src="https://example.com/embed"
  width="100%"
  height="420"
  loading="lazy"
  sandbox="allow-scripts allow-same-origin"
></iframe>
```

Prefer a wrapper component if the embed is reused across articles:

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

Register it in your site's theme:

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

Then use it in markdown:

```md
<ExternalEmbed src="https://example.com/embed" title="External content" />
```

Embed only from trusted sources. Configure `sandbox`, allowed origins, and Content Security Policy according to the content provider's requirements.

---

Next: [Customization — color schemes, styles, fonts, hooks, slots and custom layouts](customization)
