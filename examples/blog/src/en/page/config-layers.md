---
title: Configuration layers
description: 'Three clear configuration layers: developer wiring, shared administration, and per-locale administration.'
layout: page
---

# Configuration layers

There are **three editable layers**. Built-in theme and language defaults are an implementation detail beneath them. Later layers override earlier values.

```text
1. .vitepress/config.ts        developer: code, build and integrations
   → 2. src/site.yaml          admin: safe settings shared by every locale
     → 3. src/<locale>/_site.yaml  admin: one locale's identity and overrides
```

## Pick the file by responsibility

| Responsibility | File |
| --- | --- |
| Vite/VitePress options, `srcDir`, `base`, `siteUrl`, `repo`, environment variables, plugins, hooks, search assets, GA4 credentials | `.vitepress/config.ts` |
| Static theme settings shared by all languages: branding, navigation defaults, sidebar, feeds, SEO switches, icons, publisher | `src/site.yaml` |
| One language's `lang`, title, description, translations, labels, navigation text and any intentional theme override | `src/<locale>/_site.yaml` |
| Author profiles for one locale | `src/<locale>/_authors.yaml` |

The YAML levels are deliberately **not** full VitePress configurations. They never accept build hooks, plugins, `base`, `srcDir`, or `siteUrl`. This keeps secrets and build behaviour in code and makes YAML safe for content administrators.

## Level 1 — `.vitepress/config.ts`

