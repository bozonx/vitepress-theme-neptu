---
title: Advanced — Hooks & External Content
description: >
  Extend the theme without forking it — custom transform hooks, a fully custom
  post layout, and syncing content from a CMS or API before build.
layout: page
---

# Advanced — Hooks & External Content

Everything above documents the built-in behavior. This page covers the two
escape hatches for when you need more: **lifecycle hooks** and **external
content**.

## Custom transform hooks

The theme exposes the standard VitePress hooks on the config you pass to
`defineBlogConfig`. Yours run **after** the built-in transformers, so you extend
rather than replace them:

```ts
// .vitepress/config.ts
export default async () => defineBlogConfig({
  siteUrl: 'https://myblog.org',

  async transformPageData(pageData, ctx) {
    // Built-in transformers already ran (image dimensions, title,
    // meta, description). Add or tweak fields here.
    pageData.frontmatter.customField = 'value'
  },

  async transformHead(ctx) {
    return [['meta', { name: 'custom', content: 'value' }]]
  },

  async buildEnd(siteConfig) {
    // Runs after the theme's RSS / robots.txt generation.
  },
})
```

Order for `transformPageData`:

1. Built-in: `collectImageDimensions` → `transformTitle` → `transformPageMeta` → `resolveDescription`
2. Your hook

Need to run **before** the built-ins? Use VitePress'
[`extends`](https://vitepress.dev/reference/site-config#extends) — that config's
hooks fire first.

## Custom post layout

Every post building block is exported from
`vitepress-theme-neptu-blog/components`, so you can assemble your own post layout
while keeping the theme chrome:

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

See `docs/ADVANCED_CUSTOMIZATION.md` for the full list of exported components.

## External content (CMS / API)

The theme's post helpers read **local `.md` files**. If your content lives in a
CMS, API, or another site, sync it into local markdown *before* VitePress builds
— after that, generated files behave exactly like handwritten posts (previews,
feeds, archive, similar).

```json
// package.json
{
  "scripts": {
    "prebuild": "node scripts/sync-remote-posts.mjs",
    "build": "vitepress build src && pnpm pagefind"
  }
}
```

Your `sync-remote-posts.mjs` fetches remote content and writes files like
`src/en/post/<slug>.md` with the same frontmatter the theme expects (`title`,
`date`, `authorId`, `tags`, …). Because `prebuild` runs first, the freshly
written posts are indexed on every build. See `docs/EXTERNAL_CONTENT.md`.
