---
layout: home
markdownStyles: false
---

<script setup lang="ts">
import { useData } from 'vitepress'

const { localeIndex } = useData()
const L = `/${localeIndex.value}`

const heroActions = [
  { text: 'Get started', link: `${L}/doc`, variant: 'brand' },
  { text: 'All blocks', link: `${L}/doc/blocks`, variant: 'alt' },
  { text: 'GitHub', link: 'https://github.com/bozonx/vitepress-theme-neptu-blog', variant: 'ghost', icon: 'fa6-brands:github' },
]

const logos = [1, 2, 3, 4, 5, 6].map((i) => ({ src: `/img/demo/logo-${i}.svg`, alt: `Company ${i}` }))

const codeSamples = [
  { label: 'npm', lang: 'bash', code: 'npm i vitepress-theme-neptu-landing' },
  { label: 'pnpm', lang: 'bash', code: 'pnpm add vitepress-theme-neptu-landing' },
  { label: 'yarn', lang: 'bash', code: 'yarn add vitepress-theme-neptu-landing' },
  {
    label: 'theme/index.ts',
    lang: 'ts',
    code: "import LandingTheme from 'vitepress-theme-neptu-landing'\n\nexport default LandingTheme",
    caption: 'That is the whole setup — every block is registered globally.',
  },
]

const tabItems = [
  {
    label: 'YAML',
    icon: 'fa6-solid:file-code',
    title: 'The page as data',
    text: 'A blocks array in the frontmatter, validated against a JSON schema — broken markup is not reachable.',
    image: '/img/demo/shot-1.svg',
    bullets: ['Checked on CI by <code>validate:blocks</code>', 'The same format AI agents read'],
  },
  {
    label: 'Components',
    icon: 'fa6-solid:cubes',
    title: 'The page as markup',
    text: 'The same blocks are global components — no imports, no layout CSS of your own.',
    image: '/img/demo/shot-2.svg',
    bullets: ['Slots on every block', 'Custom sections from the primitives'],
  },
  {
    label: 'Your own theme',
    icon: 'fa6-solid:palette',
    title: 'The theme as one CSS file',
    text: 'Color and shape are independent axes, both switched by an attribute on <html>.',
    image: '/img/demo/shot-3.svg',
    bullets: ['Only <code>--ln-*</code> tokens', 'No changes inside the blocks'],
  },
]

const compareColumns = [
  { title: 'Free', text: 'personal sites' },
  { title: 'Team', text: 'up to 10 people', featured: true, badge: 'Popular' },
  { title: 'Company', text: 'no limits' },
]

const compareRows = [
  { group: 'Essentials', label: 'Landing blocks', values: ['24', '24', '24'] },
  { group: 'Essentials', label: 'Color palettes', values: ['8', '8', 'Custom'] },
  { group: 'Essentials', label: 'Style presets', values: ['5', '5', 'Custom'] },
  { group: 'Support', label: 'GitHub issues', values: [true, true, true] },
  { group: 'Support', label: 'Private channel', values: [false, true, true] },
  { group: 'Support', label: 'Migration help', values: [false, false, true] },
]

const features = [
  { icon: 'fa6-solid:cubes', title: 'Blocks, not markup', text: 'Twenty-four production-ready sections. Compose a page out of them instead of hand-writing layout CSS.' },
  { icon: 'fa6-solid:palette', title: 'Two theme axes', text: 'Color and style are independent. Eight palettes × five style presets, switchable at runtime.' },
  { icon: 'fa6-solid:file-code', title: 'YAML or Vue', text: 'Author pages as components, or describe them declaratively in frontmatter and let the renderer do the rest.' },
  { icon: 'fa6-solid:magnifying-glass', title: 'SEO-first', text: 'Open Graph, JSON-LD, hreflang, canonical links and a sitemap — inherited from the blog theme.' },
  { icon: 'fa6-solid:language', title: 'i18n built in', text: 'Locale folders with YAML config layers, template substitution and automatic hreflang.' },
  { icon: 'fa6-solid:robot', title: 'Agent-friendly', text: 'One prop contract across every block, a JSON schema for the YAML mode and an AGENTS.md with recipes.' },
]

