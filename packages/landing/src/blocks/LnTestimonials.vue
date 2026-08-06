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
import type { HeadingProps, SectionProps, TestimonialItem } from './types.ts'
import { useSectionProps } from './sectionProps.ts'

const props = withDefaults(
  defineProps<
    SectionProps & HeadingProps & {
      items?: TestimonialItem[]
      cols?: 1 | 2 | 3
      variant?: 'grid' | 'masonry' | 'single'
    }
  >(),
  { cols: 3, variant: 'grid', align: 'center' }
)
const sectionProps = useSectionProps(props)

</script>

<template>
  <LnSection
    v-bind="sectionProps"
    class="ln-testimonials"
    :class="`ln-testimonials--${props.variant}`"
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
      :class="props.variant === 'masonry' ? 'ln-testimonials__masonry' : undefined"
    >
      <LnCard
        v-for="(item, i) in props.items"
        :key="`${item.author}-${i}`"
        :link="item.link"
        class="ln-testimonial"
      >
        <!-- `role="img"` — without it the label on a plain div is dropped by AT. -->
        <div
          v-if="item.rating"
          class="ln-testimonial__rating"
          role="img"
          :aria-label="`${item.rating} / 5`"
        >
          <LnIcon
            v-for="star in Math.min(Math.max(Math.round(item.rating), 0), 5)"
            :key="star"
            icon="fa6-solid:star"
            size="0.9rem"
          />
        </div>

        <blockquote class="ln-testimonial__text">{{ item.text }}</blockquote>

        <footer class="ln-testimonial__footer">
          <img
            v-if="item.avatar"
            class="ln-testimonial__avatar"
            :src="resolveUrl(item.avatar)"
            :alt="item.author ?? ''"
            loading="lazy"
          />
          <span class="ln-testimonial__meta">
            <span v-if="item.author" class="ln-testimonial__author">{{ item.author }}</span>
            <span v-if="item.role" class="ln-testimonial__role">{{ item.role }}</span>
          </span>
          <img
            v-if="item.logo"
            class="ln-testimonial__logo"
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
.ln-testimonial {
  gap: 1rem;
}

.ln-testimonials--single .ln-testimonial {
  text-align: center;
  align-items: center;
}

.ln-testimonial__rating {
  display: flex;
  gap: 0.125rem;
  color: var(--ln-c-brand-text);
}

.ln-testimonial__text {
  margin: 0;
  border: 0;
  padding: 0;
  color: var(--ln-c-text-1);
  font-size: 1rem;
  line-height: var(--ln-body-lh);
  text-wrap: pretty;
}

.ln-testimonials--single .ln-testimonial__text {
  font-family: var(--ln-font-display);
  font-size: clamp(1.25rem, 1rem + 1.5vw, 1.875rem);
  line-height: 1.4;
  letter-spacing: var(--ln-heading-tracking);
}

.ln-testimonial__footer {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 0.25rem;
}

.ln-testimonials--single .ln-testimonial__footer {
  justify-content: center;
}

.ln-testimonial__avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--ln-radius-pill);
  object-fit: cover;
  flex: none;
}

.ln-testimonial__meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.ln-testimonial__author {
  font-weight: 600;
  color: var(--ln-c-text-1);
}

.ln-testimonial__role {
  color: var(--ln-c-text-2);
  font-size: 0.8125rem;
}

.ln-testimonial__logo {
  margin-left: auto;
  height: 1.5rem;
  width: auto;
  opacity: 0.7;
}

/**** Masonry */
.ln-testimonials__masonry {
  columns: 1;
  column-gap: var(--ln-gap);
}

@media (min-width: 640px) {
  .ln-testimonials__masonry {
    columns: 2;
  }
}

@media (min-width: 960px) {
  .ln-testimonials__masonry {
    columns: 3;
  }
}

.ln-testimonials__masonry .ln-testimonial {
  break-inside: avoid;
  margin-bottom: var(--ln-gap);
}
</style>
