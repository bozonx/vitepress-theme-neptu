# vitepress-theme-neptu-landing

VitePress landing theme for Neptu main site.

This is a companion package to `vitepress-theme-neptu-blog`. It reuses shared utilities and transformers from the blog theme and provides landing-page specific layouts and configuration helpers.

## Installation

```bash
pnpm add vitepress-theme-neptu-landing vitepress-theme-neptu-blog
```

## Usage

In your `.vitepress/config.js`:

```js
import { mergeSiteConfig, loadSiteLocale } from 'vitepress-theme-neptu-landing/configs'

export default async () => {
  const config = { /* ... */ }
  return mergeSiteConfig({
    ...config,
    locales: { en: await loadSiteLocale('en', config) },
  })
}
```

In your landing page markdown:

```md
---
layout: home
---

<script setup>
import { SiteHome } from 'vitepress-theme-neptu-landing/layouts'

const hero = { /* ... */ }
const features = [ /* ... */ ]
</script>

<SiteHome :hero="hero" :features="features" />
```
