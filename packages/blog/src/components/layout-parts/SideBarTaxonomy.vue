<template>
  <div :class="['pr-1 pl-3', kind === 'category' ? 'side-bar-categories' : 'side-bar-tags']">
    <div
      v-if="header"
      class="font-semibold text-xs text-[var(--vp-c-text-2)] uppercase tracking-wider mb-2"
    >
      {{ header }}
    </div>

    <TagsList
      :tags="items"
      :kind="kind"
      :size-sm="true"
      class="mb-2 gap-x-1 gap-y-3 [&_.tag-item]:py-[3px] [&_.tag-item]:px-[9px] [&_.category-item]:py-[3px] [&_.category-item]:px-[9px]"
      active-compare-method="softPagination"
      @item-click="emit('itemClick')"
    />

    <div class="mt-2">
      <NeptuBtnLink v-if="showAll" :href="allUrl" :icon="allIcon">{{
        allLabel
      }}</NeptuBtnLink>
    </div>
  </div>
</template>

<script setup lang="ts">
// Internal component — the shared body of `SideBarTags` and `SideBarCategories`.
import { computed } from 'vue'
import { useData } from 'vitepress'
import { makeTaxonomyList } from '../../list-helpers/listHelpers.ts'
import type { TaxonomyKind } from '../../list-helpers/listHelpers.ts'
import TagsList from '../TagsList.vue'
import NeptuBtnLink from '../NeptuBtnLink.vue'
import type { PostLite } from '../../types.d.ts'

const props = defineProps<{
  localePosts?: PostLite[]
  kind: 'tag' | 'category'
  /** Optional section caption above the cloud. */
  header?: string
  /** How many entries to show before the "view all" link takes over. */
  limit?: number
  allLabel?: string
  allIcon?: string
}>()
const emit = defineEmits<{
  (e: 'itemClick'): void
}>()

const { localeIndex } = useData()
const taxonomy = computed<TaxonomyKind>(() =>
  props.kind === 'category' ? 'categories' : 'tags'
)
const allEntries = computed(() =>
  makeTaxonomyList(props.localePosts, taxonomy.value)
)
// Counts are dropped here: the sidebar cloud is a navigation aid, and the
// badges make the chips too wide for the drawer.
const items = computed(() =>
  allEntries.value
    .map(({ count: _count, ...entry }) => entry)
    .slice(0, props.limit || 0)
)
const allUrl = computed(() => `/${localeIndex.value}/${taxonomy.value}`)
const showAll = computed(() => allEntries.value.length > (props.limit || 0))
</script>
