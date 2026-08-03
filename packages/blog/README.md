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

```sh
npm create neptu-blog@latest my-blog
cd my-blog
npm install      # or: pnpm install / yarn install
npm run dev      # or: pnpm dev / yarn dev
```

The scaffolder asks for a title and a content language, then writes out the
starter in [`template/`](./template). To copy that folder by hand instead:

```sh
git clone https://github.com/bozonx/vitepress-theme-neptu
cp -r vitepress-theme-neptu/packages/blog/template my-blog
```

Requires Node.js 20.19+ or 22.12+.

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
selector. It renders normal links to every locale and may highlight the
browser's language, but must not redirect automatically. It stays indexable
because `hreflang="x-default"` points at it.

The standard config helpers enforce this contract at build time: a manual
`locales.root` entry or any root Markdown file other than `src/index.md` stops
the build with a migration hint instead of producing partially broken SEO and
locale URLs.

Use the starter's root selector or import it in your own `src/index.md`:

```md
---
layout: false
---

<script setup>
import { LocaleSelector } from 'vitepress-theme-neptu/components'
</script>

<LocaleSelector />
```

The selector carries no prose — the only text is the site title (which
`mergeBlogConfig` falls back to the primary locale's title) plus each language
written in its own language. Override the heading with the `title` prop or a
`localeSelector.title` frontmatter key if you need something other than the
site title.

Configuration, frontmatter, components, and SEO are documented in full on the
[live site](https://bozonx.github.io/vitepress-theme-neptu).

## Media asset placement

The theme supports three approaches for organizing images and media:

1. **Shared `public/` directory** — `src/public/img/foo.png`, referenced as
   `/img/foo.png`. Best for small blogs and shared assets.
2. **Co-located next to the `.md` file** — `./foo.png` relative to the
   markdown file. Best for tutorials and single-file posts.
3. **Folder-per-article** — `article-slug/index.md` with a `media/`
   subfolder, referenced as `./media/foo.png`. Best for image-heavy articles.

All three get automatic `width`/`height` injection for both cover images and
standalone body images. See the [full guide](https://bozonx.github.io/vitepress-theme-neptu/en/post/media-asset-placement)
for details and examples.

## Development

This repo is an npm workspace (the blog theme is in `packages/blog`, the docs
site is in `docs/`). The monorepo uses npm for workspace management:

```sh
npm install
npm run blog:dev       # run the documentation/demo site
npm run test           # unit tests
npm run e2e            # end-to-end tests
npm run lint           # eslint
npm run typecheck      # typescript
```

## License

[MIT](./LICENSE)
