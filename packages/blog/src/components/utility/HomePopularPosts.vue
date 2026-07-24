<template>
  <div v-if="theme.popularPosts?.enabled" class="home-popular-posts relative">
    <UtilSubPageHeader class="home-popular-posts-header mb-3">
      {{ theme.t.popularPosts }}
    </UtilSubPageHeader>

    <PreviewList :locale-posts="posts" :cur-page="1" />

    <div v-if="showMorePosts" class="mt-8 flex">
      <span class="mr-2">... </span>
      <NeptuBtnLink
        :href="`popular/2`"
        :text="theme.t.showMorePosts"
        class="more-posts-btn underline"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { useData } from 'vitepress'
import UtilSubPageHeader from './UtilSubPageHeader.vue'
import NeptuBtnLink from '../NeptuBtnLink.vue'
import PreviewList from '../PreviewList.vue'
import { sortPosts } from '../../utils/shared/index.ts'
import { useUiTheme } from '../../composables/useUiTheme.ts'
import type { PostLite } from '../../types.d.ts'

const props = defineProps<{ localePosts?: PostLite[] }>()
const { localeIndex } = useData()
const { theme } = useUiTheme()
const allPosts = inject<Record<string, PostLite[]>>('posts', {})
const localePosts = props.localePosts || allPosts[localeIndex.value] || []
const sorted = sortPosts(localePosts, theme.value.popularPosts?.sortBy, true)
const posts = sorted.slice(0, theme.value.perPage || 0)
const showMorePosts = localePosts.length > (theme.value.perPage || 0)
</script>

<style scoped>
/* Frosted glass effect for popular posts */
:deep(.dark .home-popular-posts .card-item),
:deep(.home-popular-posts .card-item),
.home-popular-posts :deep(.card-item) {
  background: rgba(0, 0, 0, 0.27);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.7),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(8px);
  transition: transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease;
  will-change: transform, box-shadow, filter;
  animation: glassmorphism-fade-in 0.6s ease-out;
}

/* Hover effects */
:deep(.dark .home-popular-posts .card-item:hover),
:deep(.home-popular-posts .card-item:hover),
.home-popular-posts :deep(.card-item:hover) {
  background: rgba(0, 0, 0, 0.4);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
}

.home-popular-posts-header {
  text-shadow: 4px 4px 12px rgba(0, 0, 0, 0.8);
}

.home-popular-posts :deep(.more-posts-btn) {
  color: var(--gray-300);
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
