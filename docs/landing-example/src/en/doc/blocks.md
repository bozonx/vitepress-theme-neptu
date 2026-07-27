---
title: Blocks
description: 'Reference of every landing block: props, variants and examples'
---

# Blocks

Twenty-four blocks, one contract. Every block is a `<section>` that paints its own
surface, owns its vertical rhythm and constrains its content width — you never
write layout CSS around them.

Live examples of all of them: the [English home page](/en/) (component mode) and
the [Russian one](/ru/) (declarative mode).

## Shared props

Every block accepts these, on top of its own:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | — | Anchor id, also used by in-page links. |
| `bg` | `base \| soft \| mute \| inverse \| brand \| transparent` | `base` | Surface the section paints. |
| `width` | `narrow \| default \| wide \| full` | `default` | Max content width. |
| `padding` | `none \| sm \| md \| lg` | `md` | Vertical rhythm. |
| `align` | `start \| center` | varies | Alignment of the section header. |
| `divider` | `boolean` | `false` | Hairline above the section. |
| `noReveal` | `boolean` | `false` | Disable the scroll-reveal animation. |

Most blocks also take the header trio — `eyebrow`, `title`, `text` — and a list
of items. `title` and `text` accept inline HTML.

Alternate surfaces (`soft`, `inverse`, `brand`) re-map the text and card tokens
inside themselves, so the content stays readable without extra props.

## The catalog

| Type (YAML) | Component | Use it for |
|------|-----------|------------|
| `hero` | `LnHero` | First screen |
| `features` | `LnFeatureGrid` | Grid of capabilities |
| `feature-split` | `LnFeatureSplit` | Alternating copy + media rows |
| `bento` | `LnBento` | Tiles of uneven size |
| `carousel` | `LnCarousel` | Scrollable set of cards |
| `collection` | `LnCollection` | Resources, posts, projects and products |
| `content` | `LnContent` | Trusted rich text and editorial copy |
| `logos` | `LnLogoCloud` | Customers, sponsors, integrations |
| `stats` | `LnStats` | Key numbers |
| `steps` | `LnSteps` | "How it works" sequence |
| `testimonials` | `LnTestimonials` | Quotes and reviews |
| `pricing` | `LnPricing` | Plans, with monthly/yearly switch |
| `faq` | `LnFaq` | Accordion of answers |
| `cta` | `LnCta` | Call to action |
| `timeline` | `LnTimeline` | Roadmap or changelog |
| `team` | `LnTeam` | People |
| `gallery` | `LnGallery` | Screenshots with a lightbox |
| `code` | `LnCode` | Install commands and code samples |
| `tabs` | `LnTabs` | Compact feature scenarios |
| `compare` | `LnCompare` | Product or plan comparison |
| `newsletter` | `LnNewsletter` | Email and lead capture |
| `video` | `LnVideo` | Lazy product video |
| `embed` | `LnEmbed` | Maps, calendars and widgets |
| `banner` | `LnBanner` | Announcement strip |

## Common item shapes

```ts
// action — used by hero, cta, faq, feature-split, pricing
{ text, link?, variant?: 'brand'|'alt'|'ghost'|'outline'|'link', size?, icon?, target? }

// media — anywhere an image is accepted
'/img/shot.png' | { src?, alt?, video?, poster?, ratio?, fit?: 'cover'|'contain' }

// icon — Iconify name, emoji or image path
'fa6-solid:rocket' | '🚀' | '/img/icon.svg'
```

---

## hero — `LnHero`

| Prop | Type | Default |
|------|------|---------|
| `variant` | `split \| centered \| cover \| plain` | `split` |
| `eyebrow`, `title`, `text`, `note` | `string` | — |
| `actions` | `action[]` | — |
| `image` | media | — |
| `glow` | `boolean` | `false` |
| `overlay` | `boolean` (variant `cover`) | `true` |

Slots: `before`, `title`, `text`, `after`, `media`.

::: code-group

```md [Component]
<LnHero
  variant="split"
  glow
  eyebrow="VitePress theme"
  title='Build from <span class="ln-accent">blocks</span>'
  text="Landing, docs and pages in one place."
  note="MIT licensed"
  image="/img/demo/shot-1.svg"
  :actions="[
    { text: 'Get started', link: '/doc' },
    { text: 'GitHub', link: 'https://github.com/…', variant: 'ghost', icon: 'fa6-brands:github' },
  ]"
/>
```

