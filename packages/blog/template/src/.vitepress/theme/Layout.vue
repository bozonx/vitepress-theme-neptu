<script setup lang="ts">
import { provide } from 'vue'
import Theme from 'vitepress-theme-neptu'
import {
  NavSearchButton,
  PageFindSearch,
} from 'vitepress-theme-neptu/components'
// @ts-expect-error VitePress exposes generated data as a named export.
import { data as enData } from '../../en/loadPosts.data'

// Post data for every locale, handed to the theme through `provide`.
//
// ── Adding a locale ──────────────────────────────────────────────────────
// Creating `src/<locale>/` is not enough: VitePress data loaders are static
// imports and cannot be resolved at runtime, so each locale needs a line
// here. For a new `ru` folder, add:
//
//   import { data as ruData } from '../../ru/loadPosts.data'
//   const posts = { en: enData.posts, ru: ruData.posts }
//
// The keys must match the folder names under `src/`.
const posts = { en: enData.posts }

provide('posts', posts)

const { Layout } = Theme
</script>

<template>
  <Layout>
    <!-- Search button in the top bar. Remove this slot to drop the search UI. -->
    <template #nav-bar-content-before>
      <PageFindSearch>
        <NavSearchButton />
      </PageFindSearch>
    </template>
  </Layout>
</template>
