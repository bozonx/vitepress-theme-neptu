---
title: themeConfig settings — configuration levels 2 and 3
description: >
  An extensive overview of themeConfig settings: navigation, sidebar, footer,
  post footer, table of contents, locale inheritance, and adding new locales.
authorId: ivan-k
date: 2026-07-18
category: configuration
tags: [config, nav, sidebar, footer, toc]
descriptionAsPreview: true
translations:
  ru: /ru/posts/themeconfig-settings
---

This page covers `themeConfig` settings at levels 2 and 3 (`site.yaml` and `_site.yaml`). For level 1 (`.vitepress/config.ts`), see [Configuration layers](config-layers).

## Navigation (`nav`)

The top navigation bar is configured via `themeConfig.nav`:

```yaml
themeConfig:
  nav:
    links:
      - text: 'Home'
        href: '/'
      - text: 'About'
        href: 'pages/about'
        icon: 'fa6-solid:circle-info'
        desktopOnly: true
```

### Nav link fields

| Field | Required | Description |
| --- | --- | --- |
| `text` | Yes | Link label |
| `href` | Yes | URL (relative or absolute) |
| `icon` | No | Iconify icon (`prefix:name`) |
| `desktopOnly` | No | If `true`, hidden on mobile |

## Sidebar (`sidebar`)

The left sidebar has three sections: top links, navigation links, and bottom links.

```yaml
themeConfig:
  sidebar:
    links:
      - text: 'Recent'
        href: 'recent/1'
        icon: 'fa6-solid:bolt'
      - text: 'Archive'
        href: 'archive/'
        icon: 'fa6-solid:calendar-days'
    bottomLinks:
      - { header: '${t.links.links}' }
      - text: 'GitHub'
        href: 'https://github.com/...'
        icon: 'fa6-brands:github'
```

### Sidebar sections

| Section | Field | Description |
| --- | --- | --- |
| Top | `sidebar.links` | Main navigation links |
| Bottom | `sidebar.bottomLinks` | Secondary links (social, etc.) |

### Sidebar link fields

Same as nav links, plus:

| Field | Description |
| --- | --- |
| `header` | Renders as a section header (not a link) |

## Footer (`footer`)

The site footer is configured via `themeConfig.footer`:

```yaml
themeConfig:
  footer:
    message: 'Built with Neptu'
    copyright: '© 2026-present Your Name.'
    links:
      - text: 'About'
        href: 'pages/about'
      - text: 'Donate'
        href: 'pages/donate'
```

If `footer` is not set, no footer is rendered.

## Post footer (`postFooter`)

The post footer is the area below the article content. Its composition and order are controlled by an array:

```yaml
themeConfig:
  postFooter:
    - author
    - donate
    - comments
    - social-share
    - edit-link
    - categories
    - tags
    - similar
```

Each key renders the corresponding block. Remove or reorder entries to customize.

### Available blocks

| Key | What it renders |
| --- | --- |
| `author` | Author card |
| `donate` | Donate call-to-action |
| `comments` | Discussion link |
| `social-share` | Social sharing buttons |
| `edit-link` | "Edit this page" link |
| `categories` | Post categories |
| `tags` | Post tags |
| `similar` | Similar posts by tags |

## Table of contents and right column

### TOC settings

```yaml
themeConfig:
  toc:
    enabled: true
    minHeadings: 3        # don't show TOC if fewer than 3 headings
    maxDepth: 3           # include h2 and h3 only
```

### Right column (aside)

The right column shows the TOC and any custom content (ads, newsletter forms). Which layouts show it:

```yaml
themeConfig:
  asideLayouts: [post]    # which layouts show the right column
```

Per-post override:

```yaml
---
aside: true   # or false
toc: true      # or false
---
```

## Locale inheritance (`extends`)

A locale can inherit from another locale and override only what differs:

```yaml
# src/pt-BR/_site.yaml
lang: 'pt-BR'
extends: en    # inherit all settings from the en locale

themeConfig:
  home:
    hero:
      title: 'Meu Blog'   # override only the title
```

The `extends` field specifies which locale to inherit from. All settings are deep-merged.

## Adding a new locale

1. Create a folder: `src/<locale>/` (e.g., `src/de/`)
2. Add `_site.yaml` with at minimum `lang` and `title`
3. Add `index.md` with `layout: home`
4. Add `_authors.yaml` and `_categories.yaml` (can copy from another locale)
5. Register the locale in `.vitepress/config.ts`

```ts
// .vitepress/config.ts
export default async () => defineBlogConfig({
  // ...
  locales: ['ru', 'en', 'de'],  // or let the theme auto-detect from folders
})
```

## Link field reference

All link fields across nav, sidebar and footer share the same structure:

| Field | Type | Description |
| --- | --- | --- |
| `text` | String | Link label (supports `${t.*}` templates) |
| `href` | String | URL — relative (`pages/about`) or absolute (`https://...`) |
| `icon` | String | Iconify icon ID |
| `desktopOnly` | Boolean | Hide on mobile |
| `header` | String | Render as a section header instead of a link |

## What's next

- [Configuration layers](config-layers) — the three-level config system
- [Customization](customization) — CSS variables, hooks, slots and custom layouts
- [Home page](home-page) — home page configuration
