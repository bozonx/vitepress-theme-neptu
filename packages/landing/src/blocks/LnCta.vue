<script setup lang="ts">
/** Call to action. Put one in the middle of the page and one at the end. */
import { computed } from 'vue'
import LnSection from '../primitives/LnSection.vue'
import LnHeading from '../primitives/LnHeading.vue'
import LnButtonGroup from '../primitives/LnButtonGroup.vue'
import LnMedia from '../primitives/LnMedia.vue'
import type { ActionItem, MediaLike, SectionBg, SectionProps } from './types.ts'

const props = withDefaults(
  defineProps<
    SectionProps & {
      eyebrow?: string
      title?: string
      text?: string
      actions?: ActionItem[]
      image?: MediaLike
      note?: string
      /**
       * `banner` — full-width strip, `card` — inset panel,
       * `split` — copy left, actions right.
       */
      variant?: 'banner' | 'card' | 'split'
      /**
       * `card` only: surface the panel sits on. `bg` colors the panel itself,
       * so this is what keeps the page-level background alternation working.
       */
      surface?: SectionBg
    }
  >(),
  { variant: 'banner', bg: 'brand', align: 'center', surface: 'base' }
)

/** On a brand surface the default brand button would be invisible. */
const onBrand = computed(() => props.bg === 'brand')
</script>

<template>
  <LnSection
    :id="props.id"
    :bg="props.variant === 'card' ? props.surface : props.bg"
    :width="props.width"
    :padding="props.padding"
    :divider="props.divider"
    :no-reveal="props.noReveal"
    class="ln-cta"
    :class="`ln-cta--${props.variant}`"
  >
    <div
      class="ln-cta__inner"
      :class="{ 'ln-cta__panel': props.variant === 'card' }"
      :data-ln-cta-bg="props.variant === 'card' ? props.bg : undefined"
      :data-ln-on-brand="onBrand ? '' : undefined"
    >
      <div class="ln-cta__copy">
        <LnHeading
          :eyebrow="props.eyebrow"
          :title="props.title"
          :text="props.text"
          :align="props.variant === 'split' ? 'start' : props.align"
          :spacing="false"
        />
        <p v-if="props.note && props.variant !== 'split'" class="ln-cta__note">
          {{ props.note }}
        </p>
      </div>

      <div class="ln-cta__side">
        <LnButtonGroup
          v-if="props.actions?.length"
          :actions="props.actions"
          :align="props.variant === 'split' ? 'start' : props.align"
          size="lg"
        />
        <p v-if="props.note && props.variant === 'split'" class="ln-cta__note">
          {{ props.note }}
        </p>
      </div>

      <LnMedia v-if="props.image" :media="props.image" class="ln-cta__media" />
      <slot />
    </div>
  </LnSection>
</template>

<style scoped>
.ln-cta__inner {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.ln-cta--banner .ln-cta__inner,
.ln-cta--card .ln-cta__inner {
  align-items: center;
  text-align: center;
}

.ln-cta__panel {
  border: var(--ln-border-width) solid var(--ln-card-border-color);
  border-radius: var(--ln-card-radius);
  padding: clamp(2rem, 1.5rem + 3vw, 4.5rem) clamp(1.5rem, 1rem + 2vw, 3rem);
  box-shadow: var(--ln-card-shadow);
}

.ln-cta__panel[data-ln-cta-bg='brand'] {
  background-color: var(--ln-c-brand);
  border-color: transparent;
  --ln-c-text-1: var(--ln-c-on-brand);
  --ln-c-text-2: color-mix(in srgb, var(--ln-c-on-brand) 80%, transparent);
  --ln-c-brand-text: var(--ln-c-on-brand);
  --ln-c-brand-soft: color-mix(in srgb, var(--ln-c-on-brand) 16%, transparent);
  color: var(--ln-c-on-brand);
}

.ln-cta__panel[data-ln-cta-bg='inverse'] {
  background-color: var(--ln-c-bg-inverse);
  border-color: transparent;
  --ln-c-text-1: var(--ln-c-on-inverse);
  --ln-c-text-2: var(--ln-c-on-inverse-2);
  --ln-c-brand-text: color-mix(in srgb, var(--ln-c-brand) 62%, var(--ln-c-on-inverse));
  color: var(--ln-c-on-inverse);
}

.ln-cta__panel[data-ln-cta-bg='soft'] {
  background-color: var(--ln-c-bg-soft);
}

.ln-cta--split .ln-cta__inner {
  align-items: center;
}

@media (min-width: 860px) {
  .ln-cta--split .ln-cta__inner {
    flex-direction: row;
    justify-content: space-between;
    gap: 3rem;
  }
}

.ln-cta__copy {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
}

.ln-cta__side {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: none;
}

.ln-cta__note {
  margin: 0;
  color: var(--ln-c-text-2);
  font-size: 0.875rem;
}

.ln-cta__media {
  max-width: 22rem;
}

/* On a brand surface the default brand button would disappear. */
.ln-cta__inner[data-ln-on-brand] :deep(.ln-btn--brand) {
  background-color: var(--ln-c-on-brand);
  color: var(--ln-c-brand);
}

.ln-cta__inner[data-ln-on-brand] :deep(.ln-btn--alt) {
  background-color: transparent;
  border-color: currentcolor;
  color: inherit;
}
</style>
