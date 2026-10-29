---
title: Home page
description: >
  How to configure the blog's home page: hero block, list sections, background
  image, and custom content. General structure in site.yaml, localized
  text in _site.yaml.
authorId: ivan-k
date: 2026-08-04
category: writing
tags: [config]
descriptionAsPreview: true
translations:
  ru: /ru/posts/home-page
---

The locale home page `src/<locale>/index.md` looks like this:

```md
---
layout: home
---

Your custom text that will be rendered after the Hero block.
```

In the `index.md` file itself, you can write any content that will appear below the Hero block, or leave it empty; all other options are configured in the `themeConfig.home` section.

> Note that this refers specifically to the locale home page `src/<locale>/index.md`, not the root `src/index.md` which renders the language selector and should not be modified.

## Hero block

We recommend splitting the `home` config into shared settings in the level 2 config `src/site.yaml` and localized strings in the level 3 config `src/<locale>/_site.yaml`.

```yaml
# site.yaml
themeConfig:
  home:
    # Home page appearance theme
    # - auto: automatically determines the theme and shows the theme switch
    # - light: always light theme
    # - dark: always dark theme
    appearance: auto
    # Maximum content width in pixels
    maxWidth: 800
    background:
      # Background type: none | parallax. parallax enables a subtle parallax background on scroll
      # Default: none
      type: none
      
      # Path to background image for parallax mode
      image: /img/home.webp
      
      # Parallax background offset in pixels on scroll
      parallaxOffset: 300
```

```yaml
# en/_site.yaml
themeConfig:
  home:
    hero:
      # Hero block title
      title: 'My Blog'
      # Subtitle under title
      description: 'Short blog description'
      # Simple single image (recommended 320×320px (or 640×640px for Retina), WebP/PNG/SVG):
      image: '/img/logo.webp'
      # Or with alt text:
      # image: { src: '/img/logo.webp', alt: 'Logo' }
      # Or separate images for light and dark theme:
      # image: { light: '/img/logo-light.webp', dark: '/img/logo-dark.webp', alt: 'Logo' }
      # Array of buttons below the hero block
      actions:
        # Highlighted button - primary
        - { text: 'Read posts', href: 'recent/1', primary: true }
        # Button with icon
        - { text: 'Table of contents', href: 'pages/contents', icon: 'fa6-solid:list-ul' }
```

> **Requirements for the Hero image:**
> - **Dimensions:** recommended size is **320×320px** (scales down to 240×240px on mobile). For Retina screens, 640×640px can be provided.
> - **Format:** best results come from **WebP, PNG, or SVG with a transparent background** (mascots, 3D avatars, vector logos). The theme automatically applies a soft ambient drop shadow (`drop-shadow`) that adapts to dark and light themes.

## Sections

The order of objects in `sections` dictates the block order. Five types are supported:

| Type | What it displays | Default |
| --- | --- | --- |
| `featured` | posts marked with `featured: true` | enabled |
| `latest` | latest posts | disabled |
| `popular` | popular posts by GA4 | disabled |
| `categories` | categories list | enabled |
| `tags` | tag cloud | enabled |

```yaml
# site.yaml
themeConfig:
  home:
    sections:
      - { type: featured, enabled: true, limit: 3 }
      - { type: latest, enabled: false }
      - { type: popular, enabled: false }
      - { type: tags, enabled: true, limit: 15 }
      - { type: categories, enabled: true, limit: 10 }
```

`limit` caps the number of posts or tags displayed. If omitted, a single page is shown — the `themeConfig.perPage` value from `.vitepress/config.ts`. An empty section is never rendered: a featured section on a blog with no `featured` posts will simply not appear.

The `popular` section requires enabled GA4 integration — by default it is disabled. While there is no data, the list remains empty, and the build emits a warning. See [Analytics and popular posts](analytics) on how to enable it.

## Post feed instead of a landing page on home

The home page with `layout: home` is a landing page: hero, sections, optional parallax background, and **no sidebar**. If you prefer a traditional post feed instead, change the layout in `index.md` and insert the same component used by the `recent/[page].md` template:

```md
---
layout: util
---

<script setup>
import { RecentPostsList } from 'vitepress-theme-neptu/components'
</script>

<RecentPostsList :curPage="1" />
```

For popular posts, substitute `PopularPostsList` (requires `popularPosts.enabled`), and for featured posts — `FeaturedPostsList`.

Three differences from the template page:

- **`paths.js` is not needed.** `index.md` is a static route, not a dynamic `[page]`, so `params.page` is not set and the list defaults to the first page.
- **Do not copy `robots: noindex`.** List templates mark themselves with `noindex` so paginated pages do not create duplicate content in search results. The home page, on the contrary, must be indexed — do not carry over the `head` block from the template.
- **Pagination links go nowhere.** The base URL for pages is calculated from the current route, so on `/en/` pagination links would point to `/en/2`, which do not exist. In this mode, the home page acts as the first page of the feed; leave full pagination to `recent/1` and provide a link to it in navigation or the sidebar.

If you need more control, assemble the home page from individual components or connect a custom layout. See [Customizing the home page](customization#customizing-the-home-page).

---

Next: [Authors](authors)
