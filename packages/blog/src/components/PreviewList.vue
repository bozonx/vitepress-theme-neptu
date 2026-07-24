<script setup lang="ts">
import { computed } from 'vue'
import PreviewListItem from './PreviewListItem.vue'
import NeptuPagination from './NeptuPagination.vue'
import { useUiTheme } from '../composables/useUiTheme.ts'
import type { PostLite } from '../types.d.ts'

const { theme } = useUiTheme()

const {
  localePosts,
  curPage,
  perPage: propPerPage,
  paginationMaxItems,
  paginationBaseUrl,
} = defineProps<{
  localePosts: PostLite[]
  curPage: number
  perPage?: number
  paginationMaxItems?: number
  paginationBaseUrl?: string
}>()
const perPage = computed(() => propPerPage || theme.value.perPage || 1)
const start = computed(() =>
  curPage === 1 ? 0 : (curPage - 1) * perPage.value
)
const items = computed(() =>
  localePosts.slice(start.value, start.value + perPage.value).filter(Boolean)
)
const totalPages = computed(() => Math.ceil(localePosts.length / perPage.value))
</script>

<template>
  <div v-if="items.length">
    <ul class="list-none p-0 m-0 space-y-4">
      <li
        v-for="item in items"
        :key="item.url"
        :data-popularity-value="
          theme.popularPosts?.sortBy && item.analyticsStats?.[theme.popularPosts.sortBy]
        "
      >
        <PreviewListItem :item="item" />
      </li>
    </ul>

    <div v-if="totalPages > 1" class="mt-10">
      <NeptuPagination
        :cur-page="curPage"
        :total-pages="totalPages"
        :pagination-max-items="paginationMaxItems"
        :pagination-base-url="paginationBaseUrl"
      />
    </div>
  </div>
</template>
