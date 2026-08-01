---
layout: home
heroImg: /img/sidebar-logo.jpg
---
<script setup>
import {
  HomeHero,
  HomeFeaturedPosts,
  HomeTags,
  HomePopularPosts,
  UtilPageContent,
} from 'vitepress-theme-neptu/components'
import { useData } from 'vitepress'

const { theme, frontmatter } = useData()

const hero = {
  firstLine: "Neptu Blog Theme",
  secondLine: "A living demo &mdash; every page documents a&nbsp;feature of the&nbsp;theme",
  img: {
    src: frontmatter.value.heroImg,
    alt: "Example blog logo",
  },
  buttons: [
    {
      text: theme.value.t.toBlog,
      href: 'recent/1',
      primary: true,
    },
    {
      text: 'Read the guide',
      href: 'post/welcome',
    },
  ],
}
</script>

<HomeHero v-bind="hero" />

<UtilPageContent>

## This blog documents itself

Every post and page here is a **live demonstration** of one theme feature, with
the exact frontmatter or config that produced it shown right below the result.
Start with the [Welcome guide](post/welcome), then explore by area:

- **Frontmatter** — [full-featured post](post/full-featured) · [cover images & lightbox](post/cover-and-images) · [author, video & podcast](post/author-video-podcast) · [preview & search](post/preview-and-search) · [navigation, featured & print](post/navigation-featured-print)
- **Media components** — [YouTube, video, audio, downloads](post/media-components)
- **Markdown integrations** — [Mermaid diagrams and KaTeX formulas](post/mermaid-and-katex)
- **SEO** — [JSON-LD](post/json-ld) · [canonical & cross-posting](post/canonical-crosspost) · [i18n & hreflang](post/i18n-hreflang)
- **Configuration** — [config layers](page/config-layers) · [color themes & fonts](page/color-themes) · [nav, sidebar & footer](page/nav-sidebar-footer) · [feeds, search & SEO toggles](page/seo-feeds-search) · [advanced: hooks & external content](page/advanced)

### Every layout type is browsable

The sidebar links to each generated listing layout: **Recent**, **Popular**,
**Archive** (by year → month), **Authors**, and the **Tags** cloud. Use the
language switcher in the top bar to jump between English and Russian.

</UtilPageContent>

<HomeFeaturedPosts :max-posts="3" />
<HomeTags :header="theme.t.tags" />
<HomePopularPosts />
