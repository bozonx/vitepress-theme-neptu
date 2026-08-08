---
title: Project structure
description: >
  A map of the blog's folders: where content lives, where configuration is,
  and where static files are — and which of these you'll need to edit.
authorId: ivan-k
date: 2026-08-01
category: getting-started
tags: [start]
featured: true
descriptionAsPreview: true
translations:
  ru: /ru/posts/project-structure
---

The blog you [copied from the template](getting-started) has a standardized structure. Let's break it down so you know which file to open for each task.

## Your blog's structure

```text
my-blog/
├─ src/
│  ├─ .vitepress/
│  │  ├─ config.ts        # level 1 config, system settings
│  │  └─ theme/           # extensions and custom styles
│  ├─ ru/                 # locale — folder named after the language
│  │  ├─ posts/           # your posts (file or folder per article)
│  │  ├─ pages/           # standalone pages (About, Donate…)
│  │  ├─ _authors.yaml    # author profiles
│  │  ├─ _categories.yaml # categories for this locale
│  │  ├─ _site.yaml       # Level 3 config for a specific locale
│  │  └─ index.md         # locale home page
│  ├─ public/             # static files (media, icons, robots.txt)
│  ├─ site.yaml           # Level 2 config. Shared settings for all locales
```

These are the main files and folders you'll be working with, but you may also see other files and folders — these are service files that should not be edited without necessity.

## How posts (posts/) and pages (pages/) differ

The theme distinguishes content by purpose:

- **Posts** live in `src/<locale>/posts/` — as `.md` files. This is [your main content](first-post). Posts have dates and appear in lists of recent posts, popular posts, etc., and are automatically included in RSS, Atom and JSON feeds (if configured).
- **Pages** live in `src/<locale>/pages/` and are marked with `layout: page`. These are static documents for information not part of the blog's main content. They differ from posts in that they don't have dates and don't appear in feeds. Pages are meant for supplementary information: about the site, legal info, and similar.

## Locale folders

All content lives inside a locale folder, which represents a BCP 47 language tag: `src/ru/`, `src/en/`, `src/pt-BR/`, `src/zh-CN/`. This rule applies even for single-language sites — if you're making a blog in just one language, still use a locale folder, e.g. `src/ru/`.

Where to get codes and names is covered in [How to name a locale](locales#how-to-name-a-locale).

:::info
The VitePress `root` locale is not supported by the theme. And in the root of `src/`, only one markdown file is allowed — `index.md`, which renders the language selection page.
:::

## Nested folders inside posts/ and pages/

`posts/` and `pages/` don't have to be a flat file structure. You can build any nested structure inside them; the URL mirrors the file layout. For example:

```text
src/ru/
├─ posts/
│  ├─ hello-world.md              → /ru/posts/hello-world
│  ├─ my-article/                 → folder containing an article
│  │  ├─ index.md                 → /ru/posts/my-article/
│  │  └─ media/cover.jpg
│  └─ 2026/
│     └─ trip/
│        ├─ day-one.md            → /ru/posts/2026/trip/day-one
│        └─ day-one-photo.jpg
└─ pages/
   ├─ about.md                    → /ru/pages/about
   └─ pricing/
      ├─ index.md                 → /ru/pages/pricing/
      └─ media/table.svg
```

Two rules to keep in mind:

- **`index.md` gives a folder URL.** `posts/my-article/index.md` opens at `/ru/posts/my-article/`, not `/ru/posts/my-article/index`.
- **Subfolders don't create sections.** Nesting is a way to organize files; grouping content for the reader is handled by tags, categories and the date archive, not the path.

## What you'll need to edit

Files in `my-blog/src/` that you'll need to edit to configure your blog:

- `.vitepress/`
  - `config.ts` — siteUrl, search, external CSS/JS includes, Google Analytics integration, environment variables. This is the level 1 config for developers
  - `theme/`
    - `styles.css` — your style adjustments to the theme and overrides for standard CSS variables
- `<locale>/`
  - `_authors.yaml` — authors for this locale, or localized names and other data for authors listed in the global authors list in `src/site.yaml`
  - `_categories.yaml` — categories for this locale: the `id` that posts reference, and the name in the locale's language
  - `_site.yaml` — config for a specific locale (level 3), as well as additions and overrides for individual parameters from the global config `src/site.yaml`
  - `index.md` — the home page for this locale; you can add your own text, which will appear on the home page below the `hero` block
- `public/` — images, icons, media, robots.txt and other files that will be copied to the build as-is, without any processing
- `site.yaml` — settings for all locales at once (level 2 config for blog administrators)

The three configuration layers (`config.ts` → `site.yaml` → `_site.yaml`) are structured for a reason — how they interact and which takes precedence is covered in [Configuration layers](config-layers).

## Special files and folders

All lists — such as recent, popular, archive, authors, tags, categories — are generated automatically from your posts. The folders in your locale (e.g. `src/ru/`) `archive/`, `authors/`, `categories/`, `featured/`, `popular/` contain files that are already configured to generate the corresponding list pages; you don't need to edit them.

If you're not using a particular feature, besides disabling it in settings, also delete the corresponding folders: `authors/`, `categories/`, `featured/`, `popular/`, so they don't build unnecessarily and increase build time.

Also in the locale folder are special files:
- `getAllPosts.ts` — a service file, no need to edit
- `loadPosts.data.ts` — also a service file, no need to edit

And in the root of `src/` there's `index.md` which renders the language selection page — this file should not be edited either, but if you want, you can change its style by adding your own CSS in `.vitepress/theme/styles.css` for the `.locale-selector-wrapper` class and its descendants.

---

Now that you understand the structure, it's time to [add your first post](first-post).
