---
title: Cookie consent
description: >
  The theme's handling of cookie consent (Google Consent Mode v2), the useConsent()
  composable, and its interaction with ads and analytics.
authorId: ivan-k
date: 2026-07-25
category: integration
tags: [consent, gdpr, cmp, ads, analytics]
descriptionAsPreview: true
translations:
  ru: /ru/posts/consent
---

If you serve ads or use analytics — especially for visitors in the EU — you need a consent banner. The theme integrates with Google Consent Mode v2 and provides a `useConsent()` composable to interact with external Consent Management Platforms (CMPs).

## Why consent matters

Under GDPR and similar regulations, tracking scripts and ads require user consent. Google Consent Mode v2 adjusts how Google tags behave based on the user's consent state — without it, ad revenue and analytics accuracy may suffer for EU traffic.

## What the theme provides

The theme **does not** provide a consent banner UI. Instead, it provides:

1. **`useConsent()` composable** — reactive access to the consent state
2. **Consent Mode v2 integration** — automatically sets default consent to "denied"
3. **Conditional rendering** — ads and analytics respect the consent state

## `useConsent()`

```ts
import { useConsent } from 'vitepress-theme-neptu/composables'

const { status, granted, denied, update } = useConsent()

// status.value: 'granted' | 'denied' | 'unknown'
// granted.value: boolean
// denied.value: boolean

// Update consent (e.g., when user accepts in your CMP banner)
update('granted')
```

## Integration with a CMP

1. **Choose a CMP** — Cookiebot, OneTrust, Termly, or your own banner
2. **Set default consent to denied** — the theme does this automatically
3. **Connect your CMP to `useConsent()`** — when the user accepts, call `update('granted')`

```vue
<!-- .vitepress/theme/ConsentBanner.vue -->
<script setup>
import { useConsent } from 'vitepress-theme-neptu/composables'

const { update, granted } = useConsent()
</script>

<template>
  <div v-if="!granted" class="consent-banner">
    <p>We use cookies for ads and analytics.</p>
    <button @click="update('granted')">Accept</button>
    <button @click="update('denied')">Decline</button>
  </div>
</template>
```

## Configuration

```yaml
# src/site.yaml
themeConfig:
  consent:
    enabled: true
    defaultStatus: 'denied'   # default before user interaction
```

## How ads and analytics respond

| Feature | Behavior when consent is `denied` |
| --- | --- |
| Ads (`ads.requireConsent: true`) | Ad components are not rendered |
| GA4 | Consent Mode v2 signals sent — GA4 tracks in "consentless" mode |
| Plausible | Script not loaded |

## What's next

- [Ad blocks](ads) — ad configuration
- [Analytics](analytics) — analytics setup
