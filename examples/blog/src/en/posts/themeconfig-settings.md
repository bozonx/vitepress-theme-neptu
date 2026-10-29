---
title: themeConfig settings — configuration levels 2 and 3
description: >
  All non-system themeConfig settings for levels two and three: navigation,
  sidebar, footer, post footer, table of contents and translations. Other
  parameters are covered in dedicated articles.
authorId: ivan-k
date: 2026-08-04
category: configuration
tags: [config]
descriptionAsPreview: true
translations:
  ru: /ru/posts/themeconfig-settings
---

This article describes `themeConfig` settings configured in `site.yaml` (level 2) and `_site.yaml` (level 3).
System settings and the general layered model are described in [Configuration layers, first-level config and string templates](config-layers).

Several level 2 and 3 parameters are detailed in dedicated articles:

| Parameter | Where described |
| --- | --- |
| `home` | [Home page](home-page) |
| `i18nRouting` | [Locales and multilingual support](locales) |
| `authors` | [Authors](authors) |
| `readingTime`, `drafts`, `podcastPlatforms` | [Drafts, reading time, video button and podcasts](drafts-video-podcasts) |
| `search` | [Pagefind search](search-pagefind) |
| `popularPosts` | [Analytics and popular posts](analytics) |
| `ads` | [Ad blocks](ads) |
| `consent` | [Cookie consent](consent) |
| `feeds`, `seo`, `twitterSite` | [SEO features](seo-features) |
| `publisher` | [JSON-LD microdata](seo-json-ld) |
| `paginationMaxItems`, `postList` | [Lists and pages](lists-and-pages) |
| `defaultColorTheme`, `defaultStylePreset`, `colorPicker`, `stylePicker`, replacing built-in icons | [Customization](customization) |
| `t`, `t.searchUI`, accessibility labels, `notFound` | [Interface translations and language selection page](i18n-translations) |

