<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { computed, inject } from 'vue'
import PreviewList from '../PreviewList.vue'
import ListPageHeader from '../ListPageHeader.vue'
import { sortPosts, isPopularRoute } from '../../utils/shared/index.ts'
import NeptuBtnLink from '../NeptuBtnLink.vue'
import { useUiTheme } from '../../composables/useUiTheme.ts'
import type { PostLite } from '../../types.d.ts'

const props = defineProps<{
  localePosts?: PostLite[]
  curPage?: string | number
  perPage?: number
  paginationMaxItems?: number
  tagSlug?: string
  tagName?: string
  showPopularPostsSwitch?: boolean
}>()
const { localeIndex, frontmatter } = useData()
const { theme } = useUiTheme()
const route = useRoute()
const allPosts = inject<Record<string, PostLite[]>>('posts', {})
const localePosts = props.localePosts || allPosts[localeIndex.value] || []
const curPage = Number(props.curPage)
const tagName = computed(() =>
  typeof props.tagName === 'string' ? props.tagName.trim() : ''
)
const tagSlug = computed(() =>
  typeof props.tagSlug === 'string' ? props.tagSlug.trim() : ''
)
const tagBaseUrl = computed(() =>
  tagSlug.value
    ? `/${localeIndex.value}/tags/${tagSlug.value}`
    : `/${localeIndex.value}/tags`
)
// Filter posts by tag
const filtered = localePosts.filter((item) =>
  tagName.value ? item.tags?.map((tag) => tag.name).includes(tagName.value) : false
)
const sorted = sortPosts(
  filtered,
  theme.value.popularPosts?.sortBy,
  isPopularRoute(route.path)
)
</script>

<template>
  <ListPageHeader
    :base-url="tagBaseUrl"
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
    <NeptuBtnLink href="tags" :icon="theme.tagsIcon">{{
      theme.t.allTagsCall
    }}</NeptuBtnLink>
  </div>
</template>
