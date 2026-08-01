<script setup lang="ts">
import { computed, inject } from 'vue'
import { useData } from 'vitepress'
import PreviewList from '../PreviewList.vue'
import UtilSubPageHeader from './UtilSubPageHeader.vue'
import { filterFeaturedPosts } from '../../utils/shared/index.ts'
import { useUiTheme } from '../../composables/useUiTheme.ts'
import type { PostLite } from '../../types.d.ts'

const props = withDefaults(
  defineProps<{
    localePosts?: PostLite[]
    maxPosts?: number
    header?: string
  }>(),
  { maxPosts: 3 }
)
const { localeIndex } = useData()
const { theme } = useUiTheme()
const allPosts = inject<Record<string, PostLite[]>>('posts', {})
const localePosts = computed(
  () => props.localePosts || allPosts[localeIndex.value] || []
)
const posts = computed(() =>
  filterFeaturedPosts(localePosts.value, props.maxPosts)
)
const title = computed(
  () => props.header || theme.value.t.featuredPosts || 'Featured Posts'
)
</script>

<template>
  <section v-if="posts.length" class="home-featured-posts relative">
    <UtilSubPageHeader class="mb-3">{{ title }}</UtilSubPageHeader>
    <PreviewList :locale-posts="posts" :cur-page="1" :per-page="maxPosts" />
  </section>
</template>
