# Documentation & demo site

This is the documentation site for `vitepress-theme-neptu-blog`, built with the
theme itself. It doubles as a live demo: every page is a working example of a
feature. Published at **https://bozonx.github.io/vitepress-theme-neptu-blog**.

The Russian locale (`src/ru/`) is the primary, fully written guide. The English
locale (`src/en/`) is kept for reference and will be re-synced later.

## Run from the repo root

This monorepo uses npm workspaces:

```sh
npm install
npm run docs:dev       # dev server
npm run docs:build     # production build + Pagefind index
npm run docs:preview   # preview the production build
```

Content lives under `src/<locale>/` — see the
[Getting started](https://bozonx.github.io/vitepress-theme-neptu-blog/ru/post/getting-started)
guide for the structure. To scaffold a new blog, copy the
[`packages/blog/template/`](../packages/blog/template) directory instead of this site.

## GitHub Pages base path

The `build` and `preview` scripts in `package.json` use
`--base /vitepress-theme-neptu-blog/` because this site is deployed to a
GitHub Pages subpath (`bozonx.github.io/vitepress-theme-neptu-blog`). The
`VITEPRESS_BASE` env var is also set so runtime code can resolve the prefix.

This is **deployment-specific**. A site served from the domain root (e.g.
`myblog.com` or `localhost`) should use the VitePress default `base: '/'` — no
`--base` flag or `VITEPRESS_BASE` override is needed. The blog and landing
templates ship with `base: '/'` by default.