const bento = [
  { icon: 'fa6-solid:bolt', title: 'Zero runtime deps', text: 'The carousel is CSS scroll-snap, the accordion is <code>&lt;details&gt;</code>, the lightbox is <code>&lt;dialog&gt;</code>.', span: 2 },
  { icon: 'fa6-solid:universal-access', title: 'Accessible by default', text: 'Keyboard navigation, focus rings and reduced-motion support in every interactive block.' },
  { icon: 'fa6-solid:mobile-screen', title: 'Responsive', text: 'Fluid type and spacing driven by clamp() — no breakpoint soup.' },
  { icon: 'fa6-solid:paintbrush', title: 'Themeable to the last radius', text: 'Blocks read only --ln-* tokens. Write ~30 variables and you have a new theme.', span: 2 },
]

const splitItems = [
  {
    eyebrow: 'Authoring',
    title: 'Compose in markdown',
    text: 'Blocks are registered globally — no import block, no build step. Drop a component in and pass it data.',
    bullets: ['Same props for every block', 'Slots to override any part', 'Works in every locale folder'],
    image: '/img/demo/shot-1.svg',
    actions: [{ text: 'See the API', link: `${L}/doc/blocks`, variant: 'alt' }],
  },
  {
    eyebrow: 'Constructor',
    title: 'Or describe the page in YAML',
    text: 'Put a <code>blocks:</code> array in frontmatter and render it with a single component. Content stays separate from markup, which makes translation and CMS editing trivial.',
    bullets: ['One renderer, twenty-four types', 'Validated by a JSON schema', 'Ready for a CMS admin UI'],
    image: '/img/demo/shot-2.svg',
    actions: [{ text: 'YAML example', link: '/ru/', variant: 'alt' }],
  },
]

const stats = [
  { value: '24', label: 'Blocks', text: 'Plus 11 primitives' },
  { value: '8 × 5', label: 'Theme combos', text: 'Color × style presets' },
  { value: '0', label: 'Runtime deps', text: 'Beyond Vue and VitePress' },
  { value: '100%', label: 'Typed', text: 'Props, config and blocks' },
]

const steps = [
  { title: 'Install the theme', text: 'Add the package and point your VitePress theme entry at it.' },
  { title: 'Compose the page', text: 'Pick blocks, fill them with your copy — in markdown or in YAML.' },
  { title: 'Choose a theme', text: 'Set a color and a style preset, or write your own file of variables.' },
  { title: 'Ship', text: 'Static output, search included, SEO tags generated for you.' },
]

const carouselItems = [1, 2, 3, 4, 5, 6].map((i) => ({
  image: `/img/demo/shot-${i}.svg`,
  badge: i % 2 ? 'Template' : 'Example',
  title: `Landing preset ${i}`,
  text: 'Scroll-snap carousel: swipe on touch, arrows and dots on desktop, keyboard accessible.',
  linkText: 'Open preset',
  link: `${L}/doc/blocks`,
}))

const testimonials = [
  { text: 'We replaced 900 lines of bespoke landing CSS with eleven blocks and a token file. The redesign took an afternoon.', author: 'Anna Petrova', role: 'Frontend lead, Globex', avatar: '/img/demo/avatar-1.svg', rating: 5 },
  { text: 'The YAML mode is what sold it. Our content team edits the home page without touching a single Vue file.', author: 'Mark Ivanov', role: 'Product, Initech', avatar: '/img/demo/avatar-2.svg', rating: 5 },
  { text: 'Docs and landing in one project, one theme, one palette. Exactly what an open-source project needs.', author: 'Lena Sorokina', role: 'Maintainer, Umbra', avatar: '/img/demo/avatar-3.svg', rating: 5 },
]

const plans = [
  {
    title: 'Open source', price: '$0', period: 'forever', text: 'Everything in the theme, MIT licensed.',
    features: ['All 24 blocks', 'All theme presets', 'Docs + landing + pages', 'Community support'],
    action: { text: 'Start building', link: `${L}/doc` },
  },
  {
    title: 'Studio', price: '$19', priceYearly: '$190', period: '/ mo', periodYearly: '/ yr',
    text: 'For agencies shipping client sites.', featured: true, badge: 'Popular',
    features: ['Everything in Open source', 'Premium block presets', 'Figma token kit', 'Priority issues'],
    action: { text: 'Choose Studio', link: '#pricing' },
  },
  {
    title: 'Enterprise', price: 'Custom', text: 'Design system integration and a support SLA.',
    features: ['Everything in Studio', 'Custom blocks', 'Design review', { text: 'On-prem CMS', included: false }],
    action: { text: 'Contact us', link: `${L}/page/links`, variant: 'alt' },
  },
]

