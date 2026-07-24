<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import NeptuBtn from './NeptuBtn.vue'

type ClassValue = string | Record<string, unknown> | unknown[]

interface Props {
  customClass?: ClassValue
}

const { customClass } = defineProps<Props>()
const attrs = useAttrs()
const iconClass = computed(() => {
  const value = attrs.iconClass
  return (
    typeof value === 'string' ||
    Array.isArray(value) ||
    (value && typeof value === 'object')
      ? value
      : 'muted'
  ) as ClassValue
})
</script>

<template>
  <NeptuBtn
    v-bind="$attrs"
    role="menuitem"
    :custom-class="[
      'menu-item w-full border-0! shadow-none! transition-none! transform-none! rounded-none py-2.5 px-[1.125rem]',
      customClass,
    ]"
    inner-class="menu-item-inner"
    :icon-class="iconClass"
    :no-bg="true"
  >
    <slot />
  </NeptuBtn>
</template>

<style scoped>
/**** Lighter Btn for use on lighter background */
.menu-item:hover {
  filter: brightness(99%);
}

.dark .menu-item:hover {
  filter: brightness(110%);
}

.menu-item.active {
  background: var(--btn-bg-active);
}

.menu-item.active:hover {
  filter: brightness(103%);
}

.dark .menu-item.active:hover {
  filter: brightness(107%);
}

.menu-item-inner {
  display: inline-flex;
  will-change: transform;
  transition: transform 0.2s ease-in-out !important;
}

.menu-item:not(.disabled):hover .menu-item-inner {
  transform: translateX(4px) !important;
}
</style>
