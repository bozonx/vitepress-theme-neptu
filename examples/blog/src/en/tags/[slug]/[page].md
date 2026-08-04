---
title: "{{theme.t.tagPageHeader}}: {{params?.name}}"
layout: util
head:
  - - meta
    - name: robots
      content: noindex
---

<script setup>
import { TagPostsList } from 'vitepress-theme-neptu/components'
import { useData } from 'vitepress'

const { params } = useData()
</script>

<TagPostsList
  :curPage="params?.page"
  :tagSlug="params?.slug"
  :showPopularPostsSwitch="true"
/>