const faq = [
  { question: 'Do I have to use the documentation part?', answer: 'No. Drop the <code>doc/</code> folder and you have a plain landing with extra pages. Add it back whenever the project needs docs.', open: true },
  { question: 'Can I write my own theme?', answer: 'Yes — a theme is a CSS file. A color preset defines palette primitives under <code>[data-theme="id"]</code>; a style preset defines shape and density tokens under <code>[data-ln-style="id"]</code>. Blocks need no changes.' },
  { question: 'Can I override a single block?', answer: 'Every block exposes slots for its parts, and you can register your own component under an existing block type with <code>registerBlockTypes()</code>.' },
  { question: 'Does it work without JavaScript?', answer: 'The page renders and scrolls fine: the accordion, the carousel and all layout are pure CSS. Only the reveal animation, the pickers and the lightbox need JS.' },
]

const timeline = [
  { label: 'Shipped', state: 'done', title: 'Block library v1', text: 'Twenty-four blocks, eleven primitives, two theme axes.' },
  { label: 'Shipped', state: 'done', title: 'Declarative renderer', text: 'Frontmatter-driven pages with schema validation.' },
  { label: 'In progress', state: 'active', title: 'CMS integration', text: 'Mapping block types to a Decap CMS admin UI.' },
  { label: 'Planned', state: 'planned', title: 'More blocks', text: 'Comparison table, tabs showcase, contact form, blog teaser.' },
]

const team = [
  { name: 'Ivan Kozyrin', role: 'Author', avatar: '/img/demo/avatar-4.svg', links: [{ icon: 'fa6-brands:github', link: 'https://github.com/bozonx' }] },
  { name: 'Anna Petrova', role: 'Design', avatar: '/img/demo/avatar-1.svg' },
  { name: 'Mark Ivanov', role: 'Docs', avatar: '/img/demo/avatar-2.svg' },
  { name: 'Lena Sorokina', role: 'Community', avatar: '/img/demo/avatar-3.svg' },
]

const gallery = [1, 2, 3, 4, 5, 6].map((i) => ({
  src: `/img/demo/shot-${i}.svg`,
  alt: `Screenshot ${i}`,
  caption: `Block gallery — screen ${i}`,
}))
</script>

<LnPage>

<LnBanner
  bg="brand"
  badge="v0.20"
  icon="fa6-solid:bolt"
  text="Version 0.20 is out — six new blocks and a round of accessibility fixes"
  :link="`${L}/doc/blocks`"
  link-text="See what changed"
  dismissible
  storage-key="ln-demo-banner-0-20"
/>

<LnHero
  variant="split"
  padding="lg"
  glow
  eyebrow="VitePress landing theme"
  title='Build the whole site from <span class="ln-accent">blocks</span>'
  text="Landing on the home page, documentation next to it, one theme across both. Switch the palette and the style preset right in the nav bar."
  note="MIT licensed · works with VitePress 2"
  :actions="heroActions"
  image="/img/demo/shot-1.svg"
/>

<LnCode
  bg="soft"
  align="center"
  eyebrow="Install"
  title="One command, then only content"
  text="No build configuration, no plugin wiring."
  :items="codeSamples"
/>

<LnContent
  eyebrow="Editorial content"
  title="A flexible section for the copy between showcases"
  content="<p>Use trusted HTML or a normal slot for long-form explanations, policy notes and mission statements.</p>"
  :actions="[{ text: 'Read the guide', link: `${L}/doc`, variant: 'alt' }]"
/>

<LnCollection
  bg="soft"
  eyebrow="Resources"
  title="Cards for more than features"
  :items="[
    { title: 'Getting started', text: 'A short guide.', date: '2026-07-27', tags: ['Guide'], link: `${L}/doc`, linkText: 'Read' },
    { title: 'Block reference', text: 'Every prop and variant.', meta: ['24 blocks'], link: `${L}/doc/blocks`, linkText: 'Browse' },
    { title: 'Theming', text: 'Choose one production preset.', tags: ['CSS', 'Tokens'], actions: [{ text: 'Open', link: `${L}/doc/theming` }] },
  ]"
