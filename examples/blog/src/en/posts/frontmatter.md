---
title: All frontmatter fields
description: >
  All frontmatter capabilities: cover, author, tags, preview, video button,
  podcast dropdown, and discussion link — all included at once.
layout: post
authorId: ivan-k
translations:
  ru: /ru/posts/frontmatter
date: 2026-07-29
category: writing
categories:
  - writing
tags: [frontmatter]
descriptionAsPreview: true
featured: true
readingTime: true
aside: true
toc: true
ads: false
searchIncluded: true
canonical: https://example.com/canonical-url
seo:
  og: true
  jsonLd: true
  hreflang: true
  canonical: true
  rss: true
  maxDescriptionLength: 160
# draft: true
# contentLayout: MyCustomContent
# jsonLd: '{"@context":"https://schema.org","@type":"BlogPosting"}'
---

Using the frontmatter section of a Markdown document, you can configure each post with high precision. Frontmatter is a block at the beginning of a Markdown file demarcated by two lines of three dashes `---`, containing post metadata in YAML format. The block itself is not rendered on the page, but its data directly influences post presentation, SEO, and other aspects.

The set of available fields depends on the `layout` value. Posts have the largest set of fields — we start with them, followed by sections on regular pages (`layout: page`) and the home page (`layout: home`), where only a subset of fields is applicable.

## Full post frontmatter example

```yaml
---
### Core ###

# Publication date. String or Date. Used for sorting posts,
# article:published_time in OG and datePublished in JSON-LD.
# Can be specified as a date in `YYYY-MM-DD` format,
# or with time in ISO 8601 format `YYYY-MM-DDTHH:mm:ss`,
# e.g. `2026-07-29T12:00:00Z`, where `Z` denotes UTC.
# Specifying time makes sense if you publish multiple posts in a single day,
# to preserve their exact ordering in post lists.
# date is the only required parameter for posts.
date: 2026-07-29

# Optional page title override. By default it is extracted from the first top-level heading.
title: All frontmatter fields

# Injected into the page's meta description
description: >
  All frontmatter capabilities: cover, author, tags, preview, video button,
  podcast dropdown, and discussion link — all included at once.

# layout for posts can be omitted, as 'post' is the default.
#layout: post

# Author ID from themeConfig.authors. If ID is not found, the author card is not rendered.
# It is important to specify the author ID accurately without typos so author
# post lists and metadata build properly.
authorId: ivan-k

### Categories and tags ###

# Value is the `id` of an entry from src/<locale>/_categories.yaml; title and path
# are derived from there. During build, this field is merged with categories and removed.
# In most cases, using this field with a single category per post is recommended.
category: writing
# Category list — same IDs. Specifying more than one category is recommended
# only in rare cases, because breadcrumbs are built exclusively from the first category.
categories:
  - writing
# Tag list for building the tag cloud.
# Specify a list of strings from which slugs will be auto-generated,
# or objects { name, slug } for manual slug definition.
# Strings and objects can be mixed in the same list.
tags:
  - frontmatter
  - { name: 'Markdown', slug: 'markdown' }

### Cover and images ###

# Post cover image URL.
# Can be an external URL (https://...), a path from the public folder (/img/...),
# or a relative path (./cover.jpg) if images are stored alongside the post.
cover: https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200
# Cover width in pixels for <img> width and og:image:width.
# Recommended for external URLs to avoid layout shift (CLS).
coverWidth: 1200
# Cover height in pixels for <img> height and og:image:height.
coverHeight: 800
# Accessible alt text for cover (<img> and og:image:alt).
coverAlt: Open laptop and notebook on a wooden table
# Caption under the cover. Rendered as markdown — supports links and formatting.
coverDescription: "Photo by [Author](https://unsplash.com) on Unsplash."

### Post lists and previews ###

# Explicit card text in post lists (Recent, Tags, Authors...).
# Overrides auto-excerpt from text and the descriptionAsPreview field.
#previewText: Short text for the card in lists.
# Use description as preview text in post lists.
# Ignored if previewText is set.
descriptionAsPreview: true
# Add post to editorial featured selection.
# Featured posts appear on the featured/ page, in the sidebar, and on the home page.
featured: false

### Video, podcasts, discussion ###

# "Watch video" button at the top of the post. External URL (YouTube, Vimeo, etc.).
videoLink: https://www.youtube.com/watch?v=dQw4w9WgXcQ
# Video language — short label next to the button (e.g.: RU, EN).
videoLinkLang: EN
# Podcast language — short label next to the button.
podcastLang: EN
# List of platforms where the episode is published.
# A dropdown menu listing the podcasts will appear at the top of the post.
podcasts:
  - applepodcasts: https://podcasts.apple.com/
  - spotify: https://open.spotify.com/
  - youtubemusic: https://music.youtube.com/
  # ... and others, see details on the "Drafts, reading time, video button and podcasts" page
# Discussion URL (GitHub Discussions, Disqus, Telegram, etc.) — button in the post footer.
commentLink: https://github.com/.../discussions

### Page elements ###

# Enable/disable reading time badge for this page.
# Default: follows themeConfig.readingTime.layouts.
readingTime: true
# Show/hide right sidebar column for this page.
# Default: follows themeConfig.asideLayouts.
aside: true
# Show/hide table of contents for this page.
# Minimum heading threshold (themeConfig.toc.minHeadings) still applies.
# Default: enabled on posts, disabled on other layouts.
toc: true
# Enable/disable ad slots for this page.
# Overrides themeConfig.ads.layouts. Also affects in-content slots,
# which are inserted by the markdown plugin at build time.
# Default: follows themeConfig.ads.layouts.
ads: false

### Publishing and search ###

# Draft. The page is built (URL works for preview),
# but excluded from lists, RSS, sitemap, search and marked noindex.
# In vitepress dev drafts are visible by default, in production — hidden.
# Default: false.
#draft: true
# Include the page in the search index (Pagefind).
# Default: true for posts and pages, false for layout: util.
# draft: true forcibly sets this to false.
searchIncluded: true
# Hide the "edit this page" link on this post.
# Only works on layout: post and layout: page and only if
# themeConfig.editLink is configured at all.
# Default: the link is shown.
editLink: false

### SEO ###

# Translation map: locale code → relative path.
# Used by the language switcher in the header AND hreflang tags for SEO.
# If not specified — the switcher tries to find a translation by the same filename and full path.
translations:
  ru: /ru/posts/frontmatter
# Canonical URL. Accepts a full URL or 'self' to force a
# self-canonical where seo.canonical is disabled.
# If not specified and seo.canonical !== false — a self-canonical is generated.
canonical: https://example.com/canonical-url
# Per-feature SEO control. Each key disables the corresponding feature
# when set to false. Everything is enabled by default.
# Overrides global themeConfig.seo.
seo:
  og: true                   # Open Graph + Twitter Card meta tags.
  jsonLd: true               # JSON-LD structured data.
  hreflang: true             # hreflang link tags (only if >1 locale).
  canonical: true            # generates self-canonical when the canonical field is not set.
  rss: true                  # RSS/Atom/JSON feed link tags on the home page.
  maxDescriptionLength: 300  # character limit for auto-extracted description. Default: 300
# Custom JSON-LD.
# If a YAML object is provided, it is deep-merged with the auto-generated schema
# (nested objects merged recursively). If a JSON string is provided, it is used as-is (full replacement).
jsonLd:
  "@type": TechArticle
  proficiencyLevel: Beginner
# Standard VitePress field for arbitrary tags in <head>.
# If you place noindex here, JSON-LD and canonical will not be added to the page.
head:
  - [meta, { name: robots, content: noindex }]

### Other ###

# Component name for replacing the central content area.
# Unlike layout — replaces only Content, not the entire layout.
# If not specified — falls back to frontmatter.layout.
# The component must be globally registered.
contentLayout: MyCustomContent
---
```

