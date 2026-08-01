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
