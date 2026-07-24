<script setup lang="ts">
import { useRoute } from 'vitepress'
import { computed } from 'vue'
import NeptuBtn from './NeptuBtn.vue'
import { useUiTheme } from '../composables/useUiTheme.ts'

const route = useRoute()
const { theme } = useUiTheme()
const props = defineProps<{
  paginationMaxItems?: number
  curPage: number
  totalPages: number
  paginationBaseUrl?: string
}>()
interface PaginationItem {
  name?: number
  href: string
  title?: string
  icon?: string
}

const items = computed(() => {
  const result: PaginationItem[] = []
  const curPage = props.curPage
  const maxItems = props.paginationMaxItems || theme.value.paginationMaxItems || 7
  const totalPages = props.totalPages
  const baseUrl =
    props.paginationBaseUrl || route.path.split('/').slice(0, -1).join('/')

  if (curPage >= 1 && totalPages > 1 && curPage <= totalPages && maxItems > 0) {
    const halfPages = (maxItems - 1) / 2
    let minusPages = halfPages
    let plusPages = halfPages

    // Distribute odd number of pages: more pages to the right of the current one
    if (halfPages !== Math.ceil(halfPages)) {
      minusPages = Math.floor(halfPages)
      plusPages = Math.ceil(halfPages)
    }

    let startPage = Math.max(1, curPage - minusPages)
    let endPage = Math.min(totalPages, curPage + plusPages)

    // Adjust boundaries if they go out of range
    if (startPage < 1) {
      const shift = 1 - startPage
      startPage = 1
      endPage = Math.min(endPage + shift, totalPages)
    } else if (endPage > totalPages) {
      const shift = endPage - totalPages
      endPage = totalPages
      startPage = Math.max(startPage - shift, 1)
    }

    // Show "to start" button if the first page is not visible
    if (startPage > 1) {
      result.push({
        icon: 'mdi:page-first',
        href: `${baseUrl}/1`,
        title: theme.value.t.paginationToStart,
      })
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      result.push({ name: i, href: `${baseUrl}/${i}` })
    }

    // Show "to end" button if the last page is not visible
    if (endPage < totalPages) {
      result.push({
        icon: 'mdi:page-last',
        href: `${baseUrl}/${totalPages}`,
        title: theme.value.t.paginationToEnd,
      })
    }
  }

  return result
})
</script>

<template>
  <nav v-if="items.length" aria-label="Pagination">
    <ul class="flex justify-center gap-x-1">
      <li v-for="item of items" :key="item.href" class="flex align-center">
        <NeptuBtn
          :href="item.href"
          :title="item.title"
          :text="item.name?.toString()"
          :icon="item.icon"
          :aria-current="props.curPage === item.name ? 'page' : undefined"
          class="px-4 py-[0.35rem]"
        />
      </li>
    </ul>
  </nav>
</template>
