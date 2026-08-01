---
title: Mermaid Diagrams and KaTeX Formulas
description: Opt-in recipes for adding Mermaid and KaTeX to a Neptu blog without increasing every site's bundle.
date: 2026-07-31
authorId: ivan-k
tags: [guide, advanced]
translations:
  ru: /ru/post/mermaid-and-katex
---

# Mermaid Diagrams and KaTeX Formulas

Mermaid and KaTeX are opt-in Markdown integrations. The theme preserves your
VitePress `markdown.config`, so both can be added without changing Neptu.

## Mermaid

Install the renderer and Mermaid itself:

```bash
pnpm add -D vitepress-plugin-mermaid mermaid
```

In `.vitepress/config.ts`, wrap the already resolved Neptu config:

```ts
import { withMermaid } from 'vitepress-plugin-mermaid'
import { defineBlogConfig } from 'vitepress-theme-neptu/configs'

export default async () => {
  const config = {
    // your existing Neptu config
  }

  return withMermaid(await defineBlogConfig(config))
}
```

Then use a normal fenced block:

````md
```mermaid
flowchart LR
  Draft --> Review --> Publish
```
````

`withMermaid` must remain the outer wrapper so it can add its VitePress hooks.
See the [plugin repository](https://github.com/emersonbottero/vitepress-plugin-mermaid)
for Mermaid configuration and version compatibility.

## KaTeX

Install the Markdown-it plugin and KaTeX:

```bash
pnpm add -D @mdit/plugin-katex katex
```

Register it through the existing VitePress Markdown hook:

```ts
import { katex } from '@mdit/plugin-katex'

const config = {
  markdown: {
    config(md) {
      md.use(katex)
    },
  },
  // the rest of your Neptu config
}
```

Import the required stylesheet once in `.vitepress/theme/index.ts`:

```ts
import 'katex/dist/katex.min.css'
```

Inline and display formulas then use dollar delimiters:

```md
Euler's identity is $e^{i\pi}+1=0$.

$$
x = {-b \pm \sqrt{b^2-4ac} \over 2a}
$$
```

The full-content feed renderer intentionally handles safe standard Markdown,
not arbitrary VitePress plugins or Vue components. Mermaid blocks and KaTeX
formulas therefore remain source text in feeds unless you provide a custom feed
transformer.

The KaTeX setup follows the
[`@mdit/plugin-katex` documentation](https://mdit-plugins.github.io/katex.html).
If KaTeX is not a requirement, VitePress also documents a built-in opt-in
[MathJax setup](https://vitepress.dev/guide/markdown#math-equations).
