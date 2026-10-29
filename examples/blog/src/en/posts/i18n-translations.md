---
title: Interface translations and language selection page
description: >
  Built-in translations, t key reference, root language selection page behavior,
  fallback, locale formatting, RTL, and accessing translations from code.
authorId: ivan-k
date: 2026-08-05
category: neptu-deep
tags: [i18n, config]
descriptionAsPreview: true
translations:
  ru: /ru/posts/i18n-translations
---

The basic locale model — routing, naming, and adding languages — is covered in [Locales and multilingual support](locales). Here we explore the internal architecture of interface translations, the language selector page, fallback logic, locale formatting, RTL, and programmatic translation access.

## Root site page

The root page `/` hosts the language selection page, which comes with several specific characteristics:

- Because this page resembles an additional home page (each locale already has its own home page), there may be an inclination to alter it, for example by adding a JavaScript auto-redirect based on visitor language. However, search engine guidelines advise against client-side JavaScript redirects; if your hosting platform supports it, a server-side redirect is far superior.
- Google recommends keeping this page indexable.
- Because `hreflang="x-default"` points to it, this page must remain accessible to web crawlers.
- It is best practice not to share links to the root page on social media, as it carries no meaningful content — instead, link directly to the locale home (e.g. `https://example.com/en/`) or directly to specific articles.

## Built-in translations

The theme ships with built-in translations in `src/configs/blogLocalesBase/<locale>.ts` (including `en`, `ru`, `es`, `zh`, `sr`, `pt`, `fr`, `de`, `tr`, `ja`, `ko`, `it`, `pl`, `lv`, `nl`, `sv`, `cs`, `hi`, `th`, `he`, `ar`).

Resolution rules for the built-in layer:

1. Exact key match with the current locale (e.g. `en-GB`, `es-419`, `zh-CN`).
2. Base language match — the prefix before `-` (e.g. `en` for `en-GB`).
3. Dedicated regional fallback (e.g. `es-*` → `es-419`, `zh-*` → `zh-CN`).
4. Built-in English fallback `en`.

Fallback is the automatic selection of the nearest built-in locale when an exact match does not exist. It applies **exclusively to interface strings**, not to content or URLs.

### What falls under fallback

Interface strings (both built-in and user-defined) are resolved via `resolveBaseLocaleKey` — the same four-step chain described above. If a user is on `/en-US/posts/hello` and the directory `src/en-US/` does not exist, the interface still receives translations from the `en` locale — the prefix before `-` matches.

This also applies to the 404 page: `NotFound.vue` determines the locale from the URL and displays copy in the nearest matching language rather than defaulting to generic English.

### What does not fall under fallback

Content and URLs never fall back. VitePress is a static site generator: pages are generated strictly for locale folders that physically exist in `src/`. If `src/en-US/` does not exist, requests to `/en-US/...` yield a 404 error. The theme intentionally avoids silent redirects for content: missing content is an error that should be resolved via hosting redirect rules or content translation, whereas an automated fallback redirect would mask actual issues and compromise indexing.

## How to override translation strings

To change interface copy, edit the level 3 config `_site.yaml` in your locale folder:

```yaml
# src/en/_site.yaml
themeConfig:
  # Top level of themeConfig contains standard VitePress translation strings
  langMenuLabel: 'Change language'
  # The `t` object contains all other translations of the Neptu blog theme
  t:
    search: 'Search blog'
    links:
      donate: 'Support'
```

### Standard VitePress strings, accessibility labels, and 404 page

`themeConfig` contains dedicated top-level fields for accessibility labels on UI controls and system page copy. They do not reside inside the `t` object because most belong to the core VitePress specification, but you can override them in your level 3 `_site.yaml`:

| Field | Purpose |
| --- | --- |
| `sidebarMenuLabel` | mobile sidebar toggle button tooltip |
| `langMenuLabel` | language selector aria-label and tooltip |
| `colorThemeMenuLabel` | color theme switcher aria-label and tooltip |
| `stylePresetMenuLabel` | style preset switcher aria-label and tooltip |
| `returnToTopLabel` | "Back to top" button label |
| `darkModeSwitchLabel` | visible dark mode switch button label (inherited from VitePress) |
| `lightModeSwitchTitle` | tooltip for switching to light mode |
| `darkModeSwitchTitle` | tooltip for switching to dark mode |
| `notFound.title` | 404 page title |
| `notFound.linkText` | "Go to home" link text on 404 page |

### `t` keys

You can explore all available `themeConfig.t` keys in the following source files:

- [blogLocalesBase/en.ts](https://github.com/bozonx/vitepress-theme-neptu/blob/main/packages/blog/src/configs/blogLocalesBase/en.ts) — Blog theme keys
- [sharedLocalesBase/en.ts](https://github.com/bozonx/vitepress-theme-neptu/blob/main/packages/blog/src/configs/sharedLocalesBase/en.ts) — Shared keys between blog and landing themes

## Accessing translations from code

In custom components, translations for the active locale are accessible via composables:

- **`useTranslations()`** — reactive `t` object for the active locale;
- **`useContentLangs()`** — current locale and list of all available locales.

```ts
import { useTranslations, useContentLangs } from 'vitepress-theme-neptu/composables'

const t = useTranslations()
const { localeIndex, locales } = useContentLangs()
```

For the complete composables reference, see [Components](components#composables).

## RTL languages (Arabic, Hebrew)

The built-in set includes RTL languages: Arabic (`ar`) and Hebrew (`he`) — with complete UI translations. Built-in `ar` and `he` configurations already specify `dir: 'rtl'`, enabling automatic layout flipping.

For custom RTL locales (outside the built-in list), specify `dir: rtl` in `_site.yaml` — the theme recognizes this field automatically.

## What's next

- [Locales and multilingual support](locales) — routing, locale naming, adding a language.
- [themeConfig settings](themeconfig-settings) — locale inheritance (`extends`), adding a new locale.
- [Linking translations and hreflang](i18n-hreflang) — `translations` and search engine tags.

---

Next: [Lists and pages](lists-and-pages)
