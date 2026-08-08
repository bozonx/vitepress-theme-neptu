---
title: Customization — color schemes, styles, fonts, hooks, slots and custom layouts
description: >
  Eight color schemes and six style presets, custom hue via CSS variables,
  light and dark themes, custom fonts, icons, print version, build transform
  hooks, layout slots and custom layouts.
authorId: ivan-k
date: 2026-08-04
category: advanced
tags: [theme, config, advanced]
descriptionAsPreview: true
translations:
  ru: /ru/posts/customization
---

The theme ships with **eight** ready-made color schemes. You pick one with a single line in YAML — no imports needed. The demo uses the **blue scheme** by default, but you can change it with the picker in the top bar.

<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:12px;margin:1.5rem 0;">
  <div style="text-align:center"><div style="height:56px;border-radius:10px;background:hsl(213,66%,46%)"></div><small>blue · hue 213</small></div>
  <div style="text-align:center"><div style="height:56px;border-radius:10px;background:hsl(115,70%,37%)"></div><small>green · hue 115</small></div>
  <div style="text-align:center"><div style="height:56px;border-radius:10px;background:hsl(270,66%,46%)"></div><small>purple · hue 270</small></div>
  <div style="text-align:center"><div style="height:56px;border-radius:10px;background:hsl(30,66%,46%)"></div><small>amber · hue 30</small></div>
  <div style="text-align:center"><div style="height:56px;border-radius:10px;background:hsl(180,66%,46%)"></div><small>teal · hue 180</small></div>
  <div style="text-align:center"><div style="height:56px;border-radius:10px;background:hsl(345,66%,46%)"></div><small>rose · hue 345</small></div>
  <div style="text-align:center"><div style="height:56px;border-radius:10px;background:hsl(320,66%,46%)"></div><small>magenta · hue 320</small></div>
  <div style="text-align:center"><div style="height:56px;border-radius:10px;background:hsl(0,0%,30%)"></div><small>monochrome</small></div>
</div>

## Choosing a scheme

The color scheme is set in `site.yaml` (or in `themeConfig` in `.vitepress/config.ts`):

```yaml
# site.yaml
themeConfig:
  defaultColorTheme: 'teal' # blue | green | purple | amber | teal | rose | magenta | monochrome
  defaultStylePreset: 'editorial' # soft | sharp | brutal | glass | editorial | mono
```

You don't need to import scheme CSS files: the base theme loads all presets itself, and the selected scheme is applied by an inline script in `<head>` — no page flicker.

## Theme pickers (`colorPicker`, `stylePicker`)

The theme has two runtime switchers — one per axis — and both are **off by default**: a blog usually ships with one selected look, and pickers are for demo sites like this one. They're enabled independently:

```ts
// .vitepress/config.ts
export default {
  themeConfig: {
    // Applied to first-time visitors; saved choice always takes precedence.
    defaultColorTheme: 'blue',
    defaultStylePreset: 'soft',

    colorPicker: true, // palette icon in the top bar
    stylePicker: true, // forms icon in the top bar
  },
}
```

The visitor's choice is written to `localStorage` and restored by an inline script in `<head>` before first paint — no flash of the wrong theme.

Setting `defaultColorTheme` / `defaultStylePreset` is sufficient on its own: you don't need a picker to change the site's look.

## Style presets (`data-style`)

Color is only one axis. The second, **form**, lives in a separate `data-style` attribute, and they combine freely: `blue` + `brutal` is a completely different blog than `blue` + `soft`, with the same posts and components.

| Preset | How it looks |
|--------|--------------|
| `soft` | Default. Rounded corners, soft shadows — the usual blog look |
| `sharp` | Straight angles, flat surfaces |
| `brutal` | Hard 2px borders, offset shadows, uppercase buttons |
| `glass` | Semi-transparent surfaces, blur, deep shadows |
| `editorial` | Serif headings, borderless cards, wide line height |
| `mono` | Monospace font everywhere, thin borders, no shadows |

Presets are **shared with the landing theme** — the same file `vitepress-theme-neptu/style-presets.css` dresses both packages, so a blog and a landing page on the same domain read as one site.

A preset never names a color. It reads bridge tokens that the theme defines under its palette (`--neptu-c-ink`, `--neptu-c-surface`, `--neptu-shadow-*`, …) — this is what allows one file to serve two color systems. To make your own, copy a built-in block and change the form tokens:

