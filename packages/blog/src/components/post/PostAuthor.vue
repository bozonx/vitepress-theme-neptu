<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

import SimpleLink from '../SimpleLink.vue'
import { useThemeConfig } from '../../composables/useThemeConfig.ts'
import type { Author } from '../../types.d.ts'

const { frontmatter, localeIndex } = useData()
const { theme } = useThemeConfig()

const themeAuthor = computed(() =>
  frontmatter.value.authorId
    ? theme.value.authors?.find((item: Author) => item.id === frontmatter.value.authorId)
    : undefined
)
const authorUrl = computed(() =>
  localeIndex.value && localeIndex.value !== 'root'
    ? `/${localeIndex.value}/authors/${frontmatter.value.authorId}/1`
    : `/authors/${frontmatter.value.authorId}/1`
)
</script>

<template>
  <address v-if="themeAuthor?.name" class="flex gap-x-1">
    <span class="muted">{{ theme.t.author }}: </span>
    <SimpleLink rel="author" :href="authorUrl">{{
      themeAuthor.name
    }}</SimpleLink>
  </address>
</template>
