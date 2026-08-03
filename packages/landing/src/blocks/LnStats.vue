<script setup lang="ts">
/** Key numbers: users, downloads, uptime, stars. */
import LnSection from '../primitives/LnSection.vue'
import LnHeading from '../primitives/LnHeading.vue'
import LnGrid from '../primitives/LnGrid.vue'
import LnCard from '../primitives/LnCard.vue'
import LnIcon from '../primitives/LnIcon.vue'
import type { HeadingProps, SectionProps, StatItem } from './types.ts'
import { useSectionProps } from './sectionProps.ts'

const props = withDefaults(
  defineProps<
    SectionProps & HeadingProps & {
      items?: StatItem[]
      cols?: 2 | 3 | 4
      variant?: 'plain' | 'card' | 'divided'
    }
  >(),
  { cols: 4, variant: 'plain', align: 'center', padding: 'sm' }
)
const sectionProps = useSectionProps(props)
</script>

<template>
  <LnSection
    v-bind="sectionProps"
    class="ln-stats"
    :class="`ln-stats--${props.variant}`"
  >
    <LnHeading
      v-if="props.eyebrow || props.title || props.text"
      :eyebrow="props.eyebrow"
      :title="props.title"
      :text="props.text"
      :align="props.align"
    />

    <LnGrid :cols="props.cols" gap="sm">
      <LnCard
        v-for="(item, i) in props.items"
        :key="`${item.value}-${i}`"
        :link="item.link"
        :plain="props.variant !== 'card'"
        :padding="props.variant === 'card' ? 'md' : 'sm'"
        class="ln-stat"
        :class="{ 'ln-stat--center': props.align === 'center' }"
      >
        <LnIcon v-if="item.icon" :icon="item.icon" size="1.5rem" class="ln-stat__icon" />
        <p class="ln-stat__value">{{ item.value }}</p>
        <p v-if="item.label" class="ln-stat__label">{{ item.label }}</p>
        <p v-if="item.text" class="ln-stat__text">{{ item.text }}</p>
        <p v-if="item.trend" class="ln-stat__trend" :class="`is-${item.trendDirection ?? 'neutral'}`">{{ item.trend }}</p>
        <p v-if="item.source" class="ln-stat__source">{{ item.source }}</p>
        <p v-if="item.note" class="ln-stat__note">{{ item.note }}</p>
      </LnCard>
      <slot />
    </LnGrid>
  </LnSection>
</template>

<style scoped>
.ln-stat {
  gap: 0.375rem;
}

.ln-stat--center {
  align-items: center;
  text-align: center;
}

.ln-stats--divided .ln-stat {
  border-left: var(--ln-border-width) solid var(--ln-c-border);
  border-radius: 0;
  padding-left: 1.25rem;
}

.ln-stat__icon {
  color: var(--ln-c-brand-text);
}

.ln-stat__value {
  margin: 0;
  font-family: var(--ln-font-display);
  font-size: clamp(2rem, 1.4rem + 2vw, 3rem);
  font-weight: var(--ln-heading-weight);
  letter-spacing: var(--ln-heading-tracking);
  line-height: 1.1;
  color: var(--ln-c-brand-text);
}

.ln-stat__label {
  margin: 0;
  font-weight: 600;
  color: var(--ln-c-text-1);
}

.ln-stat__text {
  margin: 0;
  color: var(--ln-c-text-2);
  font-size: 0.875rem;
  line-height: 1.5;
}
.ln-stat__trend { margin: 0.25rem 0 0; color: var(--ln-c-brand-text); font-size: 0.875rem; font-weight: 600; }
.ln-stat__trend.is-down { color: var(--ln-c-danger); }
.ln-stat__source, .ln-stat__note { margin: 0; color: var(--ln-c-text-3); font-size: 0.75rem; line-height: 1.4; }
</style>
