---
title: Introduction
description: 'Getting started with the Neptu Landing theme for VitePress'
prev: false
---

# Introduction

**Neptu Landing** turns VitePress into a project site: a landing page built from
ready-made blocks on the home page, documentation next to it, and standalone
pages wherever you need them. The documentation part is optional — drop the
`doc/` folder and you are left with a plain landing site.

The theme extends the VitePress default theme, so the nav bar, the docs sidebar,
the outline and the search you already know keep working. What it adds is a
block library, a two-axis theme system and a declarative page format.

## Install

```bash
npm install vitepress-theme-neptu-landing vitepress-theme-neptu
# or: pnpm add vitepress-theme-neptu-landing vitepress-theme-neptu
# or: yarn add vitepress-theme-neptu-landing vitepress-theme-neptu
```

`.vitepress/theme/index.ts`:

```ts
import LandingTheme from 'vitepress-theme-neptu-landing'

export default LandingTheme
```

`.vitepress/config.ts`:

```ts
import { defineLandingConfig } from 'vitepress-theme-neptu-landing/configs'
import type { LandingUserConfig } from 'vitepress-theme-neptu-landing'

export default async () => {
  const config: LandingUserConfig = {
    srcDir: 'src',
    siteUrl: 'https://example.com',
    themeConfig: {
      logo: '/img/logo.svg',
      defaultColorTheme: 'blue',
      defaultStylePreset: 'soft',
      colorPicker: false, // enable only for a demo picker
      stylePicker: false,
      search: { provider: 'local' },
    },
  }

  return defineLandingConfig(config)
}
```

That is the whole setup. Every block and primitive is registered globally, so
markdown pages use them without an import block.

## Your first landing page

```md
---
layout: home
markdownStyles: false
---

<LnPage>

<LnHero
  variant="split"
  title="Ship your project page in an afternoon"
  text="Blocks, themes and docs in one VitePress theme."
  image="/img/hero.svg"
  :actions="[
    { text: 'Get started', link: '/doc' },
    { text: 'GitHub', link: 'https://github.com/…', variant: 'alt' },
  ]"
/>

<LnFeatureGrid
  align="center"
  title="Why it is different"
  :items="[
    { icon: '🚀', title: 'Fast', text: 'Static output, no runtime deps.' },
    { icon: '🎨', title: 'Themeable', text: 'Two independent theme axes.' },
    { icon: '🧩', title: 'Composable', text: 'Twenty-four blocks, one contract.' },
  ]"
/>

<LnCta
  bg="brand"
  title="Ready?"
  :actions="[{ text: 'Read the docs', link: '/doc' }]"
/>

</LnPage>
```

Two frontmatter keys matter:

| Key | Why |
|-----|-----|
| `layout: home` | Renders the page without the docs sidebar. |
| `markdownStyles: false` | Lets blocks go edge-to-edge instead of sitting in the prose container. |

`<LnPage>` is the wrapper that marks the page as a landing — always keep blocks
inside it.

## The other authoring mode

The same page can be described as data instead of markup. See
[Blocks](./blocks) for the reference and [Page as data](./yaml-mode) for the
declarative format.

## Site structure

```
src/
├── site.yaml            # shared config layer (nav, footer)
├── en/
│   ├── _site.yaml       # per-locale config layer (title, sidebar)
│   ├── index.md         # the landing page
│   ├── doc/             # documentation — optional
│   └── page/            # standalone pages
└── public/img/          # assets
```

Locale folders are discovered automatically: add `ru/` next to `en/` with its
own `_site.yaml` and the locale shows up in the language menu.

The locale folder is required even for a single-language site. One `en/`
folder is a complete setup and does not require translations. `src/index.md`
is reserved for the language selector; it may recommend the browser's language
but does not redirect automatically.

## Search

The landing theme does not bundle a search engine of its own — the nav bar
search box comes from the VitePress default theme, so you configure it exactly
as the VitePress docs describe:
[VitePress → Search](https://vitepress.dev/reference/default-theme-search).

Local search (MiniSearch) needs no infrastructure and suits a landing plus a
handful of doc pages:

```ts
// .vitepress/config.ts
themeConfig: {
  search: { provider: 'local' },
}
```

The full index is shipped to the browser, so it stays cheap while the site is
small. For a large documentation set, switch to `provider: 'algolia'` with your
DocSearch credentials.

Want something else — Pagefind, Orama, a hosted engine? Leave
`themeConfig.search` unset (so the default box does not render) and mount your
own component into the `nav-bar-content-before` slot. The
[landing README](https://github.com/bozonx/vitepress-theme-neptu/blob/main/packages/landing/README.md#search)
shows the wiring, and the blog theme's `PageFindSearch.vue` is a working
Pagefind reference. Note that the blog theme, unlike this one, ships Pagefind
built in — see [Search in the blog theme](https://bozonx.github.io/vitepress-theme-neptu/en/page/seo-feeds-search).
