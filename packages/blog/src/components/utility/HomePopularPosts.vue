<template>
  <div v-if="posts.length" class="home-popular-posts relative">
    <UtilSubPageHeader class="home-popular-posts-header mb-3">
      {{ hasAnalytics ? theme.t.popularPosts : theme.t.links.recent }}
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
const fallback = theme.value.popularPosts?.fallback || 'latest'
const sorted = sortPosts(localePosts, sortKey, true)
const posts = (theme.value.popularPosts?.enabled === false || (!hasAnalytics && fallback === 'hide'))
  ? []
  : sorted.slice(0, props.limit || theme.value.perPage || 1)
</script>

<style scoped>
/* Frosted glass effect for popular posts */
:deep(.dark .home-popular-posts .card-item),
:deep(.home-popular-posts .card-item),
.home-popular-posts :deep(.card-item) {
  background: color-mix(in srgb, var(--vp-c-bg-soft) 82%, transparent);
  border: 1px solid var(--vp-c-divider);
  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.18),
    inset 0 1px 0 color-mix(in srgb, var(--vp-c-text-1) 8%, transparent);
  border-radius: var(--neptu-radius-lg);
  backdrop-filter: blur(8px);
  transition: transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease;
  will-change: transform, box-shadow, filter;
  animation: glassmorphism-fade-in 0.6s ease-out;
}

/* Hover effects */
:deep(.dark .home-popular-posts .card-item:hover),
:deep(.home-popular-posts .card-item:hover),
.home-popular-posts :deep(.card-item:hover) {
  background: color-mix(in srgb, var(--vp-c-bg-soft) 92%, transparent);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
}

.home-popular-posts :deep(.more-posts-btn) {
  color: var(--vp-c-text-2);
}

@keyframes glassmorphism-fade-in {
  from {
    opacity: 0;
    backdrop-filter: blur(8px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(15px);
  }
}
</style>
