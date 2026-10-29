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
│  │  └─ theme/           # theme extensions and custom styles
│  ├─ ru/                 # locale — folder named after the language
│  │  ├─ posts/           # your posts
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

- **Posts** are [your main content](first-post), which is displayed in lists of recent posts, popular posts, etc., as well as in RSS, Atom, and JSON feeds (if configured). Each post must have a date — think of it as the publication date. Post lists are ordered by this date. Posts are located in the corresponding locale folder `src/<locale>/posts/`.
- **Pages**, unlike posts, do not have a publication date, do not appear in content lists or feeds, and are designed for various informational pages, such as: about the blog, about the author, links to social networks, or donation methods. Each page must have the frontmatter field `layout: page`. Pages are located in `src/<locale>/pages/`.

## Locale folders

All content lives inside a locale folder, which represents a BCP 47 language tag: `src/ru/`, `src/en/`, `src/pt-BR/`, `src/zh-CN/`. This rule applies even for single-language sites — if you're making a blog in just one language, still use a locale folder, e.g. `src/ru/`.

Where to get codes and names is covered in [How to name a locale](locales#how-to-name-a-locale).

::: info
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

## Configure your blog

Files in `my-blog/src/` that you should edit to configure your blog:

- `.vitepress/`
  - `config.ts` — siteUrl, search, external CSS and JS includes, Google Analytics integration, environment variables. This is the [level 1 config for developers](config-layers)
  - `theme/`
    - `styles.css` — your [style adjustments](customization) to the theme to your taste as well as overrides for standard CSS variables
- `<locale>/`
  - `_authors.yaml` — localized data of post [authors](authors)
  - `_categories.yaml` — [categories](categories-and-tags) for this locale
  - `_site.yaml` — config for a specific locale ([level 3](themeconfig-settings)), as well as additions and overrides for individual parameters from the global config `src/site.yaml`
  - `index.md` — [home page](home-page) of this locale; you can add your own text, it will appear on the home page below the `hero` block
- `public/` — images, icons, media, robots.txt and other files that will be copied to the build as-is, without any processing
- `site.yaml` — settings for all locales at once ([level 2 config for blog administrators](themeconfig-settings))

The three configuration layers (`config.ts` → `site.yaml` → `_site.yaml`) are structured for a reason — how they interact and which takes precedence is covered in [Configuration layers](config-layers).

## Special files and folders

All lists, such as recent, popular, archive, authors, tags, categories, are generated automatically from your posts. The folders in the locale directory `recent/`, `archive/`, `authors/`, `categories/`, `tags/`, `featured/`, `popular/` contain files that are already configured to generate the corresponding list pages; **you do not need to edit them**.

If you're not using a particular feature (for example, popular posts, authors page, featured posts, or categories), then in addition to disabling it in settings, you should delete the corresponding folders (`popular/`, `authors/`, `featured/`, `categories/`), so they don't build unnecessarily. However, do not delete `authors/` or `categories/` if your posts reference them via `authorId` or `category`, otherwise links from post pages will lead to a 404.

Also in the locale folder are special files:
- `getAllPosts.ts` — a service file, no need to edit
- `loadPosts.data.ts` — also a service file, no need to edit

And in the very root of `src/` there's `index.md` which renders the language selection page; this file should not be edited either, but if you want, you can change its style by adding your own CSS in `.vitepress/theme/styles.css` for the `.locale-selector-wrapper` class and its descendants.

---

Now that you understand the structure, it's time to [add your first post](first-post).

Next: [Your first post](first-post)
