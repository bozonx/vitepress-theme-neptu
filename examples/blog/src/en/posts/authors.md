---
title: Authors
description: >
  How authorId links a post to an entry in _authors.yaml, the theme builds an
  author page, injects a card into the footer, emits twitter:creator and
  article:author meta tags, and generates JSON-LD Person.
authorId: ivan-k
date: 2026-08-04
category: writing
tags: [frontmatter, config]
descriptionAsPreview: true
translations:
  ru: /ru/posts/authors
---

An author appears in the following places:

- In the post footer, the author is rendered according to the `authorId` specified in the post frontmatter
- On the author list page, author cards are displayed; the author's individual page displays their list of posts
- **`twitter:creator`** — populated from the author's `twitterHandle`. Helps Twitter/X link the article to the author in preview cards.
- **`article:author`** — Open Graph tag with the absolute URL of the author's page.
- **JSON-LD `Person`** — structured data on the author page: name, description, portrait (`ImageObject`), links (`sameAs`), and URL.
- **JSON-LD `article.author`** — `Person` object (name + URL) in the article's structured data.

## How to add an author

## Authors across all locales (`site.yaml`)

You can define authors for all locales at once in `src/site.yaml`.

```yaml
# src/site.yaml
themeConfig:
  authors:
    - id: 'jhon-doe'
      name: 'John Doe'
      description: 'Main correspondent'
      image: 'https://…/avatar.jpg'
      links:
        - type: 'github'
          url: 'https://github.com/…'
          title: 'GitHub'
```

You can also add authors for a specific locale or override fields of global authors, such as name and description, in `src/en/_authors.yaml`.

```yaml
# in src/en/_authors.yaml
- id: 'jhon-doe'
  name: 'John Doe'
  description: 'Chief correspondent'
```

And finally, reference the author's ID in the post frontmatter:

```yaml
# in post frontmatter
authorId: ivan-k
```

## All author fields

Only `id` is required; all other fields are optional.

- **`id`** *(string, required)* — unique, stable identifier. Used in post frontmatter (`authorId`) and for merging entries across configuration layers.
- **`name`** *(string)* — author's display name on the author page and in post metadata.
- **`description`** *(string)* — short biography. Rendered as HTML — supports Markdown formatting.
- **`image`** *(string)* — URL of author's avatar/portrait. Used on the author page and in the author card in the post footer.
- **`imageWidth`** *(number)* — `image` width in pixels for the `width` attribute of `<img>`. Recommended to prevent Cumulative Layout Shift (CLS). Auto-detected for local files, but must be set manually for external URLs.
- **`imageHeight`** *(number)* — `image` height in pixels for the `height` attribute of `<img>`. Similar to `imageWidth`.
- **`twitterHandle`** *(string)* — Twitter/X username without the leading `@`. Used for the `twitter:creator` meta tag.
- **`links`** *(array of objects)* — social and external links, displayed below the bio as icons. Each link:
  - **`type`** *(string)* — link type determining the icon. Built-in: `site`, `youtube`, `x`, `facebook`, `instagram`, `tiktok`, `vk`, `mastodon`, `diaspora`. Any other type (e.g. `github`) falls back to a universal globe icon.
  - **`url`** *(string)* — full URL of external resource.
  - **`title`** *(string)* — accessible title / tooltip.

### Template substitutions

Author fields support template variables `${theme.*}`, `${config.*}`, and `${t.*}` — the same ones available in `_site.yaml`. Substitutions are evaluated after merging all configuration layers.

For example, you set a custom field `organizationName` in `themeConfig`:

```yaml
# src/site.yaml
themeConfig:
  organizationName: 'Neptu Blog'
```

Now you can substitute it into the author bio using `${theme.organizationName}`:

```yaml
# src/en/_authors.yaml
- id: 'ivan-k'
  name: 'Ivan K.'
  description: 'Editor at ${theme.organizationName}'
```

After substitution, the bio becomes: "Editor at Neptu Blog".

## Adding an authors list and author pages

The theme automatically creates several pages related to authors:

- **`authors/`** — list of all authors with their cards.
- **`authors/<id>/`** — individual author page with their posts (chronological order).
- **`authors/<id>/popular/`** — author's popular posts page (popularity order).

To display the authors section in the sidebar, enable it in the locale configuration:

```yaml
# src/<locale>/_site.yaml
themeConfig:
  sidebar:
    authors: true
  # icon for the authors section in the sidebar (default: built-in)
  authorsIcon: 'lucide:users'
```

Also make sure the `src/<locale>/authors/` directory exists in your project and was not deleted. It is present by default in the blog template.

---

Next: [Where to store images and media](media-asset-placement)
