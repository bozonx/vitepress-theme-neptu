---
layout: home
---

<script setup lang="ts">
import { useData } from "vitepress";
import { SiteHome } from 'vitepress-theme-neptu-landing/layouts';

const { theme, localeIndex } = useData();

const hero = {
  name: "Neptu Landing",
  text: "A modern landing page theme for VitePress",
  tagline: "Built on top of the Neptu blog theme — SEO-first, i18n-ready, fully typed.",
  image: {
    src: theme.value.mainHeroImg,
    alt: "Neptu Landing",
  },
  actions: [
    {
      theme: "brand",
      text: `📃 About the project`,
      link: `/${localeIndex.value}/doc/about`,
    },
    {
      theme: "alt",
      text: `🗞️ News, articles, events`,
      link: `${theme.value.blogUrl}/${localeIndex.value}/recent/1`,
    },
    {
      theme: "alt",
      text: `📢 We in social media`,
      link: `/${localeIndex.value}/page/links`,
    },
  ],
}
const features = [
  {
    icon: "🤝",
    title: "SEO-first",
    details: "Built-in Open Graph, JSON-LD, canonical links, hreflang, and sitemap.",
    linkText: "Read more",
    link: `/${localeIndex.value}/doc/about`,
  },
  {
    icon: "📖",
    title: "i18n-ready",
    details: "Multi-locale support with YAML-based config and template substitution.",
    linkText: "Read more",
    link: `/${localeIndex.value}/doc/about`,
  },
  {
    icon: "⚔️",
    title: "Fully typed",
    details: "Complete TypeScript support with proper types for config, layouts, and components.",
    linkText: "Read more",
    link: `/${localeIndex.value}/doc/about`,
  },
]
</script>

<SiteHome :hero="hero" :features="features">
</SiteHome>
