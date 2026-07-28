---
title: Author Block, Video Button & Podcast Dropdown
description: >
  How authorId renders the author card and twitter:creator tag, and how videoLink
  and podcasts add call-to-action buttons at the top of a post.
date: 2025-02-14T11:00:00Z
authorId: ivan-k
cover: https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=1200&auto=format&fit=crop
coverWidth: 1200
coverHeight: 800
coverAlt: A microphone in a home podcast studio
tags:
  - frontmatter
  - media
descrAsPreview: true
commentLink: https://github.com/bozonx/vitepress-theme-neptu/discussions
videoLink: https://www.youtube.com/watch?v=dQw4w9WgXcQ
videoLinkLang: EN
podcastLang: EN
podcasts:
  spotify: https://open.spotify.com/
  applepodcasts: https://podcasts.apple.com/
  youtube: https://www.youtube.com/
translations:
  ru: /ru/post/author-video-podcast
---

Three related fields turn a plain article into a rich, multi-format post. All of
them are visible on this page: the **video button** and **podcast dropdown** at
the top, and the **author card** at the bottom.

## Author

`authorId` links the post to an entry in `_authors.yaml`. The theme then renders
the author card in the footer, links to the author's listing page, and emits a
`twitter:creator` meta tag from the author's `twitterHandle`.

### How it's done

```yaml
# in the post
authorId: ivan-k
```

```yaml
# in src/en/_authors.yaml
- id: 'ivan-k'
  name: 'Ivan K'
  description: 'Maintainer of the theme.'
  image: 'https://…/avatar.jpg'
  twitterHandle: 'neptu_blog'   # → twitter:creator on this author's posts
  links:
    - type: 'github'
      url: 'https://github.com/…'
      title: 'GitHub'
```

## Video button

`videoLink` adds a prominent button at the top of the post — handy when the
article has a companion video.

```yaml
videoLink: https://www.youtube.com/watch?v=dQw4w9WgXcQ
videoLinkLang: EN     # label language shown on the button
```

## Podcast dropdown

`podcasts` renders a dropdown of platform links, for when the post is also
available as an audio episode.

```yaml
podcastLang: EN
podcasts:
  spotify: https://open.spotify.com/…
  applepodcasts: https://podcasts.apple.com/…
  youtube: https://www.youtube.com/…
```

## Comment link

`commentLink` adds a “Discussion” button to the footer, pointing at wherever you
host conversation (GitHub Discussions, Telegram, a forum thread…).

```yaml
commentLink: https://github.com/…/discussions
```
