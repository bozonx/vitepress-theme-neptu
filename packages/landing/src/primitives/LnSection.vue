<script setup lang="ts">
/**
 * Outer wrapper of every block: paints the surface, owns the vertical rhythm
 * and constrains the content width. Blocks never set their own page padding.
 *
 * `align` is intentionally not applied here: a section does not know how its
 * content should be aligned. Blocks forward `align` to `LnHeading` /
 * `LnButtonGroup` where it has meaning.
 */
import { computed } from 'vue'
import type { SectionProps } from '../blocks/types.ts'
import LnReveal from './LnReveal.vue'

const props = withDefaults(defineProps<SectionProps & { tag?: string }>(), {
  bg: 'base',
  width: 'default',
  padding: 'md',
  align: 'start',
  divider: false,
  reveal: true,
  noReveal: false,
  tag: 'section',
})

// `reveal` is the canonical switch (default true); `noReveal: true` opts out.
// An explicit `reveal: false` wins over a stale `noReveal: false`.
const revealDisabled = computed(() => props.reveal === false || props.noReveal === true)
</script>

<template>
  <component
    :is="props.tag"
    :id="props.id"
    class="ln-section"
    :class="[
      `ln-section--bg-${props.bg}`,
      `ln-section--pad-${props.padding}`,
      { 'ln-section--divider': props.divider },
    ]"
  >
    <LnReveal :disabled="revealDisabled" class="ln-section__inner" :class="`ln-section__inner--${props.width}`">
      <slot />
    </LnReveal>
  </component>
</template>

<style scoped>
.ln-section {
  position: relative;
  width: 100%;
  padding-inline: var(--ln-page-px);
  color: var(--ln-c-text-1);
}

.ln-section__inner {
  margin-inline: auto;
  width: 100%;
  container-type: inline-size;
  container-name: ln-section;
}

.ln-section__inner--narrow {
  max-width: var(--ln-container-narrow);
}
.ln-section__inner--default {
  max-width: var(--ln-container);
}
.ln-section__inner--wide {
  max-width: var(--ln-container-wide);
}
.ln-section__inner--full {
  max-width: none;
}

/**** Padding scale */
.ln-section--pad-none {
  padding-block: 0;
}
.ln-section--pad-sm {
  padding-block: var(--ln-section-py-sm);
}
.ln-section--pad-md {
  padding-block: var(--ln-section-py);
}
.ln-section--pad-lg {
  padding-block: var(--ln-section-py-lg);
}

/**** Surfaces */
.ln-section--bg-base {
  background-color: var(--ln-c-bg);
}
.ln-section--bg-soft {
  background-color: var(--ln-c-bg-soft);
}
.ln-section--bg-mute {
  background-color: var(--ln-c-bg-mute);
}
.ln-section--bg-transparent {
  background-color: transparent;
}

.ln-section--bg-inverse {
  background-color: var(--ln-c-bg-inverse);
  --ln-c-text-1: var(--ln-c-on-inverse);
  --ln-c-text-2: var(--ln-c-on-inverse-2);
  /* The inverse surface flips between light and dark — re-derive brand text. */
  --ln-c-brand-text: color-mix(in srgb, var(--ln-c-brand) 62%, var(--ln-c-on-inverse));
  --ln-c-border: color-mix(in srgb, currentcolor 18%, transparent);
  --ln-card-bg: color-mix(in srgb, currentcolor 6%, transparent);
  --ln-card-border-color: color-mix(in srgb, currentcolor 14%, transparent);
  color: var(--ln-c-on-inverse);
}

.ln-section--bg-brand {
  background-color: var(--ln-c-brand);
  --ln-c-text-1: var(--ln-c-on-brand);
  /* Brand-on-brand is invisible: eyebrows and accents fall back to the ink. */
  --ln-c-brand-text: var(--ln-c-on-brand);
  --ln-c-brand-soft: color-mix(in srgb, var(--ln-c-on-brand) 16%, transparent);
  --ln-c-text-2: color-mix(in srgb, var(--ln-c-on-brand) 78%, transparent);
  --ln-c-border: color-mix(in srgb, var(--ln-c-on-brand) 26%, transparent);
  --ln-card-bg: color-mix(in srgb, var(--ln-c-on-brand) 10%, transparent);
  --ln-card-border-color: color-mix(in srgb, var(--ln-c-on-brand) 20%, transparent);
  color: var(--ln-c-on-brand);
}

.ln-section--divider {
  border-top: var(--ln-border-width) solid var(--ln-c-border);
}
</style>
