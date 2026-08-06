---
title: "{{theme.t.links.recent}}"
layout: util
head:
  - - meta
    - name: robots
      content: noindex
---

<script setup>
import { RecentPostsList } from 'vitepress-theme-neptu/components'
import { useData } from 'vitepress'

const { params } = useData()
</script>

<RecentPostsList
  :curPage="params?.page"
/>
