<script setup lang="ts">
/** Roadmap or changelog. `state` drives how each marker is painted. */
import LnSection from '../primitives/LnSection.vue'
import LnHeading from '../primitives/LnHeading.vue'
import LnIcon from '../primitives/LnIcon.vue'
import type { SectionProps, TimelineItem } from './types.ts'

const props = withDefaults(
  defineProps<
    SectionProps & {
      eyebrow?: string
      title?: string
      text?: string
      items?: TimelineItem[]
      /** `side` puts the labels in a dedicated left column. */
      variant?: 'stacked' | 'side'
    }
  >(),
  { variant: 'stacked', width: 'narrow', align: 'start' }
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
    class="ln-timeline"
    :class="`ln-timeline--${props.variant}`"
  >
    <LnHeading
      :eyebrow="props.eyebrow"
      :title="props.title"
      :text="props.text"
      :align="props.align"
    />

    <ol class="ln-timeline__list">
      <li
        v-for="(item, i) in props.items"
        :key="`${item.title}-${i}`"
        class="ln-timeline__item"
        :class="`is-${item.state ?? 'done'}`"
      >
        <div class="ln-timeline__marker" aria-hidden="true">
          <LnIcon v-if="item.icon" :icon="item.icon" size="0.85rem" />
        </div>

        <div class="ln-timeline__body">
          <p v-if="item.label" class="ln-timeline__label">{{ item.label }}</p>
          <h3 v-if="item.title" class="ln-timeline__title" v-html="item.title" />
          <p v-if="item.text" class="ln-timeline__text" v-html="item.text" />
        </div>
      </li>
    </ol>
    <slot />
  </LnSection>
</template>

<style scoped>
.ln-timeline__list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.ln-timeline__item {
  position: relative;
  display: grid;
  grid-template-columns: 1.5rem minmax(0, 1fr);
  gap: 1rem;
  padding-bottom: 0.25rem;
}

@media (min-width: 640px) {
  .ln-timeline--side .ln-timeline__item {
    grid-template-columns: 7rem 1.5rem minmax(0, 1fr);
  }

  .ln-timeline--side .ln-timeline__label {
    grid-column: 1;
    grid-row: 1;
    text-align: right;
    padding-top: 0.1rem;
  }

  .ln-timeline--side .ln-timeline__marker {
    grid-column: 2;
  }

  .ln-timeline--side .ln-timeline__body {
    grid-column: 3;
  }
}

.ln-timeline__item:not(:last-child)::before {
  content: '';
  position: absolute;
  top: 1.75rem;
  bottom: -2rem;
  left: 0.6875rem;
  width: var(--ln-border-width);
  background-color: var(--ln-c-border);
}

@media (min-width: 640px) {
  .ln-timeline--side .ln-timeline__item:not(:last-child)::before {
    left: calc(7rem + 1rem + 0.6875rem);
  }
}

.ln-timeline__marker {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  margin-top: 0.15rem;
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid var(--ln-c-border-strong);
  border-radius: var(--ln-radius-pill);
  background-color: var(--ln-c-bg);
  color: var(--ln-c-text-2);
}

.ln-timeline__item.is-done .ln-timeline__marker {
  border-color: var(--ln-c-brand);
  background-color: var(--ln-c-brand);
  color: var(--ln-c-on-brand);
}

.ln-timeline__item.is-active .ln-timeline__marker {
  border-color: var(--ln-c-brand);
  color: var(--ln-c-brand-text);
  box-shadow: 0 0 0 4px var(--ln-c-brand-soft);
}

.ln-timeline__item.is-planned {
  opacity: 0.75;
}

.ln-timeline__item.is-planned .ln-timeline__marker {
  border-style: dashed;
}

.ln-timeline__body {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
}

.ln-timeline__label {
  margin: 0;
  color: var(--ln-c-text-2);
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.ln-timeline__title {
  margin: 0;
  border: 0;
  padding: 0;
  font-family: var(--ln-font-display);
  font-size: var(--ln-h3-size);
  font-weight: var(--ln-heading-weight);
  line-height: 1.3;
  color: var(--ln-c-text-1);
}

.ln-timeline__text {
  margin: 0;
  color: var(--ln-c-text-2);
  font-size: 0.9375rem;
  line-height: var(--ln-body-lh);
}
</style>
