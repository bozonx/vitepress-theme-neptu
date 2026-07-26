<script setup lang="ts">
/**
 * Bento grid — feature tiles of uneven size. Set `span` / `rowSpan` on an item
 * to make it take two columns or two rows.
 */
import LnSection from '../primitives/LnSection.vue'
import LnHeading from '../primitives/LnHeading.vue'
import LnCard from '../primitives/LnCard.vue'
import LnIcon from '../primitives/LnIcon.vue'
import LnMedia from '../primitives/LnMedia.vue'
import type { FeatureItem, SectionProps } from './types.ts'

const props = withDefaults(
  defineProps<
    SectionProps & {
      eyebrow?: string
      title?: string
      text?: string
      items?: FeatureItem[]
      /** Desktop column count of the base grid. */
      cols?: 2 | 3 | 4
    }
  >(),
  { cols: 3, align: 'start' }
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
    class="ln-bento"
  >
    <LnHeading
      :eyebrow="props.eyebrow"
      :title="props.title"
      :text="props.text"
      :align="props.align"
    />

    <div class="ln-bento__grid" :style="{ '--ln-bento-cols': props.cols }">
      <LnCard
        v-for="(item, i) in props.items"
        :key="`${item.title}-${i}`"
        :link="item.link"
        :target="item.target"
        :rel="item.rel"
        hoverable
        class="ln-bento__tile"
        :style="{
          '--ln-tile-span': item.span ?? 1,
          '--ln-tile-row-span': item.rowSpan ?? 1,
        }"
      >
        <LnIcon v-if="item.icon" :icon="item.icon" class="ln-bento__icon" />
        <p v-if="item.badge" class="ln-bento__badge">{{ item.badge }}</p>
        <h3 v-if="item.title" class="ln-bento__title" v-html="item.title" />
        <p v-if="item.text" class="ln-bento__text" v-html="item.text" />
        <LnMedia
          v-if="item.image"
          :media="item.image"
          rounded="md"
          class="ln-bento__media"
        />
        <span v-if="item.linkText" class="ln-bento__link">{{ item.linkText }}</span>
      </LnCard>
      <slot />
    </div>
  </LnSection>
</template>

<style scoped>
.ln-bento__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--ln-gap);
  grid-auto-rows: minmax(11rem, auto);
}

@media (min-width: 640px) {
  .ln-bento__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 960px) {
  .ln-bento__grid {
    grid-template-columns: repeat(var(--ln-bento-cols, 3), minmax(0, 1fr));
  }

  .ln-bento__tile {
    grid-column: span min(var(--ln-tile-span, 1), var(--ln-bento-cols, 3));
    grid-row: span var(--ln-tile-row-span, 1);
  }
}

.ln-bento__tile {
  gap: 0.75rem;
  overflow: hidden;
}

.ln-bento__icon {
  color: var(--ln-c-brand);
}

.ln-bento__badge {
  margin: 0;
  align-self: flex-start;
  border-radius: var(--ln-radius-pill);
  background-color: var(--ln-c-brand-soft);
  padding: 0.125rem 0.625rem;
  color: var(--ln-c-brand);
  font-size: 0.75rem;
  font-weight: 600;
}

.ln-bento__title {
  margin: 0;
  border: 0;
  padding: 0;
  font-family: var(--ln-font-display);
  font-size: var(--ln-h3-size);
  font-weight: var(--ln-heading-weight);
  letter-spacing: var(--ln-heading-tracking);
  line-height: 1.3;
  color: var(--ln-c-text-1);
}

.ln-bento__text {
  margin: 0;
  color: var(--ln-c-text-2);
  font-size: 0.9375rem;
  line-height: var(--ln-body-lh);
}

.ln-bento__media {
  margin-top: auto;
}

.ln-bento__link {
  margin-top: auto;
  color: var(--ln-c-brand);
  font-size: 0.875rem;
  font-weight: 600;
}
</style>
