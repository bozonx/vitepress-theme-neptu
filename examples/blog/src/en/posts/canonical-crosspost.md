---
title: Canonical Links & Cross-Posting
description: >
  Point search engines at the authoritative version of a page — self-referencing
  by default, or an external URL when you republish content from elsewhere.
date: 2024-11-11T08:00:00Z
authorId: maria-editor

# This demo post declares an external canonical, as if it were republished from
# another site. Check <head> for <link rel="canonical" href="https://example.com/…">.
canonical: "https://example.com/en/articles/original-post"

category: SEO
tags:
  - seo
  - canonical
descrAsPreview: true
translations:
  ru: /ru/posts/canonical-crosspost
---

A **canonical link** tells search engines which URL is the authoritative version
of a page, preventing duplicate-content penalties. This post declares an
*external* canonical — inspect `<head>` and you'll see it points at
`example.com`, not this site.

## Default behavior

With `autoCanonical: true` (the default), every page gets a self-referencing
canonical automatically. You don't have to do anything for normal posts.

## Cross-posting: external canonical

When you republish an article that first appeared elsewhere, point the canonical
at the original so the source site keeps the SEO credit.

### How it's done

```yaml
canonical: "https://example.com/en/articles/original-post"
```

Use this when you syndicate your own content, import from a legacy domain, or
republish with permission.

## Forcing a self canonical

If you've disabled `autoCanonical` globally but want *this* page to self-
reference:

```yaml
canonical: "self"
```

## Disabling canonical for one page

```yaml
seo:
  canonical: false
```

## Global settings

```yaml
# src/site.yaml
themeConfig:
  seo:
    canonical: true
    autoCanonical: true
```

For hreflang (canonical's multilingual cousin), see
[i18n & hreflang](i18n-hreflang).
