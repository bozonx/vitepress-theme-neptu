<script setup lang="ts">
// Internal component — the shared body of `TagPostsList` and `CategoryPostsList`.
import { useData, useRoute } from 'vitepress'
import { computed, inject } from 'vue'
import PreviewList from '../PreviewList.vue'
import ListPageHeader from '../ListPageHeader.vue'
import { sortPosts, isPopularPostsRoute } from '../../utils/shared/index.ts'
import { makePostsOfTaxonomyList } from '../../list-helpers/listHelpers.ts'
import type { TaxonomyKind } from '../../list-helpers/listHelpers.ts'
import NeptuBtnLink from '../NeptuBtnLink.vue'
import { useThemeConfig } from '../../composables/useThemeConfig.ts'
import type { PostLite } from '../../types.d.ts'

const props = defineProps<{
  kind: TaxonomyKind
  localePosts?: PostLite[]
  curPage?: string | number
  perPage?: number
  paginationMaxItems?: number
  /** Canonical key of the entry — filtering and URLs both go by slug. */
  slug?: string
  showPopularPostsSwitch?: boolean
  allLabel?: string
  allIcon?: string
}>()
const { localeIndex, frontmatter } = useData()
const { theme } = useThemeConfig()
const route = useRoute()
const allPosts = inject<Record<string, PostLite[]>>('posts', {})
const localePosts = computed(
  () => props.localePosts || allPosts[localeIndex.value] || []
)
const curPage = computed(() => Number(props.curPage))
const slug = computed(() =>
  typeof props.slug === 'string' ? props.slug.trim() : ''
)
const baseUrl = computed(() =>
  slug.value
    ? `/${localeIndex.value}/${props.kind}/${slug.value}`
    : `/${localeIndex.value}/${props.kind}`
)
const sorted = computed(() =>
  sortPosts(
    makePostsOfTaxonomyList(localePosts.value, props.kind, slug.value),
    theme.value.popularPosts?.sortBy,
    isPopularPostsRoute(route.path)
  )
)
</script>

<template>
  <ListPageHeader
    :base-url="baseUrl"
    :show-popular-posts-switch="showPopularPostsSwitch"
  >
    {{ frontmatter.title }}
  </ListPageHeader>

  <PreviewList
    :locale-posts="sorted"
    :cur-page="curPage"
    :per-page="props.perPage"
    :pagination-max-items="props.paginationMaxItems"
  />

  <div class="mt-8">
    <NeptuBtnLink :href="props.kind" :icon="allIcon">{{ allLabel }}</NeptuBtnLink>
  </div>
</template>