```yaml [Data]
- type: hero
  variant: split
  glow: true
  eyebrow: VitePress theme
  title: Build from blocks
  text: Landing, docs and pages in one place.
  image: /img/demo/shot-1.svg
  actions:
    - { text: Get started, link: /doc }
    - { text: GitHub, link: 'https://github.com/…', variant: ghost }
```

:::

Use `cover` for a photo or video background — the copy is centered and the
overlay keeps it readable. Keep exactly one hero per page: it renders the `h1`.

## features — `LnFeatureGrid`

| Prop | Type | Default |
|------|------|---------|
| `items` | `{ icon?, image?, title, text?, link?, linkText?, badge? }[]` | — |
| `cols` | `1 \| 2 \| 3 \| 4` | `3` |
| `variant` | `card \| plain \| bordered` | `card` |
| `iconPosition` | `top \| inline` | `top` |
| `iconSize` | CSS length | `1.75rem` |

An item with `link` turns the whole card into a link.

```md
<LnFeatureGrid
  align="center"
  title="What you get"
  :cols="3"
  :items="[
    { icon: 'fa6-solid:cubes', title: 'Blocks', text: 'Twenty-four sections.' },
    { icon: '🎨', title: 'Themes', text: 'Two independent axes.' },
    { icon: '/img/icon.svg', title: 'Typed', text: 'Props and config.' },
  ]"
/>
```

## feature-split — `LnFeatureSplit`

Rows of copy and media, alternating sides.

| Prop | Type | Default |
|------|------|---------|
| `items` | feature + `bullets?: string[]`, `actions?: action[]` | — |
| `reverse` | `boolean` | `false` |
| `noAlternate` | `boolean` | `false` |
| `mediaRatio` | CSS aspect-ratio | — |

## bento — `LnBento`

Same items as `features`, plus `span` and `rowSpan` (`1` or `2`) to make a tile
take two columns or two rows.

## carousel — `LnCarousel`

| Prop | Type | Default |
|------|------|---------|
| `items` | `{ image?, icon?, badge?, eyebrow?, title?, text?, link?, linkText? }[]` | — |
| `perView` | `1 \| 2 \| 3 \| 4` | `3` |
| `arrows`, `dots` | `boolean` | `true` |
| `autoplay` | ms, `0` = off | `0` |
| `peek` | `boolean` | `false` |
| `cardVariant` | `card \| plain \| bordered` | `card` |

Carousel items use the shared `CardItem` contract and support `tags`, `meta`,
`actions`, `target` and `rel` in addition to the fields below.

CSS scroll-snap under the hood: it scrolls by touch and keyboard without JS.
Autoplay stops on hover and focus and never starts under
`prefers-reduced-motion`. Use the `slide` scoped slot for custom slides:

```md
<LnCarousel :items="items">
  <template #slide="{ item }">
    <MyCustomCard v-bind="item" />
  </template>
</LnCarousel>
```

## logos — `LnLogoCloud`

| Prop | Type | Default |
|------|------|---------|
| `items` | `{ src, alt?, link?, height? }[]` | — |
| `variant` | `row \| grid \| marquee` | `row` |
| `monochrome` | `boolean` | `true` |
| `speed` | seconds (marquee) | `32` |
| `logoHeight` | CSS length | `2rem` |

## stats — `LnStats`

`items: { value, label?, text?, icon? }[]`, `cols` 2–4,
`variant: plain | card | divided`.

Items may also define `trend`, `trendDirection`, `source`, `note` and `link`.

## steps — `LnSteps`

`items: { title, text?, icon?, image?, label? }[]`,
`variant: row | column`, `connector: boolean`.
The marker shows the item's `label`, its `icon`, or the 1-based index.

## testimonials — `LnTestimonials`

`items: { text, author?, role?, avatar?, logo?, rating?, link? }[]`,
`cols` 1–3, `variant: grid | masonry | single`.

## pricing — `LnPricing`

