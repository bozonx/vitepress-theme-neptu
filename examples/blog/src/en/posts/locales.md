---
title: Locales and multilingual support
description: The theme's locale model — routing, locale naming, adding a language, and language switching.
authorId: ivan-k
date: 2026-07-14
category: i18n
tags: [i18n, config]
descriptionAsPreview: true
translations:
  ru: /ru/posts/locales
---

The theme was designed from the ground up to be multilingual. Both short and hyphenated locales are supported: `en`, `ru`, `en-US`, `en-GB`, `pt-BR`, `zh-CN`.

## How locales work in the Neptu blog theme

The theme uses a unified concept of locale governing both content and interface. It is determined by the URL and the content directory:

```text
src/
  en/
  ru/
  en-US/
```

The theme always uses routing prefixed with the locale. Even a single-language site stores its content in a locale folder, such as `src/en/`.

> This is a strict contract of Neptu, not a requirement to provide translations. A single-language site contains one locale directory and is completely valid. A flat structure with posts and pages directly in `src/` is not supported.

When a visitor is on `/en/posts/hello`, the content tree, page language metadata, alternative links, and all interface strings come from the `en` locale. Internal links always resolve relative to the current locale.

### Locale is determined from the URL

The current locale is extracted from the route.

Examples:

- `/en/posts/hello` → `en` locale
- `/en-GB/posts/hello` → `en-GB` locale
- `/ru/pages/about` → `ru` locale

The URL is the source of truth.

### Language switching

The switcher in the top bar navigates the reader to the matching page in another locale's tree. Identifying the translated page is done via `translations` in the frontmatter, or if unspecified, the system attempts to find a page in other locales with the same full path. See [Linking translations and hreflang](i18n-hreflang) for details.

::: tip
Auto-resolving matching pages can be disabled — the switcher will then always navigate to the home page of the target locale:

```ts
// .vitepress/config.ts
themeConfig: { i18nRouting: false }
```
:::

## How to add a language

Two steps to a new locale:

1. **Copy the locale folder.** `src/en/` → `src/de/`. Alongside content, copy the utility list folders (`recent/`, `archive/`, `tags/`, `categories/`, `featured/`, `authors/`, `popular/`) and the files `getAllPosts.ts` and `loadPosts.data.ts` — they are locale-agnostic and require no changes.
2. **Set `lang`, `title`, and `description`** in its `_site.yaml` — see [How to name a locale](#how-to-name-a-locale) for guidance. For languages not in the built-in set, also add `label`.

Locale data is picked up automatically: the theme registers a Vite plugin that scans `src/` at build time, discovers each folder containing `_site.yaml` (or `_site.ts`) and `loadPosts.data.ts`, and generates the virtual module `virtual:neptu-posts-data` with static imports of all data loaders. `Layout.vue` imports this module once — no edits needed when adding a language.

Interface translations are picked up automatically if the language is in the built-in set; otherwise, specify the required `t` keys (see [Interface translations and language selection page](i18n-translations)).

## How to name a locale

A locale has three names, all derived from a single source — the [BCP 47](https://www.rfc-editor.org/info/bcp47) language tag:

| Where | What to write | Example |
| --- | --- | --- |
| Folder name in `src/` | locale tag, which also acts as URL prefix | `pt-BR` |
| `lang` in `_site.yaml` | the same tag — injected into `<html lang>`, `hreflang`, date formatting | `pt-BR` |
| `label` in `_site.yaml` | full language name for the switcher and language selector page | `Português` |

The tag itself consists of a language code, optionally combined with a region or script subtag: `language` (`ru`), `language-REGION` (`pt-BR`), `language-Script` (`zh-Hans`).

Write tags in canonical casing: language in lowercase, script titlecased, region in uppercase (`zh-Hant-TW`). Add a region only when it genuinely distinguishes content: for a single variant of a language, `ru` or `en` is sufficient.

For `label`, it is customary to use the endonym / autonym of the language (`Deutsch`, not `German`): the language selector page is viewed by visitors who haven't selected their interface language yet. For built-in languages (see [Built-in translations](i18n-translations#built-in-translations)), the name is already defined in the theme, and `label` can be omitted. For a custom variant or a language outside the list, specify it explicitly:

```yaml
# src/pt-BR/_site.yaml
lang: pt-BR
label: Português
```

::: tip
The JS engine itself can suggest the autonym:

```sh
node -e "console.log(new Intl.DisplayNames(['pt-BR'], { type: 'language' }).of('pt-BR'))"
# português (Brasil)
```

You should polish the result manually: `Intl` returns lowercase text with the region in parentheses, while in a switcher the concise title-cased `Português` is usually preferred.
:::

## Language codes and tag references

- **Find and validate tags** — W3C [BCP 47 Language Subtag Lookup](https://r12a.github.io/app-subtags/): searches by language and region name in the official [IANA Language Subtag Registry](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry).
- **Language codes** — [ISO 639 code list](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes) on Wikipedia; check the column with the native name / autonym — that is what you need for `label`.
- **Region codes** — [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) (two-letter, uppercase).

## What's next

- [Interface translations and language selection page](i18n-translations) — built-in translations, `t` key reference, styling the language selector page, locale inheritance.
- [Linking translations and hreflang](i18n-hreflang) — `translations` and search engine tags.

---

Next: [Linking translations and hreflang](i18n-hreflang)
