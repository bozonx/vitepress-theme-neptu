---
title: Post Navigation, Featured Posts, and Printing
description: Chronological previous/next links, curated featured collections, and the blog theme's print-friendly output.
date: 2026-08-01
authorId: ivan-k
tags: [guide, frontmatter]
featured: true
translations:
  ru: /ru/post/navigation-featured-print
---

# Post Navigation, Featured Posts, and Printing

## Previous and next post

Every post gets chronological navigation in its footer. **Previous post** means
the older publication and **Next post** means the newer one. The first and last
post therefore show only one link. Navigation never crosses a locale boundary.

The block is enabled by default. Reorder or remove it through `postFooter`:

```yaml
themeConfig:
  postFooter:
    - author
    - tags
    - navigation
    - similar
```

`navigation` and `similar` solve different problems: navigation follows the
publication timeline, while similar posts are selected by shared tags.

Custom labels can be set per locale in `_site.yaml`:

```yaml
themeConfig:
  t:
    previousPost: Earlier article
    nextPost: Later article
```

For a custom post layout, import `PostNavigation` from
`vitepress-theme-neptu/components` and pass it the locale's post data.

## Featured posts

Add `featured: true` to any post:

```yaml
---
title: The article readers should start with
date: 2026-08-01
featured: true
---
```

The flag does not reorder recent posts, archives, feeds, or similar-post lists.
It only makes the post available to an explicitly curated featured collection.
Place that collection wherever it belongs on the home page:

```md
<script setup>
import { HomeFeaturedPosts } from 'vitepress-theme-neptu/components'
</script>

<HomeFeaturedPosts :max-posts="3" />
```

Use the `header` prop to override the heading. Without it, the component uses
the locale's `t.featuredPosts` translation. Featured posts are ordered newest
first.

## Recent or popular posts as the home page

The default home page (`layout: home`) is a landing-style page with a hero,
optional parallax background, and configurable sections — but **no sidebar**.

If you prefer a standard blog listing (with sidebar, aside, and the usual
chrome), replace `layout: home` with `layout: util` in your `index.md` and
embed the same component used by the `recent/[page].md` template:

```md
---
layout: util
---

<script setup>
import { RecentList } from 'vitepress-theme-neptu/components'
</script>

<RecentList :curPage="1" />
```

For popular posts, swap `RecentList` for `PopularPostsList` (requires
`popularPosts.enabled` in `.vitepress/config.ts`).

### What's different from the listing template

- **No `paths.js` needed.** `index.md` is a single static page, not a dynamic
  `[page]` route, so `params.page` is undefined and defaults to `1`.
- **Remove `robots: noindex`.** The listing templates set `noindex` because
  paginated copies should not be indexed. Your home page *should* be indexed —
  drop the `head` block.
- **Pagination links.** `RecentList` and `PopularPostsList` derive the
  pagination base URL from the current route path. On the home page
  (`/en/`), links would point to `/en/1`, `/en/2` — which don't exist. The home
  page therefore works as a first-page view; for full pagination, link to
  `recent/1` or `popular/1` from your nav or sidebar.

## Printing

No configuration is required. The theme's print stylesheet removes the
sidebar, top navigation, site footer, interactive post-footer blocks, and
back-to-top controls. It also expands the article to the printable width,
wraps long code, avoids splitting major media blocks, and prints external link
destinations.

Add `data-print-ignore` to any custom element that should not appear on paper:

```html
<aside data-print-ignore>This is only useful on screen.</aside>
```
