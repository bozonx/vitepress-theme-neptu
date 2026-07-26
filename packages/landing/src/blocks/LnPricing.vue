<script setup lang="ts">
/**
 * Pricing plans with an optional monthly/yearly switch. The switch appears
 * only when at least one plan defines `priceYearly`.
 */
import { computed, ref } from 'vue'
import LnSection from '../primitives/LnSection.vue'
import LnHeading from '../primitives/LnHeading.vue'
import LnGrid from '../primitives/LnGrid.vue'
import LnCard from '../primitives/LnCard.vue'
import LnButton from '../primitives/LnButton.vue'
import LnIcon from '../primitives/LnIcon.vue'
import type { PricingFeature, PricingPlan, SectionProps } from './types.ts'

const props = withDefaults(
  defineProps<
    SectionProps & {
      eyebrow?: string
      title?: string
      text?: string
      items?: PricingPlan[]
      cols?: 2 | 3 | 4
      /** Labels of the period switch. */
      monthlyLabel?: string
      yearlyLabel?: string
      /** Small print under the plans. */
      note?: string
    }
  >(),
  { cols: 3, monthlyLabel: 'Monthly', yearlyLabel: 'Yearly', align: 'center' }
)

const yearly = ref(false)

const hasToggle = computed(() =>
  Boolean(props.items?.some((plan) => plan.priceYearly))
)

const priceOf = (plan: PricingPlan): string | undefined =>
  yearly.value && plan.priceYearly ? plan.priceYearly : plan.price

const periodOf = (plan: PricingPlan): string | undefined =>
  yearly.value && plan.periodYearly ? plan.periodYearly : plan.period

const normalize = (feature: string | PricingFeature): PricingFeature =>
  typeof feature === 'string' ? { text: feature, included: true } : { included: true, ...feature }
</script>

<template>
  <LnSection
    :id="props.id"
    :bg="props.bg"
    :width="props.width"
    :padding="props.padding"
    :divider="props.divider"
    :no-reveal="props.noReveal"
    class="ln-pricing"
  >
    <LnHeading
      :eyebrow="props.eyebrow"
      :title="props.title"
      :text="props.text"
      :align="props.align"
      :spacing="!hasToggle"
    />

    <div v-if="hasToggle" class="ln-pricing__toggle" role="group" aria-label="Billing period">
      <button
        type="button"
        class="ln-pricing__toggle-btn"
        :class="{ 'is-active': !yearly }"
        :aria-pressed="!yearly"
        @click="yearly = false"
      >
        {{ props.monthlyLabel }}
      </button>
      <button
        type="button"
        class="ln-pricing__toggle-btn"
        :class="{ 'is-active': yearly }"
        :aria-pressed="yearly"
        @click="yearly = true"
      >
        {{ props.yearlyLabel }}
      </button>
    </div>

    <LnGrid :cols="props.cols">
      <LnCard
        v-for="(plan, i) in props.items"
        :key="`${plan.title}-${i}`"
        :featured="plan.featured"
        padding="lg"
        class="ln-plan"
      >
        <p v-if="plan.badge" class="ln-plan__badge">{{ plan.badge }}</p>
        <h3 v-if="plan.title" class="ln-plan__title">{{ plan.title }}</h3>
        <p v-if="plan.text" class="ln-plan__text" v-html="plan.text" />

        <p v-if="priceOf(plan)" class="ln-plan__price">
          <span
            class="ln-plan__amount"
            :class="{ 'ln-plan__amount--words': !/\d/.test(priceOf(plan) ?? '') }"
          >{{ priceOf(plan) }}</span>
          <span v-if="periodOf(plan)" class="ln-plan__period">{{ periodOf(plan) }}</span>
        </p>

        <LnButton
          v-if="plan.action"
          :text="plan.action.text"
          :link="plan.action.link"
          :variant="plan.action.variant ?? (plan.featured ? 'brand' : 'alt')"
          :target="plan.action.target"
          block
          class="ln-plan__action"
        />

        <ul v-if="plan.features?.length" class="ln-plan__features">
          <li
            v-for="(feature, fi) in plan.features.map(normalize)"
            :key="fi"
            :class="{ 'is-excluded': feature.included === false }"
          >
            <LnIcon
              :icon="feature.included === false ? 'fa6-solid:xmark' : 'fa6-solid:check'"
              size="0.85rem"
            />
            <span>{{ feature.text }}</span>
          </li>
        </ul>
      </LnCard>
      <slot />
    </LnGrid>

    <p v-if="props.note" class="ln-pricing__note">{{ props.note }}</p>
  </LnSection>
