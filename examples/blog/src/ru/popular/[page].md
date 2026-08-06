---
title: "{{theme.t.popularPosts}}"
layout: util
head:
  - - meta
    - name: robots
      content: noindex
---

<script setup>
import { PopularPostsList, UtilPageContent } from 'vitepress-theme-neptu/components'
import { useData } from 'vitepress'

const { params } = useData()
</script>

<PopularPostsList
  :curPage="params?.page"
/>

<UtilPageContent>

В этом демосайте не может быть показан список популярных постов, так как сайт не подключен к Google аналитике. Но в вашем блоге на странице `popolar` будут отображаться популярные посты, как их настроить смотрите в [документации](../post/popular-posts).

</UtilPageContent>
