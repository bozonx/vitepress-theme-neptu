<template>
  <div v-if="posts.length" class="home-popular-posts relative">
    <UtilSubPageHeader class="home-popular-posts-header mb-3">
      {{ theme.t.popularPosts }}
    </UtilSubPageHeader>

    <PreviewList :locale-posts="posts" :cur-page="1" />

  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { useData } from 'vitepress'
import UtilSubPageHeader from './UtilSubPageHeader.vue'
import PreviewList from '../PreviewList.vue'
import { sortPosts } from '../../utils/shared/index.ts'
import { useUiTheme } from '../../composables/useUiTheme.ts'
import type { PostLite } from '../../types.d.ts'

const props = defineProps<{ localePosts?: PostLite[]; limit?: number }>()
const { localeIndex } = useData()
const { theme } = useUiTheme()
const allPosts = inject<Record<string, PostLite[]>>('posts', {})
const localePosts = props.localePosts || allPosts[localeIndex.value] || []
const sortKey = theme.value.popularPosts?.sortBy
const hasAnalytics = localePosts.some((post) =>
  Boolean(sortKey && Number.isFinite(post.analyticsStats?.[sortKey]))
)
const sorted = sortPosts(localePosts, sortKey, true)
const posts = (theme.value.popularPosts?.enabled === false || !hasAnalytics)
  ? []
  : sorted.slice(0, props.limit || theme.value.perPage || 1)
</script>

<style scoped>
.home-popular-posts :deep(.more-posts-btn) {
  color: var(--vp-c-text-2);
}
</style>
