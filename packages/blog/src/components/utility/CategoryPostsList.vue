<script setup lang="ts">
import TaxonomyPostsList from './TaxonomyPostsList.vue'
import { useUiTheme } from '../../composables/useUiTheme.ts'
import type { PostLite } from '../../types.d.ts'

const props = defineProps<{
  localePosts?: PostLite[]
  curPage?: string | number
  perPage?: number
  paginationMaxItems?: number
  categorySlug?: string
  /**
   * Accepted for backwards compatibility with generated route params.
   * Filtering goes by slug — the name is only a display label, and the page
   * title already carries it.
   */
  categoryName?: string
  showPopularPostsSwitch?: boolean
}>()
const { theme } = useUiTheme()
</script>

<template>
  <TaxonomyPostsList
    kind="categories"
    :locale-posts="props.localePosts"
    :cur-page="props.curPage"
    :per-page="props.perPage"
    :pagination-max-items="props.paginationMaxItems"
    :slug="props.categorySlug"
    :show-popular-posts-switch="props.showPopularPostsSwitch"
    :all-label="theme.t.allCategoriesCall"
    :all-icon="theme.categoriesIcon || theme.tagsIcon"
  />
</template>
