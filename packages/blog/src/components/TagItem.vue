<script setup lang="ts">
import { computed } from 'vue'
import BaseLink from './BaseLink.vue'
import NeptuBadge from './NeptuBadge.vue'
import { useUiTheme } from '../composables/useUiTheme.ts'

const { theme } = useUiTheme()

interface Props {
  name?: string
  count?: number
  slug?: string
  sizeXl?: boolean
  sizeSm?: boolean
  /**
   * Which taxonomy this chip belongs to. Decides the target list page and the
   * visual treatment: tags are solid pills, categories are soft outlined ones.
   */
  kind?: 'tag' | 'category'
  activeCompareMethod?:
    | 'soft'
    | 'pagination'
    | 'softPagination'
    | 'none'
    | 'strict'
}

const props = defineProps<Props>()
const isCategory = computed(() => props.kind === 'category')
// Relative href on purpose — `BaseLink` prefixes the active locale.
const href = computed(
  () => `${isCategory.value ? 'categories' : 'tags'}/${props.slug}/1`
)
const badgeTitle = computed(() =>
  isCategory.value
    ? theme.value.t.categoryBadgeCount
    : theme.value.t.tagBadgeCount
)
const className = computed(
  () =>
    'text-center rounded-[var(--neptu-radius-pill)] text-lg py-1 px-4 ' +
    'justify-center inline-flex space-x-2 items-center ' +
    (isCategory.value ? '' : 'text-white ') +
    'transition-transform duration-200 ease-[ease] hover:-translate-y-0.5 will-change-[transform] ' +
    (props.sizeXl ? `text-xl ` : '') +
    (props.sizeSm ? `text-sm ` : '') +
    (props.count ? 'pr-2 ' : '') +
    (isCategory.value ? 'category-item' : 'tag-item')
)
</script>

<template>
  <BaseLink
    :href="href"
    :class="className"
    :active-compare-method="props.activeCompareMethod"
  >
    <span>{{ props.name }}</span>
    <NeptuBadge v-if="props.count" :count="props.count" :title="badgeTitle" />
  </BaseLink>
</template>

<style scoped>
.tag-item {
  background: var(--tag-item-bg);
}

.tag-item.active {
  background: var(--tag-item-bg-active);
}

.tag-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  filter: brightness(115%);
}

.dark .tag-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  filter: brightness(110%);
}

.tag-item :deep(.badge-item) {
  background-color: rgba(0, 0, 0, 0.22);
}

.category-item {
  background: var(--category-item-bg);
  color: var(--category-item-text);
  border: 1px solid var(--category-item-border);
  font-weight: 500;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* Hover only deepens the tint while `.active` fills the chip, so the current
   category stays recognizable as the pointer travels across the list. */
.category-item:hover {
  background: var(--category-item-bg-hover);
  border-color: var(--category-item-border-hover);
}

.category-item.active {
  background: var(--category-item-bg-active);
  border-color: var(--category-item-bg-active);
  color: var(--category-item-text-active);
}

.category-item :deep(.badge-item) {
  background-color: var(--category-item-badge-bg);
}

.category-item.active :deep(.badge-item) {
  background-color: rgba(0, 0, 0, 0.22);
}
</style>
