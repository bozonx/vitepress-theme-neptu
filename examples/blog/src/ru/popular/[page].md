---
title: "{{theme.t.popularPosts}}"
layout: util
head:
  - - meta
    - name: robots
      content: noindex
---

<script setup>
import { PopularPostsList } from 'vitepress-theme-neptu/components'
import { useData } from 'vitepress'

const { params } = useData()
</script>

<PopularPostsList
  :curPage="params?.page"
/>

В этом демосайте не может быть показан список популярныйх постов, так как он не подключен к Google аналитике. Но в вашем блоге здесь будут отображаться популярные посты, как их настроить смотрите в [документации](/ru/post/popular-posts).
