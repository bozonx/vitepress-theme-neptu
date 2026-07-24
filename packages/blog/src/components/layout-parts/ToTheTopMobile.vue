<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { watch } from 'vue'
import { useUiTheme } from '../../composables/useUiTheme.ts'
import { useToTheTop } from '../../composables/useToTheTop.ts'

const props = defineProps<{
  scrollY: number
}>()
const SCROLL_BREAKPOINT = 1080
const { theme } = useUiTheme()
const { showed, opacity, show, hide, handleClick, animationMs } = useToTheTop()

watch(
  () => props.scrollY,
  (scrollY, prevScroll) => {
    const prev = prevScroll ?? 0
    if (scrollY > SCROLL_BREAKPOINT) {
      if (scrollY > prev) {
        hide()
      } else {
        show()
      }
    } else {
      hide()
    }
  },
  { immediate: true }
)
</script>

<template>
  <div
    :class="['bottom-0 right-0 fixed transition-opacity will-change-[opacity]', !showed && 'hidden']"
    :style="{ opacity, 'transition-duration': `${animationMs}ms` }"
  >
    <button
      type="button"
      class="to-the-top-mobile flex justify-center items-center w-14 h-14 rounded-full text-white mr-12 mb-12 bg-[var(--primary-btn-bg)] shadow-[0px_8px_16px_0px_rgba(0,0,0,0.3)] border-0"
      :title="theme.returnToTopLabel"
      :aria-label="theme.returnToTopLabel || 'Return to top'"
      @click.prevent.stop="handleClick"
    >
      <Icon icon="fa6-solid:arrow-up" aria-hidden="true" />
    </button>
  </div>
</template>
