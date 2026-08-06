<script setup lang="ts">
import TaxonomyPostsList from './TaxonomyPostsList.vue'
import { useThemeConfig } from '../../composables/useThemeConfig.ts'
import type { PostLite } from '../../types.d.ts'

const props = defineProps<{
  localePosts?: PostLite[]
  curPage?: string | number
  perPage?: number
  paginationMaxItems?: number
  tagSlug?: string
  showPopularPostsSwitch?: boolean
}>()
const { theme } = useThemeConfig()
</script>

<template>
  <TaxonomyPostsList
    kind="tags"
    :locale-posts="props.localePosts"
    :cur-page="props.curPage"
    :per-page="props.perPage"
    :pagination-max-items="props.paginationMaxItems"
    :slug="props.tagSlug"
    :show-popular-posts-switch="props.showPopularPostsSwitch"
    :all-label="theme.t.allTagsCall"
    :all-icon="theme.tagsIcon"
  />
</template>
