---
title: Pagefind search
description: >
  How the built-in Pagefind search works: build-time indexing, lazy UI loading,
  excluding a post from the index, and custom configuration.
authorId: ivan-k
date: 2026-07-11
category: neptu-deep
tags: [search, config]
descriptionAsPreview: true
translations:
  ru: /ru/posts/search-pagefind
---

Search is powered by [Pagefind](https://pagefind.app): it indexes the already-built site. **Pagefind is included with the theme** — you don't need to install it separately, add a build step, or include scripts in `head`. Search is enabled by default; to disable both indexing and the search button, set `enabled: false`:

```ts
// .vitepress/config.ts
themeConfig: {
  search: { enabled: true },
}
```

## What the theme does for you

- **Indexing.** After `vitepress build` completes (the `buildEnd` hook), the theme builds the index and places it in `<outDir>/pagefind`. The build script stays simple: `vitepress build src`.
- **UI loading.** `pagefind-ui.css` and `pagefind-ui.js` are loaded by the search modal on first open. This saves ~135 KB on every page load and prevents 404s in dev mode for index files that don't exist yet.

The index is built only from the production build, so search works after `npm run build` + `npm run preview`, not in dev — opening search in dev shows a helpful console warning.

## What gets indexed

Only the article text is indexed: author blocks, comments, sharing, similar posts, and "Popular" links are marked with `data-pagefind-ignore` and don't appear in search snippets.

There are no filters by tags or categories: search works on page content. To find everything in a category, use the [categories](../categories/) and [tags](../tags/) pages — see [Categories and tags](categories-and-tags).

## Excluding a post from search

To exclude a post from the search index, add to frontmatter:

```yaml
searchIncluded: false
```

The post will still be displayed on the site and appear in lists; it simply won't show up in search results.

## Configuring indexing

The theme configures Pagefind with sensible defaults — for a typical blog, nothing needs to be configured. Modal translations (labels, keyboard hints) are localized through the standard `t.searchUI` key in `site.yaml` or `_site.yaml`. Full reference — in the [Pagefind UI docs](https://pagefind.app/docs/ui/).

Need flags the theme doesn't provide? Set `search.enabled: false` and call the [Pagefind CLI](https://pagefind.app/docs/config-options/) yourself after the build.
