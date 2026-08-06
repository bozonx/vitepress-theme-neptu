<template>
  <SideBarTaxonomy
    kind="tag"
    :locale-posts="localePosts"
    :header="resolvedShowHeader ? (header ?? theme.t.tags) : undefined"
    :limit="theme.sidebar?.tagsCount"
    :all-label="theme.t.allTagsCall"
    :all-icon="theme.tagsIcon"
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

