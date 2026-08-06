<script setup lang="ts">
import { useData } from 'vitepress'
import { computed, inject } from 'vue'
import UtilPageHeader from './UtilPageHeader.vue'
import PreviewList from '../PreviewList.vue'
import { getFeaturedPostsSorted } from '../../utils/shared/index.ts'
import type { PostLite } from '../../types.d.ts'

const { frontmatter, localeIndex } = useData()

const props = defineProps<{
  localePosts?: PostLite[]
  curPage?: string | number
  perPage?: number
  paginationMaxItems?: number
}>()
const allPosts = inject<Record<string, PostLite[]>>('posts', {})
const localePosts = computed(
  () => props.localePosts || allPosts[localeIndex.value] || []
)
const curPage = Number(props.curPage || 1)
const featuredPosts = computed(() => getFeaturedPostsSorted(localePosts.value))
</script>

<template>
  <UtilPageHeader>{{ frontmatter.title }}</UtilPageHeader>
  <PreviewList
    :locale-posts="featuredPosts"
    :cur-page="curPage"
    :per-page="props.perPage"
    :pagination-max-items="props.paginationMaxItems"
  />
</template>
