---
title: Categories and tags
description: >
  Category — a post's primary section and breadcrumbs; tags — free-form labels.
  Categories are defined in _categories.yaml, tags — directly in the post.
authorId: ivan-k
date: 2026-07-27
category: writing
tags: [frontmatter, config]
descriptionAsPreview: true
translations:
  ru: /ru/posts/categories-and-tags
---

The theme has two taxonomies. Under the hood they work similarly, but they solve different problems — and are therefore configured differently:

| | Categories | Tags |
| --- | --- | --- |
| Count per post | usually one | as many as you want |
| Purpose | blog section | free-form labels |
| Where defined | `_categories.yaml` | nowhere, directly in the post |
| Breadcrumbs | built from it | no |
| Pages | [`categories/`](../categories/) | [`tags/`](../tags/) |

A blog typically has few categories, and they form its structure — which is why they are listed once in a registry, and posts reference them by ID. Tags can number in the hundreds, appearing as you go — they do not need separate registration.

## Category registry

The file `src/<locale>/_categories.yaml` is the single place where categories are defined. It works just like [`_authors.yaml`](authors). If you need logic or computed values, you can use `_categories.ts` instead of YAML — a module exporting an array of records; `.ts` takes priority if both files exist.

```yaml
# src/en/_categories.yaml
- id: 'getting-started'
  name: 'Getting Started'

- id: 'configuration'
  name: 'Configuration'

- id: 'writing'
  name: 'Writing'
```

A record has three fields, and distinguishing them is important:

| Field | Description | Translated |
| --- | --- | --- |
| `id` | key referenced by posts | **no**, identical across all locales |
| `name` | visible title | yes |
| `slug` | URL path segment | yes, but defaults to `id` |

Only `id` is required. `name` and `slug` default to `id` if omitted, so `- id: 'seo'` is already a working category with the URL `/en/categories/seo/1`.

::: tip Custom fields
You can add any custom fields to a record — for example, `description`. The theme doesn't render them, but they pass through the build and are accessible in `frontmatter.categories[]` for your custom components or CMS.
:::

::: tip Also supported in `_site.yaml`
The same can be defined in `themeConfig.categories` inside `_site.yaml` — layers merge by `id`. However, a dedicated file is more convenient: it is easy to edit in headless CMSs like Sveltia, and it keeps the main site config lean.
:::

::: tip Editor autocompletion
Add the schema line to the top of `_categories.yaml`:
`# yaml-language-server: $schema=https://unpkg.com/vitepress-theme-neptu/schema/categories.schema.json`
— then any editor with yaml-language-server (VS Code, Neovim, etc.) will provide autocompletion and value validation.
:::

## Setting a post category

In the post, specify only the category `id`:

```yaml
---
title: Launch a blog in 5 minutes
category: getting-started
tags:
  - guide
---
```

If a post genuinely belongs to multiple categories, use the `categories` field with a list of IDs:

```yaml
categories:
  - getting-started
  - configuration
```

`category` is simply syntactic sugar for a single-element list. During the build, the theme normalizes both fields into a single deduplicated `categories` list by `id`, so components and structured data always read one consistent shape. Specifying both fields at the same time is allowed — the value from `category` comes first.

### Breadcrumbs

Breadcrumbs are automatically generated from the post's first category. They appear at the top of the post page and show the path from the home page to the current post:

Home → Category name → Post title

**The first category is primary.** It determines the breadcrumbs and `BreadcrumbList` in structured data. Additional categories are shown as chips in the post footer.

## Different URLs in different languages

A category has its own entry in each locale, and the `slug` can differ between entries:

```yaml
# src/ru/_categories.yaml
- id: 'writing'
  name: 'Контент'
  slug: 'kontent'
```

```yaml
# src/en/_categories.yaml
- id: 'writing'
  name: 'Writing'
```

This produces `/ru/categories/kontent/1` and `/en/categories/writing/1` — each URL is human-readable in its language, which is better for SEO. Meanwhile, the language switcher continues to work because the category resolves by the shared `id`.

## Tags

Unlike categories, tags are specified directly in the post's frontmatter, without a central registry.

```yaml
tags:
  - frontmatter
  - layout # → /en/tags/layout/1
```

A custom slug is specified using object syntax:

```yaml
tags:
  - { name: 'Vue.js', slug: 'vue' }
```

A tag exists in the tag list as long as at least one post uses it.

::: tip Tag registry for CMS
If you need a tag list for autocomplete in a CMS like Sveltia, create `_tags.yaml` yourself: the CMS reads such a file directly, whereas the theme does not require or read it. Simply keep display names in it, and configure the CMS widget to save a string to the post — this way there is no second source of truth.
:::

## Configuration

```yaml
# src/site.yaml
themeConfig:
  sidebar:
    tags: true
    categories: true # disabled by default
    # How many tags to show in the sidebar; followed by "All tags" link.
    # tagsCount: 15 # default: 15

    # How many categories to show in the sidebar; followed by "All categories" link.
    # categoriesCount: 10 # default: 10

  # Icon for category links (default: tagsIcon).
  categoriesIcon: 'fa6-solid:folder-open'
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

`postFooter` is an array of strings representing footer block names: `author`, `donate`, `comments`, `social-share`, `edit-link`, `categories`, `tags`, `similar`.
The key order dictates the block order. The array **completely replaces** the default value, so you must list all blocks you want to display: omit `categories` or `tags` to hide that block.

## Feeds and search

Post tags are added to the RSS feed as `<category>` elements with links to the tag page. Categories are not emitted in the feed.

---

Next: [Drafts, reading time, video button and podcasts](drafts-video-podcasts)
