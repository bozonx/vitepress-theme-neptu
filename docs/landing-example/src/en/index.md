---
layout: home
---

<script setup>
import { useData } from "vitepress";
import { SiteHome } from 'vitepress-theme-neptu-landing/layouts';

const { theme, localeIndex } = useData();

const hero = {
  name: "",
  text: "",
  tagline: "",
  image: {
    src: theme.value.mainHeroImg,
    alt: "",
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
    title: "",
    details: "",
    linkText: "Читать о",
    link: "/ru/doc/",
  },
  {
    icon: "📖",
    title: "",
    details: "",
    linkText: "Читать о",
    link: "/ru/doc/",
  },
  {
    icon: "⚔️",
    title: "",
    details: "",
    linkText: "Читать о",
    link: "/ru/doc/",
  },
]
</script>

<SiteHome :hero="hero" :features="features">
</SiteHome>
