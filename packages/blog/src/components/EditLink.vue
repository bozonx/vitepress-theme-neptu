<template>
  <NeptuBtnLink
    v-if="allowEditLink"
    :href="editLinkHref"
    rel="nofollow"
    icon="bx:edit"
  >
    {{ theme.editLink?.text || theme.t?.editLink }}
  </NeptuBtnLink>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'
import { isPost, isPage } from '../utils/shared/index.ts'
import NeptuBtnLink from './NeptuBtnLink.vue'
import { useUiTheme } from '../composables/useUiTheme.ts'

const { page, frontmatter } = useData()
const { theme } = useUiTheme()

const allowEditLink = computed(() => {
  return (
    theme.value?.editLink &&
    frontmatter.value?.editLink !== false &&
    (isPost(frontmatter.value) || isPage(frontmatter.value))
  )
})

const editLinkHref = computed(() => {
  const pattern = theme.value?.editLink?.pattern
  if (typeof pattern === 'function') {
    return pattern(page.value)
  }
  return pattern?.replace(':path', page.value.relativePath)
})
</script>
