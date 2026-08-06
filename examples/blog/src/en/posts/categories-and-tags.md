---
title: Categories and Tags
description: >
  A category is the post's one section and its breadcrumb trail; tags are free
  labels. How to declare them, where they show up, and what you can configure.
date: 2025-05-06T10:00:00Z
authorId: ivan-k
category: Configuration
tags:
  - guide
  - config
descriptionAsPreview: true
---

The theme has two taxonomies. They share the same internals but answer
different questions:

| | Categories | Tags |
| --- | --- | --- |
| Per post | usually one | as many as you like |
| Meaning | a section of the blog | free-form labels |
| Breadcrumbs | built from it | none |
| Pages | [`categories/`](../categories/) | [`tags/`](../tags/) |
| Post-footer block | `PostCategories` | `PostTags` |
| Search filter | `category` | `tag` |

Neither needs a registry file — both are collected from post frontmatter at
build time.

## Declaring a category

The ordinary case is one category, written as a string:

```yaml
---
title: Getting started in five minutes
category: Getting Started
tags:
  - guide
---
```

The URL slug is transliterated from the name: `Getting Started` →
`/en/categories/getting-started/1`. Set it yourself with the object form:

```yaml
category: { name: 'Getting Started', slug: 'start' }
```

If a post genuinely belongs in several sections, use `categories` — it accepts
strings and objects alike:

```yaml
categories:
  - Getting Started
  - { name: 'Configuration', slug: 'setup' }
```

`category` is sugar for a single-entry list. At build time the theme folds both
fields into one normalized `categories` list, de-duplicated by slug, so
components and structured data always read a single shape. Declaring both is
fine — the `category` value comes first.

**The first category wins.** It is the one that builds the breadcrumb trail and
the `BreadcrumbList` markup. The rest appear as chips in the post footer.

## What you get for free

These pages are generated at build time — you do not create them:

| Page | URL |
| --- | --- |
| All categories | [`categories/`](../categories/) |
| Posts in a category | `categories/<slug>/<page>` |
| Popular in a category | `categories/<slug>/popular/<page>` |

Plus, on post pages: the breadcrumb trail above the title, the category block in
the footer, and the category cloud in the sidebar.

::: tip Upgrading an existing blog
Categories arrived after the first template releases. If your blog was scaffolded
earlier, copy `src/<locale>/categories/` from the
[template](https://github.com/bozonx/vitepress-theme-neptu/tree/main/packages/blog/template/src/en/categories)
— without those files VitePress never builds the category routes.
:::

## Configuration

```yaml
# src/site.yaml
themeConfig:
  sidebar:
    tags: true
    categories: true # off unless set
  # How many categories the sidebar shows before the "all categories" link.
  sidebarCategoriesCount: 10
  # Icon for category links; falls back to tagsIcon.
  categoriesIcon: 'fa6-solid:folder-open'
  postFooter:
    - categories
    - tags
```

Drop `categories` from `postFooter` to hide the footer block — the order of the
keys is the order of the blocks.

## Breadcrumbs

The trail is rendered only for posts that have a category:
`Home / Categories / <Category> / <Title>`. Without one there is no hierarchy to
express, and "Home / Post title" tells the reader nothing — so it is omitted.

The matching `BreadcrumbList` JSON-LD is emitted alongside the visible trail —
see [JSON-LD structured data](json-ld).

`NeptuBreadcrumbs` is exported too, if you want a trail of your own:

```vue
<script setup>
import { NeptuBreadcrumbs } from 'vitepress-theme-neptu/components'
</script>

<NeptuBreadcrumbs
  :items="[
    { text: 'Home', href: '/' },
    { text: 'Docs', href: 'pages/docs' },
    { text: 'Current page' },
  ]"
/>
```

Relative hrefs (`pages/docs`) get the active locale prefix automatically. The
last item needs no `href` — the current page renders as plain text.

## Search

Categories are indexed as the `category` facet and tags as `tag`, so the search
UI can filter by either — see [Preview and search](preview-and-search).
