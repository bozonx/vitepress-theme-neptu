---
title: Support This Blog
description: Demo donate page — the target of the donate button in the nav, sidebar, and post footer.
layout: page
translations:
  ru: /ru/page/donate
---

# Support This Blog

This page is the demo target of the **donate button**. That button appears in
three places, all controlled by config:

- the top bar (`nav.donate: true`),
- the sidebar bottom (`sidebar.donate: true`),
- the post footer (when `donate` is in `postFooter`).

Its URL and icon come from `themeConfig.donate`:

```yaml
# src/site.yaml
themeConfig:
  donate:
    url: 'page/donate'
    postDonateCall: 'If you find this blog useful, consider supporting it.'
    # icon: 'fa6-solid:hand-holding-heart'
```

On a real blog you'd replace the link below with your payment provider.

[Donate](https://example.com/donate)

Thank you! ❤️
