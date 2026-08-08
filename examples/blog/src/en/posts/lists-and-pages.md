---
title: Lists and pages
description: >
  How the theme automatically generates post lists (recent, featured, popular,
  archive, authors, tags, categories) and how to create static pages.
authorId: ivan-k
date: 2026-07-28
category: neptu-deep
tags: [lists, pages, archive, featured]
descriptionAsPreview: true
translations:
  ru: /ru/posts/lists-and-pages
---

The theme automatically generates various post lists from your posts. You don't create these pages — they're routes built from the post data.

## Auto-generated lists

| List | Route | What it shows |
| --- | --- | --- |
| Recent | `recent/<page>` | All posts sorted by date (newest first) |
| Featured | `featured/<page>` | Posts with `featured: true` |
| Popular | `popular/<page>` | Popular posts (requires GA4 integration) |
| Archive | `archive/<year>/<page>` | Posts grouped by year and month |
| Authors | `authors/<id>/<page>` | Posts by a specific author |
| Tags | `tags/<slug>/<page>` | Posts with a specific tag |
| Categories | `categories/<slug>/<page>` | Posts in a specific category |

All lists support pagination. The `perPage` setting controls how many posts per page:

```yaml
# src/site.yaml
themeConfig:
  perPage: 10
```

## Featured posts

Mark a post as featured in frontmatter:

```yaml
---
featured: true
---
```

Featured posts appear in:
- The `featured/` route
- The home page `featured` section (if configured)

## Archive

The archive groups posts by year and month automatically. The `archive/` folder contains template files that you don't need to edit.

## Sidebar configuration

Control which lists appear in the sidebar:

```yaml
# src/en/_site.yaml
themeConfig:
  sidebar:
    links:
      - text: 'Recent'
        href: 'recent/1'
        icon: 'fa6-solid:bolt'
      - text: 'Featured'
        href: 'featured/1'
        icon: 'fa6-solid:bookmark'
      - text: 'Archive'
        href: 'archive/'
        icon: 'fa6-solid:calendar-days'
      - text: 'Authors'
        href: 'authors/'
        icon: 'mdi:users'
      - text: 'Tags'
        href: 'tags/'
        icon: 'fa6-solid:tag'
      - text: 'Categories'
        href: 'categories/'
        icon: 'fa6-solid:folder-open'
```

## Post cards in lists

Each post in a list is rendered as a card showing:
- Cover image (if set)
- Title
- Date
- Reading time
- Preview text
- Author name
- Category and tags

### Preview text

The preview text in list cards is determined by priority:

1. `previewText` frontmatter field — highest priority
2. `descriptionAsPreview: true` — uses the `description` field
3. Auto-extract from the post content — first paragraph(s)

```yaml
---
descriptionAsPreview: true
# or
previewText: 'Custom preview text for the card.'
```

An empty `previewText: ''` disables the preview entirely.

### Card elements

Card elements can be individually controlled via `themeConfig`:

```yaml
themeConfig:
  postCard:
    showCover: true
    showDate: true
    showReadingTime: true
    showAuthor: true
    showCategory: true
    showTags: true
```

## Static pages

Pages with `layout: page` are standalone documents not part of the post feed:

```yaml
---
layout: page
title: About
---
```

Pages don't appear in lists, RSS, or the archive. They're for content like About, Donate, Privacy Policy, etc.

## Disabling unused lists

If you don't use a feature, disable it and remove the corresponding folder:

```bash
rm -rf src/en/authors src/en/categories src/en/featured src/en/popular
```

This prevents empty pages from being built and speeds up the build.

## What's next

- [Home page](home-page) — home page sections
- [Components reference](components) — list components for custom pages
