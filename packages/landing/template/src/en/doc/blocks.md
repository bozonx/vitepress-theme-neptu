---
title: Blocks
description: 'Reference of every landing block: props, variants and examples'
---

# Blocks

Twenty-four blocks, one contract. Every block is a `<section>` that paints its own
surface, owns its vertical rhythm and constrains its content width — you never
write layout CSS around them.

The home page of this template is a working example (component mode).

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
| `noReveal` | `boolean` | `false` | **Deprecated** — use `reveal: false` instead. |

Most blocks also take the header trio — `eyebrow`, `title`, `text` — and a list
of items. `title` and `text` accept inline HTML.

Alternate surfaces (`soft`, `inverse`, `brand`) re-map the text and card tokens
inside themselves, so the content stays readable without extra props.

### Deprecated props

| Old prop | Replacement | Blocks |
|---------|-------------|-------|
| `noReveal` | `reveal: false` | All |
| `noAlternate` | `alternate: false` | `feature-split` |
| `ratio` | `mediaRatio` | `gallery`, `video`, `embed`, `tabs` |
| `imageRatio` | `mediaRatio` | `collection` |
| `monthlyLabel` | `toggle.monthlyLabel` | `pricing` |
| `yearlyLabel` | `toggle.yearlyLabel` | `pricing` |
| `discountLabel` | `toggle.discountLabel` | `pricing` |

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
| `embed` | `LnEmbed` | Iframe embed (maps, calendars) |
| `banner` | `LnBanner` | Announcement bar |

## Page rules

1. Use exactly one `hero`; only `banner` may precede it.
2. Alternate `base` and `soft`; reserve `brand`/`inverse` for emphasis.
3. End marketing pages with a clear CTA.
4. Give every image meaningful `alt` text and every section a unique `id`.

Authoritative contracts: the package's `src/blocks/types.ts` and
`schema/landing-blocks.schema.json`.

## Data mode

The same blocks can be described in frontmatter and rendered with a single
component. Content stays separate from markup, which makes translation, CMS
editing and AI generation straightforward:

```md
---
layout: landing
blocks:
  - type: hero
    title: Everything in YAML
    actions: [{ text: Get started, link: /en/doc }]
  - type: features
    cols: 3
    items:
      - { icon: 🚀, title: Fast, text: Static output. }
  - type: cta
    bg: brand
    title: Ready?
    actions: [{ text: Read the docs, link: /en/doc }]
---
```

Built-in blocks are schema-validated by `npm run validate:blocks`. Custom types
registered with `registerBlockTypes` are intentionally accepted by the schema;
the validation command rejects unknown types unless explicitly allowed with
`--allow-type=my-block`.

Block actions always navigate and therefore require both `text` and `link`.
For an event-handling button without a URL, compose a custom section with the
`LnButton` primitive instead.

## Custom blocks

Register your own component under an existing block type with
`registerBlockTypes()`:

```ts
// .vitepress/theme/index.ts
import LandingTheme from 'vitepress-theme-neptu-landing'
import { registerBlockTypes } from 'vitepress-theme-neptu-landing/blocks'
import MyBlock from './MyBlock.vue'

registerBlockTypes({ 'my-block': MyBlock })

export default LandingTheme
```

Every block exposes slots for its parts, so you can override pieces without
replacing the whole component.
