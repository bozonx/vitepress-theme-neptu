---
title: Page as data
description: 'Describe a landing page in YAML and render it with a single component'
---

# Page as data

A landing page can be written as a `blocks:` array in frontmatter instead of
components. One renderer turns it into the same output:

```md
---
layout: landing
blocks:
  - type: hero
    variant: centered
    title: Everything in YAML
    text: No Vue in this file.
    actions:
      - { text: Get started, link: /doc }

  - type: features
    cols: 3
    items:
      - { icon: 🚀, title: Fast, text: Static output. }
      - { icon: 🎨, title: Themeable, text: Two theme axes. }
      - { icon: 🧩, title: Composable, text: Twenty-four blocks. }

  - type: cta
    bg: brand
    title: Ready?
    actions:
      - { text: Read the docs, link: /doc }
---

```

The [Russian home page](/ru/) of this site is written exactly like that — open
its source next to the [English one](/en/) to compare the two modes.

`type` selects the block; every other key is passed to it as a prop. The names
and the values are identical to the component mode, so the
[block reference](./blocks) applies to both.

## Why bother

- **Translations.** Content lives in data, not in markup, so a translator copies
  a YAML file instead of editing Vue.
- **CMS.** Block types map cleanly onto a CMS collection with variable types —
  the path to a visual page builder for non-technical editors.
- **Generation.** A script or an AI agent produces a validated YAML file far
  more reliably than a Vue template.

## Mixing modes

`LandingRenderer` accepts an explicit list, so you can compute blocks and still
add hand-written sections around them:

```md
<script setup>
const blocks = [{ type: 'hero', title: 'Computed' }]
</script>

<LandingRenderer :blocks="blocks">
  <template #before>
    <LnAnnouncement />
  </template>

  <LnSection bg="soft">Custom section after the generated ones</LnSection>
</LandingRenderer>
```

## Custom block types

Register your own components — or replace a built-in type — before the renderer
mounts:

```ts
// .vitepress/theme/index.ts
import LandingTheme from 'vitepress-theme-neptu-landing'
import { registerBlockTypes } from 'vitepress-theme-neptu-landing/blocks'
import PricingCalculator from './PricingCalculator.vue'

registerBlockTypes({ 'pricing-calculator': PricingCalculator })

export default LandingTheme
```

Then use `- type: pricing-calculator` in any page.

Registration rejects duplicate names. Replacing a built-in or an existing
custom type must be deliberate:

```ts
registerBlockTypes({ pricing: CustomPricing }, { override: true })
```

## Validation

An unknown `type` renders a visible development placeholder. The CI validator
rejects unknown properties, duplicate ids, invalid hero order and unknown
types. Allow every registered custom type explicitly:

```sh
npx neptu-landing src --allow-type=pricing-calculator
```

The CLI accepts one or more Markdown files or directories and defaults to the
current directory.
