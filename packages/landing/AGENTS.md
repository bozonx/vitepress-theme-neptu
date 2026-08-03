# Neptu Landing authoring guide

## Model

A page is an ordered list of full-width blocks. Each block owns its surface,
spacing and content width. Use `layout: landing` with `blocks:` for data mode,
or `layout: home` with `<LnPage>` for component mode.

Theme axes are independent:

- `data-theme`: color palette;
- `data-style`: shape, density, typography and motion.

Production sites normally choose one palette and one style in `themeConfig`.
The two pickers are demo controls, off unless `colorPicker: true` /
`stylePicker: true`. Style presets are shared with the blog theme.

## Page rules

1. Use exactly one `hero`; only `banner` may precede it.
2. Alternate `base` and `soft`; reserve `brand`/`inverse` for emphasis.
3. End marketing pages with a clear CTA.
4. Give every image meaningful `alt` text and every section a unique `id`.
5. Use only `--ln-*` tokens in custom CSS.
6. Treat inline HTML as trusted author content; sanitize external CMS input.

## Shared block props

`id`, `bg`, `width`, `padding`, `align`, `divider`, `reveal`.
Most blocks also accept `eyebrow`, `title`, `text`.
`noReveal` is a deprecated alias for `reveal: false`.

Every item in `actions` requires both `text` and `link`. Use the `LnButton`
primitive in component mode for event-handling buttons without a destination.

Card-based blocks share `CardItem`: `title`, `text`, `eyebrow`, `icon`,
`image`, `badge`, `tags`, `meta`, `date`, `link`, `linkText`, `actions`.

## Blocks

| Need | Block |
|---|---|
| First screen | `hero` |
| Capabilities | `features`, `feature-split`, `bento`, `tabs` |
| Resources, posts, projects, products | `collection`, `carousel` |
| Trusted rich copy | `content` |
| Screenshots and case studies | `gallery` |
| Logos and metrics | `logos`, `stats` |
| Process or roadmap | `steps`, `timeline` |
| Code or product demo | `code`, `video`, `embed` |
| Proof and people | `testimonials`, `team` |
| Commercial conversion | `pricing`, `compare`, `faq`, `newsletter`, `cta` |
| Announcement | `banner` |

All types:
`hero`, `features`, `feature-split`, `bento`, `tabs`, `carousel`, `collection`,
`content`, `logos`, `stats`, `steps`, `code`, `video`, `embed`, `compare`,
`testimonials`, `pricing`, `faq`, `cta`, `newsletter`, `timeline`, `team`,
`gallery`, `banner`.

Authoritative contracts: `src/blocks/types.ts` and
`schema/landing-blocks.schema.json`.

## Data mode

```yaml
---
layout: landing
blocks:
  - type: hero
    title: Ship faster
  - type: collection
    title: Latest resources
    items:
      - title: Guide
        link: /guide
  - type: cta
    bg: brand
    title: Ready?
    actions:
      - { text: Get started, link: /docs }
---
```

Run `npx neptu-landing src`. Registered custom types must be allowed explicitly:

```sh
npx neptu-landing src --allow-type=my-block
```

## Component mode and extension

Blocks and primitives are global components:

```md
<LnPage>
  <LnHero title="Ship faster" />
  <LnSection bg="soft"><LnCard>Custom content</LnCard></LnSection>
</LnPage>
```

Register a data-mode block before the app mounts:

```ts
registerBlockTypes({ 'my-block': MyBlock })
```

## Styling

Choose production defaults:

```ts
themeConfig: {
  defaultColorTheme: 'teal',
  defaultStylePreset: 'sharp',
}
```

Override semantic tokens for custom styling:

```css
:root {
  --ln-container: 1200px;
  --ln-radius-lg: 0.5rem;
  --ln-font-display: 'Manrope', sans-serif;
}
```

Full token defaults: `src/styles/landing-vars.css`.
