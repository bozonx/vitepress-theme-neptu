---
title: Post Footer, Sharing & Similar Posts
description: >
  What renders below a post — social share buttons, the reorderable postFooter
  blocks, and the automatic "similar posts" list — and how to configure each.
date: 2025-01-25T10:00:00Z
authorId: ivan-k
cover: https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1200&auto=format&fit=crop
coverWidth: 1200
coverHeight: 800
coverAlt: Hands stacked together in a team huddle
tags:
  - frontmatter
  - guide
descrAsPreview: true
commentLink: https://github.com/bozonx/vitepress-theme-neptu/discussions
translations:
  ru: /ru/post/post-footer-and-sharing
---

Scroll to the bottom of this post and you'll see the whole footer stack in
action: the **author card**, a **discussion link**, **share buttons**, an
**edit link**, **tags**, and a **similar posts** list. Every one of those blocks
is configurable — here's how.

## The postFooter blocks

The footer is an ordered list of named blocks. Reorder or omit them in
`src/site.yaml` (or per-locale):

### How it's done

```yaml
# src/site.yaml
themeConfig:
  postFooter:
    - author        # author card (from authorId)
    - donate        # donate call-to-action
    - comments      # commentLink button
    - social-share  # share buttons (see below)
    - edit-link     # "Edit this page" (set repo; its URL is generated automatically)
    - tags          # this post's tags
    - similar       # similar posts list
    - popular-link  # link to the Popular listing
```

Drop any line to hide that block; change the order to rearrange the stack.

Set `themeConfig.repo` once in `.vitepress/config.ts` and the theme derives the edit
URL for the supported Git hosts. `editLink.text` only changes the label; use
`editLink.pattern` solely to override the generated branch or source path.

## Social share buttons

The `social-share` block renders share buttons. The theme ships six defaults
(Telegram, WhatsApp, VK, X, Facebook, LinkedIn) — that's what you see below this
post with no config at all. Override the whole list to pick your own networks:

```yaml
# src/<locale>/_site.yaml
themeConfig:
  socialMediaShares:
    - name: telegram
      icon: 'logos:telegram'
      title: 'Telegram'
      urlTemplate: 'https://t.me/share/url?url={url}&text={title}'
    - name: bluesky
      icon: 'simple-icons:bluesky'
      title: 'Bluesky'
      urlTemplate: 'https://bsky.app/intent/compose?text={title}%20{url}'
```

`{url}` and `{title}` are replaced with the current page's URL and title. Hide
the block entirely with `socialMediaShares: []`.

## Similar posts

The `similar` block automatically lists posts that share tags with the current
one — no per-post config. Control how many appear globally:

```yaml
# src/site.yaml
themeConfig:
  similarPostsCount: 5
```

Because this post is tagged `frontmatter` and `guide`, the similar list below is
populated from the other posts sharing those tags. Add tags to a post and it
starts showing up in more “similar” lists.
