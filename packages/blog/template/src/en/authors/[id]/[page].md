---
title: "{{theme.authors.find((item) => item.id === params?.id)?.name}}"
layout: util
---

<script setup>
import { AuthorDetails } from 'vitepress-theme-neptu-blog/components'
import { useData } from 'vitepress'

const { params } = useData()
</script>

<AuthorDetails
  :authorId="params?.id"
  :curPage="params?.page"
  :showPopularPostsSwitch="true"
/>
