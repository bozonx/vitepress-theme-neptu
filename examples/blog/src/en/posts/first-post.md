---
title: Your first post
description: >
  A minimal post is a Markdown file with a title, date and author. Let's go
  through what's required and what you can add later.
authorId: maria-editor
date: 2026-07-31
category: getting-started
tags: [start, frontmatter]
featured: true
descriptionAsPreview: true
translations:
  ru: /ru/posts/first-post
---

A post is just a Markdown file in the `src/<locale>/posts/` folder. The filename becomes the page URL: `posts/my-first-post.md` → `/ru/posts/my-first-post`.

A post can also be a folder: `posts/my-first-post/index.md` opens at `/ru/posts/my-first-post/`, with its images stored alongside. See [Project structure](project-structure) and [Where to store images and media](media-asset-placement) for details.

## Minimal post

Create a file `src/en/posts/my-first-post.md`:

```md
---
date: 2026-07-24T10:00:00Z
authorId: maria-editor
---

# Hello, world

This is my first post. Here I can write using **Markdown** markup.
```

The only required field here is **`date`** — the publication date in ISO format. It's used for sorting, the archive and feeds. Just a date is enough: `2026-07-24`. Including the time is optional but useful when multiple posts go out on the same day — then use the format: `2026-07-24T10:00:00Z` (ISO 8601).

The second field, `authorId`, is optional — only include it if the post's author is a regular contributor listed in your config and/or in `_authors.yaml`.

:::tip
If the author is a one-time contributor, you can simply credit them in the post body, e.g.: Our freelance correspondent [John Doe](https://example.com).
:::

## What else to know

The theme takes the title from the first `#` in the text. A separate `title` field is only needed to override it (e.g., for a longer `<title>` in the browser tab).

For a full list of frontmatter fields, see [All frontmatter fields](frontmatter). Managing covers, previews and media is covered in the following articles in the "Content" section.

---

Next: [Publishing and deployment](deploy)
