---
title: Components, composables and utilities reference
description: >
  What the theme exports: global components for markdown, list and post blocks
  for custom layouts, composables and utility functions.
authorId: ivan-k
date: 2026-07-08
category: neptu-deep
tags: [advanced, components]
descriptionAsPreview: true
translations:
  ru: /ru/posts/components
---

This is a reference page: a listing of everything the theme exports. For practical usage, see [Customization](customization).

## Four import points

```ts
import { RecentPostsList } from 'vitepress-theme-neptu/components'
import { useThemeConfig } from 'vitepress-theme-neptu/composables'
import { isPost } from 'vitepress-theme-neptu/utils'
import { makeTagsList } from 'vitepress-theme-neptu/list-helpers'
```

## Global components

Five components are registered globally — you can use them in any `.md` file without `<script setup>` or import:

| Component | Purpose |
| --- | --- |
| `YouTubeVideo` | Responsive YouTube embed |
| `VideoFile` | Local video player |
| `AudioFile` | Audio player with download link |
| `FileDownload` | File download button |
| `NeptuAd` | Ad block at any position in an article |

Live examples of the first four and their props — in [Covers, images and media](covers-images-media#media-components); `NeptuAd` is described in [Ad blocks](ads).

## Lists and pages

Components used to build the theme's utility pages. Needed if you're making your own list page or customizing the home page:

| Component | What it renders |
| --- | --- |
| `RecentPostsList` | Recent posts with pagination |
| `PopularPostsList` | Popular posts (requires `popularPosts.enabled`) |
| `FeaturedPostsList` | Posts with `featured: true` |
| `TagPostsList` | Posts of a single tag |
| `CategoryPostsList` | Posts of a single category |
| `MonthPostsList` | Posts of a single month |
| `AllTagsList` | Cloud of all tags |
| `AllCategoriesList` | List of all categories |
| `NeptuAuthors` | List of authors |
| `AuthorDetails` | Card for a single author |
| `NeptuYears` | Archive by years |
| `MonthsOfYear` | Months within a year |
| `UtilPageContent` | Content of a utility page |
| `UtilPageHeader` | Header of a utility page |
| `UtilSubPageHeader` | Subheader of a utility page |

All lists accept `curPage` and render their own pagination; the template pages in `recent/`, `tags/` and `archive/` show how to wire them up.

## Home page blocks

| Component | What it renders |
| --- | --- |
| `HomeHero` | Hero block from `home.hero` |
| `HomeSections` | All sections from `home.sections` at once |
| `HomeFeaturedPosts` | Featured posts section |
| `HomeLatestPosts` | Latest posts section |
| `HomePopularPosts` | Popular posts section |
| `HomeTags` | Tag cloud |
| `HomeCategories` | Category list |

The normal home page is configured via YAML — see [Lists, pages and the home page](lists-and-pages). These components are needed only if you're building the home page manually.

## Post parts

These make up the standard article layout; use them to build your own:

| Component | Purpose |
| --- | --- |
| `PostDate` | Publication date |
| `PostReadingTime` | Reading time estimate |
| `PostDraftBadge` | "Draft" badge |
| `PostImage` | Cover with caption and dimensions |
| `PostTopBar` | Top actions: video button and podcasts |
| `PostVideoLink` | External video button |
| `PodcastDropdown`, `PodcastIcon` | Podcast dropdown list |
| `PostAuthor` | Author card |
| `PostCategories` | Post categories |
| `PostTags` | Post tags |
| `PostSimilarList` | Similar posts by tags |
| `PostSocialShare` | "Share" buttons |
| `PostComments` | Discussion link |
| `PostDonateLink` | "Support the blog" call-to-action |
| `PostFooter` | The entire post footer |

## Navigation and appearance

| Component | Purpose |
| --- | --- |
| `NeptuBreadcrumbs` | Breadcrumbs ([example](categories-and-tags#breadcrumbs)) |
| `PagefindSearch` | Search modal |
| `NavSearchButton` | Search trigger button |
| `SwitchLang`, `LocaleSelector` | Locale switching |
| `SwitchAppearance` | Light/dark theme toggle |
| `ColorThemePicker` | Color scheme picker |
| `StylePresetPicker` | Style preset picker |
| `TocAside`, `TocCollapsible`, `TocLinks` | Article table of contents |

## Composables

```ts
import { useThemeConfig, useBreakpoint } from 'vitepress-theme-neptu/composables'
```

| Composable | Description |
| --- | --- |
| `useThemeConfig()` | Typed access to the merged `themeConfig` |
| `useTranslations()` | `t` strings for the current locale |
| `useContentLangs()` | Current locale and list of available ones |
| `useBreakpoint()` | Reactive mobile / tablet / desktop checks |
| `useScrollY()` | Reactive `window.scrollY` |
| `useScrollToTopButton()` | Logic for the "scroll to top" button |
| `useToc()` | Page headings for a custom TOC |
| `useLightbox()` | Image lightbox control |
| `useSwipeDrawer()` | Swipe gestures for mobile sidebar |
| `useOnClickOutside()` | Click outside an element |
| `useColorTheme()` | Read and change color scheme |
| `useStylePreset()` | Read and change style preset |
| `useConsent()` | Cookie consent — see [Cookie consent](consent) |
| `useDownloadFile()` | Download logic for custom buttons |

## Utilities

```ts
import { isPost, resolvePreviewText } from 'vitepress-theme-neptu/utils'
```

| Utility | Description |
| --- | --- |
| `isPost(frontmatter)` | `true` for posts (`layout: post` or no layout) |
| `isPage(frontmatter)` | `true` for `layout: page` |
| `isUtilPage(frontmatter)` | `true` for `util`, `tag`, `category`, `archive`, `author` |
| `isHomePage(frontmatter)` | `true` for `layout: home` |
| `resolvePreviewText(frontmatter)` | Preview text by theme rules |
| `resolvePagefindBodyAttribute(theme, frontmatter)` | Body marker for Pagefind |
| `isPopularPostsRoute(path)` | Popular posts list route |
| `isAuthorPath(filePath)` | Author page path |

Filesystem functions are separate: `vitepress-theme-neptu/utils/node` is available only in config and build scripts, `…/utils/client` — only in the browser.

## List helpers

`vitepress-theme-neptu/list-helpers` — what the template pages use.

### List functions

| Function | What it does |
| --- | --- |
| `makeTagsList(allPosts)` | All tags with post counts |
| `makeCategoriesList(allPosts)` | All categories with post counts |
| `makePostsOfTagList(allPosts, slug)` | Posts of the specified tag |
| `makePostsOfCategoryList(allPosts, slug)` | Posts of the specified category |
| `makeTaxonomyList(allPosts, kind)` | Generic form for tags / categories |
| `makePostsOfTaxonomyList(allPosts, kind, slug)` | Generic taxonomy filtering |
| `makeYearsList(allPosts)` | Years with post counts |
| `makeMonthsList(allPosts, year)` | Months of a year with post counts |
| `makePostsOfMonthList(allPosts, year, month)` | Posts of a specific month |
| `makeAuthorsList(allPosts, allAuthors)` | Authors with post counts |
| `safeGetYear(date)` | Safe year extraction |
| `safeGetMonth(date)` | Safe month extraction (1-based) |

### Route params functions

| Function | What it does |
| --- | --- |
| `makeAllPostsParams(posts, perPage)` | Params for paginating all posts |
| `makeFeaturedPostsParams(posts, perPage)` | Params for featured posts |
| `makeYearPostsParams(posts, perPage)` | Params for posts by year |
| `makeYearMonthParams(posts)` | Params for year + month |
| `makeTagsParams(posts, perPage, lang?)` | Params for tag pages |
| `makeCategoriesParams(posts, perPage, lang?)` | Params for category pages |
| `makeTaxonomyParams(posts, kind, perPage, lang?)` | Generic taxonomy params |
| `makeAuthorsParams(posts, perPage)` | Params for author pages |

The `…/list-helpers/node` branch contains `loadPostsDataFromFiles` for custom data loaders — see [External content](external-content).

## Types

The theme's main entry point exports TypeScript types for typing your own components, configs and data loaders:

```ts
import type {
  Author,
  BlogUserConfig,
  DeepPartial,
  ExtendedPageData,
  ExtendedSiteConfig,
  I18nTranslations,
  LocaleDefinition,
  Post,
  PostFrontmatter,
  PostLite,
  SeoConfig,
  Tag,
  ThemeConfig,
} from 'vitepress-theme-neptu'
```

| Type | Description |
| --- | --- |
| `Author` | Blog author description |
| `BlogUserConfig` | User blog configuration |
| `DeepPartial<T>` | Recursive `Partial` for nested objects |
| `ExtendedPageData` | Extended VitePress page data |
| `ExtendedSiteConfig` | Extended site configuration |
| `I18nTranslations` | Translation strings for the current locale |
| `LocaleDefinition` | Description of a single locale |
| `Post` | Full post model |
| `PostFrontmatter` | Typed post frontmatter |
| `PostLite` | Lightweight post model for lists |
| `SeoConfig` | SEO configuration |
| `Tag` | Tag description |
| `ThemeConfig` | Full theme configuration |
