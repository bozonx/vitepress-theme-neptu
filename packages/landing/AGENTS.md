# Working with the Neptu Landing theme

Instructions for AI agents (and humans in a hurry) building pages or themes with
`vitepress-theme-neptu-landing`. Everything here is checkable against the source
in `src/`.

## Mental model

A landing page is an ordered list of **blocks**. A block is a full-width
section that paints its own surface, owns its vertical rhythm and constrains its
content width. You never write layout CSS around blocks.

Two independent theme axes control the looks:

- `data-theme` on `<html>` — palette (`blue`, `green`, `purple`, `amber`,
  `teal`, `rose`, `magenta`, `monochrome`)
- `data-ln-style` on `<html>` — shape and density (`soft`, `sharp`, `brutal`,
  `glass`, `editorial`)

## Rules

1. **Never hardcode colors, radii, shadows or spacing** in a block or a custom
   section. Use `--ln-*` tokens. Raw hex values and palette primitives
   (`--gray-*`) are a bug.
2. **One `hero` per page**, always first — it renders the page `h1`.
3. **Blocks live inside `<LnPage>`** (component mode) or are produced by
   `<LandingRenderer />` (data mode). Never mix a block into a `vp-doc` page.
4. A landing page needs `layout: home` **and** `markdownStyles: false` in
   frontmatter. Without the second key blocks get trapped in the prose column.
5. **Do not invent props.** The full set is `SectionProps` (below) plus what the
   block declares in `src/blocks/types.ts`. An unknown block `type` is skipped
   with a dev warning.
6. Alternate the `bg` of consecutive sections (`base` → `soft` → `base`) to give
   the page rhythm; use `inverse` or `brand` once or twice at most.
7. `title` and `text` accept inline HTML — use it for `<br>` and
   `<span class="ln-accent">`, not for layout.

## Shared props (every block)

| Prop | Values | Default |
|------|--------|---------|
| `id` | anchor string | — |
| `bg` | `base` `soft` `mute` `inverse` `brand` `transparent` | `base` |
| `width` | `narrow` `default` `wide` `full` | `default` |
| `padding` | `none` `sm` `md` `lg` | `md` |
| `align` | `start` `center` | per block |
| `divider` | boolean | `false` |
| `noReveal` | boolean | `false` |

Most blocks also take `eyebrow`, `title`, `text` and an `items` array.

## Block types

`hero` · `features` · `feature-split` · `bento` · `carousel` · `logos` ·
`stats` · `steps` · `testimonials` · `pricing` · `faq` · `cta` · `timeline` ·
`team` · `gallery`

Component names are the PascalCase form with an `Ln` prefix: `features` →
`LnFeatureGrid`, `feature-split` → `LnFeatureSplit`, `logos` → `LnLogoCloud`,
the rest are literal (`hero` → `LnHero`).

Authoritative prop definitions: `src/blocks/types.ts`.
JSON Schema for the data mode: `schema/landing-blocks.schema.json`.

## Two authoring modes

**Components** — blocks are registered globally, no imports needed:

```md
---
layout: home
markdownStyles: false
---

<LnPage>
<LnHero title="…" :actions="[{ text: 'Start', link: '/doc' }]" />
<LnFeatureGrid :cols="3" :items="[…]" />
</LnPage>
```

**Data** — the whole page in frontmatter:

```md
---
layout: home
markdownStyles: false
blocks:
  - type: hero
    title: …
  - type: features
    cols: 3
    items: […]
---

<LandingRenderer />
```

Prefer the data mode when generating a page programmatically: it is validated by
the schema and cannot produce broken markup.

## Page recipes

Proven block orders — start from one of these instead of inventing a structure.

**SaaS product**
`hero(split)` → `logos(marquee)` → `features(3)` → `feature-split` →
`stats(inverse)` → `testimonials` → `pricing` → `faq` → `cta(brand)`

**Open-source project**
`hero(centered)` → `features(3)` → `bento` → `steps` → `timeline` → `team` →
`faq` → `cta(brand)`

**Course or info product**
`hero(cover)` → `stats` → `steps(column)` → `feature-split` → `testimonials` →
`pricing` → `faq` → `cta(banner)`

**Agency or portfolio**
`hero(split)` → `logos` → `gallery` → `feature-split` → `testimonials(single)` →
`team` → `cta(card)`

## Writing a theme

A theme is a CSS file, not a component change.

Color preset — palette primitives only:

```css
[data-theme='ocean'] {
  --primary-hue: 195;
  --layout-hue: 210;
  --primary-btn-bg: hsl(var(--primary-hue), 72%, 42%);
  --primary-btn-bg-active: hsl(var(--primary-hue), 78%, 32%);
  /* copy --gray-50 … --gray-950 from a built-in preset and shift the hue */
}
```

Style preset — shape, density and motion, never colors:

```css
[data-ln-style='compact'] {
  --ln-radius-lg: 0.5rem;
  --ln-section-py: clamp(2.5rem, 1.5rem + 3vw, 4.5rem);
  --ln-card-padding: 1rem;
  --ln-card-shadow: none;
}
```

Token groups: `--ln-c-*` (colors), `--ln-radius-*` / `--ln-border-width`
(shape), `--ln-shadow-*`, `--ln-container*` / `--ln-section-py*` / `--ln-gap*` /
`--ln-page-px` (layout), `--ln-font-*` / `--ln-h1-size` / `--ln-heading-*`
(typography), `--ln-ease` / `--ln-duration` / `--ln-lift` (motion),
`--ln-btn-*`, `--ln-card-*`. Full list with defaults:
`src/styles/landing-vars.css`.

Set defaults in the site config:

```ts
themeConfig: { defaultColorTheme: 'ocean', defaultLandingStyle: 'compact' }
```

## Extending

Custom section from primitives (stays on theme automatically):

```md
<LnSection bg="soft" width="narrow">
  <LnHeading title="…" align="center" />
  <LnGrid :cols="2"><LnCard>…</LnCard><LnCard>…</LnCard></LnGrid>
</LnSection>
```

Custom block type for the data mode:

```ts
import { registerBlockTypes } from 'vitepress-theme-neptu-landing/blocks'
registerBlockTypes({ 'my-block': MyBlock })
```

## Checklist before finishing a page

- [ ] `layout: home` and `markdownStyles: false` are set
- [ ] exactly one `hero`, and it is first
- [ ] backgrounds alternate; no two `brand`/`inverse` sections in a row
- [ ] every image has meaningful `alt`
- [ ] every `id` used by an in-page link exists
- [ ] no raw colors or `--gray-*` in custom CSS
- [ ] the page ends with a `cta`