::: tip
See an example of the full level 2 configuration [here](https://github.com/bozonx/vitepress-theme-neptu/blob/main/packages/blog/template/src/site.yaml)

See an example of the full level 3 configuration [here](https://github.com/bozonx/vitepress-theme-neptu/blob/main/packages/blog/template/src/en/_site.yaml)

This will help you understand how parameters are split across levels: in short, localized strings and locale-specific parameters live in level 3 config, while everything else belongs in level 2 config.
:::

## Locale inheritance (`extends`)

Closely related locales do not need duplicate configurations. `extends` in `_site.yaml` specifies the folder name of the parent locale whose settings are used as a base:

```yaml
# src/en-GB/_site.yaml
extends: en
lang: en-GB
title: My Blog
```

The value is the folder name, not a file path. **Everything** from the parent's `_site.yaml` is inherited: `lang`, `title`, `description`, `themeConfig` and translations `t`. Objects are merged recursively (deep-merge), so you only need to declare the differences.

Always specify `lang` explicitly — it is injected into `<html lang>`, `hreflang`, and date formatting. If you inherit `lang: en` from the parent, the `/en-GB/` page will be labeled as generic English, even though the URL and content are British English.

`extends` chains are supported to any depth — `en-GB` can inherit from `en`, and `en-US` from `en-GB`. The theme detects cycles (`en → en-GB → en`) and terminates them with a console warning.

## Adding a new locale

Create a folder `src/<locale>/` with a `_site.yaml` file. The next step depends on whether the language is in the built-in set.

**Regional variant** (`en-GB`, `es-MX`) — inherit everything from the base locale via `extends` and override only the differences. Content will be available at its URL, with interface translations coming from the parent (see [Locale inheritance](#locale-inheritance-extends)).

```yaml
# src/en-GB/_site.yaml
extends: en
lang: en-GB
```

**Language outside built-in set** (`uk`, `vi`) — define `lang`, `label`, and keys in `t`. Other strings are inherited from English via fallback, so you can translate incrementally — starting with the most visible (`search`, `tags`, `categories`, `readingTime`, `links.*`). For the full reference of `t` keys, see [Interface translations](i18n-translations#t-keys).

```yaml
# src/uk/_site.yaml
lang: uk
label: Ukrainian
themeConfig:
  t:
    search: 'Search'
    tags: 'Tags'
    categories: 'Categories'
    readingTime: 'Reading time'
    links:
      aboutBlog: 'About blog'
      donate: 'Support'
```

If there is no separate content for a regional locale and you need a redirect such as `/en-US/*` → `/en/*`, configure `301`/`308` redirects on your hosting provider (`_redirects` for Netlify, `vercel.json` for Vercel, redirect rules for Cloudflare) — this is a hosting deployment rule rather than part of the theme.

## Navigation, sidebar and footer

### Top navigation (`nav`)

The bar at the very top. Contains arbitrary links, social icons, donate button, search button, language switcher, and theme color picker.

```yaml
# src/<locale>/_site.yaml
themeConfig:
  nav:
    donate: true            # show donate button in navbar (requires donate.url)
    links:
      - text: 'External link'
        href: 'https://example.org/'
        icon: 'solar:document-linear'
        desktopOnly: true   # hide on mobile (where sidebar handles navigation)
      - text: 'Sidebar only'
        href: 'pages/mobile-info'
        icon: 'solar:phone-linear'
        mobileOnly: true    # hide on desktop (show only in sidebar)
    socialLinks:
      - icon: 'fa6-brands:github'
        href: '${theme.repo}'
```

Link fields (`text`, `href`, `icon`, `desktopOnly`, etc.) are documented in [Link fields](#link-fields).

### Sidebar

Enable or disable built-in sections and add custom link groups:

```yaml
themeConfig:
  sidebar:
    sidebarTitle: 'My Blog'  # sidebar heading; false — hide
    logoSrc: '/img/sidebar-logo.webp'  # logo above navigation; or object { light, dark, alt }
    logoHeight: 180
    tagsCount: 15       # maximum tags in sidebar tag cloud
    categoriesCount: 10 # maximum categories in sidebar categories list
    recent: true        # Show link to recent posts
    featured: true      # Show link to posts with featured: true
    popular: true       # Show link to popular posts. Requires popularPosts.enabled (disabled by default)
    archive: true       # Show link to archive by years → months
    authors: true       # Show link to authors
    tags: true          # Show tag cloud
    categories: true    # Show categories cloud (disabled by default)
    donate: true        # Show link to donate
    rssFeed: true       # Show link to RSS feed
    atomFeed: true      # Show link to Atom feed
    links:
      - text: 'Table of contents'
        href: 'pages/contents'
        icon: 'fa6-solid:list-ul'
    bottomLinks:
      # Header for group of links
      - { header: '${t.links.links}' }
      - text: 'Our YouTube channel'
        href: 'https://www.youtube.com/'
        icon: '${theme.youtubeIcon}'
      - text: 'Social media'
        href: 'pages/links'
        icon: 'fa6-solid:share-nodes'
    socialLinks:
      - icon: 'fa6-brands:github'
        href: '${theme.repo}'
```

Sections are rendered in a fixed order: logo → main links (`sidebar.links`) → recent / featured / popular / archive / authors / tags / categories → `bottomLinks` → social links → feeds.

### Footer

The page footer: copyright, platform information, arbitrary links and social icons:

```yaml
themeConfig:
  footer:
    socialLinks:
      - icon: 'fa6-brands:github'
        href: '${theme.repo}'
        title: 'GitHub'
    message: 'Copying allowed only with a link to the source.'
    copyright: 'Copyright 2026 Your Name.'
    links:
      - text: '${t.links.aboutBlog}'
        href: 'pages/about'
        # desktopOnly: true  # hide on mobile
        # mobileOnly: true   # hide on desktop
```

Link fields in `footer.links` are described in [Link fields](#link-fields).
Social link fields in `footer.socialLinks` follow below.

The `rssFeed` and `atomFeed` flags are enabled by default and displayed only when the respective feed exists.

::: tip
You can completely replace the default footer with your own; see [Customization](customization#customizing-the-site-footer).
:::

### Link fields

Links in `nav.links`, `sidebar.links`, `sidebar.bottomLinks`, and `footer.links` use the same set of fields:

| Field | Description |
| --- | --- |
| `text` | Link text. Except in socialLinks, which are icon-only without text |
| `title` | Tooltip text |
| `href` | URL; relative paths are prefixed with locale, absolute URLs (`https://…`) used as-is |
| `icon` | [Iconify](https://icon-sets.iconify.design/) icon name, e.g. `solar:document-linear` |
| `iconClass` | CSS class for icon |
| `class` | CSS class for the whole link element |
| `desktopOnly` | `true` — hide on mobile (where sidebar handles navigation) |
| `mobileOnly` | `true` — hide on desktop (show only in sidebar) |

## "Support" button (donate)

The `nav.donate` and `sidebar.donate` flags only toggle the button visibility; where it links to is defined in the separate `donate` section:

```yaml
themeConfig:
  donate:
    url: 'pages/donate'   # relative path is prefixed with locale, or external https://
    icon: 'fa6-solid:hand-holding-heart'   # optional, defaults to donateIcon
    postDonateCall: 'If you found this article helpful, consider supporting the blog.'
```

::: tip
Without `donate.url`, donation buttons will not appear in the top navbar, sidebar, or post footer, even if enabled.
:::

::: tip
A relative `href` such as `pages/about` is automatically prefixed with the current locale (`/en/pages/about`, `/ru/pages/about`). For external links, use absolute URLs (`https://…`).
:::

## Edit link (editLink)

The `edit-link` block in the post footer displays a "Edit this page" link.
The theme automatically generates the edit URL from `themeConfig.repo` for GitHub, GitLab, Bitbucket, Gitea, Forgejo, and Codeberg — you only need to specify `repo` in `.vitepress/config.ts`. You only need to override `pattern` manually for custom branches or source paths:

```yaml
themeConfig:
  editLink:
    text: 'Edit on GitHub'
    pattern: 'https://github.com/user/repo/edit/main/src/:path'
```

::: tip
If `repo` is not set, the block is not displayed. The default text is taken from translations (`t.editLink`) — override only if the standard phrase is unsuitable.
:::

## External links in post content

By default, an external link icon is appended to external links inside your markdown content (not navigation links) to inform readers that the link leads to an external website and will open in a new tab. This icon can be disabled globally:

```yaml
# src/site.yaml
themeConfig:
  externalLinkIcon: true   # set to false to remove the ↗ icon on external links
```

::: tip
If you need to change the `rel` attribute (VitePress adds `rel="noreferrer"` by default), override `markdown.externalLinks` in `.vitepress/config.ts`:

```ts
markdown: {
  externalLinks: { target: '_blank', rel: [] }, // for example, remove rel="noreferrer"
}
```
:::

## Post footer

Scroll to the bottom of this page — all post footer blocks are in active use: **author card**, **discussion link**, **social share buttons**, **edit link**, **categories and tags**, and the list of **similar posts**.

### Composition and block order

The post footer is an ordered array of block names. The order in the array matches the order on the page; to remove a block, simply omit it.

```yaml
themeConfig:
  postFooter:
    - author        # Author name and card
    - donate        # Call to support the blog
    - comments      # Link to discussion on social media / forum
    - social-share  # Social share buttons
    - edit-link     # "Edit this page" link
    - categories    # Post categories
    - tags          # Post tags
    - similar       # Similar posts
```

| Key | Block | Display condition |
| --- | --- | --- |
| `author` | Author card | post specifies `authorId` |
| `donate` | Support call | `donate.url` is specified |
| `comments` | Discussion link | post specifies `commentLink` |
| `social-share` | Share buttons | at least one network is enabled |
| `edit-link` | Edit link | `repo` is specified |
| `categories` | Post categories | post has a category |
| `tags` | Post tags | post has tags |
| `similar` | Similar posts | posts sharing tags were found |

::: tip
The array is replaced completely across configuration levels, so in `_site.yaml` you must list the full array rather than appending to it. You can define a different list for a specific locale — for instance, placing social share buttons higher in a specific language.
:::

::: tip
Complete replacement of the footer — via the `post-footer` slot or named slots for individual blocks — is described in [Customization](customization#customizing-the-post-footer).
:::

### Similar posts

The `similar` block finds articles sharing tags — no need to configure it per post. The more matching tags, the higher the post ranks:

```yaml
# src/site.yaml
themeConfig:
  similarPostsCount: 5
```

### Social share buttons

The `social-share` block in the post footer displays sharing buttons for social networks. Each locale provides its own built-in defaults — for English this includes X, Facebook, LinkedIn, WhatsApp, Telegram, and Reddit. They work out of the box without configuration.

The list from `site.yaml` and `_site.yaml` **merges with the built-in list by the `name` key** rather than replacing it. This enables three techniques:

```yaml
# src/site.yaml
themeConfig:
  socialMediaShares:
    # 1. Customize appearance of a built-in button — name matches, fields override
    - name: telegram
      icon: 'logos:telegram'
      title: 'Telegram'

    # 2. Add a custom network — new name appends to the end
    - name: bluesky
      icon: 'simple-icons:bluesky'
      title: 'Bluesky'
      urlTemplate: 'https://bsky.app/intent/compose?text={title}%20{url}'

    # 3. Disable a built-in button
    - name: vk
      enabled: false
```

Button fields:

| Field | Description |
| --- | --- |
| `name` | Merge key — matches built-in record |
| `icon` | [Iconify](https://icon-sets.iconify.design/) icon name, e.g. `logos:telegram` |
| `title` | Tooltip |
| `urlTemplate` | Share link template with placeholders `{url}` and `{title}` (derived from current page) |
| `class` | Custom CSS class for the button |
| `enabled` | `false` hides the button without removing it from config |

::: warning
An empty array `socialMediaShares: []` does not disable sharing. To remove the block, omit `social-share` from `postFooter` — or set `enabled: false` on each button.
:::

## Right column (aside)

The right column contains the table of contents (TOC), and underneath it — anything you place there: an [ad block](ads) and custom blocks in the `aside` slot. The column appears only on wide screens (viewport width greater than 1550px).

By default, the right column is displayed on all pages except the home page and `layout: page`. You can customize this behavior:

```yaml
# src/site.yaml
themeConfig:
  # Overriding this list replaces the default array rather than augmenting it.
  # This example lists all available options, but the default list excludes page:
  asideLayouts: [post, util, tag, category, archive, author, page]
```

To enable or disable the right column for a specific page, add `aside: true` or `aside: false` to its frontmatter.

## Table of contents (TOC)

The table of contents is automatically generated from page headings.

```yaml
# src/site.yaml
themeConfig:
  toc:
    enabled: true
    minHeadings: 3
    position: auto
    collapsed: true
    level: [2, 3]
    label: 'Table of contents'
```

Options:

| Parameter | Default | Description |
| --- | --- | --- |
| `enabled` | `true` | Completely disable TOC |
| `minHeadings` | `3` | Minimum number of headings required to show TOC. Value `1` — always show |
| `position` | `auto` | TOC behavior across screen widths: `auto` — column on wide screens, collapsible block on narrow; `aside` — column only, hidden on narrow screens; `top` — collapsible block only at any screen width |
| `collapsed` | `true` | Initial state of collapsible block (collapsed). Built on native `<details>`, providing keyboard and screen-reader accessibility for free. Expanding on mobile creates a full screen of scrolling before the first paragraph |
| `level` | `[2, 3]` | Heading levels to include. Accepts same values as VitePress `outline`: number, `[min, max]` pair, or `'deep'` (h2–h6) |
| `label` | from translations | TOC heading text |

The table of contents is enabled by default only on posts. To enable it on a page with `layout: page`, add `toc: true` to its frontmatter:

```yaml
---
title: Comprehensive Reference Page
layout: page
toc: true # enable where disabled by default
---
```

::: tip
To disable TOC on an individual post, add `toc: false` to its frontmatter.
:::

---

Next: [Locales and multilingual support](locales)