</template>

<style scoped>
.ln-pricing__toggle {
  display: flex;
  gap: 0.25rem;
  /* Sits between two block-level children — center it explicitly. */
  margin: 0 auto clamp(2rem, 1.5rem + 1.5vw, 3rem);
  width: fit-content;
  border: var(--ln-border-width) solid var(--ln-c-border);
  border-radius: var(--ln-radius-pill);
  background-color: var(--ln-c-bg-soft);
  padding: 0.25rem;
}

.ln-pricing__toggle-btn {
  border: 0;
  border-radius: var(--ln-radius-pill);
  background-color: transparent;
  padding: 0.4rem 1.1rem;
  color: var(--ln-c-text-2);
  font: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color var(--ln-duration) var(--ln-ease),
    color var(--ln-duration) var(--ln-ease);
}

.ln-pricing__toggle-btn.is-active {
  background-color: var(--ln-c-brand);
  color: var(--ln-c-on-brand);
}

.ln-plan {
  gap: 0.75rem;
}

.ln-plan__badge {
  position: absolute;
  top: 0;
  right: var(--ln-card-padding);
  transform: translateY(-50%);
  margin: 0;
  border-radius: var(--ln-radius-pill);
  background-color: var(--ln-c-brand);
  padding: 0.2rem 0.75rem;
  color: var(--ln-c-on-brand);
  font-size: 0.75rem;
  font-weight: 700;
}

.ln-plan__title {
  margin: 0;
  border: 0;
  padding: 0;
  font-family: var(--ln-font-display);
  font-size: var(--ln-h3-size);
  font-weight: var(--ln-heading-weight);
  color: var(--ln-c-text-1);
}

.ln-plan__text {
  margin: 0;
  color: var(--ln-c-text-2);
  font-size: 0.9375rem;
  line-height: 1.5;
}

.ln-plan__price {
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
  margin: 0.5rem 0;
}

.ln-plan__amount {
  font-family: var(--ln-font-display);
  font-size: clamp(2rem, 1.5rem + 1.5vw, 2.75rem);
  font-weight: var(--ln-heading-weight);
  letter-spacing: var(--ln-heading-tracking);
  line-height: 1;
  color: var(--ln-c-text-1);
}

/* "Custom", "Contact us" and friends should not shout like a number does. */
.ln-plan__amount--words {
  font-size: clamp(1.375rem, 1.2rem + 0.8vw, 1.75rem);
}

.ln-plan__period {
  color: var(--ln-c-text-2);
  font-size: 0.9375rem;
}

.ln-plan__action {
  margin-bottom: 0.5rem;
}

.ln-plan__features {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 0.9375rem;
}

.ln-plan__features li {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  line-height: 1.5;
  color: var(--ln-c-text-1);
}

.ln-plan__features li :deep(.ln-icon) {
  margin-top: 0.2rem;
  color: var(--ln-c-brand);
}

.ln-plan__features li.is-excluded {
  color: var(--ln-c-text-3);
  text-decoration: line-through;
}

.ln-plan__features li.is-excluded :deep(.ln-icon) {
  color: var(--ln-c-text-3);
}

.ln-pricing__note {
  margin: 2rem 0 0;
  text-align: center;
  color: var(--ln-c-text-2);
  font-size: 0.875rem;
}
</style>
