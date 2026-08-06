<template>
  <SideBarTaxonomy
    kind="category"
    :locale-posts="localePosts"
    :header="resolvedShowHeader ? (header ?? theme.t.categories) : undefined"
    :limit="theme.sidebar?.categoriesCount"
    :all-label="theme.t.allCategoriesCall"
    :all-icon="theme.categoriesIcon || theme.tagsIcon"
    @item-click="emit('itemClick')"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SideBarTaxonomy from './SideBarTaxonomy.vue'
import { useThemeConfig } from '../../composables/useThemeConfig.ts'
import { makeCategoriesList, makeTagsList } from '../../list-helpers/listHelpers.ts'
import type { PostLite } from '../../types.d.ts'

const props = withDefaults(
  defineProps<{
    localePosts?: PostLite[]
    header?: string
    showHeader?: boolean
  }>(),
  {
    showHeader: undefined,
  }
)

const { theme } = useThemeConfig()
const emit = defineEmits<{
  (e: 'itemClick'): void
}>()

const hasCategories = computed(
  () => makeCategoriesList(props.localePosts).length > 0
)
const hasTags = computed(() => makeTagsList(props.localePosts).length > 0)

const resolvedShowHeader = computed(() => {
  if (typeof props.showHeader === 'boolean') {
    return props.showHeader
  }
  return hasCategories.value && hasTags.value
})
</script>

