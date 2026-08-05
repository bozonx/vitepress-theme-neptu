<script setup lang="ts">
import { provide } from 'vue'
import Theme from 'vitepress-theme-neptu'
import {
  NavSearchButton,
  PageFindSearch,
} from 'vitepress-theme-neptu/components'
import { posts } from 'virtual:neptu-posts-data'

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
