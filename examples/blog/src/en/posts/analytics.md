---
title: Analytics and popular posts
description: >
  How to connect an analytics counter (GA4, Yandex Metrika, Plausible) and enable
  a list of popular posts based on real pageviews from Google Analytics 4.
authorId: ivan-k
date: 2026-08-04
category: integration
tags: [advanced, config, analytics]
descriptionAsPreview: true
translations:
  ru: /ru/posts/analytics
---

Collecting blog traffic statistics consists of two parts:
1. **Client-side counter** — tracks reader visits across pages.
2. **Server-side popular posts aggregator** — queries the GA4 Data API at build time and forms a ranking of the most-read articles.

## Connecting an analytics counter

You add your analytics tracking script to the `head` section of `.vitepress/config.ts`. The theme automatically injects the Google Consent Mode v2 script **before** your tags, so `gtag.js` immediately respects consent signals and holds cookies until user response. Learn more about consent in [Cookie consent (GDPR and CMP)](consent).

### Google Analytics 4

```ts
// .vitepress/config.ts
export default async () => defineBlogConfig({
  head: [
    // The theme injects the consent script before this block automatically
    [
      'script',
      {
        async: '',
        src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX',
      },
    ],
    [
      'script',
      {},
      `window.dataLayer=window.dataLayer||[];` +
        `function gtag(){dataLayer.push(arguments)}` +
        `gtag('js',new Date());gtag('config','G-XXXXXXXXXX');`,
    ],
  ],
})
```

### Cookieless analytics (Plausible, Umami, GoatCounter)

Counters that do not use cookies generally do not require a consent banner (GDPR / ePrivacy):

```ts
// .vitepress/config.ts
export default async () => defineBlogConfig({
  head: [
    [
      'script',
      {
        defer: '',
        'data-domain': 'yourdomain.com',
        src: 'https://plausible.io/js/script.js',
      },
    ],
  ],
})
```

---

## Popular posts via GA4

"Popular posts" is a list of articles sorted by real view metrics from **Google Analytics 4**. Unlike "recent" (by date) or "featured" (curated manually), popularity is calculated automatically based on data GA4 is already collecting.

### How it works

Statistics are fetched from GA4 **at build time** — once. The result is baked directly into static pages: zero client-side requests to Google APIs after deployment, and the private key is used strictly on the build server and never leaks to the reader's browser.

During the build, the theme queries the GA4 Data API and retrieves: views, unique visitors, and average session duration for each path. It then sorts the pages by popularity for the popular posts list.

::: info
If there is no data, the network is unreachable, or credentials are invalid, the theme outputs a warning and **the build continues**. The popular list simply remains empty.
:::

### Configuring GA4

#### 1. Creating a Service Account

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project (or select an existing one).
3. Enable the **Google Analytics Data API** — navigate to **APIs & Services → Library** → search for "Google Analytics Data API" → click **Enable**. Without this, the API returns 403.
4. Go to **IAM & Admin → Service Accounts** and create a new service account (e.g. `ga4-popular-posts`).
5. Select the newly created account, go to the **Keys** tab → **Add Key → Create new key → JSON**. Save the downloaded JSON file.

#### 2. Adding to Google Analytics

1. Open [Google Analytics](https://analytics.google.com/).
2. Select your GA4 property.
3. Navigate to **Admin → Property access management**.
4. Click **Add users** and paste the `client_email` from your downloaded JSON key, assigning the **Viewer** role.

#### 3. Obtaining the Property ID

The Property ID is the numeric identifier of your GA4 property. Locate it in **Admin → Property settings** under **Property ID**. It resembles `123456789`.

#### 4. Passing credentials

**Never commit the JSON key to the repository**. Pass credentials using environment variables:

```bash
GA_PROPERTY_ID=123456789
GA_CREDENTIALS_JSON='{"type": "service_account", "client_email": "...", "private_key": "...", ...}'
```

### Enabling in configuration

Popular posts are configured in the level 1 configuration (`.vitepress/config.ts`), where credentials, environment variables, and integrations belong. See [Configuration layers](config-layers) for details.

```ts
// .vitepress/config.ts
export const popularPosts = {
  // Enable GA4 integration (default: false)
  enabled: true,
  // Sort metric: 'pageviews' | 'uniquePageviews' | 'avgTimeOnPage' (default: 'pageviews')
  sortBy: 'pageviews',
  dataSource: {
    // Data provider (currently only GA4)
    provider: 'ga4',
    // GA4 property ID (default: null)
    propertyId: process.env.GA_PROPERTY_ID,
    // JSON key contents as a string (default: null)
    credentialsJson: process.env.GA_CREDENTIALS_JSON,
    // Data collection window in days (default: 30)
    // dataPeriodDays: 30,
    // Max rows from GA (default: 1000)
    // dataLimit: 1000,
  },
} satisfies NonNullable<ThemeConfig['popularPosts']>

export default async () => defineBlogConfig({
  // ... other settings
  themeConfig: {
    popularPosts,
  },
})
```

::: info
The `popularPosts` object is used in two places: it is imported by the locale data loader (`loadPosts.data.ts`) and passed into `themeConfig.popularPosts`.
:::

#### Sort metrics

| Value | GA4 Metric | What it measures |
| --- | --- | --- |
| `pageviews` | `screenPageViews` | Total page views |
| `uniquePageviews` | `totalUsers` | Unique visitors (user count, not unique pageviews) |
| `avgTimeOnPage` | `averageSessionDuration` | Average session duration |

Posts without statistics (e.g., brand-new articles not yet captured in the reporting window) are sorted by date — newer first.

### Enabling display

After enabling the integration in `config.ts`, turn on the display blocks in `site.yaml` (level 2) or `_site.yaml` (level 3). Author pages and the archive will automatically show sort switches for popular posts.

#### Sidebar

```yaml
# src/site.yaml
themeConfig:
  sidebar:
    popular: true    # "Popular" section in the sidebar
```

#### Home page

```yaml
# src/site.yaml
themeConfig:
  home:
    sections:
      - { type: popular, enabled: true, limit: 5 }
```

`limit` caps the number of articles. Without it, a single page is shown — the `perPage` value. An empty section is never rendered: while there is no data, the block simply does not appear. See [Home page](home-page) for more details.

---

## What's next

- [Cookie consent (GDPR and CMP)](consent) — Consent Mode v2, CMP, consent banners and `useConsent()`.
- [Ad blocks](ads) — where ad blocks are placed and how to connect them.
- [Publishing and deployment](deploy) — passing GA4 secrets in CI/CD.

---

Next: [Ad blocks](ads)
