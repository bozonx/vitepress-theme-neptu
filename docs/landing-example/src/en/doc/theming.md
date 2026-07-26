---
title: Theming
description: 'Two independent theme axes, the token layer and how to write your own theme'
---

# Theming

The theme has **two independent axes**:

| Axis | Attribute | Changes |
|------|-----------|---------|
| Color | `data-theme` | Palette: brand color, grays, surfaces |
| Style | `data-ln-style` | Shape, density, typography, motion |

They combine freely — `teal` + `brutal` is a different looking site from `teal`
+ `soft`, with the same content and the same components. Both are remembered in
`localStorage` and restored before the first paint, so there is no flash of the
wrong theme.

Built-in color themes: `blue`, `green`, `purple`, `amber`, `teal`, `rose`,
`magenta`, `monochrome` — the same palettes the blog theme uses, so a landing
and a blog on the same domain stay consistent.

Built-in style presets: `soft` (default), `sharp`, `brutal`, `glass`,
`editorial`.

Set the defaults in your config:

```ts
themeConfig: {
  defaultColorTheme: 'teal',
  defaultLandingStyle: 'editorial',
}
```

Try the two pickers in the nav bar of this site — every block on the home page
re-themes without a reload.

## The token layers

```
palette primitives      --gray-50…950, --primary-btn-bg        ← color theme
        ↓
semantic tokens         --ln-c-*, --ln-radius-*, --ln-section-py…
        ↓
blocks                  scoped CSS that reads only --ln-*
```

Blocks never reference a raw color or a palette primitive — only `--ln-*`. That
is the rule that makes a theme replaceable by a single stylesheet.

Groups of tokens: colors (`--ln-c-*`), shape (`--ln-radius-*`,
`--ln-border-width`), elevation (`--ln-shadow-*`), layout (`--ln-container*`,
`--ln-section-py*`, `--ln-gap*`, `--ln-page-px`), typography (`--ln-font-*`,
`--ln-h1-size`, `--ln-heading-*`, `--ln-body-lh`), motion (`--ln-ease`,
`--ln-duration`, `--ln-lift`), buttons (`--ln-btn-*`) and cards
(`--ln-card-*`).

## Small tweaks

Override tokens in your own stylesheet — no component changes needed:

```css
:root {
  --ln-container: 1200px;
  --ln-radius-lg: 0.5rem;
  --ln-font-display: 'Manrope', sans-serif;
}
```

## Your own color theme

A color preset defines palette primitives only:

```css
[data-theme='ocean'] {
  --primary-hue: 195;
  --layout-hue: 210;
  --primary-btn-bg: hsl(var(--primary-hue), 72%, 42%);
  --primary-btn-bg-active: hsl(var(--primary-hue), 78%, 32%);
  /* --gray-50 … --gray-950 — copy a built-in preset and shift the hue */
}
```

Then either set `defaultColorTheme: 'ocean'` or set the attribute yourself.

## Your own style preset

A style preset touches shape, density and motion — never colors:

```css
[data-ln-style='compact'] {
  --ln-radius-lg: 0.5rem;
  --ln-section-py: clamp(2.5rem, 1.5rem + 3vw, 4.5rem);
  --ln-card-padding: 1rem;
  --ln-heading-weight: 600;
  --ln-card-shadow: none;
}
```

Both examples live in `.vitepress/theme/styles.css` of this demo site.

## Dark mode

Dark mode comes from the VitePress default theme (`.dark` on `<html>`). The
token layer defines the dark values of every semantic token, so blocks and
custom presets follow along automatically — you only need to override a dark
value if your preset changes colors.

## The bridge to VitePress

`vitepress-bridge.css` feeds the landing tokens into `--vp-*`, which is why the
nav bar, the docs sidebar and prose pages follow the same theme as the blocks.
If you build your own components in a docs page, style them with `--ln-*` and
they will match everywhere.
