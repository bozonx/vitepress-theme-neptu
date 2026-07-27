<script setup lang="ts">
/** Grid of feature cards — the workhorse block of any landing page. */
import LnSection from '../primitives/LnSection.vue'
import LnHeading from '../primitives/LnHeading.vue'
import LnGrid from '../primitives/LnGrid.vue'
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
      cols?: 1 | 2 | 3 | 4
      /** `card` draws a surface, `plain` drops it, `bordered` keeps only lines. */
      variant?: 'card' | 'plain' | 'bordered'
      /** Icon placement inside a card. */
      iconPosition?: 'top' | 'inline'
      iconSize?: string
    }
  >(),
  {
    cols: 3,
    variant: 'card',
    iconPosition: 'top',
    iconSize: '1.75rem',
    align: 'start',
  }
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
    class="ln-features"
    :class="`ln-features--${props.variant}`"
  >
    <LnHeading
      :eyebrow="props.eyebrow"
      :title="props.title"
      :text="props.text"
      :align="props.align"
    />

    <LnGrid :cols="props.cols">
        <LnCard
          v-for="(item, i) in props.items"
          :key="`${item.title}-${i}`"
          :link="item.link"
          :target="item.target"
          :rel="item.rel"
          :plain="props.variant !== 'card'"
          :hoverable="props.variant === 'card'"
          class="ln-feature"
          :class="`ln-feature--icon-${props.iconPosition}`"
        >
          <LnMedia
            v-if="item.image"
            :media="item.image"
            ratio="16/9"
            rounded="md"
            class="ln-feature__image"
          />
          <LnIcon
            v-if="item.icon"
            :icon="item.icon"
            :size="props.iconSize"
            class="ln-feature__icon"
          />

          <div class="ln-feature__body">
            <p v-if="item.badge" class="ln-feature__badge">{{ item.badge }}</p>
            <h3 v-if="item.title" class="ln-feature__title" v-html="item.title" />
            <p v-if="item.text" class="ln-feature__text" v-html="item.text" />
            <span v-if="item.linkText" class="ln-feature__link">{{ item.linkText }}</span>
          </div>
        </LnCard>
      <!-- Appended after the items, like in every other block. -->
      <slot />
    </LnGrid>
  </LnSection>
</template>

<style scoped>
.ln-feature {
  gap: 1rem;
}

.ln-feature--icon-inline {
  flex-direction: row;
  align-items: flex-start;
}

.ln-features--bordered .ln-feature {
  border-color: var(--ln-c-border);
  border-radius: 0;
  border-width: 0;
  border-left-width: var(--ln-border-width);
  border-left-style: solid;
  padding-block: 0.25rem;
}

.ln-feature__icon {
  color: var(--ln-c-brand-text);
}

.ln-feature__image {
  margin-bottom: 0.25rem;
}

.ln-feature__body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
}

.ln-feature__badge {
  margin: 0;
  align-self: flex-start;
  border-radius: var(--ln-radius-pill);
  background-color: var(--ln-c-brand-soft);
  padding: 0.125rem 0.625rem;
  color: var(--ln-c-brand-text);
  font-size: 0.75rem;
  font-weight: 600;
}

.ln-feature__title {
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

.ln-feature__text {
  margin: 0;
  color: var(--ln-c-text-2);
  font-size: 0.9375rem;
  line-height: var(--ln-body-lh);
}

.ln-feature__link {
  margin-top: auto;
  padding-top: 0.25rem;
  color: var(--ln-c-brand-text);
  font-size: 0.875rem;
  font-weight: 600;
}
</style>
