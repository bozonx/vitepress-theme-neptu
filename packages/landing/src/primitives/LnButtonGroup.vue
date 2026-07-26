<script setup lang="ts">
/** Renders a list of {@link ActionItem} as a wrapping row of buttons. */
import LnButton from './LnButton.vue'
import type { ActionItem, Align, ButtonSize } from '../blocks/types.ts'

const props = withDefaults(
  defineProps<{
    actions?: ActionItem[]
    align?: Align
    /** Default size for actions that do not set their own. */
    size?: ButtonSize
  }>(),
  { align: 'start', size: 'md' }
)
</script>

<template>
  <div
    v-if="(props.actions && props.actions.length) || $slots.default"
    class="ln-actions"
    :class="`ln-actions--${props.align}`"
  >
    <LnButton
      v-for="(action, i) in props.actions"
      :key="`${action.text}-${i}`"
      :text="action.text"
      :link="action.link"
      :variant="action.variant ?? (i === 0 ? 'brand' : 'alt')"
      :size="action.size ?? props.size"
      :icon="action.icon"
      :target="action.target"
      :rel="action.rel"
    />
    <slot />
  </div>
</template>

<style scoped>
.ln-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.ln-actions--center {
  justify-content: center;
}
</style>
