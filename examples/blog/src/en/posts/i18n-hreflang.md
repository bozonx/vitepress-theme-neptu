---
title: Localization & hreflang
description: >
  This blog ships English and Russian. Learn how locale folders, the language
  switcher, the translations field, and automatic hreflang tags fit together.
date: 2024-10-02T08:00:00Z
authorId: maria-editor
cover: https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200&auto=format&fit=crop
coverWidth: 1200
coverHeight: 800
coverAlt: Colorful flags of many countries
category: SEO
tags:
  - seo
  - i18n
descrAsPreview: true
# Link this post to its Russian counterpart. The theme uses this for the
# language switcher AND for the <link rel="alternate" hreflang="ru"> tag.
translations:
  ru: "/ru/post/i18n-hreflang"
---

This very post exists in **Russian** too. Use the **language switcher** in the
top bar to jump to it — and notice the switcher lands you on the *translated
post*, not the Russian home page, because the two are linked.

## How locales work

Each language is a folder under `src/` with its own `_site.yaml`. The theme
auto-discovers them — no locale list to maintain in code:

```
src/
  en/   ← _site.yaml, posts, listing routes
  ru/   ← _site.yaml, posts, listing routes
```

This is the required structure for single-language sites too. Keeping only
`src/en/` is complete and does not require creating translations. Neptu does
not treat root-level posts and pages as a second content mode: `src/index.md`
is reserved for a neutral language selector.
The config helper enforces this at build time: `locales.root` and root Markdown
files other than `src/index.md` fail with a migration hint.

Every locale gets its own home page, feeds, sitemap entries, and full set of
listing layouts (recent / popular / archive / authors / tags).

The root selector renders ordinary links to every locale, each written in its
own language, with no prose beyond the site title. Browser-language detection
highlights the matching link and scrolls it into view — no badge, no label to
translate — but it never redirects. The page stays indexable because
`hreflang="x-default"` points at it. For a
single-language deployment that needs an immediate `/` → `/en/` transition,
configure a permanent HTTP 301 or 308 redirect at the hosting layer instead of
adding a JavaScript timer.

## Linking translations

Add a `translations` map to a post's frontmatter to connect it with the same
article in other languages:

### How it's done

```yaml
# in src/en/post/i18n-hreflang.md
translations:
  ru: "/ru/post/i18n-hreflang"
```

```yaml
# in src/ru/post/i18n-hreflang.md
translations:
  en: "/en/post/i18n-hreflang"
```

From this the theme does two things automatically:

1. **Language switcher** — sends readers to the matching translation.
2. **hreflang tags** — emits `<link rel="alternate" hreflang="…">` for each
   linked language plus `x-default`, so Google serves the right version per
   user. Inspect `<head>` to see them.

## Per-locale identity

Each `_site.yaml` sets its own `lang`, labels, and can override any
theme string via the `t` translation map:

```yaml
# src/ru/_site.yaml
lang: 'ru-RU'
```

## Primary locale

The `primaryLocale` field sets which locale is the site's primary language. It
controls:

- the `x-default` target in hreflang tags;
- the `title` and `description` of the root language selector page at `/`.

```ts
// .vitepress/config.ts
const config: BlogUserConfig = {
  // ...
  primaryLocale: 'en',
}
```

The value is the locale folder name (`en`, `ru`, `pt-BR`). When omitted, `en`
is used if it exists, otherwise the first locale alphabetically.

## Toggles

hreflang is on by default; disable per page with `seo.hreflang: false`, or
globally in `src/site.yaml` under `themeConfig.seo`.
