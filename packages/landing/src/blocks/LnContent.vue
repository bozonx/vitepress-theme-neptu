<script setup lang="ts">
/** General-purpose editorial section for copy that does not fit a card grid. */
import LnSection from '../primitives/LnSection.vue'
import LnHeading from '../primitives/LnHeading.vue'
import LnMedia from '../primitives/LnMedia.vue'
import LnButtonGroup from '../primitives/LnButtonGroup.vue'
import type { ActionItem, HeadingProps, MediaLike, SectionProps } from './types.ts'
import { useSectionProps } from './sectionProps.ts'

const props = withDefaults(
  defineProps<
    SectionProps &
      HeadingProps & {
        /** Trusted HTML produced by Markdown or a trusted CMS pipeline. */
        content?: string
      image?: MediaLike
      actions?: ActionItem[]
      variant?: 'prose' | 'split' | 'card'
      reverse?: boolean
    }
  >(),
  { variant: 'prose', width: 'narrow', align: 'start', reverse: false }
)
const sectionProps = useSectionProps(props)
</script>

<template>
  <LnSection
    v-bind="sectionProps"
    :width="props.variant === 'split' && props.width === 'narrow' ? 'default' : props.width"
    class="ln-content"
    :class="[`ln-content--${props.variant}`, { 'ln-content--reverse': props.reverse }]"
  >
    <div class="ln-content__inner">
      <div class="ln-content__copy">
        <LnHeading
          :eyebrow="props.eyebrow"
          :title="props.title"
          :text="props.text"
          :align="props.align"
          :spacing="Boolean(props.content || $slots.default)"
        />
        <!-- eslint-disable-next-line vue/no-v-html -- trusted author content -->
        <div v-if="props.content" class="ln-content__prose" v-html="props.content" />
        <div v-if="$slots.default" class="ln-content__prose"><slot /></div>
        <LnButtonGroup v-if="props.actions?.length" :actions="props.actions" :align="props.align" />
      </div>
      <LnMedia v-if="props.image" :media="props.image" border shadow class="ln-content__media" />
    </div>
  </LnSection>
</template>

<style scoped>
.ln-content__inner {
  display: grid;
  gap: var(--ln-gap);
}

.ln-content--card .ln-content__inner {
  border: var(--ln-border-width) solid var(--ln-card-border-color);
  border-radius: var(--ln-card-radius);
  padding: var(--ln-card-padding);
  background: var(--ln-card-bg);
  box-shadow: var(--ln-card-shadow);
}

.ln-content__copy {
  min-width: 0;
}

.ln-content__prose {
  color: var(--ln-c-text-2);
}

.ln-content__prose :deep(> :first-child) { margin-top: 0; }
.ln-content__prose :deep(> :last-child) { margin-bottom: 0; }

.ln-content__prose + :deep(.ln-actions) {
  margin-top: 1.5rem;
}

@media (min-width: 860px) {
  .ln-content--split .ln-content__inner {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: center;
  }
  .ln-content--split.ln-content--reverse .ln-content__copy { order: 2; }
}
</style>
