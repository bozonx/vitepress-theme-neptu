---
title: Ad blocks
description: >
  How to integrate custom ad components, configure their placement, and manage
  their display based on consent.
authorId: ivan-k
date: 2026-07-24
category: integration
tags: [ads, consent, config]
descriptionAsPreview: true
translations:
  ru: /ru/posts/ads
---

The theme provides ad placement, height reservation, and an "Advertisement" label — but the ad component itself must be custom-made and globally registered.

## How it works

1. You create a Vue component that renders your ad code
2. Register it globally in `.vitepress/theme/index.ts`
3. Configure where ads appear via `themeConfig.ads`

The theme handles:
- **Placement** — aside, after content, in-content
- **Height reservation** — reserves space to prevent layout shift
- **Label** — "Advertisement" text above the block
- **Consent** — hides ads until consent is given (if configured)

## Creating an ad component

```vue
<!-- .vitepress/theme/MyAd.vue -->
<script setup>
// Your ad code here — Google AdSense, custom banner, etc.
</script>

<template>
  <div class="my-ad">
    <!-- ad content -->
  </div>
</template>
```

Register it globally:

```ts
// .vitepress/theme/index.ts
import MyAd from './MyAd.vue'

export default {
  enhanceApp({ app }) {
    app.component('NeptuAd', MyAd)  // must be registered as 'NeptuAd'
  },
}
```

The component must be registered with the name `NeptuAd` — the theme looks for this exact name.

## Ad placement

```yaml
# src/site.yaml
themeConfig:
  ads:
    enabled: true
    layouts: [post]          # which layouts show ads
    component: 'NeptuAd'     # must match the registered name
    placements:
      aside: true            # right column
      afterContent: true     # below the article
      inContent: true        # between paragraphs
      inContentFrequency: 3  # every N paragraphs
```

### Placement types

| Placement | Where | Notes |
| --- | --- | --- |
| `aside` | Right column, below TOC | Only on layouts with aside |
| `afterContent` | Below article, before footer | |
| `inContent` | Between paragraphs | Frequency controlled by `inContentFrequency` |

## Manual placement

You can also place ads manually in markdown:

```md
First part of the article.

<NeptuAd />

Continuation of the article.
```

Manual placements work independently of automatic ones — both can appear on the same page.

## Per-post control

```yaml
---
ads: false  # disable all ads for this post
---
```

## Consent integration

If you use consent management (see [Cookie consent](consent)), ads can be hidden until the user gives consent:

```yaml
# src/site.yaml
themeConfig:
  ads:
    requireConsent: true
```

When `requireConsent` is `true`, ad components are not rendered until `useConsent()` returns `granted`.

## Disabling ads

### Globally

```yaml
themeConfig:
  ads:
    enabled: false
```

### Per page

```yaml
---
ads: false
---
```

## What's next

- [Cookie consent](consent) — consent management
- [Customization](customization) — CSS variables for ad blocks
