<script setup lang="ts">
import { provide } from 'vue'
import Theme from 'vitepress-theme-neptu'
import {
  NavSearchButton,
  PageFindSearch,
} from 'vitepress-theme-neptu/components'
// @ts-expect-error VitePress exposes generated data as a named export.
import { data as enData } from '../../en/loadPosts.data'
// @ts-expect-error VitePress exposes generated data as a named export.
import { data as ruData } from '../../ru/loadPosts.data'

const posts = { en: enData.posts, ru: ruData.posts }

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
