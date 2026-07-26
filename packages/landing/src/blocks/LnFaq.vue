<script setup lang="ts">
/**
 * FAQ accordion built on native `<details>`: it opens and closes without JS,
 * is keyboard accessible by default and is indexed by search engines.
 */
import LnSection from '../primitives/LnSection.vue'
import LnHeading from '../primitives/LnHeading.vue'
import LnButtonGroup from '../primitives/LnButtonGroup.vue'
import type { ActionItem, FaqItem, SectionProps } from './types.ts'

const props = withDefaults(
  defineProps<
    SectionProps & {
      eyebrow?: string
      title?: string
      text?: string
      items?: FaqItem[]
      cols?: 1 | 2
      /** Only one answer open at a time (native `name` grouping). */
      exclusive?: boolean
      /** Actions under the list — "still have questions?". */
      actions?: ActionItem[]
    }
  >(),
  { cols: 1, exclusive: false, width: 'narrow', align: 'start' }
)
</script>

<template>
  <LnSection
    :id="props.id"
    :bg="props.bg"
    :width="props.cols === 2 ? props.width : 'narrow'"
    :padding="props.padding"
    :divider="props.divider"
    :no-reveal="props.noReveal"
    class="ln-faq"
  >
    <LnHeading
      :eyebrow="props.eyebrow"
      :title="props.title"
      :text="props.text"
      :align="props.align"
    />

    <div class="ln-faq__list" :class="`ln-faq__list--${props.cols}`">
      <details
        v-for="(item, i) in props.items"
        :key="`${item.question}-${i}`"
        class="ln-faq__item"
        :name="props.exclusive ? `ln-faq-${props.id ?? 'default'}` : undefined"
        :open="item.open"
      >
        <summary class="ln-faq__question">
          <span v-html="item.question" />
          <span class="ln-faq__marker" aria-hidden="true" />
        </summary>
        <div class="ln-faq__answer" v-html="item.answer" />
      </details>
      <slot />
    </div>

    <LnButtonGroup
      v-if="props.actions?.length"
      :actions="props.actions"
      :align="props.align"
      class="ln-faq__actions"
    />
  </LnSection>
</template>

<style scoped>
.ln-faq__list--1 {
  display: flex;
  flex-direction: column;
}

.ln-faq__list--2 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0 var(--ln-gap);
}

@media (min-width: 860px) {
  .ln-faq__list--2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.ln-faq__item {
  border-bottom: var(--ln-border-width) solid var(--ln-c-border);
}

.ln-faq__question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.125rem 0;
  cursor: pointer;
  list-style: none;
  font-family: var(--ln-font-display);
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--ln-c-text-1);
  transition: color var(--ln-duration) var(--ln-ease);
}

.ln-faq__question::-webkit-details-marker {
  display: none;
}

.ln-faq__question:hover {
  color: var(--ln-c-brand);
}

.ln-faq__question:focus-visible {
  outline: 2px solid var(--ln-c-brand);
  outline-offset: 2px;
  border-radius: var(--ln-radius-xs);
}

.ln-faq__marker {
  position: relative;
  flex: none;
  width: 0.875rem;
  height: 0.875rem;
}

.ln-faq__marker::before,
.ln-faq__marker::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  border-radius: 2px;
  background-color: currentcolor;
  transition: transform var(--ln-duration) var(--ln-ease);
}

.ln-faq__marker::after {
  transform: rotate(90deg);
}

.ln-faq__item[open] .ln-faq__marker::after {
  transform: rotate(0deg);
}

.ln-faq__answer {
  padding-bottom: 1.25rem;
  color: var(--ln-c-text-2);
  line-height: var(--ln-body-lh);
}

.ln-faq__answer :deep(a) {
  color: var(--ln-c-brand);
}

.ln-faq__answer :deep(p) {
  margin: 0 0 0.75rem;
}

.ln-faq__answer :deep(p:last-child) {
  margin-bottom: 0;
}

.ln-faq__actions {
  margin-top: 2.5rem;
}
</style>
