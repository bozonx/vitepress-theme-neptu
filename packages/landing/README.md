# vitepress-theme-neptu-landing

VitePress theme for **project sites**: a landing page built from ready-made
blocks on the home route, documentation next to it, and standalone pages
wherever you need them. The documentation part is optional — without it you get
a plain landing site.

It is a companion to `vitepress-theme-neptu-blog` and reuses its utilities,
transformers, SEO pipeline and color palettes. The chrome (nav bar, docs
sidebar, outline, search) comes from the VitePress default theme.

The runnable example lives in `docs/landing-example` and starts from the repo
root with `pnpm landing:dev`.

## What is in the box

- **15 blocks** — hero, features, feature-split, bento, carousel, logos, stats,
  steps, testimonials, pricing, faq, cta, timeline, team, gallery
- **11 primitives** — page, section, container, grid, heading, button, button
  group, card, media, icon, reveal
- **Two theme axes** — color (`data-theme`) and style (`data-ln-style`), both
  switchable at runtime and restored before the first paint
- **Two authoring modes** — Vue components in markdown, or a declarative
  `blocks:` array in frontmatter
- **Agent-ready** — one prop contract across all blocks, a JSON schema for the
  data mode and [`AGENTS.md`](./AGENTS.md) with rules and page recipes

Zero runtime dependencies beyond Vue and VitePress: the carousel is CSS
scroll-snap, the accordion is `<details>`, the lightbox is `<dialog>`.

## Installation

```bash
pnpm add vitepress-theme-neptu-landing vitepress-theme-neptu-blog
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
      search: { provider: 'local' },
    },
  }

  return defineLandingConfig(config)
}
```

`defineLandingConfig` auto-discovers locale folders from `srcDir` using
`<srcDir>/<locale>/_site.yaml` or `_site.ts`, applies the SEO transformers and
injects the inline script that restores the theme without a flash.

## Building a page

Blocks and primitives are registered globally — no import block needed.

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
  :actions="[{ text: 'Get started', link: '/doc' }]"
/>

<LnFeatureGrid
  align="center"
  title="Why it is different"
  :items="[
    { icon: '🚀', title: 'Fast', text: 'Static output, no runtime deps.' },
    { icon: '🎨', title: 'Themeable', text: 'Two independent theme axes.' },
    { icon: '🧩', title: 'Composable', text: 'Fifteen blocks, one contract.' },
  ]"
/>

<LnCta bg="brand" title="Ready?" :actions="[{ text: 'Read the docs', link: '/doc' }]" />

</LnPage>
```

`layout: home` drops the docs sidebar; `markdownStyles: false` lets blocks go
edge-to-edge.

### The same page as data

```md
---
layout: home
markdownStyles: false
blocks:
  - type: hero
    title: Everything in YAML
    actions: [{ text: Get started, link: /doc }]
  - type: features
    cols: 3
    items:
      - { icon: 🚀, title: Fast, text: Static output. }
  - type: cta
    bg: brand
    title: Ready?
---

<LandingRenderer />
```

Content is separated from markup, which makes translations, CMS editing and
generation straightforward. Unknown block types are skipped with a dev warning.

## Shared props

Every block accepts `id`, `bg` (`base` `soft` `mute` `inverse` `brand`
`transparent`), `width` (`narrow` `default` `wide` `full`), `padding` (`none`
`sm` `md` `lg`), `align` (`start` `center`), `divider` and `noReveal`, plus the
header trio `eyebrow` / `title` / `text` and its own `items`.

Types: `src/blocks/types.ts`. Schema: `schema/landing-blocks.schema.json`.

## Theming

```
palette primitives   --gray-50…950, --primary-btn-bg     ← data-theme
        ↓
semantic tokens      --ln-c-*, --ln-radius-*, --ln-section-py…
        ↓
blocks               scoped CSS reading only --ln-*
```

Color themes: `blue`, `green`, `purple`, `amber`, `teal`, `rose`, `magenta`,
`monochrome` — shared with the blog theme.
Style presets: `soft`, `sharp`, `brutal`, `glass`, `editorial`.

A new theme is a CSS file, not a component change:

```css
[data-ln-style='compact'] {
  --ln-radius-lg: 0.5rem;
  --ln-card-padding: 1rem;
  --ln-card-shadow: none;
}
```

Add the pickers to your nav bar:

```vue
<template #nav-bar-content-after>
  <LnThemePicker axis="color" />
  <LnThemePicker axis="style" />
</template>
```

Full token list with defaults: `src/styles/landing-vars.css`.

## Package entry points

| Import | Contents |
|--------|----------|
| `vitepress-theme-neptu-landing` | Theme entry (default export) |
| `…/blocks` | Blocks, `LandingRenderer`, registry, types |
| `…/primitives` | `LnSection`, `LnGrid`, `LnCard`, … |
| `…/components` | `LnThemePicker` |
| `…/composables` | `useLandingStyle`, `useColorTheme` |
| `…/configs` | `defineLandingConfig` and config helpers |
| `…/landing.css` | All style layers (imported by the theme entry) |
| `…/landing-vars.css`, `…/style-presets.css`, `…/vitepress-bridge.css` | Individual layers |

### Config helpers

| Export | Description |
|--------|-------------|
| `defineLandingConfig(config)` | Async entry point — auto-discovers locales, applies defaults, validates required fields. |
| `defineLandingConfigSync(config)` | Sync variant, without locale auto-discovery. |
| `mergeLandingConfig(config)` | Low-level merge without validation warnings. |
| `loadSiteLocale(localeIndex, config)` | Build a single locale from YAML layers. |
| `autoLoadSiteLocales(config)` | Auto-discover all locale folders. |
| `createLandingHeadScript(defaults)` | Inline head script restoring the theme; added automatically. |

### YAML config layers

- `<srcDir>/site.yaml` — cross-locale shared layer
- `<srcDir>/<locale>/_site.yaml` — per-locale layer (supports `extends:`)

Top-level keys: `lang`, `title`, `titleTemplate`, `description`. Everything else
goes under `themeConfig:`.

## TypeScript

```ts
import type {
  LandingUserConfig,
  LandingThemeConfig,
  ResolvedLandingConfig,
} from 'vitepress-theme-neptu-landing'
import type {
  BlockSpec,
  FeatureItem,
  PricingPlan,
} from 'vitepress-theme-neptu-landing/blocks'
```

## Migrating from 0.20

- The default export is now a full theme (default theme + blocks + styles)
  instead of a bare `Layout`. Use `export default LandingTheme`, or
  `{ ...LandingTheme, Layout }` to add nav bar slots.
- `SiteHome` still ships from `…/layouts`, but new pages should use `LnHero` +
  `LnFeatureGrid` inside `<LnPage>`.
- Import `…/landing.css` only if you build your own theme entry — the default
  export already includes it.
