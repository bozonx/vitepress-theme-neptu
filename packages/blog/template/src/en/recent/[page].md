---
title: "{{theme.t.links.recent}}"
layout: util
head:
  - - meta
    - name: robots
      content: noindex
---

<script setup>
import { RecentList } from 'vitepress-theme-neptu-blog/components'
import { useData } from 'vitepress'

const { params } = useData()
</script>

<RecentList
  :curPage="params?.page"
/>