```css
[data-style='compact'] {
  --neptu-radius-md: 0.25rem;
  --neptu-card-shadow: none;
  --neptu-card-shadow-hover: none;
  --neptu-lift: 0px;
  /* … set the rest of the token set, see the comment at the top of the file */
}
```

Custom ids work as `defaultStylePreset` or as a `data-style` attribute you set yourself; the built-in picker shows only built-in presets.

## Custom hue

Each scheme is controlled by two CSS variables. To set a custom hue, override them in `.vitepress/theme/styles.css`:

```css
:root {
  --primary-hue: 115; /* accent color: buttons, links, active states */
  --layout-hue: 200;  /* neutral interface hue: borders, surfaces */
}
```

`--primary-hue` and `--layout-hue` are independent, so you can combine a bright accent color with a differently-tinted neutral interface.

## Light / dark appearance

Regardless of color scheme, the theme supports light and dark appearance out of the box — try the sun/moon toggle in the top bar. Each scheme contains descriptions for both variants, so no additional configuration is needed.

## Custom fonts

Your custom styles live in `.vitepress/theme/styles.css`. The file must start with two imports — the theme is styled with Tailwind v4:

```css
/* .vitepress/theme/styles.css */
@import 'tailwindcss';
@import 'vitepress-theme-neptu/tailwind-source.css';
```

By default the theme uses a safe web font stack (`Arial, 'Helvetica Neue', Helvetica, sans-serif` — fast loading, no layout shift). To use your own font, load it in `head` and override two CSS variables — nothing else is needed, the entire theme will apply them automatically:

```ts
// .vitepress/config.ts — load font
head: [
  ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
  ['link', { href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Fira+Code&display=swap', rel: 'stylesheet' }],
],
```

```css
/* .vitepress/theme/styles.css — apply */
:root {
  --font-body: 'Roboto', ui-sans-serif, system-ui, sans-serif;   /* text, headings, buttons */
  --vp-font-family-mono: 'Fira Code', ui-monospace, monospace;   /* code blocks, audio player */
}
```

If you need a font only for headings, don't change `--font-body` — override `h1…h6` in `styles.css`.

## Icons

