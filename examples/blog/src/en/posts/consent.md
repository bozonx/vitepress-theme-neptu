---
title: Cookie consent (GDPR and CMP)
description: >
  Why a cookie banner is needed, why AdSense in the EU requires a certified CMP,
  how the theme sets up Google Consent Mode v2, and how to use useConsent().
authorId: ivan-k
date: 2026-07-04
category: integration
tags: [advanced, config]
descriptionAsPreview: true
translations:
  ru: /ru/posts/consent
---

As soon as a site displays ads or connects an analytics counter that stores cookies, consent becomes a necessary consideration. The theme covers the technical portion that third-party services cannot handle on your behalf, but **the theme does not render a consent banner itself**.

::: warning This is not legal advice
The guidance below covers technical implementation details and advertising platform requirements. Policy language, consent category breakdown, and regulatory applicability to your specific audience remain your responsibility.
:::

## Is a banner required?

In short: if you serve ads or collect analytics using cookies and have visitors from the EEA, UK, or Switzerland — yes. Cookie-free analytics (Plausible, Umami, GoatCounter) do not require consent.

- The **ePrivacy Directive** requires obtaining consent **before** storing or accessing non-essential cookies and similar device storage. Ad units and cookie-based analytics fall under this; cookieless trackers do not.
- The **GDPR** establishes strict requirements for the consent itself: it must be prior, informed, freely given, and **revocable**, with opting out being no more difficult than opting in.

## How to enable a banner

The Neptu blog theme does not bundle an in-house consent banner, as a simple DIY banner cannot satisfy strict regulatory requirements. A banner must be integrated separately:

- **Google Advertising (AdSense / Ad Manager)** with visitors from the EEA, UK, or Switzerland — Google requires a TCF-certified CMP. The simplest solution is to turn on **Privacy & messaging** directly in your AdSense console.
- **Cookie analytics only, without Google ads** — certification is not required; any open-source banner or custom modal will suffice. You can wire it into the theme using `useConsent()` (below). For cookie-free analytics, no banner is needed at all.

| Option | Best for | Notes |
| --- | --- | --- |
| **Privacy & messaging in AdSense** | AdSense publishers | Free, fully certified, zero custom code — toggled on with a switch in your account. |
| Cookiebot, Usercentrics, CookieYes | custom branding and categories | Freemium, certified CMPs |
| Klaro, vanilla-cookieconsent | analytics only, no Google ads | Open-source, **not** TCF-certified |

## What the theme does

The theme provides the **consent foundation** — actions that an external CMP cannot perform because they must execute before the CMP itself loads.

### Consent Mode v2 in `<head>`

The theme injects default values for the five Google Consent Mode v2 signals as the first script in `<head>`:

| Signal | Purpose |
| --- | --- |
| `analytics_storage` | Analytics cookies |
| `ad_storage` | Advertising cookies |
| `ad_user_data` | Sending user data to Google |
| `ad_personalization` | Personalized advertising |
| `functionality_storage` | Functional cookies (language, preferences) |

All are set to `denied`. Execution order is vital: signals only apply to tags that load **after** them, which is why this script precedes gtag.js, AdSense, and the CMP itself. Otherwise, the initial pageview hit would bypass the restriction.

The same script restores a returning visitor's choice from storage so they are not treated as having opted out while the CMP initializes.

```ts
// .vitepress/config.ts — default settings, rarely need changing
export default async () => defineBlogConfig({
  themeConfig: {
    consent: {
      enabled: true,
      waitForUpdate: 500, // how long tags wait for CMP response, ms
      // regions: ['ES', 'US-CA'], // restrict to specific regions (ISO 3166-2)
      // defaults: { analytics: true }, // if legally applicable for your setup
    },
  },
})
```

`consent.enabled: false` disables this script — only needed if your CMP injects default signals on its own. Avoid running both: whichever executes last overrides previous values, and not always in the way you expect.

### `useConsent()`

A reactive composable bridging your CMP with the theme. Call it inside your CMP callback: the theme saves the decision, emits `gtag('consent', 'update', ...)`, and re-renders ad blocks if they are awaiting consent.

```ts
import { useConsent } from 'vitepress-theme-neptu/composables'

const {
  consent,
  hasDecided,
  adsAllowed,
  analyticsAllowed,
  set,
  acceptAll,
  rejectAll,
  reset,
} = useConsent()

// from your CMP callback
set({ analytics: true, ads: false, adUserData: false, adPersonalization: false })

// "Cookie settings" link in the footer
reset()
```

The user's decision is stored in `localStorage` (`consent.storageKey`, default: `neptu-consent`) and synchronized across browser tabs.

If your CMP manages Google Consent Mode independently, you don't need to call `useConsent()` at all — the theme inspects state only when `ads.requireConsent` is enabled.

## Ads and consent

```ts
themeConfig: {
  ads: {
    component: 'AdUnit',
    requireConsent: false, // default
  },
}
```

`requireConsent: false` does not mean "show ads without consent". A certified CMP dictates what to serve: upon refusal, Google switches to non-personalized ads rather than dropping the slot entirely. If the theme were to hide the container completely, those ad impressions would be lost.

Set `requireConsent: true` when nothing should load prior to explicit consent — for example, if using an ad network that lacks Consent Mode support.

## Checklist

1. Cookieless analytics only → no banner needed.
2. Google Analytics → banner required; easiest route is an open-source library wired via `useConsent()`.
3. AdSense or Ad Manager with EEA/UK/CH visitors → enable **Privacy & messaging** in AdSense and activate **Consent Mode** in European regulations message settings. No custom code required.
4. The theme places the Consent Mode script automatically — modify `consent.enabled` only if your CMP already provides it.

## What's next

- [Analytics and popular posts](analytics) — connecting counters and GA4 page view stats.
- [Ad blocks](ads) — ad placement options and configuration.
- [Customization](customization) — slots, hooks, and composables.

---

Next: [Mermaid diagrams and KaTeX formulas](mermaid-and-katex)