This is the only developer-owned file. It is a normal `BlogUserConfig` / VitePress config, so the complete standard VitePress option reference remains the [VitePress site-config reference](https://vitepress.dev/reference/site-config). The theme-specific options that belong here are integration options:

| Field | Purpose |
| --- | --- |
| `srcDir` | Content root; required for automatic locale discovery. |
| `base` | Public subpath, such as `/blog/`. |
| `siteUrl` | Absolute public URL; required for sitemap, feeds, canonical, Open Graph and JSON-LD. |
| `themeConfig.repo` | Source repository; supplies edit-link URLs and repository links. |
| `head` | External assets and metadata. |
| `vite`, `markdown`, `sitemap` | Native VitePress/Vite build configuration. |
| `transformPageData`, `transformHead`, `buildEnd` | Custom lifecycle hooks, executed after theme hooks. |
| `themeConfig.search` | Pagefind search; `enabled: false` to disable. |
| `themeConfig.popularPosts.enabled` / `.dataSource` | GA4 integration; keep credentials and env-derived values here. |

```ts
export default async () => defineBlogConfig({
  srcDir: path.resolve(__dirname, '../'),
  base: process.env.VITEPRESS_BASE || '/',
  siteUrl: process.env.SITE_URL || 'https://example.com',
  themeConfig: {
    repo: 'https://github.com/acme/my-blog',
    search: { enabled: true },
    popularPosts: { enabled: Boolean(process.env.GA_PROPERTY_ID), dataSource: { provider: 'ga4' } },
  },
})
```

## Level 2 — `src/site.yaml`

This file has one effective root key, `themeConfig`. It is the complete, self-documented reference for safe settings shared by every locale. Use it for the default value; do not duplicate a value in each locale.

`themeConfig` groups are: general (`blogTitle`, switches, `defaultColorTheme`, `defaultStylePreset`), listing (`postList`, `postFooter`), icons, sidebar, `nav`, `donate`, `editLink`, `footer`, `publisher`, `authors`, `socialMediaShares`, `feeds`, `seo`, `popularPosts.sortBy`, landing-only fields and `t` translations. Every field is commented in the starter's [`src/site.yaml`](https://github.com/bozonx/vitepress-theme-neptu/tree/main/packages/blog/template/src/site.yaml).

Set `repo` in `.vitepress/config.ts`. It automatically supplies
the `editLink.pattern` for GitHub, GitLab, Bitbucket, Gitea, Forgejo and
Codeberg, using the `main` branch and `src/` directory. Usually a locale only
needs `editLink.text`; set `editLink.pattern` yourself only when its branch or
source path differs from those defaults.

**Exception — `perPage`:** Unlike every other `themeConfig` field, `perPage` **cannot** be set in `site.yaml` or `_site.yaml`. It is a build-time parameter that path generators (`*.paths.js`) import at build time to compute pagination routes. Setting it in YAML would desynchronise the generated routes from the runtime value. Configure `perPage` only in `.vitepress/config.ts` (e.g. `export const PER_PAGE = 10` and `themeConfig: { perPage: PER_PAGE }`). The schema rejects `perPage` in YAML and emits a build-time warning.

Arrays replace an earlier array as a whole. Objects deep-merge. `authors` is the exception: entries merge by their stable `id`.

### Translation keys (`themeConfig.t`)

The theme ships with built-in UI translations for 21 locales (`en`, `ru`, `es`, `zh`, `sr`, `pt`, `fr`, `de`, `tr`, `ja`, `ko`, `it`, `pl`, `lv`, `nl`, `sv`, `cs`, `hi`, `th`, `he`, `ar`). Override only the keys you need — the rest is inherited from the built-in locale defaults. All `t` overrides can be placed at any layer: `config.ts`, `site.yaml` (shared), or `_site.yaml` (per-locale).

**Top-level string keys:**

| Key | Default (en) |
| --- | --- |
| `popularPosts` | Popular Posts |
| `similarPosts` | Similar Posts |
| `shareSocialMedia` | Share on Social Media |
| `currentLang` | Current language |
| `tagBadgeCount` | The number of posts on this tag |
| `tagPageHeader` | All Posts by Tag |
| `tags` | Tags |
| `allTags` | All Tags |
| `paginationToStart` | First Page |
| `paginationToEnd` | Last Page |
| `toHome` | Go to the home page |
| `toBlog` | Go to blog |
| `author` | Author |
| `year` | Year |
| `showMorePosts` | Load More |
| `listenPodcast` | Listen to podcast |
| `commentLink` | Discuss this post |
| `allTagsCall` | View All Tags |
| `popularPostsCall` | View All Popular Posts |
| `viewInAnotherLanguage` | View in another language |
| `postVideoButton` | Watch Video |
| `allPostsOfAuthor` | Posts of the author |
| `closeMenu` | Close menu |
| `allPostsOfYear` | All posts of the year |
| `pageNotFound` | 404 not found |
| `postsCount` | Publications |
| `editLink` | Found an error? Suggest an edit |
| `search` | Search |
| `searchInBlog` | Search in this blog |

**`postsCountForms`** — array of plural forms. English: `['Publication', 'Publications']` (2 forms). Russian: `['статья', 'статьи', 'статей']` (3 forms).

**`months`** — array of 12 month names, January through December.

**`links`** — navigation/sidebar labels:

| Key | Default (en) |
| --- | --- |
| `links.aboutBlog` | About This Blog |
| `links.donate` | Donate |
| `links.recent` | Recent |
| `links.popular` | Popular |
| `links.byDate` | By Date |
| `links.links` | Links |
| `links.authors` | Authors |
| `links.aboutUs` | About Us |
| `links.rssFeed` | RSS feed |
| `links.atomFeed` | Atom feed |

**`podcasts`** — podcast platform labels: `site`, `rss`, `castbox`, `soundstream`, `spotify`, `youtube`, `amazonmusic`, `iheartradio`, `tunein`, `vk`, `yandexmusic`, `deezer`, `pocketcasts`, `applepodcasts`, `overcast`, `zvuk`, `podcastaddiction`.

**`audioFile`** — audio player labels: `downloadFile`, `playAudio`, `pauseAudio`, `startAudioPlayback`, `pauseAudioPlayback`, `resumeAudioPlayback`, `stopAudio`, `stopAudioPlayback`, `hidePlayer`, `hidePlayerTitle`, `audioFile`, `downloadAudioFile`, `currentTime`, `audioProgress`, `volumeControl`, `volumePercent`, `retryWithValidUrl`, `retry`, `invalidUrlProvided`, `invalidAudioUrlProvided`, `errorDownloadingFile`, `errorPlayingAudioFile`, `audioPlaybackAborted`, `networkErrorLoadingAudio`, `audioDecodingError`, `audioFormatNotSupported`, `unknownAudioError`, `errorLoadingAudioFile`.

**`fileDownload`** — file download labels: `fileDownload`, `downloadFile`, `downloadFileWithName`, `fileType`, `fileSize`, `downloadStarted`, `downloadError`, `invalidUrlProvided`, `retryDownload`, `retry`.

**`videoFile`** — video player labels: `downloadFile`, `videoFile`, `downloadVideoFile`, `retry`, `videoPlaybackAborted`, `networkErrorLoadingVideo`, `videoDecodingError`, `videoFormatNotSupported`, `unknownVideoError`, `errorLoadingVideoFile`.

**`lightbox`** — image lightbox labels: `prev`, `next`, `close`, `resetZoom`, `dialogTitle`, `loadingIndicatorLabel`.

The full default values for each locale are in `src/configs/blogLocalesBase/<locale>.ts` and `src/configs/sharedLocalesBase/<locale>.ts`. The starter's [`src/site.yaml`](https://github.com/bozonx/vitepress-theme-neptu/tree/main/packages/blog/template/src/site.yaml) has every key commented as a reference.

## Level 3 — `src/<locale>/_site.yaml`

Use this for one locale only. Its root fields are exactly:

| Root field | Purpose |
| --- | --- |
| `lang` | IETF language tag, e.g. `en-US`. |
| `title` | Locale site title. |
| `titleTemplate` | Page-title template; use `:title`. |
| `description` | Locale SEO/feed description. |
| `extends` | Parent **locale directory name**, e.g. `en`; never a file path. |
| `themeConfig` | Any safe theme setting from Level 2, as a locale override. |

```yaml
# src/en-GB/_site.yaml
extends: en
lang: en-GB
title: Example blog
description: Notes for UK readers.
themeConfig:
  blogTitle: Example blog
  langMenuLabel: Change language
  nav:
    links:
      - text: About
        href: page/about
```

Prefer Level 2 for a shared value. An override in this file is intentional: language, copy, a locale-specific URL, or a genuine regional UI difference.

### Fine-grained `themeConfig` overrides

Objects deep-merge across layers, so you can override individual sub-keys without re-declaring the entire block. Only specify what differs for this locale — the rest is inherited from Level 2.

```yaml
# src/en/_site.yaml — override only the sub-keys that differ
themeConfig:
  # Hide preview text on post cards, keep all other postList defaults from site.yaml
  postList:
    showPreview: false

  # Reorder post-footer blocks for this locale only
  postFooter:
    - author
    - tags
    - social-share
```

This works for any nested `themeConfig` key: `sidebar`, `nav`, `footer`, `donate`, `editLink`, `socialMediaShares`, `seo`, `feeds`, etc. See the starter's [`src/site.yaml`](https://github.com/bozonx/vitepress-theme-neptu/tree/main/packages/blog/template/src/site.yaml) for the full parameter reference — do not duplicate parameters that are already defined there.

## Authors — `_authors.yaml`

`_authors.yaml` is an array of profiles. Required: `id`; supported optional fields: `name`, `description`, `image`, `imageWidth`, `imageHeight`, `twitterHandle`, and `links[]` (`type`, `url`, `title`). It has its own self-documenting example and schema. It merges with inline `themeConfig.authors` by `id`; the dedicated file wins for a conflicting field.

## YAML templates and validation

Only YAML supports templates. Substitutions use the form `${variable.path}`, where `path` is **any dot-path** within the corresponding object — e.g. `${theme.blogTitle}`, `${config.siteUrl}`, `${t.links.aboutBlog}`.

| Variable | Contents | Example |
| --- | --- | --- |
| `${theme.*}` | merged `themeConfig` (built-in defaults + `config.ts` + `site.yaml`) | `${theme.blogTitle}` |
| `${site.*}` | resolved locale site object (`title`, `description`, `lang`, etc.) | `${site.title}` |
| `${t.*}` | translation object (`theme.t`) — built-in or overridden keys | `${t.editLink}` |
| `${config.*}` | the full `BlogUserConfig` from `config.ts` | `${config.siteUrl}` |
| `${localeIndex}` | current locale directory name (e.g. `en`, `ru`) | `${localeIndex}` |

Substitution runs in **two passes**:

1. **During YAML parsing** — context is `{ config, theme, t, localeIndex }`. The `site` variable is not available at this stage. Unresolved placeholders are left in place.
2. **After merging all layers** — context is extended with `site`, and remaining placeholders (including `${site.*}`) are resolved from the final merged config.

> Thus `${theme.*}`, `${config.*}`, `${t.*}` and `${localeIndex}` resolve in the first pass, while `${site.*}` resolves in the second. Circular references are safe: the iterative pass is bounded to 8 steps; unresolved templates remain in the text.

YAML files link to `site.schema.json` / `authors.schema.json` for editor completion and validation. The schemas describe all public Neptu fields; unknown keys remain warnings-compatible for future VitePress extensions. TypeScript variants (`site.ts`, `_site.ts`, `_authors.ts`) take precedence over YAML and use `defineSiteConfig`, `defineLocaleConfig`, and `defineAuthorsList` respectively.

## Custom fields in `themeConfig`

You can add **any own fields** to `themeConfig` — they pass through the entire merge pipeline and are accessible at runtime via `useUiTheme()`. Objects deep-merge across layers; arrays replace.

```yaml
# src/site.yaml
themeConfig:
  myCustomField: "hello"
  myCustomConfig:
    featureEnabled: true
    apiUrl: "https://api.example.com"
```

Access in a Vue component:

```vue
<script setup lang="ts">
import { useUiTheme } from 'vitepress-theme-neptu/composables'

const { theme } = useUiTheme()
console.log(theme.value.myCustomField)   // "hello"
console.log(theme.value.myCustomConfig)  // { featureEnabled: true, apiUrl: "..." }
</script>
```

Custom fields can be set at any layer: `config.ts`, `site.yaml`, or `_site.yaml`. Values merge by priority — lowest to highest.
