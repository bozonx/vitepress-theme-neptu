<script setup lang="ts">
/**
 * Surface used by every card-ish block (features, pricing, testimonials,
 * team...). Renders an `<a>` when `link` is set so the whole card is clickable.
 */
import { computed } from 'vue'
import { withBase } from 'vitepress'

const props = withDefaults(
  defineProps<{
    link?: string
    target?: string
    rel?: string
    /** Lift and highlight on hover. Implied by `link`. */
    hoverable?: boolean
    /** Emphasized card — used for the recommended pricing plan. */
    featured?: boolean
    padding?: 'none' | 'sm' | 'md' | 'lg'
    /** Drop the background and border, keep the padding. */
    plain?: boolean
    tag?: string
  }>(),
  { hoverable: false, featured: false, padding: 'md', plain: false, tag: 'div' }
)

const isExternal = computed(() => /^(https?:)?\/\//.test(props.link ?? ''))
const href = computed(() => {
  if (!props.link) return undefined
  return isExternal.value || props.link.startsWith('#')
    ? props.link
    : withBase(props.link)
})
const target = computed(() => props.target ?? (isExternal.value ? '_blank' : undefined))
</script>

<template>
  <component
    :is="href ? 'a' : props.tag"
    class="ln-card"
    :class="[
      `ln-card--pad-${props.padding}`,
      {
        'ln-card--hoverable': props.hoverable || Boolean(href),
        'ln-card--featured': props.featured,
        'ln-card--plain': props.plain,
      },
    ]"
    :href="href"
    :target="target"
    :rel="props.rel ?? (target === '_blank' ? 'noreferrer' : undefined)"
  >
    <slot />
  </component>
</template>

<style scoped>
.ln-card {
  position: relative;
  display: flex;
  flex-direction: column;
  border: var(--ln-border-width) solid var(--ln-card-border-color);
  border-radius: var(--ln-card-radius);
  background-color: var(--ln-card-bg);
  backdrop-filter: var(--ln-card-backdrop, none);
  box-shadow: var(--ln-card-shadow);
  color: inherit;
  text-decoration: none;
  transition:
    transform var(--ln-duration) var(--ln-ease),
    border-color var(--ln-duration) var(--ln-ease),
    box-shadow var(--ln-duration) var(--ln-ease);
}

.ln-card--pad-none {
  padding: 0;
}
.ln-card--pad-sm {
  padding: calc(var(--ln-card-padding) * 0.6);
}
.ln-card--pad-md {
  padding: var(--ln-card-padding);
}
.ln-card--pad-lg {
  padding: calc(var(--ln-card-padding) * 1.35);
}

.ln-card--plain {
  border-color: transparent;
  background-color: transparent;
  box-shadow: none;
}

.ln-card--hoverable:hover {
  transform: translateY(var(--ln-lift));
  border-color: var(--ln-c-brand);
  box-shadow: var(--ln-card-shadow-hover);
}

.ln-card--featured {
  border-color: var(--ln-c-brand);
  box-shadow: var(--ln-card-shadow-hover);
}

.ln-card:focus-visible {
  outline: 2px solid var(--ln-c-brand);
  outline-offset: 3px;
}
</style>
