---
title: Search
description: 'Local search, Algolia DocSearch, and how to add a custom provider'
---

# Search

The landing theme ships **no search of its own**. The nav bar search box comes
from the VitePress default theme, so you get its two providers and configure
them exactly as the VitePress docs describe — see
[VitePress → Search](https://vitepress.dev/reference/default-theme-search).

This template uses local search. Configure the provider in
`src/.vitepress/config.ts` under `themeConfig.search`.

## Local search

MiniSearch, zero infrastructure. The sensible default for a landing plus a
handful of doc pages:

```ts
themeConfig: {
  search: {
    provider: 'local',
    // options: { detailedView: true, locales: { ru: { translations: { … } } } },
  },
}
```

The whole index is shipped to the browser, which is fine for small sites and
gets heavy once you have hundreds of long pages.

## Algolia DocSearch

For larger sites — requires an external account and a crawler:

```ts
themeConfig: {
  search: {
    provider: 'algolia',
    options: { appId: '…', apiKey: '…', indexName: '…' },
  },
}
```

## Adding a custom provider

Anything beyond those two is a custom integration, and there are two routes:

### Pagefind

If the site outgrew the local index. Install `pagefind`, run its
[CLI](https://pagefind.app/docs/) after `vitepress build`, add `pagefind-ui.js`
/ `pagefind-ui.css` on demand and mount `PagefindUI` in your own component. The
blog theme's `PageFindSearch.vue` (in `vitepress-theme-neptu`) is a working
reference — it lazy-loads the bundle, handles multilingual indexes and the modal
history.

### Any hosted search

Orama, Typesense, Meilisearch… — replace the default theme's search slot with
your own component:

```ts
// .vitepress/theme/index.ts
import { h } from 'vue'
import LandingTheme from 'vitepress-theme-neptu-landing'
import MySearch from './MySearch.vue'

export default {
  ...LandingTheme,
  // LandingLayout forwards every slot to the default theme layout.
  Layout: () =>
    h(LandingTheme.Layout, null, {
      'nav-bar-content-before': () => h(MySearch),
    }),
}
```

Whichever route you take, keep `themeConfig.search` unset so the default
theme does not render a second search box.
