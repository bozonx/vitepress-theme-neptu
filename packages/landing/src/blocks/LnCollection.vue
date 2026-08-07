<script setup lang="ts">
/** Generic cards for resources, posts, projects, events and products. */
import LnSection from '../primitives/LnSection.vue'
import LnHeading from '../primitives/LnHeading.vue'
import LnGrid from '../primitives/LnGrid.vue'
import LnCard from '../primitives/LnCard.vue'
import LnMedia from '../primitives/LnMedia.vue'
import LnIcon from '../primitives/LnIcon.vue'
import LnButtonGroup from '../primitives/LnButtonGroup.vue'
import type { ActionItem, CollectionItem, HeadingProps, SectionProps } from './types.ts'
import { useSectionProps } from './sectionProps.ts'

const props = withDefaults(
  defineProps<
    SectionProps &
      HeadingProps & {
        items?: CollectionItem[]
      actions?: ActionItem[]
      cols?: 1 | 2 | 3 | 4
      variant?: 'card' | 'plain' | 'bordered'
      layout?: 'grid' | 'list'
      /** CSS aspect-ratio of the card media, e.g. `16/9`. */
      mediaRatio?: string
    }
  >(),
  { cols: 3, variant: 'card', layout: 'grid', mediaRatio: '16/9', align: 'start' }
)
const sectionProps = useSectionProps(props)

/** Only set `datetime` when the value is a machine-readable date. */
const isoDate = (value: string): string | undefined =>
  Number.isNaN(Date.parse(value)) ? undefined : value
</script>

<template>
  <LnSection
    v-bind="sectionProps"
    class="ln-collection" :class="`ln-collection--${props.layout}`"
  >
    <LnHeading :eyebrow="props.eyebrow" :title="props.title" :text="props.text" :align="props.align" />
    <LnGrid :cols="props.layout === 'list' ? 1 : props.cols">
      <LnCard
        v-for="(item, i) in props.items" :key="`${item.title}-${i}`"
        :link="item.actions?.length ? undefined : item.link" :target="item.target" :rel="item.rel"
        :plain="props.variant === 'plain'" :hoverable="props.variant === 'card'"
        class="ln-collection__item" :class="`ln-collection__item--${props.variant}`"
      >
        <LnMedia v-if="item.image" :media="item.image" :ratio="props.mediaRatio" rounded="md" class="ln-collection__media" />
        <div class="ln-collection__body">
          <div v-if="item.date || item.meta?.length" class="ln-collection__meta">
            <time v-if="item.date" :datetime="isoDate(item.date)">{{ item.date }}</time><span v-for="meta in item.meta" :key="meta">{{ meta }}</span>
          </div>
          <LnIcon v-if="item.icon" :icon="item.icon" class="ln-collection__icon" />
          <span v-if="item.badge" class="ln-collection__badge">{{ item.badge }}</span>
          <h3 v-if="item.title" v-html="item.title" />
          <p v-if="item.text" v-html="item.text" />
          <div v-if="item.tags?.length" class="ln-collection__tags"><span v-for="tag in item.tags" :key="tag">{{ tag }}</span></div>
          <LnButtonGroup v-if="item.actions?.length" :actions="item.actions" size="sm" />
          <span v-else-if="item.linkText" class="ln-collection__link">{{ item.linkText }}</span>
        </div>
      </LnCard>
    </LnGrid>
    <LnButtonGroup v-if="props.actions?.length" :actions="props.actions" :align="props.align" class="ln-collection__actions" />
    <slot />
  </LnSection>
</template>

<style scoped>
.ln-collection__item { gap: 1rem; }
.ln-collection__item--bordered { border-color: var(--ln-c-border-strong); background: transparent; box-shadow: none; }
.ln-collection__body { display: flex; flex-direction: column; gap: 0.75rem; min-width: 0; }
.ln-collection__body h3, .ln-collection__body p { margin: 0; }
.ln-collection__body h3 { font: var(--ln-heading-weight) var(--ln-h3-size)/var(--ln-heading-lh) var(--ln-font-display); }
.ln-collection__body p, .ln-collection__meta { color: var(--ln-c-text-2); }
.ln-collection__meta, .ln-collection__tags { display: flex; flex-wrap: wrap; gap: 0.5rem; font-size: 0.8125rem; }
.ln-collection__tags span, .ln-collection__badge { width: fit-content; border-radius: var(--ln-radius-pill); background: var(--ln-c-brand-soft); padding: 0.2rem 0.55rem; color: var(--ln-c-brand-text); font-size: 0.75rem; }
.ln-collection__icon, .ln-collection__link { color: var(--ln-c-brand-text); }
.ln-collection__actions { margin-top: var(--ln-gap); }
@media (min-width: 720px) {
  .ln-collection--list .ln-collection__item { display: grid; grid-template-columns: minmax(12rem, 0.7fr) 1fr; }
}
</style>
