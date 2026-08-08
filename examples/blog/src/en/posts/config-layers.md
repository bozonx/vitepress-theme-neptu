---
title: Configuration layers, first-level config and string templates
description: >
  The three-level configuration hierarchy: config.ts, site.yaml, and _site.yaml —
  the role of each file and string templating within YAML configs.
authorId: ivan-k
date: 2026-07-17
category: configuration
tags: [config, advanced]
descriptionAsPreview: true
translations:
  ru: /ru/posts/config-layers
---

The theme uses a three-level configuration system. Each level has a different purpose and is edited by different people.

## The three levels

| Level | File | Who edits | What goes here |
| --- | --- | --- | --- |
| 1 | `.vitepress/config.ts` | Developer | System settings: `siteUrl`, `base`, search, head, VitePress config |
| 2 | `src/site.yaml` | Administrator | Global settings for all locales: theme, nav, sidebar, footer, SEO |
| 3 | `src/<locale>/_site.yaml` | Administrator | Locale-specific settings: translations, localized nav, overrides |

Levels are deep-merged: level 3 overrides level 2, which overrides level 1's `themeConfig`.

## Level 1: `.vitepress/config.ts`

This is the VitePress config file. It's TypeScript, so it's for developers. Here you set:

```ts
// .vitepress/config.ts
import { defineBlogConfig } from 'vitepress-theme-neptu'

export default async () => defineBlogConfig({
  siteUrl: 'https://myblog.org',
  // base: '/my-blog/',  // only if not at domain root

  themeConfig: {
    search: { enabled: true },
    // ...other settings
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],
})
```

### What belongs here

- `siteUrl` — absolute site address (required for SEO)
- `base` — path prefix (only for subdirectory hosting)
- `search` — Pagefind search configuration
- `head` — arbitrary `<head>` tags
- Environment variables and secrets
- Vite/Rollup build options
- Markdown plugin configuration (Mermaid, KaTeX)

## Level 2: `src/site.yaml`

Global settings shared by all locales. Edited as YAML — no TypeScript needed.

```yaml
# src/site.yaml
themeConfig:
  defaultColorTheme: 'blue'
  defaultStylePreset: 'soft'

  nav:
    links:
      - text: 'Home'
        href: '/'
  sidebar:
    links:
      - text: 'Recent'
        href: 'recent/1'
  footer:
    message: 'Built with Neptu'
    copyright: '© 2026'
```

### What belongs here

- Theme appearance (color scheme, style preset)
- Navigation, sidebar, footer structure
- SEO global settings
- Home page configuration
- Author registry (global)
- Ad placement configuration
- Analytics configuration

## Level 3: `src/<locale>/_site.yaml`

Locale-specific settings. Deep-merged over level 2, so you only specify what differs:

```yaml
# src/en/_site.yaml
lang: 'en-US'
title: 'My Blog'
description: 'A blog about things'

themeConfig:
  home:
    hero:
      title: 'My Blog'
      description: 'A blog about things'
  nav:
    links:
      - text: 'Contents'
        href: 'pages/contents'
```

### What belongs here

- `lang` — BCP 47 language tag
- `title` and `description` — localized site title and description
- Localized navigation text
- Localized hero text
- Translation overrides (`t` keys)
- Per-locale overrides (e.g., different background image)

## String templating

YAML config values support string templates — references to other config values:

### `${t.*}` — translation strings

```yaml
themeConfig:
  sidebar:
    bottomLinks:
      - { header: '${t.links.links}' }
```

Resolves to the current locale's translation for `links.links`.

### `${theme.*}` — theme config values

```yaml
themeConfig:
  sidebar:
    bottomLinks:
      - text: 'YouTube'
        href: 'https://youtube.com/'
        icon: '${theme.youtubeIcon}'
```

Resolves to the `youtubeIcon` value from the merged theme config.

## Custom fields

You can add custom fields to `themeConfig` at any level. They're available in templates and via `useThemeConfig()`:

```yaml
# src/site.yaml
themeConfig:
  myCustomField: 'value'
```

```ts
// In a Vue component
const { theme } = useData()
console.log(theme.value.myCustomField) // 'value'
```

## What's next

- [themeConfig settings](themeconfig-settings) — full settings reference for levels 2 and 3
- [Customization](customization) — hooks, slots and custom layouts
