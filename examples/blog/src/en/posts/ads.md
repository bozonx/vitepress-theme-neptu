---
title: Ad blocks
description: >
  Connecting a component, three placement options, and inserting in-content ads at build time.
authorId: ivan-k
date: 2026-07-05
category: integration
tags: [advanced, config]
descriptionAsPreview: true
translations:
  ru: /ru/posts/ads
---

The theme does not include a proprietary ad component and is not tied to any specific ad network. It handles placement, height reservation, the "Advertisement" label, and consent coordination — while you write the ad unit code yourself and connect it via `ads.component`.

In-content blocks are inserted **at build time** by a `markdown-it` plugin. VitePress markdown is compiled into a Vue template, so the theme injects `<NeptuAd />` directly into the article's HTML.

The right-column placement location is detailed in [themeConfig settings](themeconfig-settings#right-column-aside).

## Connecting a component

```vue
<!-- .vitepress/theme/AdUnit.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'

// `placement` and `index` come from the theme — use them to tailor formats.
defineProps<{ placement?: string; index?: number }>()

onMounted(() => {
  try {
    ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
  } catch {
    // Ad blocker — silently ignore
  }
})
</script>

<template>
  <ins
    class="adsbygoogle"
    style="display: block"
    data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
    data-ad-slot="1234567890"
  />
</template>
```

```ts
// .vitepress/theme/index.ts
import Theme from 'vitepress-theme-neptu'
import AdUnit from './AdUnit.vue'

export default {
  ...Theme,
  enhanceApp(ctx) {
    Theme.enhanceApp?.(ctx)
    ctx.app.component('AdUnit', AdUnit)
  },
}
```

```ts
// .vitepress/config.ts
export default async () => defineBlogConfig({
  themeConfig: {
    ads: { component: 'AdUnit' },
  },
  head: [
    [
      'script',
      {
        async: '',
        crossorigin: 'anonymous',
        src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX',
      },
    ],
  ],
})
```

The component is registered globally because in-content blocks are injected during build time — importing them inside individual markdown files is not feasible.

::: tip Page navigation
VitePress is an SPA. The theme binds the block to the route via `:key`, so when navigating between posts, the component is remounted and `onMounted` fires again automatically. No manual intervention is needed.
:::

## Ad configuration

```ts
themeConfig: {
  ads: {
    component: 'AdUnit',
    layouts: ['post'],
    aside: true,
    afterContent: false,
    inContent: {
      enabled: true,
      anchor: 'heading',
      start: 2,
      every: 3,
      max: 2,
      minBlocks: 6,
    },
  },
}
```

### `ads` parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Main toggle. Frontmatter `ads: true \| false` on a page overrides this. |
| `component` | `string` | — | Name of globally registered component rendering the ad block. Receives `placement` and `index` props. Without it, `NeptuAd` renders only its default slot content. |
| `layouts` | `string[]` | `['post']` | Layouts where ad slots are permitted: `'post'`, `'page'`, `'util'`, `'tag'`, `'category'`, `'archive'`, `'author'`. |
| `defaultLayout` | `string` | `'post'` | Layout assumed if the page frontmatter does not declare `layout`. |
| `aside` | `boolean` | `true` | Block in the right column. |
| `afterContent` | `boolean` | `false` | Block below article body, before post footer. |
| `requireConsent` | `boolean` | `false` | Do not render block until the visitor has granted consent. |
| `label` | `string` | translation `adLabel` | Text above block. An empty string removes the label. |
| `minHeight` | `Partial<Record<'aside' \| 'in-content' \| 'after-content', number>>` | — | Reserved height in pixels for each placement to prevent layout shifts. |

### `ads.inContent` parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Enable automated blocks inside the text. |
| `anchor` | `'heading' \| 'paragraph'` | `'heading'` | Anchor target: `'heading'` — before `##` heading, `'paragraph'` — before paragraph. |
| `start` | `number` | `2` | Index of the first anchor (1-indexed) before which a block is placed. |
| `every` | `number` | `3` | How many anchors to skip between blocks. |
| `max` | `number` | `2` | Maximum number of blocks per page. |
| `minBlocks` | `number` | `6` | Minimum number of top-level blocks in the article — short posts remain unaffected. |

## Disabling on a page

```yaml
---
title: Page without ads
ads: false
---
```

This also works in reverse — `ads: true` where disabled by default. Frontmatter is respected by the build-time plugin, so in-content blocks will not appear either.

## What's next

- [Cookie consent](consent) — Consent Mode v2, CMP, and Google requirements.
- [Analytics and popular posts](analytics) — setting up page view tracking.
- [themeConfig settings](themeconfig-settings#right-column-aside) — column geometry and slots.

---

Next: [Cookie consent](consent)
