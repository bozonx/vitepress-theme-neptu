---
title: Locales and multilingual support
description: >
  The theme's i18n model: how locales are structured, routed from URLs,
  how to add new languages, and the language switcher.
authorId: ivan-k
date: 2026-07-19
category: i18n
tags: [i18n, locales, routing]
descriptionAsPreview: true
translations:
  ru: /ru/posts/locales
---

The theme's multilingual model is folder-based: each locale lives in its own directory under `src/`. This applies even for single-language sites.

## How locales work

```text
src/
├─ ru/          → /ru/...
├─ en/          → /en/...
├─ pt-BR/       → /pt-BR/...
└─ index.md     → / (language selection page)
```

The folder name is the locale code. It appears in the URL prefix: `src/en/posts/hello.md` → `/en/posts/hello`.

## BCP 47 tags

Locale folder names should follow BCP 47 language tags:

| Folder | Tag | Language |
| --- | --- | --- |
| `en` | en | English |
| `ru` | ru | Russian |
| `pt-BR` | pt-BR | Brazilian Portuguese |
| `zh-CN` | zh-CN | Simplified Chinese |

The `lang` field in `_site.yaml` should match:

```yaml
# src/pt-BR/_site.yaml
lang: 'pt-BR'
```

## How to name a locale

- Use the two-letter language code for generic languages: `en`, `ru`, `de`, `fr`
- Use the full BCP 47 tag for regional variants: `pt-BR`, `zh-CN`, `en-GB`
- The folder name, `lang` field and `label` field should all be consistent

## Language switcher

The language switcher in the top bar shows all available locales. For posts, it links to the translated version of the same article (if linked via `translations` frontmatter or matched by path). For generated list pages (categories, tags, archive), it links to the equivalent page in the other locale.

See [Linking translations and hreflang](i18n-hreflang) for how translations are linked.

## Root page

For multilingual sites, the root URL `/` shows a language selection page built from the `LocaleSelector` component. This page lists all available locales with links to each one's home page.

For single-language sites, the root URL redirects to the single locale's home page.

:::info
The VitePress `root` locale is not supported by the theme. Content must always be in a locale folder.
:::

## Adding a new language

1. Create a folder: `src/<locale>/`
2. Add `_site.yaml`:

```yaml
lang: 'de-DE'
title: 'Mein Blog'
description: 'Ein Blog über Dinge'

themeConfig:
  home:
    hero:
      title: 'Mein Blog'
      description: 'Ein Blog über Dinge'
```

3. Add `index.md`:

```md
---
layout: home
---
```

4. Add `_authors.yaml` and `_categories.yaml` (can copy from another locale and translate)
5. Add posts in `src/<locale>/posts/`

The theme auto-detects locales from the folder structure.

## `lang` and `label` in `_site.yaml`

| Field | Description |
| --- | --- |
| `lang` | BCP 47 tag — used in `<html lang="...">` and hreflang |
| `label` | Display name in the language switcher (e.g., "Português") |

```yaml
# src/pt-BR/_site.yaml
lang: 'pt-BR'
label: 'Português (BR)'
```

If `label` is not set, the theme derives a display name from the `lang` tag.

## What's next

- [Linking translations and hreflang](i18n-hreflang) — `translations` field and SEO
- [Interface translations](i18n-translations) — built-in translations and overrides
