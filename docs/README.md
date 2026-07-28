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
