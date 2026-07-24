<script setup lang="ts">
import { computed } from 'vue'
import TagItem from './TagItem.vue'
import type { TagInfo } from '../types.d.ts'

const {
  tags,
  sizeXl = false,
  sizeSm = false,
  class: customClass,
  activeCompareMethod,
} = defineProps<{
  tags: TagInfo[]
  sizeXl?: boolean
  sizeSm?: boolean
  class?: string | Record<string, unknown> | unknown[]
  activeCompareMethod?: 'soft' | 'pagination' | 'softPagination' | 'none' | 'strict'
}>()
const emit = defineEmits<{
  (e: 'itemClick'): void
}>()
const sizeClasses: Record<string, string> = {
  xl: 'gap-x-3 gap-y-4',
  md: 'gap-x-2 gap-y-3',
  sm: 'gap-x-2 gap-y-3',
}
const sizeClass = computed(() => {
  const sizeKey = (sizeXl && 'xl') || (sizeSm && 'sm') || 'md'
  return sizeClasses[sizeKey]
})
</script>

<template>
  <ul
    v-if="tags.length"
    :class="['flex flex-wrap list-none p-0 m-0', sizeClass, customClass]"
  >
    <li v-for="(item, index) in tags" :key="item.slug || item.name || index">
      <TagItem
        v-bind="item"
        :size-xl="sizeXl"
        :size-sm="sizeSm"
        :active-compare-method="activeCompareMethod"
        @click="emit('itemClick')"
      />
    </li>
    <slot name="after" />
  </ul>
</template>
