<script setup lang="ts">
/**
 * The only button of the library. Renders an `<a>` when `link` is given and a
 * `<button>` otherwise, so it works for both navigation and interactions.
 */
import { computed } from 'vue'
import { withBase } from 'vitepress'
import LnIcon from './LnIcon.vue'
import type { ButtonSize, ButtonVariant } from '../blocks/types.ts'

const props = withDefaults(
  defineProps<{
    text?: string
    link?: string
    variant?: ButtonVariant
    size?: ButtonSize
    icon?: string
    /** Put the icon after the label. */
    iconRight?: boolean
    target?: string
    rel?: string
    disabled?: boolean
    /** Stretch to the full width of the parent. */
    block?: boolean
  }>(),
  { variant: 'brand', size: 'md', iconRight: false, disabled: false, block: false }
)

const isExternal = computed(() => /^(https?:)?\/\//.test(props.link ?? ''))
const href = computed(() => {
  if (!props.link) return undefined
  return isExternal.value || props.link.startsWith('#')
    ? props.link
    : withBase(props.link)
})
const target = computed(() => props.target ?? (isExternal.value ? '_blank' : undefined))
const rel = computed(
  () => props.rel ?? (target.value === '_blank' ? 'noreferrer' : undefined)
)
</script>

<template>
  <component
    :is="href && !props.disabled ? 'a' : 'button'"
    class="ln-btn"
    :class="[
      `ln-btn--${props.variant}`,
      `ln-btn--${props.size}`,
      { 'ln-btn--block': props.block, 'is-disabled': props.disabled },
    ]"
    :href="href && !props.disabled ? href : undefined"
    :target="href ? target : undefined"
    :rel="href ? rel : undefined"
    :disabled="href && !props.disabled ? undefined : props.disabled || undefined"
  >
    <LnIcon v-if="props.icon && !props.iconRight" :icon="props.icon" size="1.1em" />
    <span v-if="props.text || $slots.default" class="ln-btn__label">
      <slot>{{ props.text }}</slot>
    </span>
    <LnIcon v-if="props.icon && props.iconRight" :icon="props.icon" size="1.1em" />
  </component>
</template>

<style scoped>
.ln-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: var(--ln-border-width) solid transparent;
  border-radius: var(--ln-btn-radius);
  height: var(--ln-btn-height);
  padding-inline: var(--ln-btn-px);
  font-family: inherit;
  font-size: 0.9375rem;
  font-weight: var(--ln-btn-weight);
  letter-spacing: var(--ln-btn-tracking);
  text-transform: var(--ln-btn-uppercase);
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  box-shadow: var(--ln-btn-shadow);
  transition:
    background-color var(--ln-duration) var(--ln-ease),
    border-color var(--ln-duration) var(--ln-ease),
    color var(--ln-duration) var(--ln-ease),
    transform var(--ln-duration) var(--ln-ease),
    box-shadow var(--ln-duration) var(--ln-ease);
}

.ln-btn:hover {
  transform: translateY(var(--ln-lift));
}

.ln-btn:focus-visible {
  outline: 2px solid var(--ln-c-brand);
  outline-offset: 2px;
}

.ln-btn.is-disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
}

/**** Sizes */
.ln-btn--sm {
  height: calc(var(--ln-btn-height) * 0.8);
  padding-inline: calc(var(--ln-btn-px) * 0.7);
  font-size: 0.875rem;
}
.ln-btn--lg {
  height: calc(var(--ln-btn-height) * 1.2);
  padding-inline: calc(var(--ln-btn-px) * 1.25);
  font-size: 1rem;
}

/**** Variants */
.ln-btn--brand {
  background-color: var(--ln-c-brand);
  color: var(--ln-c-on-brand);
}
.ln-btn--brand:hover {
  background-color: var(--ln-c-brand-active);
}

.ln-btn--alt {
  background-color: var(--ln-c-bg-mute);
  color: var(--ln-c-text-1);
  border-color: var(--ln-c-border);
}
.ln-btn--alt:hover {
  border-color: var(--ln-c-brand);
  color: var(--ln-c-brand);
}

.ln-btn--outline {
  background-color: transparent;
  color: currentcolor;
  border-color: var(--ln-c-border-strong);
}
.ln-btn--outline:hover {
  border-color: var(--ln-c-brand);
  color: var(--ln-c-brand);
}

.ln-btn--ghost {
  background-color: transparent;
  color: currentcolor;
}
.ln-btn--ghost:hover {
  background-color: var(--ln-c-brand-soft);
  color: var(--ln-c-brand);
}

.ln-btn--link {
  background-color: transparent;
  color: var(--ln-c-brand);
  height: auto;
  padding: 0;
  border-radius: 0;
  box-shadow: none;
}
.ln-btn--link:hover {
  text-decoration: underline;
  transform: none;
}

.ln-btn--block {
  width: 100%;
}
</style>
