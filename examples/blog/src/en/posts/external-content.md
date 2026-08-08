---
title: External content — CMS, API and custom data loaders
description: >
  Methods for integrating external content from CMS or APIs: pre-build
  synchronization, HTML to Markdown conversion, custom data loaders, and
  embedding via iframes or Vue components.
authorId: ivan-k
date: 2026-07-27
category: advanced
tags: [cms, api, data-loaders, external]
descriptionAsPreview: true
translations:
  ru: /ru/posts/external-content
---

The theme is designed for local Markdown files, but you can integrate external content from a CMS or API in several ways.

## Method 1: Pre-build synchronization

Write a script that fetches content from your CMS/API and writes it as Markdown files before the build:

```ts
// scripts/sync-content.ts
import { writeFileSync, mkdirSync } from 'fs'

async function syncContent() {
  const posts = await fetch('https://api.my-cms.com/posts').then(r => r.json())

  for (const post of posts) {
    const dir = `src/en/posts/${post.slug}`
    mkdirSync(dir, { recursive: true })

    const frontmatter = [
      '---',
      `title: ${JSON.stringify(post.title)}`,
      `date: ${post.publishedAt}`,
      `authorId: ${post.authorId}`,
      '---',
      '',
    ].join('\n')

    writeFileSync(`${dir}/index.md`, frontmatter + post.content)
  }
}

syncContent()
```

Add it to your build script:

```json
{
  "scripts": {
    "build": "npm run sync && vitepress build src"
  }
}
```

## Method 2: HTML to Markdown conversion

If your CMS returns HTML, convert it to Markdown:

```bash
npm install @turndown/turndown
```

```ts
import TurndownService from '@turndown/turndown'

const turndown = new TurndownService()
const markdown = turndown.turndown(post.htmlContent)
```

## Method 3: Custom data loaders

VitePress supports custom data loaders that run at build time. Use them to load external data and pass it to pages:

```ts
// src/en/loadExternalPosts.data.ts
import { createContentLoader } from 'vitepress'

export default createContentLoader('posts/*.md', {
  // ...options
})
```

For more advanced cases, use the theme's `loadPostsDataFromFiles` helper:

```ts
import { loadPostsDataFromFiles } from 'vitepress-theme-neptu/list-helpers/node'
```

## Method 4: Embedding via iframes

For content that can't be converted to Markdown (interactive widgets, maps), embed it:

```md
<iframe src="https://app.my-cms.com/post/123" width="100%" height="600" />
```

## Method 5: Custom Vue components

Create a Vue component that fetches and renders external content at runtime:

```vue
<!-- .vitepress/theme/ExternalPost.vue -->
<script setup>
import { ref, onMounted } from 'vue'

const content = ref('')
onMounted(async () => {
  content.value = await fetch('/api/post/123').then(r => r.text())
})
</script>

<template>
  <div v-html="content" />
</template>
```

:::warning
Only embed content from trusted sources. External scripts and iframes can introduce security risks. Ensure proper CSP headers and sanitize any user-generated content.
:::

## What's next

- [Components reference](components) — all exported components and utilities
- [Project structure](project-structure) — where files live
