# vitepress-theme-neptu-landing

VitePress theme for **project sites**: a landing page built from ready-made
blocks on the home route, documentation next to it, and standalone pages
wherever you need them. The documentation part is optional — without it you get
a plain landing site.

It is a companion to `vitepress-theme-neptu` and reuses its utilities,
transformers, SEO pipeline and color palettes. The chrome (nav bar, docs
sidebar, outline, search) comes from the VitePress default theme.

The runnable example lives in `docs/landing-example` and starts from the repo
root with `npm run landing:dev` (monorepo uses npm workspaces).

## What is in the box

- **24 blocks** — hero, features, feature-split, bento, tabs, carousel,
  collection, content, logos, stats, steps, code, video, embed, compare,
  testimonials, pricing, faq, cta, newsletter, timeline, team, gallery, banner
- **11 primitives** — page, section, container, grid, heading, button, button
  group, card, media, icon, reveal
- **Two theme axes** — color (`data-theme`) and style (`data-style`), both
  switchable at runtime and restored before the first paint
- **Two authoring modes** — Vue components in markdown, or a declarative
  `blocks:` array in frontmatter
- **Agent-ready** — one prop contract across all blocks, a JSON schema for the
  data mode and [`AGENTS.md`](./AGENTS.md) with rules and page recipes

The only runtime helper beyond Vue and VitePress is `@iconify/vue`; theme
icons are bundled locally, so rendering never depends on Iconify's API. The
carousel is CSS scroll-snap, the accordion is `<details>`, and the lightbox is
`<dialog>`.

## Installation

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
      // Optional demo UI; both default to false.
      colorPicker: false,
      stylePicker: false,
      search: { provider: 'local' },
    },
  }

  return defineLandingConfig(config)
}
```

`defineLandingConfig` auto-discovers locale folders from `srcDir` using
`<srcDir>/<locale>/_site.yaml` or `_site.ts`, applies the SEO transformers and
injects the inline script that restores the theme without a flash.

### Required content structure

Landing follows the same strict convention as the blog theme:

```text
src/
├── site.yaml
├── index.md             # neutral language selector
└── en/
    ├── _site.yaml
    ├── index.md         # landing page
    ├── doc/             # optional
    └── page/            # optional
```

The locale directory is required even when the site has only one language;
one directory does not imply that translations must be created. Do not place
locale content directly under `src/`. Add sibling locale directories only when
their content exists. The root selector should render ordinary locale links
and may visually recommend the browser's language, but should not redirect
automatically.

The config helper enforces this contract at build time. A manual
`locales.root` entry or any root Markdown file other than `src/index.md` is an
error with a migration hint, rather than a partially supported second mode.

Use the landing theme's built-in root layout:

```yaml
---
layout: locale-selector
navbar: false
sidebar: false
localeSelector:
  title: Choose your language
  description: Select the language you want to use.
  recommendedLabel: Recommended for your browser
head:
  - - meta
    - name: robots
      content: noindex
---
```

## Building a page

Blocks and primitives are registered globally — no import block needed.

```md
---
layout: home
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
    { icon: '🧩', title: 'Composable', text: 'Twenty-four blocks, one contract.' },
  ]"
/>

<LnCta bg="brand" title="Ready?" :actions="[{ text: 'Read the docs', link: '/doc' }]" />

</LnPage>
```

For component-authored pages, `layout: home` drops the docs sidebar. The
recommended data mode below needs only `layout: landing`; it renders blocks
edge-to-edge automatically.

### The same page as data

```md
---
layout: landing
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
    actions: [{ text: Read the docs, link: /doc }]
---

```

Content is separated from markup, which makes translations, CMS editing and
generation straightforward. Built-in blocks are schema-validated by
`npx neptu-landing src`; custom types registered with `registerBlockTypes` are
intentionally accepted by the schema. Unknown runtime types show a visible
development placeholder. The validation command rejects unknown types unless
they are explicitly allowed with `--allow-type=my-block`.

Data mode rejects incomplete interactive content: a `hero` needs a title,
collection-like blocks need at least one item, CTAs need linked actions, and
`video` / `embed` need a source. Components remain more permissive so they can
be composed with slots.

For TypeScript-authored data, use `defineBuiltInBlocks([...])` to retain the
strict built-in union, including the same required fields as the schema. If you
register custom types, opt in explicitly with
`defineCustomBlocks<'my-block'>([...])`.

Block actions always navigate and therefore require both `text` and `link`.
For an event-handling button without a URL, compose a custom section with the
`LnButton` primitive instead.

## Shared props

Every block accepts `id`, `bg` (`base` `soft` `mute` `inverse` `brand`
`transparent`), `width` (`narrow` `default` `wide` `full`), `padding` (`none`
`sm` `md` `lg`), `align` (`start` `center`), `divider`, `reveal` and the
header trio `eyebrow` / `title` / `text` and its own `items`.

Interactive blocks generate stable internal ids automatically. Set `id` when
you need a section anchor or a predictable DOM id. For meaningful images, use
the object form (`{ src, alt }`); use `decorative: true` only for imagery that
does not convey content. Ambient video is opt-in with `autoplay: true` and is
disabled for visitors who prefer reduced motion.

Types: `src/blocks/types.ts`. Schema: `schema/landing-blocks.schema.json`.

## Media asset placement

The landing theme supports three approaches for organizing images and media
files — the same as the blog theme. All three work for block `image` / `video`
/ `poster` properties and for images in markdown content.

### 1. Shared public directory

Media lives in `src/public/` and is referenced with an absolute path.

```text
src/
├─ public/
│  └─ img/
│     ├─ hero.svg
│     └─ logo.png
└─ en/
   └─ index.md
