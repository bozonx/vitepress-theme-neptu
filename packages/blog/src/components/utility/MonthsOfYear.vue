<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { inject } from 'vue'
import { makeMonthsList } from '../../list-helpers/listHelpers.ts'
import { sortPosts, isPopularRoute } from '../../utils/shared/index.ts'
import ListItemWithBadge from '../ListItemWithBadge.vue'
import PreviewList from '../PreviewList.vue'
import UtilPageHeader from './UtilPageHeader.vue'
import ListPageHeader from '../ListPageHeader.vue'
import { useUiTheme } from '../../composables/useUiTheme.ts'
import type { PostLite } from '../../types.d.ts'

const props = defineProps<{
  localePosts?: PostLite[]
  year: string | number
  curPage?: string | number
  perPage?: number
  paginationMaxItems?: number
  showPopularPostsSwitch?: boolean
}>()
const { frontmatter, localeIndex } = useData()
const { theme } = useUiTheme()
const route = useRoute()
const allPosts = inject<Record<string, PostLite[]>>('posts', {})
const localePosts = props.localePosts || allPosts[localeIndex.value] || []
const monthsList = makeMonthsList(localePosts, props.year)

const curPage = Number(props.curPage || 1)
// Filter posts by year
const filtered = localePosts.filter((item) => {
  const postYear = new Date(item.date as string | number | Date).getUTCFullYear()
  return postYear === Number(props.year)
})

const sorted = sortPosts(
  filtered,
  theme.value.popularPosts?.sortBy,
  isPopularRoute(route.path)
)
</script>

<template>
  <div>
    <UtilPageHeader>{{ frontmatter.title }}</UtilPageHeader>

    <ul v-if="monthsList.length" class="flex flex-wrap gap-x-8">
      <template v-for="item in monthsList" :key="item.month">
        <li v-if="item.count">
          <ListItemWithBadge
            :href="`archive/${props.year}/month/${item.month}`"
            :text="theme.t.months[item.month - 1]"
            :count="item.count"
          />
        </li>
      </template>
    </ul>

    <ListPageHeader
      :show-popular-posts-switch="showPopularPostsSwitch"
      :base-url="`/${localeIndex}/archive/${props.year}`"
      class="mt-10"
    >
      {{ theme.t.allPostsOfYear }}
    </ListPageHeader>

    <PreviewList
      :locale-posts="sorted"
      :cur-page="curPage"
      :per-page="props.perPage"
      :pagination-max-items="props.paginationMaxItems"
    />
  </div>
</template>
