<template>
  <SideBarTaxonomy
    kind="tag"
    :locale-posts="localePosts"
    :limit="theme.sidebarTagsCount"
    :all-label="theme.t.allTagsCall"
    :all-icon="theme.tagsIcon"
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
