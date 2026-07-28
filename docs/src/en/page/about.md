---
title: About This Demo
description: What this example blog is, and how to use it as a starting point for your own site.
layout: page
translations:
  ru: /ru/page/about
---

# About This Demo

This is the example site that ships with
[vitepress-theme-neptu](https://github.com/bozonx/vitepress-theme-neptu).
It plays three roles at once:

1. **Visual documentation** — every post and page demonstrates a real feature,
   with the frontmatter or config that produced it shown right below the result.
2. **Scaffold** — copy the `example/blog` directory to bootstrap your own blog.
3. **E2E fixture** — the content covers the full range of options, so it doubles
   as a test fixture.

## How the pages are organized

| Area | Where to look |
| --- | --- |
| Post frontmatter | Posts tagged [`frontmatter`](../tags/frontmatter/1) |
| Media embeds | [Media components](../post/media-components) |
| SEO (OG, JSON-LD, canonical, hreflang) | Posts tagged [`seo`](../tags/seo/1) |
| Configuration | This `page/*` section: [layers](config-layers), [themes & fonts](color-themes), [nav/sidebar/footer](nav-sidebar-footer), [feeds/search](seo-feeds-search), [advanced](advanced) |
| Layout types | Sidebar: Recent · Popular · Archive · Authors · Tags |

## Run it locally

```bash
git clone https://github.com/bozonx/vitepress-theme-neptu
cd vitepress-theme-neptu
npm install
npm run docs:dev
```

Then open the printed URL. Edit any file under `example/blog/src` and the page
hot-reloads.

## Start your own blog

Copy `example/blog` somewhere new, then:

- replace `siteUrl` in `.vitepress/config.ts`,
- edit `src/site.yaml` and each `src/<locale>/_site.yaml`,
- delete the demo posts in `src/<locale>/post/` and write your own.

See [Config layers](config-layers) for what to edit where.
