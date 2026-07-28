---
layout: home
heroImg: /img/sidebar-logo.jpg
---
<script setup>
import {
  HomeHero,
  HomeTags,
  HomePopularPosts,
  UtilPageContent,
} from 'vitepress-theme-neptu/components'
import { useData } from 'vitepress'

const { theme, frontmatter } = useData()

const hero = {
  firstLine: "Тема Neptu для блога",
  secondLine: "Блог на VitePress, который можно запустить за пять минут",
  img: {
    src: frontmatter.value.heroImg,
    alt: "Логотип демо-блога",
  },
  buttons: [
    {
      text: "Начать за 5 минут",
      href: 'post/getting-started',
      primary: true,
    },
    {
      text: theme.value.t.toBlog,
      href: 'recent/1',
    },
  ],
}
</script>

<HomeHero v-bind="hero" />

<UtilPageContent>

**Neptu** — готовая тема для блога на [VitePress](https://vitepress.dev/):
списки постов, теги, авторы, архив, RSS, поиск, мультиязычность и SEO работают
из коробки. Вы пишете статьи в Markdown — всё остальное тема берёт на себя.

Этот сайт — одновременно **демо** и **руководство**. Каждая страница показывает
живую возможность темы, а под ней — код, который её создаёт. Читать можно по
порядку, как гайд:

- **[Быстрый старт](post/getting-started)** — запустить блог и написать первый пост.
- **[Контент](post/full-featured)** — обложки, медиа, авторы, превью, футер поста.
- **[Настройка](post/config-layers)** — конфигурация, навигация и выбор темы.
- **[Мультиязычность](post/locales)** — локали, переводы и hreflang.
- **[Кастомизация](post/components)** — компоненты, стили, слоты и хуки.
- **[SEO и деплой](post/seo-overview)** — ленты, микроразметка, публикация.

</UtilPageContent>

<HomeTags :header="theme.t.tags" />
<HomePopularPosts />
