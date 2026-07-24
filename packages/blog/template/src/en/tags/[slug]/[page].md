---
title: "{{theme.t.tagPageHeader}}: {{params?.name}}"
layout: util
head:
  - - meta
    - name: robots
      content: noindex
---

<script setup>
import { TagPostsList } from 'vitepress-theme-neptu-blog/components'
import { useData } from 'vitepress'

const { params } = useData()
</script>

<TagPostsList
  :curPage="params?.page"
  :tagName="params?.name"
  :tagSlug="params?.slug"
  :showPopularPostsSwitch="true"
/>