| Prop | Type | Default |
|------|------|---------|
| `items` | plan (below) | — |
| `cols` | `2 \| 3 \| 4` | `3` |
| `monthlyLabel`, `yearlyLabel` | `string` | `Monthly` / `Yearly` |
| `note` | `string` | — |
| `currency`, `billingSuffix`, `discountLabel` | `string` | — |
| `toggle` | `{ monthlyLabel?, yearlyLabel?, discountLabel? }` | — |

```ts
// plan
{
  title, text?, badge?, featured?,
  price, period?,          // shown on the monthly tab
  priceYearly?, periodYearly?,   // adding this enables the period switch
  features: (string | { text, included?: false })[],
  action: { text, link, variant? },
}
```

## faq — `LnFaq`

`items: { question, answer, open? }[]`, `cols` 1–2, `exclusive: boolean`,
`actions: action[]`. Built on `<details>`: it works without JavaScript and stays
indexable. `question` and `answer` accept HTML.

## cta — `LnCta`

`variant: banner | card | split`, plus `title`, `text`, `note`, `actions`,
`image`. On `bg="brand"` the button colors are inverted automatically.

## timeline — `LnTimeline`

`items: { label?, title, text?, icon?, state?: 'done' | 'active' | 'planned' }[]`,
`variant: stacked | side`.

## team — `LnTeam`

`items: { name, role?, text?, avatar?, links?: { icon?, text?, link }[] }[]`,
`cols` 2–4, `variant: card | plain`, `avatarShape: circle | rounded`.
Use `groups: { id, title?, text? }[]` with `item.group`; members also accept
`department` and `meta: string[]`.

## gallery — `LnGallery`

`items: { src, alt?, caption?, link?, ratio? }[]`, `cols` 2–4,
`variant: grid | masonry`, `lightbox: boolean`, `ratio`.
Items also accept `title`, `text`, `tags` and `actions`, so the same block can
serve as a portfolio or case-study grid. The lightbox is a native `<dialog>`.

## collection — `LnCollection`

Generic resource cards for posts, projects, products and events. Items use
`CardItem`: `title`, `text`, `image`, `icon`, `badge`, `tags`, `meta`, `date`,
`link`, `linkText`, `actions`. Props: `cols` 1–4, `layout: grid | list`,
`variant: card | plain | bordered`, `imageRatio`, and section-level `actions`.

## content — `LnContent`

Trusted editorial content with `variant: prose | split | card`, `content`,
`image`, `actions` and `reverse`. `content` is rendered as HTML; sanitize input
from external CMS users before it reaches the page.

## embed — `LnEmbed`

Lazy iframe for maps, calendars, demos and booking widgets. Props: `src`,
`embedTitle`, `caption`, `ratio`, `loading`, `allow`, `sandbox`, `actions`.

## code, tabs, compare, newsletter, video, banner

- `code`: samples `{ label?, lang?, code, html?, caption? }`, copy and chrome controls.
- `tabs`: `CardItem`-like tabs, `variant: top | side`, `initial`, `mediaRatio`.
- `compare`: `columns`, positional `rows[].values`, `rowsLabel`, `stickyHead`.
- `newsletter`: native or AJAX form with extra fields and consent text.
- `video`: click-to-load YouTube/Vimeo or native `src` player.
- `banner`: `placement: inline | top | bottom`, `sticky`, dismiss state, and
  explicit shared `width`, `padding`, `noReveal` support.

---

## Primitives

Blocks are assembled from these; use them directly for custom sections so your
own markup inherits the same tokens.

| Component | Purpose |
|-----------|---------|
| `LnPage` | Root wrapper of a landing page |
| `LnSection` | Surface + rhythm + width |
| `LnContainer` | Width constraint outside a section |
| `LnGrid` | Responsive grid (`cols`, `gap`) |
| `LnHeading` | Eyebrow + title + lead |
| `LnButton`, `LnButtonGroup` | Buttons and action rows |
| `LnCard` | Card surface, clickable when given `link` |
| `LnMedia` | Image or video frame with a ratio |
| `LnIcon` | Iconify name, emoji or image |
| `LnReveal` | Scroll-reveal wrapper |

```md
<LnSection bg="soft" width="narrow" padding="lg">
  <LnHeading title="A custom section" text="Built from primitives." align="center" />
  <LnGrid :cols="2">
    <LnCard>Anything you like</LnCard>
    <LnCard>Still on theme</LnCard>
  </LnGrid>
</LnSection>
```
