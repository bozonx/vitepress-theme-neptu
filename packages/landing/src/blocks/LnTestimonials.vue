<script setup lang="ts">
/**
 * Social proof. `grid` for a few strong quotes, `masonry` for many short ones,
 * `single` for one hero-sized testimonial.
 */
import LnSection from '../primitives/LnSection.vue'
import LnHeading from '../primitives/LnHeading.vue'
import LnGrid from '../primitives/LnGrid.vue'
import LnCard from '../primitives/LnCard.vue'
import LnIcon from '../primitives/LnIcon.vue'
import { resolveUrl } from '../utils/url.ts'
import type { SectionProps, TestimonialItem } from './types.ts'

const props = withDefaults(
  defineProps<
    SectionProps & {
      eyebrow?: string
      title?: string
      text?: string
      items?: TestimonialItem[]
      cols?: 1 | 2 | 3
      variant?: 'grid' | 'masonry' | 'single'
    }
  >(),
  { cols: 3, variant: 'grid', align: 'center' }
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
    class="ln-quotes"
    :class="`ln-quotes--${props.variant}`"
  >
    <LnHeading
      :eyebrow="props.eyebrow"
      :title="props.title"
      :text="props.text"
      :align="props.align"
    />

    <component
      :is="props.variant === 'masonry' ? 'div' : LnGrid"
      v-bind="props.variant === 'masonry' ? {} : { cols: props.variant === 'single' ? 1 : props.cols }"
      :class="props.variant === 'masonry' ? 'ln-quotes__masonry' : undefined"
    >
      <LnCard
        v-for="(item, i) in props.items"
        :key="`${item.author}-${i}`"
        :link="item.link"
        class="ln-quote"
      >
        <!-- `role="img"` — without it the label on a plain div is dropped by AT. -->
        <div
          v-if="item.rating"
          class="ln-quote__rating"
          role="img"
          :aria-label="`${item.rating} / 5`"
        >
          <LnIcon
            v-for="star in Math.round(item.rating)"
            :key="star"
            icon="fa6-solid:star"
            size="0.9rem"
          />
        </div>

        <blockquote class="ln-quote__text">{{ item.text }}</blockquote>

        <footer class="ln-quote__footer">
          <img
            v-if="item.avatar"
            class="ln-quote__avatar"
            :src="resolveUrl(item.avatar)"
            :alt="item.author ?? ''"
            loading="lazy"
          />
          <span class="ln-quote__meta">
            <span v-if="item.author" class="ln-quote__author">{{ item.author }}</span>
            <span v-if="item.role" class="ln-quote__role">{{ item.role }}</span>
          </span>
          <img
            v-if="item.logo"
            class="ln-quote__logo"
            :src="resolveUrl(item.logo)"
            alt=""
            loading="lazy"
          />
        </footer>
      </LnCard>
      <slot />
    </component>
  </LnSection>
</template>

<style scoped>
.ln-quote {
  gap: 1rem;
}

.ln-quotes--single .ln-quote {
  text-align: center;
  align-items: center;
}

.ln-quote__rating {
  display: flex;
  gap: 0.125rem;
  color: var(--ln-c-brand-text);
}

.ln-quote__text {
  margin: 0;
  border: 0;
  padding: 0;
  color: var(--ln-c-text-1);
  font-size: 1rem;
  line-height: var(--ln-body-lh);
  text-wrap: pretty;
}

.ln-quotes--single .ln-quote__text {
  font-family: var(--ln-font-display);
  font-size: clamp(1.25rem, 1rem + 1.5vw, 1.875rem);
  line-height: 1.4;
  letter-spacing: var(--ln-heading-tracking);
}

.ln-quote__footer {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 0.25rem;
}

.ln-quotes--single .ln-quote__footer {
  justify-content: center;
}

.ln-quote__avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--ln-radius-pill);
  object-fit: cover;
  flex: none;
}

.ln-quote__meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.ln-quote__author {
  font-weight: 600;
  color: var(--ln-c-text-1);
}

.ln-quote__role {
  color: var(--ln-c-text-2);
  font-size: 0.8125rem;
}

.ln-quote__logo {
  margin-left: auto;
  height: 1.5rem;
  width: auto;
  opacity: 0.7;
}

/**** Masonry */
.ln-quotes__masonry {
  columns: 1;
  column-gap: var(--ln-gap);
}

@media (min-width: 640px) {
  .ln-quotes__masonry {
    columns: 2;
  }
}

@media (min-width: 960px) {
  .ln-quotes__masonry {
    columns: 3;
  }
}

.ln-quotes__masonry .ln-quote {
  break-inside: avoid;
  margin-bottom: var(--ln-gap);
}
</style>
