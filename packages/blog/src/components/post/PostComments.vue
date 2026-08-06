<script setup lang="ts">
import { useData } from 'vitepress'

import NeptuBtnLink from '../NeptuBtnLink.vue'
import { useThemeConfig } from '../../composables/useThemeConfig.ts'

const { frontmatter } = useData()
const { theme } = useThemeConfig()
</script>

<template>
  <div v-if="frontmatter.commentLink">
    <NeptuBtnLink
      :href="frontmatter.commentLink"
      :text="theme.t.commentLink"
      target="_blank"
      icon="fa6-solid:comment-dots"
      class="underline"
    />
  </div>
</template>
