---
layout: home
markdownStyles: false
---

<script setup lang="ts">
import { useData } from 'vitepress'

const { localeIndex } = useData()
const L = `/${localeIndex.value}`

// Page data lives in this script block so the markup stays clean. Swap these
// values for your own copy and images. For a data-driven version, replace the
// components below with a `blocks:` array in frontmatter (see doc/blocks.md).

const heroActions = [
  { text: 'Get started', link: `${L}/doc`, variant: 'brand' },
  { text: 'GitHub', link: 'https://github.com/bozonx/vitepress-theme-neptu', variant: 'alt' },
]

const features = [
  { icon: 'fa6-solid:cubes', title: 'Blocks, not markup', text: 'Twenty-four production-ready sections. Compose a page out of them instead of hand-writing layout CSS.' },
  { icon: 'fa6-solid:palette', title: 'Two theme axes', text: 'Color and style are independent. Eight palettes × five style presets, switchable at runtime.' },
  { icon: 'fa6-solid:file-code', title: 'YAML or Vue', text: 'Author pages as components, or describe them declaratively in frontmatter and let the renderer do the rest.' },
  { icon: 'fa6-solid:magnifying-glass', title: 'SEO-first', text: 'Open Graph, JSON-LD, hreflang, canonical links and a sitemap — inherited from the blog theme.' },
  { icon: 'fa6-solid:language', title: 'i18n built in', text: 'Locale folders with YAML config layers, template substitution and automatic hreflang.' },
  { icon: 'fa6-solid:robot', title: 'Agent-friendly', text: 'One prop contract across every block, a JSON schema for the YAML mode and an AGENTS.md with recipes.' },
]

const steps = [
  { title: 'Install the theme', text: 'Add the package and point your VitePress theme entry at it.' },
  { title: 'Compose the page', text: 'Pick blocks, fill them with your copy — in markdown or in YAML.' },
  { title: 'Choose a theme', text: 'Set a color and a style preset, or write your own file of variables.' },
  { title: 'Ship', text: 'Static output, SEO tags generated for you.' },
]

const faq = [
  { question: 'Do I have to use the documentation part?', answer: 'No. Drop the <code>doc/</code> folder and you have a plain landing with extra pages. Add it back whenever the project needs docs.' },
  { question: 'Can I write my own theme?', answer: 'Yes — a theme is a CSS file. A color preset defines palette primitives under <code>[data-theme="id"]</code>; a style preset defines shape and density tokens under <code>[data-ln-style="id"]</code>. Blocks need no changes.' },
  { question: 'Does it work without JavaScript?', answer: 'The page renders and scrolls fine: the accordion, the carousel and all layout are pure CSS. Only the reveal animation, the pickers and the lightbox need JS.' },
]
</script>

<LnPage>

<LnHero
  variant="split"
  padding="lg"
  glow
  eyebrow="VitePress landing theme"
  title='Build the whole site from <span class="ln-accent">blocks</span>'
  text="Landing on the home page, documentation next to it, one theme across both."
  note="MIT licensed · works with VitePress 2"
  :actions="heroActions"
  image="/img/hero.svg"
/>

<LnFeatureGrid
  id="features"
  align="center"
  eyebrow="What you get"
  title="Everything a project site needs"
  text="Each block takes the same section props — background, width, padding, alignment — so pages stay consistent whatever you compose."
  :items="features"
  :cols="3"
/>

<LnSteps
  id="how"
  bg="soft"
  align="center"
  eyebrow="How it works"
  title="Four steps to a finished site"
  :items="steps"
  variant="row"
/>

<LnFaq
  id="faq"
  align="center"
  eyebrow="FAQ"
  title="Frequently asked"
  :items="faq"
/>

<LnCta
  variant="banner"
  bg="brand"
  title="Ready to build your landing?"
  text="Install the theme, copy this page and replace the copy with your own."
  :actions="[
    { text: 'Get started', link: `${L}/doc` },
    { text: 'Browse blocks', link: `${L}/doc/blocks`, variant: 'alt' },
  ]"
/>

</LnPage>
