<script setup lang="ts">
/**
 * Scroll-reveal wrapper.
 *
 * Progressive enhancement: the hidden state is applied only under
 * `html.ln-js`, a class set by the inline head script (see `headScript` in
 * `src/configs`). Without JS — and during SSR — content is simply visible, so
 * there is no flash of empty page and no dependency on the observer.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Delay in ms, used to stagger sibling items. */
    delay?: number
    /** Skip the animation entirely. */
    disabled?: boolean
    tag?: string
  }>(),
  { delay: 0, disabled: false, tag: 'div' }
)

const el = ref<HTMLElement | null>(null)
const shown = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (props.disabled || typeof IntersectionObserver === 'undefined') {
    shown.value = true
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        shown.value = true
        observer?.disconnect()
        observer = null
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
  )

  if (el.value) observer.observe(el.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <component
    :is="props.tag"
    ref="el"
    class="ln-reveal"
    :class="{ 'is-shown': shown, 'is-static': props.disabled }"
    :style="props.delay ? { '--ln-reveal-delay': `${props.delay}ms` } : undefined"
  >
    <slot />
  </component>
</template>

<style scoped>
:global(html.ln-js) .ln-reveal:not(.is-static) {
  opacity: 0;
  transform: translateY(var(--ln-reveal-distance));
  transition:
    opacity 0.5s var(--ln-ease) var(--ln-reveal-delay, 0ms),
    transform 0.5s var(--ln-ease) var(--ln-reveal-delay, 0ms);
  will-change: opacity, transform;
}

:global(html.ln-js) .ln-reveal.is-shown {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  :global(html.ln-js) .ln-reveal:not(.is-static) {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