## Regular pages (`layout: page`)

`layout: page` is a simple page without post chrome: the theme renders only your markdown content, the left sidebar, and the footer. The first-level heading is written directly in the page text — `title` from frontmatter is not rendered in the page body, but only used in browser `<title>` and SEO tags.

A typical page looks like this:

```yaml
---
# Required field — without it the page renders as a post.
# Available options: post, home, page, util, tag, category, archive, author.
# Also: false — bare content without sidebar, header, or footer.
# Passing a globally registered component name completely replaces the layout.
layout: page
# Injected into <title> and SEO meta. Not shown in page body —
# write the heading in markdown yourself
title: About the blog
# Injected into meta description
description: Who I am, what this blog is about, and how to reach me.
# Translation map: locale code → relative path
translations:
  ru: /ru/about
---
```

Besides these four, the following also work on `layout: page`:

- `aside` — right column. On pages it is **disabled** by default (`page` is absent from `themeConfig.asideLayouts`), enabled via `aside: true`.
- `toc` — table of contents. Disabled by default; on pages TOC lives only in the right column, so `toc: true` alone is not enough — `aside: true` is also required.
- `ads` — ad slots, including in-content. Disabled by default.
- `draft` — draft: URL works, but the page is excluded from sitemap, search, and marked `noindex`.
- `searchIncluded` — inclusion in Pagefind index. Default: `true`.
- `canonical`, `seo`, `head` — canonical URL, granular toggling of SEO features, and arbitrary tags in `<head>`.
- `jsonLd` — custom JSON-LD, as an object (deep-merge) or string (full replacement).
- `editLink` — `false` removes the "edit page" link.
- `contentLayout` — overrides central content area with a custom component.

All other fields from the post example are **ignored** on `layout: page`: `date`, `authorId`, `cover` and other `cover*` fields, `category`, `categories`, `tags`, `featured`, `previewText`, `descriptionAsPreview`, `readingTime`, `videoLink`, `videoLinkLang`, `podcasts`, `podcastLang`, `commentLink`. Regular pages do not appear in feeds or post lists, so taxonomies, previews, and covers are not needed.

## Home page (`layout: home`)

**The home page is not configured through frontmatter.** Its entire presentation — hero block, sections, width, color scheme, and background — is declared in the configuration, while `src/<locale>/index.md` contains only layout:

```yaml
---
layout: home
---
```

Appearance is configured in `site.yaml`, localized strings in the locale's `_site.yaml` (detailed in [Home page](home-page)).

Of the common frontmatter fields, only `title`, `description`, `translations`, `canonical`, `seo` and `draft` are meaningful on the home page. All other fields are ignored.

---

Next: [Categories and tags](categories-and-tags)
