---
title: Interface translations and language selection page
description: >
  Built-in translations, fallback mechanisms, overriding translation strings,
  and accessing translations from code.
authorId: ivan-k
date: 2026-07-20
category: i18n
tags: [i18n, translations, ui]
descriptionAsPreview: true
translations:
  ru: /ru/posts/i18n-translations
---

The theme ships with built-in UI translations. You can use them as-is, override individual strings, or add entirely new translations.

## Built-in translations

The theme includes translations for all UI elements — buttons, labels, section headers, accessibility text — in multiple languages. The available translations are determined by the locales you have configured.

## Fallback mechanism

If a translation key is not found in the current locale, the theme falls back to:

1. The locale specified in `extends` (if set)
2. English (`en`) — the default source language
3. The raw key name (last resort)

This means you only need to translate strings that differ from the fallback.

## Overriding translation strings

Override individual strings in `_site.yaml` via the `t` key:

```yaml
# src/en/_site.yaml
themeConfig:
  t:
    links:
      aboutBlog: 'About'
      links: 'Useful links'
    searchUI:
      placeholder: 'Search articles...'
    toBlog: 'Read the blog'
```

Only specify the keys you want to override — the rest fall back to built-in translations.

## Translation key reference

Common keys you might want to override:

| Key | Default (en) | Description |
| --- | --- | --- |
| `t.toBlog` | 'To the blog' | Hero action button |
| `t.links.aboutBlog` | 'About blog' | Footer link |
| `t.links.links` | 'Links' | Sidebar section header |
| `t.tags` | 'Tags' | Tags section header |
| `t.searchUI.placeholder` | 'Search' | Search input placeholder |

## Language selection page behavior

For multilingual sites, the root URL `/` shows a language selection page. The theme:

1. Detects the visitor's browser language
2. Highlights the matching locale (if available)
3. Lists all available locales with their display names

The page is built from the `LocaleSelector` component. You can style it via CSS — see [Customization](customization#styling-the-language-selection-page).

## Accessing translations from code

```ts
import { useTranslations } from 'vitepress-theme-neptu/composables'

const t = useTranslations()
console.log(t.value.links.aboutBlog)  // 'About'
```

## Accessibility labels

The theme includes ARIA labels and screen reader text in its translations. These are in the `t.a11y` namespace and can be overridden the same way as other strings.

## RTL support

The theme supports RTL (right-to-left) languages. Set `dir: 'rtl'` in `_site.yaml`:

```yaml
# src/ar/_site.yaml
lang: 'ar'
dir: 'rtl'
```

The theme automatically flips the layout direction for RTL locales.

## What's next

- [Locales and multilingual support](locales) — locale structure and routing
- [Linking translations and hreflang](i18n-hreflang) — SEO for multilingual sites
