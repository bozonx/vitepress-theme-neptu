<script setup lang="ts">
/** "How it works" — a numbered sequence, laid out in a row or a column. */
import LnSection from '../primitives/LnSection.vue'
import LnHeading from '../primitives/LnHeading.vue'
import LnIcon from '../primitives/LnIcon.vue'
import LnMedia from '../primitives/LnMedia.vue'
import type { SectionProps, StepItem } from './types.ts'

const props = withDefaults(
  defineProps<
    SectionProps & {
      eyebrow?: string
      title?: string
      text?: string
      items?: StepItem[]
      variant?: 'row' | 'column'
      /** Show connecting lines between the markers. */
      connector?: boolean
    }
  >(),
  { variant: 'row', connector: true, align: 'start' }
)
</script>

<template>
  <LnSection
    :id="props.id"
    :bg="props.bg"
    :width="props.width"
    :padding="props.padding"
    :divider="props.divider"
    :no-reveal="props.noReveal"
    class="ln-steps"
    :class="[`ln-steps--${props.variant}`, { 'ln-steps--connected': props.connector }]"
  >
    <LnHeading
      :eyebrow="props.eyebrow"
      :title="props.title"
      :text="props.text"
      :align="props.align"
    />

    <ol class="ln-steps__list">
      <li v-for="(item, i) in props.items" :key="`${item.title}-${i}`" class="ln-step">
        <div class="ln-step__marker" aria-hidden="true">
          <LnIcon v-if="item.icon" :icon="item.icon" size="1.1rem" />
          <span v-else>{{ item.label ?? i + 1 }}</span>
        </div>

        <div class="ln-step__body">
          <p v-if="item.eyebrow" class="ln-step__eyebrow">{{ item.eyebrow }}</p>
          <h3 v-if="item.title" class="ln-step__title" v-html="item.title" />
          <p v-if="item.text" class="ln-step__text" v-html="item.text" />
          <LnMedia
            v-if="item.image"
            :media="item.image"
            rounded="md"
            border
            class="ln-step__media"
          />
        </div>
      </li>
    </ol>
    <slot />
  </LnSection>
</template>

<style scoped>
.ln-steps__list {
  display: grid;
  gap: clamp(1.5rem, 1rem + 2vw, 3rem);
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: ln-step;
}

.ln-steps--row .ln-steps__list {
  grid-template-columns: 1fr;
}

@media (min-width: 860px) {
  .ln-steps--row .ln-steps__list {
    grid-auto-flow: column;
    grid-auto-columns: minmax(0, 1fr);
  }
}

.ln-step {
  position: relative;
  display: flex;
  gap: 1rem;
  min-width: 0;
}

.ln-steps--row .ln-step {
  flex-direction: column;
}

.ln-step__marker {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 2.5rem;
  height: 2.5rem;
  border: var(--ln-border-width) solid var(--ln-c-border);
  border-radius: var(--ln-radius-pill);
  background-color: var(--ln-c-bg);
  color: var(--ln-c-brand-text);
  font-family: var(--ln-font-display);
  font-weight: 700;
}

/**** Connectors */
.ln-steps--connected.ln-steps--column .ln-step:not(:last-child)::before {
  content: '';
  position: absolute;
  top: 2.75rem;
  left: 1.25rem;
  bottom: -1.5rem;
  width: var(--ln-border-width);
  background-color: var(--ln-c-border);
}

@media (min-width: 860px) {
  .ln-steps--connected.ln-steps--row .ln-step:not(:last-child)::before {
    content: '';
    position: absolute;
    top: 1.25rem;
    left: 2.75rem;
    right: calc(-1 * clamp(1.5rem, 1rem + 2vw, 3rem));
    height: var(--ln-border-width);
    background-color: var(--ln-c-border);
  }
}

.ln-step__body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
}

.ln-step__eyebrow {
  margin: 0;
  color: var(--ln-c-brand-text);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.ln-step__title {
  margin: 0;
  border: 0;
  padding: 0;
  font-family: var(--ln-font-display);
  font-size: var(--ln-h3-size);
  font-weight: var(--ln-heading-weight);
  line-height: 1.3;
  color: var(--ln-c-text-1);
}

.ln-step__text {
  margin: 0;
  color: var(--ln-c-text-2);
  font-size: 0.9375rem;
  line-height: var(--ln-body-lh);
}

.ln-step__media {
  margin-top: 0.5rem;
}
</style>
