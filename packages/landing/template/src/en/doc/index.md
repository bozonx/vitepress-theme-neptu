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

The packages are already wired up in this template's `package.json`:

```bash
npm install
# or: pnpm install / yarn install
```

`.vitepress/theme/index.ts`:

```ts
import LandingTheme from 'vitepress-theme-neptu-landing'
import Layout from './Layout.vue'
import './styles.css'

export default {
  extends: LandingTheme,
  Layout,
}
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

The home page in this template (`en/index.md`) is composed from blocks:

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
  :actions="[{ text: 'Get started', link: '/en/doc' }]"
/>

<LnFeatureGrid
  align="center"
  title="Why it is different"
  :items="[
    { icon: '🚀', title: 'Fast', text: 'Static output, no runtime deps.' },
    { icon: '🎨', title: 'Themeable', text: 'Two independent theme axes.' },
  ]"
/>

<LnCta bg="brand" title="Ready?" :actions="[{ text: 'Read the docs', link: '/en/doc' }]" />

</LnPage>
```

## Project layout

```text
src/
├── site.yaml             # shared cross-locale config (Level 2)
├── index.md              # neutral language selector
├── .vitepress/
│   ├── config.ts         # VitePress & theme wiring (Level 1)
│   └── theme/            # theme entry, Layout, style overrides
├── public/               # static assets (logo, hero…)
└── en/
    ├── _site.yaml        # per-locale config (Level 3)
    ├── index.md          # landing page
    ├── doc/              # optional documentation
    └── pages/             # optional standalone pages
```

The locale directory is required even for a single-language site. Do not place
locale content directly under `src/`. Add sibling locale directories only when
their content exists.

## Where to go next

- [Blocks](./blocks) — the full catalogue and the shared props.
- [Search](./search) — local vs Algolia, and how to add a custom provider.
