<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { watch } from 'vue'
import { useUiTheme } from '../../composables/useUiTheme.ts'
import { useToTheTop } from '../../composables/useToTheTop.ts'

const props = defineProps<{
  scrollY: number
}>()
const { theme } = useUiTheme()
const SCROLL_BREAKPOINT = 1080
const { showed, opacity, show, hide, handleClick, animationMs } = useToTheTop()

watch(
  () => props.scrollY,
  (scrollY) => {
    if (scrollY > SCROLL_BREAKPOINT) {
      show()
    } else {
      hide()
    }
  },
  { immediate: true }
)
</script>

<template>
  <div
    :class="[
      'bottom-0 fixed transition-opacity will-change-[opacity] to-the-top-desk',
      !showed && 'hidden',
    ]"
    :style="{ opacity, 'transition-duration': `${animationMs}ms` }"
  >
    <button
      type="button"
      class="mb-9 ml-4 flex gap-x-2 px-2 py-2 cursor-pointer text-[var(--gray-600)] hover:text-[var(--gray-900)] dark:text-[var(--gray-300)] dark:hover:text-[var(--gray-100)] border-0 bg-transparent"
      :aria-label="theme.returnToTopLabel || 'Return to top'"
      @click.prevent.stop="handleClick"
    >
      <Icon icon="fa6-solid:arrow-up" width="1.3rem" height="1.3rem" aria-hidden="true" />
      {{ theme.returnToTopLabel }}
    </button>
  </div>
</template>
