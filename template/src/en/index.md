---
layout: home
---
<script setup>
import {
  HomeHero,
  HomeTags,
  UtilPageContent,
} from 'vitepress-theme-neptu-blog/components'
import { useData } from 'vitepress'

const { theme } = useData()

const hero = {
  firstLine: "Welcome to My Blog",
  secondLine: "Thoughts, stories, and ideas built with Neptu Blog Theme",
  buttons: [
    {
      text: "Browse Recent Posts",
      href: 'recent/1',
      primary: true,
    },
    {
      text: 'About Me',
      href: 'page/about',
    },
  ],
}
</script>

<HomeHero v-bind="hero" />

<UtilPageContent>

## Hello, World! 👋

Welcome to your brand new blog site powered by **VitePress** and **Neptu Blog Theme**.

### What to do next?

1. Edit `src/site.yaml` or `src/en/_site.yaml` to customize titles, social links, and footer.
2. Add your posts to `src/en/post/`.
3. Check out the example posts below to see how frontmatter works.

</UtilPageContent>

<HomeTags :header="theme.t?.tags || 'Tags'" />
