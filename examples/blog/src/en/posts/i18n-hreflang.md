---
title: Linking translations and hreflang
description: >
  How to link translations of the same article with the translations field and
  what the language switcher and hreflang tags get from it.
authorId: maria-editor
cover: https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200&auto=format&fit=crop
coverWidth: 1200
coverHeight: 800
coverAlt: Colorful flags of different countries
translations:
  ru: "/ru/posts/i18n-hreflang"
date: 2026-07-13
category: i18n
tags: [i18n, seo]
descriptionAsPreview: true
---

This article is also available in **Russian**. Click the language switcher in the top bar — it will take you to the translated article, not the home page, because the versions are linked. Here we explain how this linking works and what it gives search engines. The locale system itself is described in [Locales and multilingual support](locales).

## Two matching methods

The theme looks for page translations in this order:

1. **`translations` field** in frontmatter — if present, it's the source of truth.
2. **Same relative path** of the article in other locales — fallback.

### Explicit matching

```yaml
# src/en/posts/i18n-hreflang.md
translations:
  ru: "/ru/posts/i18n-hreflang"
```

```yaml
# src/ru/posts/i18n-hreflang.md
translations:
  en: "/en/posts/i18n-hreflang"
```

The link is specified from both sides: each page declares where its translations live.

Explicit translations are only needed when article names or folders differ across locales, i.e., the slug paths are not identical.

```yaml
translations:
  en: /en/posts/hello-world
  'pt-BR': /pt-BR/artigos/ola-mundo
```

### Path matching

If you follow an approach where all article paths are the same across locales — including folders and subfolders, with only the content differing by language — then there's no need to specify the `translations` field in article frontmatter. Translations will be detected automatically:

```text
en/posts/article/hello-world.md  ←→  ru/posts/article/hello-world.md  ←→  de/posts/article/hello-world.md
```

### Generated lists

Tag pages, category pages, author pages, archive pages, as well as `recent/`, `popular/` and `featured/` — these are not files but routes that the theme builds from your posts. Both methods above don't apply to them: `[slug]/[page].md` is physically the same file in all locales, so "path matching" always "works," even if such a page doesn't exist in the other locale.

So a separate rule applies:

- **matching by meaning, not by path.** Category — by `id` from `_categories.yaml`, tag — by slug, author — by `authorId`, archive — by year;
- **always to the first page.** The reader is switching languages, not wanting the same page number in a different set of posts — and the third page in another locale might not exist;
- **no link if the list in the target locale is empty** or that section doesn't exist there at all. The route for an empty list is not built, and a section can be disabled by removing its folder — see [Project structure](project-structure).

## What the theme does with the link

If an article has a translation, the **language switcher** in the top bar contains links to the current article's versions in other languages.

The presence of a translation is checked at build time by scanning files in `srcDir`, and the result is written to the page. So the switcher offers exactly the languages in which the page actually exists, and matches the `hreflang` tags — they're now computed from the same source.

Also, **hreflang tags** appear in the page's `<head>` — one `<link rel="alternate">` for each found version, including the current one, plus `x-default`. View the source of this page, they're there:

```html
<link rel="alternate" hreflang="ru-RU" href="https://…/ru/posts/i18n-hreflang" />
<link rel="alternate" hreflang="en-US" href="https://…/en/posts/i18n-hreflang" />
<link rel="alternate" hreflang="x-default" href="https://…/en/posts/i18n-hreflang" />
```

This tells search engines: these pages are not duplicates, but versions of the same content for different languages — and the reader should be shown the one matching their language.

Implementation details:

- **The `hreflang` attribute value is the full `lang` of the locale** (`ru-RU`, `pt-BR`), as set in its `_site.yaml`, not the folder name.
- **`x-default` points to the primary locale.** The primary locale is determined by the `primaryLocale` field in `.vitepress/config.ts`. If not set, `en` is used (if it exists), otherwise the first locale alphabetically.
  Exception — locale home pages: for them `x-default` points to the root language selection page.
- **The version must exist on disk.** The theme checks the file before outputting the link, so there are no broken hreflang tags.
- If you have only one language in the blog, hreflang doesn't appear in `head` because there's simply no need.
- Drafts (`draft: true`) are excluded from hreflang automatically along with canonical and JSON-LD — see [Drafts, reading time, video and podcasts](drafts-video-podcasts).

:::tip
Absolute addresses are built from `siteUrl` — without it the tags won't appear, so set it before publishing (see [SEO overview](seo-features)).
:::

## Primary locale

The `primaryLocale` field sets the locale that's considered the primary one for the site.
It's used for:

- `x-default` in hreflang tags (see above);
- `title` and `description` of the root language selection page at `/`.

```ts
// .vitepress/config.ts
const config: BlogUserConfig = {
  // ...
  primaryLocale: 'en',
}
```

The value is the locale folder name (`ru`, `en`, `pt-BR`). If not set, the primary locale defaults to `en` (if it exists), otherwise the first locale alphabetically.

## How to disable

```yaml
# Globally — src/site.yaml
themeConfig:
  seo:
    hreflang: false
```

```yaml
# For a single page — in frontmatter
seo:
  hreflang: false
```

## What's next

- [Locales and multilingual support](locales) — routing, locale naming, adding a language
- [Interface translations and language selection page](i18n-translations) — built-in translations, `t` key reference, `extends`
- [SEO mechanisms](seo-features) — feeds, robots, sitemap, canonical and cross-posting
