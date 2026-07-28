---
title: Color Themes
description: The theme ships eight ready-made color schemes and supports fully custom hues via CSS variables.
layout: page
---

# Color Themes

The theme ships **eight** ready-made color schemes. You pick one by importing its
CSS in `.vitepress/theme/index.ts`. This demo currently uses **blue**.

<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:12px;margin:1.5rem 0;">
  <div style="text-align:center"><div style="height:56px;border-radius:10px;background:hsl(213,66%,46%)"></div><small>blue · hue 213</small></div>
  <div style="text-align:center"><div style="height:56px;border-radius:10px;background:hsl(115,70%,37%)"></div><small>green · hue 115</small></div>
  <div style="text-align:center"><div style="height:56px;border-radius:10px;background:hsl(270,66%,46%)"></div><small>purple · hue 270</small></div>
  <div style="text-align:center"><div style="height:56px;border-radius:10px;background:hsl(30,66%,46%)"></div><small>amber · hue 30</small></div>
  <div style="text-align:center"><div style="height:56px;border-radius:10px;background:hsl(180,66%,46%)"></div><small>teal · hue 180</small></div>
  <div style="text-align:center"><div style="height:56px;border-radius:10px;background:hsl(345,66%,46%)"></div><small>rose · hue 345</small></div>
  <div style="text-align:center"><div style="height:56px;border-radius:10px;background:hsl(320,66%,46%)"></div><small>magenta · hue 320</small></div>
  <div style="text-align:center"><div style="height:56px;border-radius:10px;background:hsl(0,0%,30%)"></div><small>monochrome</small></div>
</div>

## Switching the scheme

Import exactly one theme CSS at the top of `.vitepress/theme/index.ts`:

```ts
// .vitepress/theme/index.ts
import 'vitepress-theme-neptu/blue-theme.css'
// import 'vitepress-theme-neptu/green-theme.css'
// import 'vitepress-theme-neptu/purple-theme.css'
// import 'vitepress-theme-neptu/amber-theme.css'
// import 'vitepress-theme-neptu/teal-theme.css'
// import 'vitepress-theme-neptu/rose-theme.css'
// import 'vitepress-theme-neptu/magenta-theme.css'
// import 'vitepress-theme-neptu/monochrome-theme.css'
```

## Dynamic Theme Switcher (`themeSwitcher`)

The theme supports a real-time color theme picker control in the top bar (try the palette icon in the navigation). Selected theme choices are automatically saved to `localStorage`.

To enable this switcher in your blog, set `themeSwitcher: true` in `themeConfig`:

```ts
// .vitepress/config.ts
export default {
  themeConfig: {
    themeSwitcher: true, // Enables real-time palette selector in the top bar
  }
}
```

## Custom hue

Every scheme is driven by two CSS variables. To roll your own, skip the theme
import and set them in `.vitepress/theme/styles.css`:

```css
:root {
  --primary-hue: 115; /* accent color: buttons, links, active states */
  --layout-hue: 200;  /* neutral chrome tint: borders, surfaces */
}
```

`--primary-hue` and `--layout-hue` are independent, so you can pair a vivid
accent with a differently-tinted neutral UI.

## Light / dark appearance

Independent of the color scheme, the theme supports light and dark appearance
out of the box — try the sun/moon toggle in the top bar. Each scheme defines
both variants, so no extra configuration is needed.

## Custom fonts

The theme uses a web-safe font stack by default (`Arial, 'Helvetica Neue',
Helvetica, sans-serif` — fastest load, no layout shift). To use a custom font,
load it in `head` and redefine two CSS variables — nothing else needed, the
whole theme picks them up:

```ts
// .vitepress/config.ts — load the font
head: [
  ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
  ['link', { href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Fira+Code&display=swap', rel: 'stylesheet' }],
],
```

```css
/* .vitepress/theme/styles.css — apply it */
:root {
  --font-body: 'Roboto', ui-sans-serif, system-ui, sans-serif;   /* body, headings, buttons */
  --vp-font-family-mono: 'Fira Code', ui-monospace, monospace;   /* code blocks, audio player */
}
```

For a headings-only accent, leave `--font-body` alone and target `h1…h6` in
`styles.css` instead.

## Home background

This demo also sets a full-bleed hero background on the home layout. That is
plain CSS in `styles.css`, not part of the color scheme:

```css
.home-layout {
  background-image: url('https://images.unsplash.com/photo-...');
  background-color: #000000;
}
```
