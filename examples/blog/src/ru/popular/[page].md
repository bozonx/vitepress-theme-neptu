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

В этом демосайте не может быть показан список популярных постов, так как сайт не подключен к Google аналитике. Как настроить вывод популярных постов в вашем блоге смотрите в [документации](../posts/analytics).

</UtilPageContent>
