---
title: Home page
description: >
  How to configure the blog's home page: hero block, content sections,
  background image, and using a post feed instead of a landing page.
authorId: ivan-k
date: 2026-07-12
category: configuration
tags: [home, config, layout]
descriptionAsPreview: true
translations:
  ru: /ru/posts/home-page
---

The home page is configured entirely through YAML — no Vue components needed unless you want full custom control. All settings live in `themeConfig.home` within `site.yaml` and `_site.yaml`.

## Hero block

The hero is the first thing visitors see. It consists of a title, description, logo image and action buttons:

```yaml
# src/site.yaml
themeConfig:
  home:
    hero:
      title: 'My Blog'
      description: 'A blog about things'
      image:
        light: '/img/home-logo-light.webp'
        dark: '/img/home-logo-dark.webp'
        alt: 'Blog logo'
      actions:
        - text: 'Get started'
          href: 'posts/getting-started'
          primary: true
        - text: 'About'
          href: 'pages/about'
```

The `image` field supports separate `light` and `dark` variants. The `actions` array defines buttons — `primary: true` makes the button stand out.

## Content sections

Below the hero, the home page can display multiple content sections:

```yaml
themeConfig:
  home:
    sections:
      - type: 'featured'
        title: 'Featured posts'
        maxPosts: 3
      - type: 'latest'
        title: 'Latest posts'
        maxPosts: 6
      - type: 'popular'
        title: 'Popular posts'
        maxPosts: 5
      - type: 'categories'
        title: 'Categories'
      - type: 'tags'
        title: 'Tags'
        limit: 20
```

### Section types

| Type | What it shows |
| --- | --- |
| `featured` | Posts marked with `featured: true` |
| `latest` | Most recent posts by date |
| `popular` | Popular posts (requires `popularPosts.enabled`) |
| `categories` | List of all categories |
| `tags` | Tag cloud of all tags |

Each section accepts `maxPosts` (or `limit` for tags) to control how many items to show.

## Background image

The home page background is configured separately from the color scheme:

```yaml
themeConfig:
  home:
    background:
      type: parallax   # none | parallax
      image: 'https://images.unsplash.com/photo-...'
```

- `type: none` — no background image
- `type: parallax` — subtle parallax effect on scroll

## Post feed instead of landing page

If you prefer a simple post feed instead of a landing page, use `layout: home` in `index.md` and configure only the `latest` section:

```yaml
themeConfig:
  home:
    hero:
      actions:
        - text: 'All posts'
          href: 'recent/1'
          primary: true
    sections:
      - type: 'latest'
        maxPosts: 10
```

## Custom content in index.md

Any markdown content in `src/<locale>/index.md` (after the frontmatter) is rendered below the hero and sections. This is useful for a welcome message or introduction:

```md
---
layout: home
---

Welcome to my blog! Check out the [getting started guide](posts/getting-started).
```

## Locale-specific overrides

Since config layers are deep-merged, you can override just the background or hero text per locale:

```yaml
# en/_site.yaml — overrides only the image, rest comes from site.yaml
themeConfig:
  home:
    background:
      image: /img/home-en.webp
```

## What's next

- [themeConfig settings](themeconfig-settings) — full settings reference
- [Customization](customization) — custom home page layouts and slots
