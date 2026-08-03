---
title: "{{theme.t.categoryPageHeader}}: {{params?.name}}"
layout: util
head:
  - - meta
    - name: robots
      content: noindex
---

<script setup>
import { CategoryPostsList } from 'vitepress-theme-neptu/components'
import { useData } from 'vitepress'

const { params } = useData()
</script>

<CategoryPostsList
  :curPage="params?.page"
  :categoryName="params?.name"
  :categorySlug="params?.slug"
  :showPopularPostsSwitch="true"
/>
