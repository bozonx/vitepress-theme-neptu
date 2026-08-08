---
title: Analytics and popular posts
description: >
  How to integrate client-side analytics (GA4, Plausible) and enable popular
  posts lists based on GA4 data, including service account setup.
authorId: ivan-k
date: 2026-07-23
category: integration
tags: [analytics, ga4, popular-posts]
descriptionAsPreview: true
translations:
  ru: /ru/posts/analytics
---

The theme supports two types of analytics: client-side tracking (page views) and server-side popular posts (based on GA4 data).

## Client-side analytics

### Google Analytics 4

```ts
// .vitepress/config.ts
export default async () => defineBlogConfig({
  themeConfig: {
    analytics: {
      ga4: {
        measurementId: 'G-XXXXXXXXXX',
      },
    },
  },
})
```

The GA4 script is loaded with consent awareness — it respects the user's consent choice (see [Cookie consent](consent)).

### Plausible

```ts
// .vitepress/config.ts
export default async () => defineBlogConfig({
  themeConfig: {
    analytics: {
      plausible: {
        domain: 'myblog.org',
        // src: 'https://plausible.io/js/script.js',  // self-hosted: use your URL
      },
    },
  },
})
```

## Popular posts (GA4 Data API)

Popular posts are computed at build time using the Google Analytics 4 Data API. This requires a Google Cloud service account.

### Setup

1. **Create a Google Cloud project** and enable the Google Analytics Data API.

2. **Create a service account** and download the JSON key file.

3. **Grant the service account access** to your GA4 property:
   - In GA4 Admin → Property access management
   - Add the service account email as a Viewer

4. **Set environment variables** for the build:

```bash
export GA_PROPERTY_ID=123456789
export GA_CREDENTIALS_JSON='{"type":"service_account",...}'
```

5. **Enable popular posts** in the config:

```yaml
# src/site.yaml
themeConfig:
  popularPosts:
    enabled: true
    days: 30           # look back period
    limit: 10          # max posts to track
```

### Display

Popular posts can be shown in two places:

```yaml
# src/site.yaml
themeConfig:
  popularPosts:
    enabled: true
    sidebar: true       # show in sidebar
    home: true          # show as a home page section
```

### Home page section

```yaml
themeConfig:
  home:
    sections:
      - type: 'popular'
        title: 'Popular posts'
        maxPosts: 5
```

### Without GA4

If you don't use GA4, popular posts won't be available. The `popular` route and sidebar section will simply not render.

## What's next

- [Cookie consent](consent) — consent management for analytics
- [Lists and pages](lists-and-pages) — all list types
