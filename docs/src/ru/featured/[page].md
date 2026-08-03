---
title: "{{theme.t.featuredPosts}}"
layout: util
head:
  - - meta
    - name: robots
      content: noindex
---

<script setup>
import { FeaturedList } from 'vitepress-theme-neptu/components'
import { useData } from 'vitepress'

const { params } = useData()
</script>

<FeaturedList
  :curPage="params?.page"
/>
