<script setup lang="ts">
/**
 * Alternating rows of copy and media. Use it to explain two to four key
 * capabilities in depth, after the compact `LnFeatureGrid`.
 */
import LnSection from '../primitives/LnSection.vue'
import LnHeading from '../primitives/LnHeading.vue'
import LnMedia from '../primitives/LnMedia.vue'
import LnIcon from '../primitives/LnIcon.vue'
import LnButtonGroup from '../primitives/LnButtonGroup.vue'
import LnReveal from '../primitives/LnReveal.vue'
import type { SectionProps, SplitItem } from './types.ts'

const props = withDefaults(
  defineProps<
    SectionProps & {
      eyebrow?: string
      title?: string
      text?: string
      items?: SplitItem[]
      /** Start with the media on the left instead of the right. */
      reverse?: boolean
      /** Keep every row in the same order instead of alternating. */
      noAlternate?: boolean
      mediaRatio?: string
    }
  >(),
  { reverse: false, noAlternate: false, align: 'start' }
)

const isReversed = (index: number): boolean =>
  props.noAlternate ? props.reverse : props.reverse !== (index % 2 === 1)
</script>

<template>
  <LnSection
    :id="props.id"
    :bg="props.bg"
    :width="props.width"
    :padding="props.padding"
    :divider="props.divider"
    no-reveal
    class="ln-split"
  >
    <LnHeading
      :eyebrow="props.eyebrow"
      :title="props.title"
      :text="props.text"
      :align="props.align"
    />

    <div class="ln-split__rows">
      <LnReveal
        v-for="(item, i) in props.items"
        :key="`${item.title}-${i}`"
        :disabled="props.noReveal"
        class="ln-split__row"
        :class="{ 'ln-split__row--reversed': isReversed(i) }"
      >
        <div class="ln-split__copy">
          <LnIcon v-if="item.icon" :icon="item.icon" class="ln-split__icon" />
          <p v-if="item.badge" class="ln-split__badge">{{ item.badge }}</p>
          <LnHeading
            :eyebrow="item.eyebrow"
            :title="item.title"
            :text="item.text"
            :spacing="false"
          />

          <ul v-if="item.bullets?.length" class="ln-split__bullets">
            <li v-for="(bullet, bi) in item.bullets" :key="bi" v-html="bullet" />
          </ul>

          <LnButtonGroup
            v-if="item.actions?.length"
            :actions="item.actions"
            class="ln-split__actions"
          />
          <a v-else-if="item.link && item.linkText" class="ln-split__link" :href="item.link">
            {{ item.linkText }}
          </a>
        </div>

        <div v-if="item.image" class="ln-split__media">
          <LnMedia :media="item.image" :ratio="props.mediaRatio" border shadow />
        </div>
      </LnReveal>
    </div>

    <slot />
  </LnSection>
</template>

<style scoped>
.ln-split__rows {
  display: flex;
  flex-direction: column;
  gap: clamp(3rem, 2rem + 4vw, 6rem);
}

.ln-split__row {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(1.5rem, 1rem + 3vw, 4rem);
  align-items: center;
}

@media (min-width: 860px) {
  .ln-split__row {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }

  .ln-split__row--reversed .ln-split__copy {
    order: 2;
  }
}

.ln-split__copy {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
}

.ln-split__icon {
  color: var(--ln-c-brand);
}

.ln-split__badge {
  margin: 0;
  align-self: flex-start;
  border-radius: var(--ln-radius-pill);
  background-color: var(--ln-c-brand-soft);
  padding: 0.125rem 0.625rem;
  color: var(--ln-c-brand);
  font-size: 0.75rem;
  font-weight: 600;
}

.ln-split__bullets {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: var(--ln-c-text-2);
}

.ln-split__bullets li {
  position: relative;
  padding-left: 1.5rem;
  line-height: var(--ln-body-lh);
}

.ln-split__bullets li::before {
  content: '';
  position: absolute;
  top: 0.6em;
  left: 0.25rem;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: var(--ln-radius-pill);
  background-color: var(--ln-c-brand);
}

.ln-split__actions {
  margin-top: 0.5rem;
}

.ln-split__link {
  color: var(--ln-c-brand);
  font-weight: 600;
  text-decoration: none;
}

.ln-split__link:hover {
  text-decoration: underline;
}

.ln-split__media {
  min-width: 0;
}
</style>
