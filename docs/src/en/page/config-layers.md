---
title: Configuration Layers
description: The theme merges settings from four layers. This page explains what each layer is for and which one to edit.
layout: page
---

# Configuration Layers

Theme settings are resolved by merging **four layers** in priority order. Later
layers win over earlier ones:

```
built-in theme defaults
  → .vitepress/config.ts        (developer-owned, needs code)
    → src/site.yaml             (admin-editable, cross-locale)
      → src/<locale>/_site.yaml (admin-editable, per-locale)
```

## Which layer do I edit?

| I want to change… | Edit this file |
| --- | --- |
| `siteUrl`, env-driven values, Vite plugins, search provider, popular-posts (GA4) | `.vitepress/config.ts` |
| Presentation shared by all locales (footer, publisher, icons, SEO toggles) | `src/site.yaml` |
| Localized identity & overrides (`lang`, `blogTitle`, nav labels, translations) | `src/<locale>/_site.yaml` |

**Rule of thumb:** if it needs JavaScript or a secret, it goes in `config.ts`.
If a non-developer might want to change it, put it in YAML.

## Layer 1 — `.vitepress/config.ts`

Code-only wiring. This is where `defineBlogConfig` runs and auto-discovers
locale folders (any `src/<locale>/` that has a `_site.yaml`).

```ts
// .vitepress/config.ts (excerpt)
export default async () => {
  const config: BlogUserConfig = {
    srcDir: path.resolve(__dirname, '../'),
    siteUrl: 'https://myblog.org', // absolute, no trailing slash — used for
                                   // canonical, sitemap, RSS, OG, hreflang
    themeConfig: {
      repo: 'https://github.com/your-org/your-blog',
      perPage: 10,
      search: { provider: 'pagefind', options: { bodyMarker: 'data-pagefind-body' } },
      popularPosts, // env-driven (GA4), must stay in code
    },
  }
  return defineBlogConfig(config)
}
```

## Layer 2 — `src/site.yaml` (cross-locale)

Everything under `themeConfig:` that is the **same for every locale** but a
content editor may want to change without touching code:

```yaml
themeConfig:
  publisher:
    logo: 'https://myblog.org/logo.png'
  editLink:
    pattern: 'https://github.com/your-org/your-blog/edit/main/src/:path'
  sidebar:
    popular: true
    recent: true
    archive: true
    authors: true
    tags: true
```

## Layer 3 — `src/<locale>/_site.yaml` (per-locale)

Localized identity and any overrides that differ for this language. Top-level
keys are `lang`, `title`, `titleTemplate`, `description`; everything else nests
under `themeConfig:`.

```yaml
lang: 'en-US'
description: 'Example Blog Description'
themeConfig:
  blogTitle: 'Neptu Blog Theme'
  footer:
    copyright: 'Copyright © 2026 Your Name.'
```

## String templates in YAML

Inside any `_site.yaml` you can interpolate dynamic values (resolved before the
YAML is parsed):

| Template | Resolves to |
| --- | --- |
| `${theme.<key>}` | any merged `themeConfig` value, e.g. `${theme.repo}` |
| `${t.<key>}` | a translation string, e.g. `${t.links.donate}` |
| `${config.siteUrl}` | the site URL from `config.ts` |
| `${localeIndex}` | current locale folder name, e.g. `en` |

```yaml
publisher:
  name: '${theme.blogTitle}'
  url: '${config.siteUrl}'
nav:
  socialLinks:
    - icon: 'fa6-brands:github'
      link: '${theme.repo}'
```

See `docs/CONFIG_LAYERS.md` in the repo for the full reference.
