<template>
  <SideBarTaxonomy
    kind="category"
    :locale-posts="localePosts"
    :header="theme.t.categories"
    :limit="theme.sidebarCategoriesCount"
    :all-label="theme.t.allCategoriesCall"
    :all-icon="theme.categoriesIcon || theme.tagsIcon"
    @item-click="emit('itemClick')"
  />
</template>

<script setup lang="ts">
import SideBarTaxonomy from './SideBarTaxonomy.vue'
import { useUiTheme } from '../../composables/useUiTheme.ts'
import type { PostLite } from '../../types.d.ts'

defineProps<{ localePosts?: PostLite[] }>()
const { theme } = useUiTheme()
const emit = defineEmits<{
  (e: 'itemClick'): void
}>()
</script>
