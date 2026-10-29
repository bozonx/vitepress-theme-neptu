---
title: Drafts, reading time, video button and podcasts
description: >
  How to hide unfinished posts, display reading time estimates, add a video
  button, and include a podcast dropdown in an article.
authorId: ivan-k
date: 2026-08-04
category: writing
tags: [frontmatter, config]
descriptionAsPreview: true
videoLink: https://www.youtube.com/watch?v=dQw4w9WgXcQ
videoLinkLang: EN
podcastLang: EN
podcasts:
  - applepodcasts: https://podcasts.apple.com/
  - spotify: https://open.spotify.com/
  - youtube: https://www.youtube.com/watch?v=dQw4w9WgXcQ
  - youtubemusic: https://music.youtube.com/
  - amazonmusic: https://music.amazon.com/
  - castbox: https://castbox.fm/
  - deezer: https://www.deezer.com/
  - iheartradio: https://www.iheart.com/
  - tunein: https://tunein.com/
  - pocketcasts: https://pca.st/
  - overcast: https://overcast.fm/
  - podcastaddict: https://podcastaddict.com/
  - podcastindex: https://podcastindex.org/
  - rss: https://example.com/rss
  - site: https://example.com/episode
translations:
  ru: /ru/posts/drafts-video-podcasts
---

## Drafts

Add `draft: true` to the post frontmatter — and it will disappear from all public surfaces of the blog, such as:

- All post lists — recent, popular, archive, tags, authors, similar
- RSS / Atom / JSON feeds
- sitemap.xml
- Search (Pagefind)
- JSON-LD, hreflang, canonical, and other SEO components
- The draft becomes unavailable to search bots, adding `<meta name="robots" content="noindex, nofollow">` to `<head>`

```yaml
---
title: Post that is not ready yet
date: 2026-08-01T10:00:00Z
authorId: ivan-k
draft: true
---
```

> The draft page is still included in the production build and remains accessible via a direct link — this is the only way to open it, for instance to share a link with colleagues to discuss an article before publication.

> If you need a file to be completely excluded from the build, exclude it using VitePress via `srcExclude`:
>  ```ts
>  // .vitepress/config.ts
>  export default async () => defineBlogConfig({
>    srcExclude: ['**/*.draft.md'],
>  })
>  ```

### Drafts are visible in the dev server

By default, drafts are **visible** in `vitepress dev` and **hidden** in `vitepress build`. This allows the author to see work-in-progress posts in general lists while writing, without accidentally publishing them.

The mode is determined by `NODE_ENV`. You can override it explicitly:

```yaml
# src/site.yaml
themeConfig:
  drafts:
    showDrafts: false  # hide even in dev
```

`showDrafts: true` will return drafts to all lists and feeds — including the production build. Use this only for internal preview environments.

## Post reading time and word count

Both values are calculated during the build from the raw markdown source. Code blocks, inline code, and raw HTML are excluded from the count — long configuration listings are usually skimmed rather than read word for word.

For CJK scripts where words are not space-delimited, characters are counted individually and converted to "words" using a factor of 2.

The estimate is never zero: any non-empty text is at least "1 min".

The article's reading time is displayed under the post title and in the post list on the right under the title in a `<time datetime="PT1M">` tag formatted according to ISO 8601. The word count is emitted in the post's JSON-LD, for example:

```json
{
  "@type": "BlogPosting",
  "wordCount": 218,
  "timeRequired": "PT1M"
}
```

### Configuration

```yaml
# src/site.yaml
themeConfig:
  readingTime:
    enabled: true           # default: true
    wordsPerMinute: 200     # default: 200
    layouts: [post]         # which layouts show the reading time
  postList:
    showReadingTime: true   # show reading time in post cards
```

To disable the badge for a specific post:

```yaml
---
readingTime: false
---
```

## "Watch video" button

The `videoLink` field in the post frontmatter adds a "Watch video" button to the article header. This is convenient for articles that accompany or summarize video content.

```yaml
videoLink: https://www.youtube.com/watch?v=dQw4w9WgXcQ
videoLinkLang: EN     # label language displayed on the button
```

## Podcast dropdown

`podcasts` displays a dropdown list of links to podcast platforms. It is ideal for podcast episode pages with the transcript or show notes in the post body.

Menu items appear in the exact order you define them. Each item is `<platform id>: <episode URL>`. Specify only those platforms where the episode is actually published.

You can also extend the list of podcast platforms if your service is not in the built-in list, by configuring custom platforms in the site config or directly in the post's `podcasts` list, as shown below.

```yaml
podcastLang: EN
podcasts:
  - applepodcasts: https://podcasts.apple.com/
  - spotify: https://open.spotify.com/
  - youtube: https://www.youtube.com/
  - youtubemusic: https://music.youtube.com/
  - amazonmusic: https://music.amazon.com/
  - castbox: https://castbox.fm/
  - deezer: https://www.deezer.com/
  - iheartradio: https://www.iheart.com/
  - tunein: https://tunein.com/
  - pocketcasts: https://pca.st/
  - overcast: https://overcast.fm/
  - podcastaddict: https://podcastaddict.com/
  - podcastindex: https://podcastindex.org/
  - rss: https://example.com/rss
  # Any website on the internet
  - site: https://example.com/episode
  # Example of a custom platform with a custom icon
  - id: podimo
    url: https://podimo.com/
    label: Podimo
    iconUrl: /icons/podimo.svg
```

### Custom platform

The key for each item is the platform ID. There are 15 built-in platforms: 13 brand services (listed above) plus generic `site` and `rss`; anything else is added to the `themeConfig.podcastPlatforms` registry, which provides the label and icon across all posts:

```yaml
# src/site.yaml
themeConfig:
  podcastPlatforms:
    podbean:
      label: Podbean
      icon: simple-icons:podbean       # any Iconify icon
    zvuk:
      label: { ru: Звук, en: Zvuk }    # labels can be localized
      iconUrl: /icons/zvuk.svg         # or a custom file from public/
```

The same registry can override built-in platforms — just specify their ID.

::: warning Iconify icons and offline builds
The theme includes an offline icon set that contains only the built-in platform icons. An `icon` name not in this bundle will be fetched from `api.iconify.design` in the reader's browser. If this is undesirable, use `iconUrl` with your own file or register the icon yourself using `addIcon()` in your `enhanceApp`.
:::

For a one-off platform where you don't want to edit global configuration, define the item directly in the post — as in the `podimo` example above.

If a platform is found neither in the registry nor among built-in platforms, the link still works: the label is derived from the ID (`player-fm` → `Player Fm`), and the icon defaults to generic `mdi:podcast`.

## Discussion link

`commentLink` adds a "Discussion" button to the article footer linking to your discussion platform (GitHub Discussions, Telegram, a forum thread...).

```yaml
commentLink: https://github.com/…/discussions
```

> It is recommended to place a link here to the social media post announcing this article, steering users to your social channels where they can follow you.

---

Next: [Home page](home-page)