/>

<LnEmbed
  eyebrow="Embed"
  title="Maps, calendars and widgets"
  text="The iframe stays lazy and receives an accessible title."
  :src="`${L}/doc/about`"
  embed-title="Embedded documentation example"
  ratio="21/9"
/>

<LnLogoCloud bg="soft" variant="marquee" eyebrow="Trusted by" :items="logos" />

<LnFeatureGrid
  id="features"
  align="center"
  eyebrow="What you get"
  title="Everything a project site needs"
  text="Each block takes the same section props — background, width, padding, alignment — so pages stay consistent whatever you compose."
  :items="features"
  :cols="3"
/>

<LnBento
  bg="soft"
  align="center"
  eyebrow="Under the hood"
  title="Boring technology, on purpose"
  :items="bento"
  :cols="3"
/>

<LnFeatureSplit
  id="authoring"
  eyebrow="Two ways to author"
  title="Components or data — pick per page"
  :items="splitItems"
/>

<LnTabs
  id="authoring-tabs"
  bg="soft"
  align="center"
  eyebrow="How it works"
  title="One set of data, three ways to work"
  :items="tabItems"
/>

<LnStats bg="inverse" :items="stats" :cols="4" />

<LnSteps
  id="how"
  align="center"
  eyebrow="How it works"
  title="Four steps to a finished site"
  :items="steps"
  variant="row"
/>

<LnCarousel
  bg="soft"
  eyebrow="Presets"
  title="Start from a ready-made page"
  text="Swipe, drag, or use the arrows."
  :items="carouselItems"
  :per-view="3"
/>

<LnVideo
  align="center"
  eyebrow="Demo"
  title="Three minutes on building a page"
  text="Nothing is loaded from YouTube until you press play — no third-party cookies on the first visit."
  youtube="dQw4w9WgXcQ"
  poster="/img/demo/shot-3.svg"
  caption="Building a landing page from scratch"
/>

<LnTestimonials
  id="testimonials"
  align="center"
  eyebrow="Social proof"
  title="What people say"
  :items="testimonials"
  :cols="3"
/>

<LnPricing
  id="pricing"
  bg="soft"
  align="center"
  eyebrow="Pricing"
  title="Simple plans"
  text="Everything here is open source; the paid tiers only demonstrate the block."
  :items="plans"
  note="Prices are fictional — this is a demo page."
/>

<LnCompare
  id="compare"
  bg="soft"
  align="center"
  eyebrow="Compare"
  title="What each plan includes"
  rows-label="Features"
  :columns="compareColumns"
  :rows="compareRows"
  note="Every plan ships the sources under the MIT license."
/>

<LnGallery
  id="gallery"
  eyebrow="Gallery"
  title="Screens from the template"
  :items="gallery"
  :cols="3"
/>

<LnTimeline
  bg="soft"
  eyebrow="Roadmap"
  title="Where this is going"
  :items="timeline"
  variant="side"
/>

<LnTeam
  align="center"
  eyebrow="Team"
  title="People behind the theme"
  :items="team"
  :cols="4"
/>

<LnFaq
  id="faq"
  bg="soft"
  eyebrow="FAQ"
  title="Frequently asked"
  :items="faq"
  exclusive
  :actions="[{ text: 'Read the docs', link: `${L}/doc` }]"
/>

<LnNewsletter
  id="subscribe"
  bg="soft"
  align="center"
  eyebrow="Newsletter"
  title="One email when new blocks land"
  text="Once a month: what shipped and how to use it."
  action="https://example.com/subscribe"
  submit-text="Subscribe"
  consent="I agree to the <a href='page/links'>terms</a>"
  note="Unsubscribe in one click."
/>

<LnCta
  variant="banner"
  bg="brand"
  title="Ready to build your landing?"
  text="Install the theme, copy this page and replace the copy with your own."
  note="No build configuration required."
  :actions="[
    { text: 'Get started', link: `${L}/doc` },
    { text: 'Browse blocks', link: `${L}/doc/blocks`, variant: 'alt' },
  ]"
/>

</LnPage>