```

```yaml
blocks:
  - type: hero
    image: /img/hero.svg
```

### 2. Co-located next to the markdown file

Images sit next to the `.md` file and are referenced with a relative path.
Dimensions are read automatically at build time.

```text
src/
└─ en/
   ├─ index.md
   └─ hero-bg.jpg
```

```yaml
blocks:
  - type: hero
    image: ./hero-bg.jpg
```

### 3. Folder-per-page with a media subfolder

Each page gets its own directory with `index.md` and a `media/` subfolder.

```text
src/
└─ en/
   └─ landing/
      ├─ index.md
      └─ media/
         ├─ hero.svg
         └─ team-photo.jpg
```

```yaml
blocks:
  - type: hero
    image: ./media/hero.svg
  - type: team
    items:
      - title: Jane Doe
        image: ./media/team-photo.jpg
```

### Comparison

| Approach | Path style | Portable | Auto dimensions | Best for |
|---|---|---|---|---|
| Public directory | `/img/foo.png` | No | Yes | Small sites, shared assets |
| Co-located | `./foo.png` | Yes | Yes | Single-page landings |
| Folder-per-page | `./media/foo.png` | Yes | Yes | Multi-page, image-heavy |

All three approaches get automatic `width`/`height` injection for standalone
body images. Block images (hero, gallery, team, etc.) are processed through
`LnMedia`, which resolves paths via `withBase` — use absolute paths from
`public/` for block-level media, or relative paths for markdown body images.

## Search

Unlike the blog theme (which bundles Pagefind), the landing theme ships **no
search of its own**. The nav bar search box comes from the VitePress default
theme, so you get its two providers and configure them exactly as the VitePress
docs describe — see
[VitePress → Search](https://vitepress.dev/reference/default-theme-search).

**Local search** (MiniSearch, zero infrastructure) is the sensible default for a
landing plus a handful of doc pages:

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

**Algolia DocSearch** for larger sites — requires an external account and a
crawler:

```ts
themeConfig: {
  search: {
    provider: 'algolia',
    options: { appId: '…', apiKey: '…', indexName: '…' },
  },
}
```

### Adding another provider

Anything beyond those two is a custom integration, and there are two routes:

- **Pagefind**, if the site outgrew the local index. Install `pagefind`, run its
  [CLI](https://pagefind.app/docs/) after `vitepress build`, add
  `pagefind-ui.js` / `pagefind-ui.css` on demand and mount `PagefindUI` in your
  own component. The blog theme's `PageFindSearch.vue` is a working reference —
  it lazy-loads the bundle, handles multilingual indexes and the modal history.
- **Any hosted search** (Orama, Typesense, Meilisearch…) — replace the default
  theme's search slot with your own component:

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

Whichever route you take, keep `themeConfig.search.provider` unset (or set to
your own value) so the default theme does not render a second search box.

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
Style presets: `soft`, `sharp`, `brutal`, `glass`, `editorial`, `mono` — also
shared with the blog theme, so both halves of a site keep the same shape
language.

A new theme is a CSS file, not a component change:

```css
[data-style='compact'] {
  --ln-radius-lg: 0.5rem;
  --ln-card-padding: 1rem;
  --ln-card-shadow: none;
}
```

A preset meant to work in the blog theme too sets the shared `--neptu-*` tokens
instead of `--ln-*`; see the contract at the top of
`vitepress-theme-neptu/style-presets.css`.

Production sites normally choose one palette and one style. Both pickers are
disabled by default; enable them for a demo with `colorPicker: true` /
`stylePicker: true`, then add them to your nav bar:

```vue
<template #nav-bar-content-after>
  <ColorThemePicker />
  <StylePresetPicker />
</template>
```

The controls are shared with the blog theme — one implementation dresses both.

Full token list with defaults: `src/styles/landing-vars.css`.

Custom preset ids can be used as defaults or set directly on `<html>`. The
built-in picker lists built-in presets only.

## Package entry points

| Import | Contents |
|--------|----------|
| `vitepress-theme-neptu-landing` | Theme entry (default export) |
| `…/blocks` | Blocks, `LandingRenderer`, registry, `useSectionProps`, types |
| `…/primitives` | `LnSection`, `LnGrid`, `LnCard`, … |
| `…/components` | `ColorThemePicker`, `StylePresetPicker` (re-exported from the blog theme) |
| `…/composables` | `useStylePreset`, `useColorTheme` |
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

Priority, from lowest to highest: built-in defaults → `config.ts` → shared
`site.yaml` → locale `_site.yaml`. Objects are deep-merged; arrays are replaced.
An `extends: en` key in a locale file inherits that locale before applying the
current file. Strings may use `${localeIndex}`, `${config.*}`, `${theme.*}` and
`${t.*}` template values.

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
- Import `…/landing.css` only if you build your own theme entry — the default
  export already includes it.
