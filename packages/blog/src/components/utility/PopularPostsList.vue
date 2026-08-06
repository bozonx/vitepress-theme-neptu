<script setup lang="ts">
import { useData } from 'vitepress'
import { inject } from 'vue'
import UtilPageHeader from './UtilPageHeader.vue'
import PreviewList from '../PreviewList.vue'
import { sortPosts } from '../../utils/shared/index.ts'
import { useThemeConfig } from '../../composables/useThemeConfig.ts'
import type { PostLite } from '../../types.d.ts'

const props = defineProps<{
  localePosts?: PostLite[]
  curPage?: string | number
  perPage?: number
  paginationMaxItems?: number
}>()
const { frontmatter, localeIndex } = useData()
const { theme } = useThemeConfig()
const allPosts = inject<Record<string, PostLite[]>>('posts', {})
const localePosts = props.localePosts || allPosts[localeIndex.value] || []
const curPage = Number(props.curPage)
const sortKey = theme.value.popularPosts?.sortBy
const hasAnalytics = localePosts.some((post) =>
  Boolean(sortKey && Number.isFinite(post.analyticsStats?.[sortKey]))
)
const sorted = (theme.value.popularPosts?.enabled === false || !hasAnalytics)
  ? []
  : sortPosts(localePosts, sortKey, true)
</script>

<template>
  <UtilPageHeader>{{ frontmatter.title }}</UtilPageHeader>
  <PreviewList
    :locale-posts="sorted"
    :cur-page="curPage"
    :per-page="props.perPage"
    :pagination-max-items="props.paginationMaxItems"
  />
</template>
