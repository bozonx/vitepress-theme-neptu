<script setup lang="ts">
import { provide } from 'vue'
import Theme from 'vitepress-theme-neptu-blog'
import {
  NavSearchButton,
  PageFindSearch,
} from 'vitepress-theme-neptu-blog/components'
// @ts-expect-error VitePress exposes generated data as a named export.
import { data as enData } from '../../en/loadPosts.data'

const posts = { en: enData.posts }

provide('posts', posts)

const { Layout } = Theme
</script>

<template>
  <Layout>
    <template #nav-bar-content-before>
      <PageFindSearch>
        <NavSearchButton />
      </PageFindSearch>
    </template>
  </Layout>
</template>
