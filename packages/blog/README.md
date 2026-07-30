# vitepress-theme-neptu

A blog theme for [VitePress](https://vitepress.dev/): post lists, tags, authors and
archive, RSS/Atom/JSON feeds, Pagefind search, multilingual routing, and technical
SEO (JSON-LD, Open Graph, hreflang, canonical, sitemap) — all working out of the box.
Styled with Tailwind v4.

## 📖 Documentation & live demo

The documentation is itself a blog built with this theme — every page is a live
example with the code that produces it, arranged as a guide from first launch to
advanced customization:

### → [bozonx.github.io/vitepress-theme-neptu](https://bozonx.github.io/vitepress-theme-neptu)

Start there. This README only covers the essentials.

## Features

- **Multilingual by design** — one strict locale-prefixed content structure for
  both single-language and multilingual sites
- **Auto-generated lists** — recent, popular, archive, authors, tags
- **Feeds** — RSS / Atom / JSON per locale
- **Search** — Pagefind integration
- **SEO** — JSON-LD, Open Graph, hreflang, canonical, sitemap, robots.txt
- **Popular posts** — ranked by Google Analytics 4 pageviews at build time
- **Doc components** — YouTube embed, video/audio players, file download
- **Tailwind v4** styling with eight color schemes, light/dark, custom fonts

## Quick start

The fastest way to a working blog is to copy the starter template in
[`template/`](./template):

```sh
git clone https://github.com/bozonx/vitepress-theme-neptu
cp -r vitepress-theme-neptu/packages/blog/template my-blog
cd my-blog
npm install      # or: pnpm install / yarn install
npm run dev      # or: pnpm dev / yarn dev
```

Full walkthrough: [Getting started](https://bozonx.github.io/vitepress-theme-neptu/ru/post/getting-started).

### Adding to an existing VitePress project

```sh
npm install -D vitepress-theme-neptu
# or: pnpm add -D vitepress-theme-neptu / yarn add -D vitepress-theme-neptu
```

```ts
// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress-theme-neptu'
import './styles.css'
export default DefaultTheme
```

```css
/* .vitepress/theme/styles.css */
@import "tailwindcss";
@import "vitepress-theme-neptu/tailwind-source.css";
```

```ts
// .vitepress/config.ts
import { defineBlogConfig } from 'vitepress-theme-neptu/configs'

export default async () =>
  defineBlogConfig({
    siteUrl: 'https://example.com',
    srcDir: 'src',
  })
```

### Required content structure

Neptu intentionally uses one structure for every site:

```text
src/
├── site.yaml
└── en/
    ├── _site.yaml
    ├── index.md
    ├── post/
    └── page/
```

A single-language site still has exactly one locale directory, such as
`src/en/`; this does not require adding translations. Add another directory
only when you actually publish another language. Root-level content pages are
not a second supported mode: `src/index.md` is reserved for the language
selector. It renders normal links to every locale and may recommend the
browser's language, but must not redirect automatically.

Configuration, frontmatter, components, and SEO are documented in full on the
[live site](https://bozonx.github.io/vitepress-theme-neptu).

## Development

This repo is an npm workspace (the blog theme is in `packages/blog`, the docs
site is in `docs/`). The monorepo uses npm for workspace management:

```sh
npm install
npm run docs:dev       # run the documentation/demo site
npm run test           # unit tests
npm run e2e            # end-to-end tests
npm run lint           # eslint
npm run typecheck      # typescript
```

## License

[MIT](./LICENSE)
