<script setup lang="ts">
/** Key numbers: users, downloads, uptime, stars. */
import LnSection from '../primitives/LnSection.vue'
import LnHeading from '../primitives/LnHeading.vue'
import LnGrid from '../primitives/LnGrid.vue'
import LnCard from '../primitives/LnCard.vue'
import LnIcon from '../primitives/LnIcon.vue'
import type { SectionProps, StatItem } from './types.ts'

const props = withDefaults(
  defineProps<
    SectionProps & {
      eyebrow?: string
      title?: string
      text?: string
      items?: StatItem[]
      cols?: 2 | 3 | 4
      variant?: 'plain' | 'card' | 'divided'
    }
  >(),
  { cols: 4, variant: 'plain', align: 'center', padding: 'sm' }
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
        :plain="props.variant !== 'card'"
        :padding="props.variant === 'card' ? 'md' : 'sm'"
        class="ln-stat"
        :class="{ 'ln-stat--center': props.align === 'center' }"
      >
        <LnIcon v-if="item.icon" :icon="item.icon" size="1.5rem" class="ln-stat__icon" />
        <p class="ln-stat__value">{{ item.value }}</p>
        <p v-if="item.label" class="ln-stat__label">{{ item.label }}</p>
        <p v-if="item.text" class="ln-stat__text">{{ item.text }}</p>
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
</style>
