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
npm install vitepress-theme-neptu-landing vitepress-theme-neptu-blog
# or: pnpm add vitepress-theme-neptu-landing vitepress-theme-neptu-blog
# or: yarn add vitepress-theme-neptu-landing vitepress-theme-neptu-blog
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
      defaultLandingStyle: 'soft',
      themePicker: false, // enable only for a demo picker
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
