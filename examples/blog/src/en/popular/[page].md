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

This demo site cannot show a list of popular posts because the site is not connected to Google Analytics. To learn how to enable popular posts in your blog, see the [documentation](../posts/analytics).

</UtilPageContent>
