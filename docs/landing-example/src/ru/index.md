---
layout: home
---

<script setup lang="ts">
import { useData } from "vitepress";
import { SiteHome } from 'vitepress-theme-neptu-landing/layouts';

const { theme, localeIndex } = useData();

const hero = {
  name: "Neptu Landing",
  text: "Современный лендинг-темплейт для VitePress",
  tagline: "Построен на базе темплейта блога Neptu — SEO-first, i18n, полная типизация.",
  image: {
    src: theme.value.mainHeroImg,
    alt: "Neptu Landing",
  },
  actions: [
    {
      theme: "brand",
      text: `📃 О проекте`,
      link: `/${localeIndex.value}/doc/about`,
    },
    {
      theme: "alt",
      text: `🗞️ Новости, статьи, события`,
      link: `${theme.value.blogUrl}/${localeIndex.value}/recent/1`,
    },
    {
      theme: "alt",
      text: `📢 Мы в соцсетях`,
      link: `/${localeIndex.value}/page/links`,
    },
  ],
}
const features = [
  {
    icon: "🤝",
    title: "SEO-first",
    details: "Встроенные Open Graph, JSON-LD, canonical links, hreflang и sitemap.",
    linkText: "Подробнее",
    link: `/${localeIndex.value}/doc/about`,
  },
  {
    icon: "📖",
    title: "i18n-ready",
    details: "Поддержка нескольких языков с YAML-конфигурацией и подстановкой шаблонов.",
    linkText: "Подробнее",
    link: `/${localeIndex.value}/doc/about`,
  },
  {
    icon: "⚔️",
    title: "Полная типизация",
    details: "Полная поддержка TypeScript с типами для конфигурации, layouts и компонентов.",
    linkText: "Подробнее",
    link: `/${localeIndex.value}/doc/about`,
  },
]
</script>

<SiteHome :hero="hero" :features="features">
</SiteHome>
