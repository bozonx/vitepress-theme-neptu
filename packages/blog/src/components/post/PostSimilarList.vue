<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import PreviewList from '../PreviewList.vue'
import { sortSimilarPosts } from '../../utils/shared/index.ts'
import { useUiTheme } from '../../composables/useUiTheme.ts'
import type { PostLite } from '../../types.d.ts'

const props = defineProps<{ localePosts?: PostLite[] }>()
const { frontmatter } = useData()
const { theme } = useUiTheme()
const route = useRoute()

// Get similar posts using the helper
const items = computed(() =>
  frontmatter.value.tags
    ? sortSimilarPosts(
        props.localePosts || [],
        frontmatter.value.tags,
        route.path,
        theme.value.popularPosts?.enabled
          ? theme.value.popularPosts.sortBy
          : undefined,
        theme.value.similarPostsCount
      )
    : []
)
</script>

<template>
  <div v-if="items.length">
    <h2 class="text-xl font-bold mb-4">{{ theme.t.similarPosts }}</h2>

    <PreviewList
      :locale-posts="items"
      :cur-page="1"
      :per-page="theme.similarPostsCount"
      :pagination-max-items="theme.paginationMaxItems"
    />
  </div>
</template>
