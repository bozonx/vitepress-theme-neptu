<script setup lang="ts">
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
  activeCompareMethod?:
    | 'soft'
    | 'pagination'
    | 'softPagination'
    | 'none'
    | 'strict'
}

const props = defineProps<Props>()
const href = `tags/${props.slug}/1`
const className =
  'text-center rounded-full text-lg py-1 px-4 ' +
  'justify-center inline-flex space-x-2 items-center text-white ' +
  'transition-transform duration-200 ease-[ease] hover:-translate-y-0.5 will-change-[transform] ' +
  (props.sizeXl ? `text-xl ` : '') +
  (props.sizeSm ? `text-sm ` : '') +
  (props.count ? 'pr-2 ' : '') +
  `tag-item`
</script>

<template>
  <BaseLink
    :href="href"
    :class="className"
    :active-compare-method="props.activeCompareMethod"
  >
    <span>{{ props.name }}</span>
    <NeptuBadge
      v-if="props.count"
      :count="props.count"
      :title="theme.t.tagBadgeCount"
    />
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
</style>
