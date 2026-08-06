---
title: "{{theme.t.featuredPosts}}"
layout: util
head:
  - - meta
    - name: robots
      content: noindex
---

<script setup>
import { FeaturedPostsList } from 'vitepress-theme-neptu/components'
import { useData } from 'vitepress'

const { params } = useData()
</script>

<FeaturedPostsList
  :curPage="params?.page"
/>
