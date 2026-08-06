# Neptu Landing Starter Template

A clean, production-ready starter for a project landing page powered by
[VitePress](https://vitepress.dev/) and
[`vitepress-theme-neptu-landing`](https://github.com/bozonx/vitepress-theme-neptu).

A landing page is the home route, documentation sits next to it (optional), and
standalone pages go wherever you need them. Everything is composed from
ready-made blocks — no layout CSS of your own.

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
# or: pnpm install / yarn install
```

### 2. Start local development server

```bash
npm run dev
# or: pnpm dev / yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for production

```bash
npm run build
# or: pnpm build / yarn build
```

This compiles the static site into `src/.vitepress/dist`. The landing theme
ships **no search of its own** — the docs part uses VitePress local search
(MiniSearch), which needs no separate build step.

### 4. Preview production build

```bash
npm run preview
# or: pnpm preview / yarn preview
```

### 5. Validate blocks (data mode)

If you author pages with a `blocks:` array in frontmatter, validate them against
the JSON schema:

```bash
npm run validate:blocks
```

---

## 📁 Project Structure

```text
.
├── src/
│   ├── .vitepress/
│   │   ├── config.ts       # Main VitePress & theme config
│   │   └── theme/          # Theme entry, Layout, style overrides
│   ├── site.yaml           # Global cross-locale site config
│   ├── index.md            # Language selector (never locale content)
│   ├── en/                 # English content locale
│   │   ├── _site.yaml      # Locale site config
│   │   ├── index.md        # Landing page (blocks)
│   │   ├── doc/            # Optional documentation
│   │   └── pages/           # Standalone pages
│   └── public/             # Static public assets (logo, hero…)
├── package.json
└── README.md
```

This structure is required for both single-language and multilingual Neptu
sites. Keeping only `src/en/` is a complete single-language setup; it does not
mean that you must create translations. Do not move locale content directly
under `src/`. When another language is needed, add a sibling such as `src/ru/`.

The root `src/index.md` is a neutral language selector. It contains crawlable
links and only highlights the browser's likely language; it deliberately does
not perform an automatic browser-language redirect.

---

## 🧩 Building the Page

Blocks and primitives are registered globally — no import block needed. The
home page in this template is authored with **components** (`layout: home`):

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

### The same page as data

The same blocks can be described declaratively in frontmatter and rendered with
`layout: landing`. Content stays separate from markup, which makes translation,
CMS editing and AI generation straightforward:

```md
---
layout: landing
blocks:
  - type: hero
    title: Everything in YAML
    actions: [{ text: Get started, link: /en/doc }]
  - type: features
    cols: 3
    items:
      - { icon: 🚀, title: Fast, text: Static output. }
  - type: cta
    bg: brand
    title: Ready?
    actions: [{ text: Read the docs, link: /en/doc }]
---
```

Built-in blocks are schema-validated by `npm run validate:blocks`. Custom types
registered with `registerBlockTypes` are intentionally accepted by the schema;
the validation command rejects unknown types unless explicitly allowed with
`--allow-type=my-block`.

See `src/en/doc/blocks.md` for the full block catalogue and the shared props
every block accepts.

---

## ⚙️ Customization

- **Site Info & Navigation**: Edit `src/site.yaml` and `src/en/_site.yaml` to
  set the logo, nav bar links, footer text and the default color/style theme.
- **VitePress & integrations**: Edit `src/.vitepress/config.ts` to set your site
  URL (`siteUrl`), the `base` path, search provider and head tags.
- **Repository & edit links**: Set `themeConfig.repo` in
  `src/.vitepress/config.ts`. The edit-link URL is generated automatically.
- **Color & style**: Set `defaultColorTheme` / `defaultStylePreset` in
  `src/site.yaml`. Pickers are demo controls — enable them with
  `colorPicker: true` / `stylePicker: true`, then add them to the nav bar
  (see `src/.vitepress/theme/Layout.vue`).
- **Style overrides**: Edit `src/.vitepress/theme/styles.css`. Override `--ln-*`
  semantic tokens, or ship your own color (`[data-theme='…']`) and style
  (`[data-ln-style='…']`) presets.
- **New documentation pages**: Add new `.md` files in `src/en/doc/` and reference
  them in the `doc` sidebar (in `src/en/_site.yaml`).
- **Drop the docs**: A plain landing has no `doc/` folder. Remove it and the
  `doc` nav/sidebar entries whenever the project does not need documentation.

## 🔍 Search

The landing theme ships no search of its own — the nav bar search box comes
from the VitePress default theme. This template uses local search (MiniSearch),
configured in `src/.vitepress/config.ts`. For larger sites, switch to Algolia
DocSearch. See `src/en/doc/search.md` for both providers and how to add a custom
one (Pagefind, Orama…).