Every `icon:` field accepts an [Iconify](https://icon-sets.iconify.design/) string of the form `prefix:name`, e.g. `fa6-solid:hand-holding-heart`. Default icons ("Donate", recent, popular, RSS, etc.) can be overridden globally in `src/site.yaml`:

```yaml
themeConfig:
  donateIcon: 'fa6-solid:hand-holding-heart'
  recentIcon: 'fa6-solid:bolt'
  featuredIcon: 'fa6-solid:bookmark'
  popularIcon: 'fa6-solid:star'
  byDateIcon: 'fa6-solid:calendar-days'
  authorsIcon: 'mdi:users'
  tagsIcon: 'fa6-solid:tag'
  categoriesIcon: 'fa6-solid:folder-open'  # no default — falls back to tagsIcon
  rssIcon: 'bi:rss-fill'
  atomIcon: 'vscode-icons:file-type-atom'
  youtubeIcon: 'fa6-brands:youtube'
```

`categoriesIcon` has no default: if the field is not set, `tagsIcon` is used. `youtubeIcon` is used in the post video link button.

## Home page background image

The home page background is not part of the color scheme — it's a separate YAML setting. That's how this demo is built:

```yaml
# src/site.yaml
themeConfig:
  home:
    background:
      type: parallax   # none | parallax
      image: 'https://images.unsplash.com/photo-...'
```

More about home page blocks — in [Home page](home-page).

## Customizing the home page

YAML settings from `themeConfig.home` are enough for most scenarios: hero, sections, background, appearance. When you need more control — the theme exposes all home page building blocks as separate components, and the `BlogHome` layout supports slots.

### `home` layout slots

The `layout: home` layout (the `BlogHome` component) provides slots for additional content:

| Slot | Location |
|------|----------|
| `home-before` | Before the content area (between header and hero/sections) |
| `home-after` | After the content area (before page close) |
| `nav-bar-content-before` | In the top bar, before its content (shared slot, exists in all layouts) |

To use them, wrap `BlogHome` in your own layout component:

```vue
<!-- .vitepress/theme/CustomHome.vue -->
<script setup>
import BlogHome from 'vitepress-theme-neptu/layouts/BlogHome.vue'
import { useScrollY } from 'vitepress-theme-neptu/composables'

const { scrollY } = useScrollY()
</script>

<template>
  <BlogHome :scroll-y="scrollY">
    <template #home-before>
      <MyBanner />
    </template>
    <template #home-after>
      <MyCTA />
    </template>
  </BlogHome>
</template>
```

Register the component globally in `.vitepress/theme/index.ts` and reference it in frontmatter:

```yaml
---
layout: CustomHome
---
```

### Building from individual components

If you need full control over the home page structure, build it from individual blocks. All are exported from `vitepress-theme-neptu/components`:

| Component | What it renders |
|-----------|-----------------|
| `HomeHero` | Hero block from `home.hero` |
| `HomeSections` | All sections from `home.sections` at once |
| `HomeFeaturedPosts` | Featured posts section |
| `HomeLatestPosts` | Latest posts section |
| `HomePopularPosts` | Popular posts section |
| `HomeTags` | Tag cloud |
| `HomeCategories` | Category list |

Example of a custom home layout:

```vue
<!-- .vitepress/theme/CustomHome.vue -->
<script setup lang="ts">
import { useData } from 'vitepress'
import {
  HomeHero,
  HomeFeaturedPosts,
  HomeLatestPosts,
  HomeTags,
} from 'vitepress-theme-neptu/components'

const { theme } = useData()
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Your own header or navigation -->
    <header class="w-full sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur">
      <nav class="max-w-3xl mx-auto px-4 sm:px-7 py-3">
        <a href="/">My Blog</a>
      </nav>
    </header>
    <main class="max-w-3xl mx-auto px-4 sm:px-7 w-full py-12">
      <HomeHero v-if="theme.home?.hero" v-bind="theme.home.hero" />
      <div class="vp-doc"><Content /></div>
      <HomeFeaturedPosts :max-posts="3" />
      <HomeLatestPosts :limit="10" />
      <HomeTags :header="theme.t.tags" :limit="20" />
    </main>
  </div>
</template>
```

Components read configuration from `themeConfig` via `useThemeConfig()`, so YAML settings (`home.hero`, `home.sections`, `perPage`, etc.) continue to work — you don't need to pass props manually if they're already set in config. Props like `:max-posts` or `:limit` let you override values for a specific layout.

### Fully custom layout

If neither `BlogHome` nor individual components suit you, create a layout from scratch and connect it via `layout` in frontmatter. The theme imposes no restrictions on the content of `index.md` — any globally registered Vue component will work.

Full reference of exported components — on the [Components](components) page, "Home page blocks" section.

## Printing

Nothing to configure: when printing a page, the theme automatically hides the sidebar, top bar, site footer, interactive blocks below the article, and scroll-to-top buttons. The article takes the full page width, long code lines wrap, large media blocks don't break across pages, and external links print their URLs.

To remove a custom element from the print version, add the `data-print-ignore` attribute:

```html
<aside data-print-ignore>This block is only needed on screen.</aside>
```

## Right column and table of contents

The right column of the post layout is the third column to the right of the text. It contains the article table of contents, and below it — whatever you put there: ad blocks, newsletter forms, promos. Visibility and behavior settings are in [themeConfig settings](themeconfig-settings#table-of-contents-and-right-column). Here — CSS variables and slots for customization.

### CSS variables

Column geometry and styling are controlled by CSS variables:

| Variable | Default | Purpose |
| --- | --- | --- |
| `--aside-width` | `300px` | Column width |
| `--aside-top` | `100px` | Top offset for sticky content |
| `--aside-gap` | `1.5rem` | Gap between article and column |
| `--aside-padding-x` | `1rem` | Internal horizontal padding |
| `--aside-breakpoint` | `1550px` | Reference: show threshold |
| `--toc-indent` | `0.85rem` | Indent per nesting level |
| `--toc-link-active-color` | link color | Active TOC item |
| `--toc-box-border` | gray | Collapsible block border |
| `--ad-block-margin` | `2.5rem` | Margins around in-content ad block |
| `--ad-label-color` | gray | "Advertisement" label color |

```css
/* .vitepress/theme/styles.css */
:root {
  --aside-width: 336px;
  --aside-top: 120px;
}
```

`--aside-breakpoint` is an informational variable: CSS media queries can't read custom properties, so the threshold itself is hardcoded in components. If you need a different breakpoint, override the media queries for `.aside-container` and `.toc-collapsible--auto` in your CSS.

Classes for fine styling: `.aside-container`, `.aside-content`, `.toc-aside`, `.toc-collapsible`, `.toc-link`, `.neptu-ad`.

### `aside` slot

If you need to put something custom in the column — a newsletter form, promo block — there's an `aside` slot. Its content is rendered as-is, without a frame or "Advertisement" label:

```vue
<template>
  <Layout>
    <template #aside>
      <NewsletterCard />
    </template>
  </Layout>
</template>
```

The slot and TOC coexist: the TOC stays at the top, your block goes below. Column visibility on specific layouts is still controlled via `themeConfig.asideLayouts` and the `aside` frontmatter field.

## Styling the language selection page

The root page `/` (for multilingual sites) is built from the `LocaleSelector` component. Its behavior is described in [Interface translations](i18n-translations#behavior-on-first-visit). Here — CSS structure and variables for customization.

The component uses the following classes:

| Class | Element |
| --- | --- |
| `.locale-selector-wrapper` | Outer container of the entire page |
| `.locale-selector` | Main area with background gradients |
| `.locale-selector__panel` | Card with title and links |
| `.locale-selector__title` | Site title (`<h1>`) |
| `.locale-selector__links` | Navigation with locale links (`<nav>`) |
| `.locale-selector__link` | Link to one locale (`<a>`) |
| `.locale-selector__link--detected` | Modifier: browser-detected language |
| `.locale-selector__label` | Block with language name and code inside the link |
| `.locale-selector__arrow` | Arrow on the right side of the link |

Visual values are exposed as CSS variables on `.locale-selector-wrapper`. You can override them in your CSS — no `!important` or fighting scoped styles:

```css
.locale-selector-wrapper {
  --locale-selector-bg: #f8f4ff;
  --locale-selector-panel-bg: rgba(255, 255, 255, 0.9);
  --locale-selector-panel-border: 1px solid #e8e0f0;
  --locale-selector-panel-radius: 1.5rem;
  --locale-selector-title-color: #6b21a8;
  --locale-selector-link-bg: #faf5ff;
  --locale-selector-link-border: #e9d5ff;
  --locale-selector-link-hover-bg: #f3e8ff;
  --locale-selector-link-hover-border: #a855f7;
  --locale-selector-arrow-color: #a855f7;
}
```

Full list of variables with defaults — in the `LocaleSelector.vue` source. Dark theme is overridden via `.dark .locale-selector-wrapper { ... }`.

## Custom transform hooks

When YAML settings aren't enough, the theme provides standard VitePress hooks in the configuration you pass to `defineBlogConfig`. Your hooks execute **after** the built-in transformers, so you extend rather than replace them:

```ts
// .vitepress/config.ts
export default async () => defineBlogConfig({
  siteUrl: 'https://myblog.org',

  async transformPageData(pageData, ctx) {
    // Built-in transformers have already run (image dimensions, title,
    // meta tags, description). Add or modify fields here.
    pageData.frontmatter.customField = 'value'
  },

  async transformHead(ctx) {
    return [['meta', { name: 'custom', content: 'value' }]]
  },

  async buildEnd(siteConfig) {
    // Runs after the theme generates RSS / robots.txt.
  },
})
```

Execution order for `transformPageData`:

1. Built-in: `collectImageDimensions` → `transformTitle` → `transformPageMeta` → `resolveDescription`
2. Your hook

Need to run **before** the built-in transformers? Use [`extends`](https://vitepress.dev/reference/site-config#extends) in VitePress — hooks from that configuration fire first.

## Custom post layout

Every building block of a post is exported from `vitepress-theme-neptu/components`, so you can assemble your own post layout while keeping the theme's overall interface:

```vue
<script setup lang="ts">
import {
  PostDate, PostAuthor, PostImage, PostTags,
  PostSocialShare, PostSimilarList, PostFooter,
} from 'vitepress-theme-neptu/components'
</script>

<template>
  <article>
    <PostDate />
    <PostAuthor />
    <PostImage />
    <div class="vp-doc"><Content /></div>
    <PostTags />
    <PostSocialShare />
    <PostSimilarList />
    <PostFooter />
  </article>
</template>
```

Then register the component in `.vitepress/theme/index.ts` as global and use it in frontmatter:

```yaml
---
layout: post
contentLayout: CustomPost
---
```

The difference between the two fields:

- **`contentLayout`** replaces only the central column. Sidebar, top bar, table of contents and right column remain from the theme — this is what you want in most cases.
- **`layout`** with your component name replaces the entire page, including the wrapper.

If your changes are small, don't replace the layout at all — use slots (below).

Full list of exported post parts (`PostDate`, `PostAuthor`, `PostImage`, `PostTags`, `PostSocialShare`, `PostSimilarList`, `PostFooter`, `PostTopBar`, `PostVideoLink`, `PostDonateLink`, `PostComments`, `PostCategories` and others) — in the [Components reference](components).

## Post layout slots

If you need to add only small UI fragments to the standard post layout, use slots instead of replacing the component entirely:

```vue
<!-- .vitepress/theme/Layout.vue -->
<script setup>
import Theme from 'vitepress-theme-neptu'
const { Layout } = Theme
</script>

<template>
  <Layout>
    <template #post-header-before>
      <BreadcrumbNav />
    </template>

    <template #post-content-after>
      <NewsletterSignup />
    </template>
  </Layout>
</template>
```

Available slots within the standard post layout (`PageContent.vue`):

| Slot | Location |
|------|----------|
| `post-header-before` | Before `<header>` (title, date, topbar) |
| `post-header-after` | After `<header>` |
| `post-content-before` | Before markdown `<Content />` |
| `post-content-after` | After markdown `<Content />` |
| `post-footer` | Replaces the entire `<PostFooter />` block |

These slots exist only on posts. Pages with `layout: page` and utility pages (`util`, `tag`, `archive`, `author`) render only `<Content />`, so `post-*` slots don't apply there.

### General layout slots

Besides post content, slots exist for the page wrapper — sidebar, header, right column and footer. They're passed to the same `<Layout>`:

| Slot | Location |
|------|----------|
| `aside` | Right column (ads, promo) — from 1550px |
| `sidebar-top` | Top of left sidebar, above navigation |
| `sidebar-middle` | Middle of left sidebar |
| `sidebar-bottom` | Bottom of left sidebar, below links |
| `sub-sidebar` | Additional sidebar section |
| `nav-bar-content-before` | In the top bar, before its content |
| `footer` | Replaces the site footer entirely |

The right column is configured separately — which pages show it, how to connect ads and how to change dimensions is described in [themeConfig settings](themeconfig-settings#table-of-contents-and-right-column).

## Customizing the site footer

The site footer is set via `themeConfig.footer`:

```ts
// .vitepress/config.ts
export default async () => defineBlogConfig({
  themeConfig: {
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright 2026',
      links: [{ text: 'GitHub', href: 'https://github.com/...' }],
    },
  },
})
```

To completely replace the footer, use the `footer` slot in your `Layout.vue`:

```vue
<template>
  <Layout>
    <template #footer>
      <MySiteFooter />
    </template>
  </Layout>
</template>
```

When the `footer` slot is provided, the theme's built-in footer and its spacing are not rendered. To remove the footer entirely — don't set `themeConfig.footer` and don't provide a `footer` slot.

## Customizing the post footer

The composition and order of footer blocks are set by the `themeConfig.postFooter` array — covered in [themeConfig settings](themeconfig-settings#post-footer). Here — what to do when rearranging blocks isn't enough.

### Replacing the entire footer

Use the `post-footer` slot in your `Layout.vue`:

```vue
<template>
  <Layout>
    <template #post-footer>
      <MyCustomFooter />
    </template>
  </Layout>
</template>
```

### Overriding individual blocks

`PostFooter` provides a named slot for each block key: `author`, `donate`, `comments`, `social-share`, `edit-link`, `categories`, `tags`, `similar`. Pass your own content to override one block without touching the others.

These slots live **inside** `PostFooter` and aren't proxied through the layout chain, so they can't be used directly from `Layout.vue`. To reach them, build a custom `contentLayout` and render `PostFooter` manually:

```vue
<!-- .vitepress/theme/CustomPostContent.vue -->
<script setup>
import { PostFooter } from 'vitepress-theme-neptu/components'
</script>

<template>
  <article>
    <div class="vp-doc"><Content /></div>
    <PostFooter>
      <template #donate>
        <MyCustomDonate />
      </template>
    </PostFooter>
  </article>
</template>
```

Then register the component globally and reference it in frontmatter:

```yaml
---
layout: post
contentLayout: CustomPostContent
---
```

This way the sidebar, top bar, table of contents and right column remain from the theme — you replace only the central column and within it finely override one footer block.

## Build warnings

`defineBlogConfig` prints warnings to the console for common configuration mistakes:

- Missing `siteUrl` — SEO features may generate broken URLs.
- Empty `locales` — the theme requires at least one locale.

These warnings appear only when running the build / dev server.

## Custom ad block and custom placement

To place a block at a specific location, write the component manually in markdown — automatic blocks are placed independently of manual ones:

```md
First part of the article.

<NeptuAd />

Continuation.
```

## What's next

- [Components reference](components) — what you can import from the theme.
- [External content](external-content) — content from CMS or API.
- [Ad blocks](ads) — your component in theme slots.
