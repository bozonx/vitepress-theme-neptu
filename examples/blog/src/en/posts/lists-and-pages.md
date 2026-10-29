---
title: Lists and pages
description: >
  The theme automatically compiles recent, featured, popular, archive, authors,
  and tags lists from your posts. Plus — standalone pages like "About this blog".
authorId: ivan-k
date: 2026-07-19
category: neptu-deep
tags: [config]
descriptionAsPreview: true
translations:
  ru: /ru/posts/lists-and-pages
---

You write posts — and the theme builds list pages automatically. Let's look at which lists are available and how standalone pages like "About this blog" work. Home page configuration is covered in a separate article — [Home page](home-page).

## Automated lists

From your posts, the theme generates seven types of lists. All of them are accessible from this demo's sidebar:

| List | What it shows | URL |
| --- | --- | --- |
| **Recent** | all posts by date, newest first | [`recent/1`](../recent/1) |
| **Featured** | posts with `featured: true` | [`featured/1`](../featured/1) |
| **Popular** | posts by pageviews (requires GA4) | [`popular/1`](../popular/1) |
| **Archive** | by years, then by months | [`archive/`](../archive/) |
| **Authors** | posts by each author | [`authors/`](../authors/) |
| **Tags** | posts by each tag | [`tags/`](../tags/) |
| **Categories** | posts by each category | [`categories/`](../categories/) |

You don't need to create these pages manually — they are assembled during the build. Which ones to display in the sidebar is decided by `sidebar` (see [themeConfig settings](themeconfig-settings)):

```yaml
# src/<locale>/_site.yaml
themeConfig:
  sidebar:
    recent: true
    featured: true
    popular: true     # requires popularPosts.enabled in config.ts
    archive: true
    authors: true
    tags: true
    categories: true  # disabled by default
```

"Popular" relies on Google Analytics data and functions only when a GA4 data source is configured — see [Analytics and popular posts](analytics) for details.

The number of posts per list page is controlled by `perPage` in `.vitepress/config.ts` — this is a build-time parameter and does not work in YAML (see [Configuration layers](config-layers)). The number of page numbers visible in pagination is configured via `paginationMaxItems` (default: 5).

## Featured posts

`featured: true` in frontmatter adds an article to the editorial selection:

```yaml
---
title: An article worth starting with
date: 2026-08-01
featured: true
---
```

This flag does not alter the order of recent posts, archive, feeds, or similar articles — it only populates the [`featured/1`](../featured/1) page, the sidebar section of the same name, and the `featured` section on the home page. Inside the selection, posts are listed from newest to oldest.

## Authors, tags and categories

- **Authors** come from `_authors.yaml`: a post references the author via `authorId`, and the theme builds the [author page](../authors/) and injects their metadata into the footer and structured data. For details, see [Authors](authors).
- **Tags** are taken directly from the post's `tags` field; no separate tag registry is needed.
- **Categories** are described in the locale's `_categories.yaml`, and a post links to one via `id` in the `category` (or `categories`) field. One category per post defines the blog section and breadcrumbs. For details, see [Categories and tags](categories-and-tags).

## Standalone pages

Not everything on a blog is an article. For permanent pages (about, contact, rules), create a file in `src/<locale>/pages/` with `layout: page`:

```md
---
title: About the blog
layout: page
---

# About the blog

Standard Markdown. This page will not appear in feeds, archive, or post lists — it is simply a document.
```

Linking to it is convenient from the navbar, footer, or sidebar bottom links (`href: 'pages/about'`). Live examples include [About this demo](../pages/about) and [Links](../pages/links).

## Post cards in lists

Post cards in lists (such as on **Recent posts**, **Tags**, and **Authors** pages) display a brief preview. By default, the theme generates a preview from the beginning of the post body, but this can be customized.

### Three ways to control previews

**1. Automatic (default).** Do nothing — the theme creates an excerpt from the article text up to `maxPreviewLength` characters.

**2. Using description.** Set `descriptionAsPreview: true` to use the frontmatter `description` field as the card text (this is how most demo posts are configured).

**3. Explicit text.** Set `previewText` to manually specify the card text. Use `descriptionAsPreview` **or** `previewText`, but not both together.

```yaml
# Explicit preview text:
previewText: "This card text is explicitly specified via previewText…"

# Or alternative option:
# descriptionAsPreview: true
```

### Preview length

Set the automatic preview length **strictly in `config.ts`**: text is truncated at build time in the locale's data loader, which imports this export:

```ts
// .vitepress/config.ts
export const postList = { maxPreviewLength: 300 }
```

The YAML schema accepts the key `postList.maxPreviewLength`, but it will have no effect on the already truncated card text — do not duplicate it there.

### Card elements

Displaying card elements (date, tags, thumbnail, author) is configured in YAML:

```yaml
# src/site.yaml
themeConfig:
  postList:
    showDate: true
    showTags: true
    showThumbnail: true
    showPreview: true
    showAuthor: true
```

---

Next: [Pagefind search](search-pagefind)
