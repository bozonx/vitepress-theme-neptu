<script setup lang="ts">
/**
 * Content width constraint for custom markup placed outside `LnSection`
 * (for example hand-written markdown between blocks).
 */
import type { SectionWidth } from '../blocks/types.ts'

const props = withDefaults(
  defineProps<{ width?: SectionWidth; padded?: boolean; tag?: string }>(),
  { width: 'default', padded: true, tag: 'div' }
)
</script>

<template>
  <component
    :is="props.tag"
    class="ln-container"
    :class="[`ln-container--${props.width}`, { 'ln-container--padded': props.padded }]"
  >
    <slot />
  </component>
</template>

<style scoped>
.ln-container {
  margin-inline: auto;
  width: 100%;
}

.ln-container--padded {
  padding-inline: var(--ln-page-px);
}

.ln-container--narrow {
  max-width: var(--ln-container-narrow);
}
.ln-container--default {
  max-width: var(--ln-container);
}
.ln-container--wide {
  max-width: var(--ln-container-wide);
}
.ln-container--full {
  max-width: none;
}
</style>
