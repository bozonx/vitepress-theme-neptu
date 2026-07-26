<script setup lang="ts">
/**
 * Eyebrow + title + lead. `title` and `text` accept inline HTML (`<br>`,
 * `<span class="ln-accent">`) because landing copy usually needs it.
 */
import type { Align, HeadingProps } from '../blocks/types.ts'

const props = withDefaults(
  defineProps<
    HeadingProps & {
      align?: Align
      /** Heading tag — keep exactly one `h1` per page. */
      level?: 'h1' | 'h2' | 'h3'
      /** Visual size, independent of the semantic level. */
      size?: 'display' | 'section' | 'card'
      /** Bottom margin. */
      spacing?: boolean
    }
  >(),
  { align: 'start', level: 'h2', size: 'section', spacing: true }
)
</script>

<template>
  <header
    v-if="props.eyebrow || props.title || props.text || $slots.default"
    class="ln-heading"
    :class="[
      `ln-heading--${props.align}`,
      `ln-heading--${props.size}`,
      { 'ln-heading--spaced': props.spacing },
    ]"
  >
    <p v-if="props.eyebrow" class="ln-heading__eyebrow">
      <slot name="eyebrow">{{ props.eyebrow }}</slot>
    </p>

    <component :is="props.level" v-if="props.title || $slots.title" class="ln-heading__title">
      <slot name="title"><span v-html="props.title" /></slot>
    </component>

    <p v-if="props.text || $slots.text" class="ln-heading__text">
      <slot name="text"><span v-html="props.text" /></slot>
    </p>

    <slot />
  </header>
</template>

<style scoped>
.ln-heading {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ln-heading--spaced {
  margin-bottom: clamp(2rem, 1.5rem + 1.5vw, 3.5rem);
}

.ln-heading--center {
  align-items: center;
  text-align: center;
}

.ln-heading__eyebrow {
  margin: 0;
  color: var(--ln-c-brand);
  font-size: var(--ln-eyebrow-size);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.ln-heading__title {
  margin: 0;
  border: 0;
  padding: 0;
  font-family: var(--ln-font-display);
  font-weight: var(--ln-heading-weight);
  letter-spacing: var(--ln-heading-tracking);
  line-height: var(--ln-heading-lh);
  color: var(--ln-c-text-1);
  text-wrap: balance;
}

.ln-heading--display .ln-heading__title {
  font-size: var(--ln-h1-size);
}
.ln-heading--section .ln-heading__title {
  font-size: var(--ln-h2-size);
}
.ln-heading--card .ln-heading__title {
  font-size: var(--ln-h3-size);
}

.ln-heading__text {
  margin: 0;
  max-width: 46ch;
  color: var(--ln-c-text-2);
  font-size: var(--ln-lead-size);
  line-height: var(--ln-body-lh);
  text-wrap: pretty;
}

.ln-heading--center .ln-heading__text {
  max-width: 58ch;
}

.ln-heading--card .ln-heading__text {
  font-size: 0.9375rem;
}
</style>
