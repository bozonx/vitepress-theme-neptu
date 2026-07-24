<template>
  <div class="side-bar-tags pr-1 pl-3">
    <TagsList
      :tags="tags"
      :size-sm="true"
      class="mb-2 side-bar-tags-list gap-x-1 gap-y-3 [&_.tag-item]:py-[3px] [&_.tag-item]:px-[9px]"
      active-compare-method="softPagination"
      @item-click="emit('itemClick')"
    />
    <div class="mt-2">
      <NeptuBtnLink
        v-if="showAllTags"
        :href="allTagsUrl"
        :icon="theme.tagsIcon"
        >{{ theme.t.allTagsCall }}</NeptuBtnLink
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { makeTagsList } from '../../list-helpers/listHelpers.ts'
import NeptuBtnLink from '../NeptuBtnLink.vue'
import TagsList from '../TagsList.vue'
import { useData } from 'vitepress'
import { computed } from 'vue'
import { useUiTheme } from '../../composables/useUiTheme.ts'
import type { PostLite } from '../../types.d.ts'

const props = defineProps<{ localePosts?: PostLite[] }>()
const { localeIndex } = useData()
const { theme } = useUiTheme()
const allTags = computed(() => makeTagsList(props.localePosts))
const tags = computed(() =>
  allTags.value
    .map(({ count: _count, ...tag }) => tag)
    .slice(0, theme.value.sidebarTagsCount || 0)
)
const allTagsUrl = computed(() => `/${localeIndex.value}/tags`)
const showAllTags = computed(
  () => allTags.value.length > (theme.value.sidebarTagsCount || 0)
)
const emit = defineEmits<{
  (e: 'itemClick'): void
}>()
</script>
