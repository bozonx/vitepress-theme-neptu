<script setup lang="ts">
/**
 * Scroll-snap carousel. No dependencies, no JS required to scroll — arrows,
 * dots and autoplay are progressive enhancements on top of a native scroller,
 * which keeps it accessible (keyboard, touch, screen readers) and SSR-safe.
 *
 * Use the `slide` scoped slot to render custom content instead of `items`.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import LnSection from '../primitives/LnSection.vue'
import LnHeading from '../primitives/LnHeading.vue'
import LnCard from '../primitives/LnCard.vue'
import LnIcon from '../primitives/LnIcon.vue'
import LnMedia from '../primitives/LnMedia.vue'
import type { CarouselSlide, SectionProps } from './types.ts'

const props = withDefaults(
  defineProps<
    SectionProps & {
      eyebrow?: string
      title?: string
      text?: string
      items?: CarouselSlide[]
      /** Slides visible at once on desktop. */
      perView?: 1 | 2 | 3 | 4
      arrows?: boolean
      dots?: boolean
      /** Autoplay interval in ms. `0` disables it. */
      autoplay?: number
      /** Let slides bleed past the container edge. */
      peek?: boolean
      ariaLabel?: string
    }
  >(),
  {
    perView: 3,
    arrows: true,
    dots: true,
    autoplay: 0,
    peek: false,
    align: 'start',
  }
)

const track = ref<HTMLElement | null>(null)
const active = ref(0)
const canPrev = ref(false)
const canNext = ref(true)
let timer: ReturnType<typeof setInterval> | null = null

const slideCount = computed(() => props.items?.length ?? 0)

const slides = (): HTMLElement[] =>
  track.value ? (Array.from(track.value.children) as HTMLElement[]) : []

const syncState = (): void => {
  const el = track.value
  if (!el) return

  const children = slides()
  const center = el.scrollLeft + el.clientWidth / 2
  let closest = 0
  let min = Number.POSITIVE_INFINITY

  children.forEach((child, i) => {
    const distance = Math.abs(child.offsetLeft + child.clientWidth / 2 - center)
    if (distance < min) {
      min = distance
      closest = i
    }
  })

  active.value = closest
  canPrev.value = el.scrollLeft > 4
  canNext.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 4
}

const goTo = (index: number): void => {
  const el = track.value
  const child = slides()[index]
  if (!el || !child) return
  el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: 'smooth' })
}

const step = (delta: number): void => {
  const next = active.value + delta
  if (next < 0 || next >= slideCount.value) {
    goTo(delta > 0 ? 0 : slideCount.value - 1)
    return
  }
  goTo(next)
}

const stopAutoplay = (): void => {
  if (timer) clearInterval(timer)
  timer = null
}

const startAutoplay = (): void => {
  if (!props.autoplay || slideCount.value < 2) return
  stopAutoplay()
  timer = setInterval(() => step(1), props.autoplay)
}

onMounted(() => {
  syncState()
  track.value?.addEventListener('scroll', syncState, { passive: true })
  window.addEventListener('resize', syncState, { passive: true })

  const reduced =
    typeof matchMedia === 'function' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduced) startAutoplay()
})

onBeforeUnmount(() => {
  stopAutoplay()
  track.value?.removeEventListener('scroll', syncState)
  window.removeEventListener('resize', syncState)
})
</script>

<template>
  <LnSection
    :id="props.id"
    :bg="props.bg"
    :width="props.width"
    :padding="props.padding"
    :divider="props.divider"
    :no-reveal="props.noReveal"
    class="ln-carousel"
    :class="{ 'ln-carousel--peek': props.peek }"
    :style="{ '--ln-carousel-per-view': props.perView }"
  >
    <div class="ln-carousel__head">
      <LnHeading
        :eyebrow="props.eyebrow"
        :title="props.title"
        :text="props.text"
        :align="props.align"
        :spacing="false"
      />

      <div v-if="props.arrows && slideCount > 1" class="ln-carousel__arrows">
        <button
          type="button"
          class="ln-carousel__arrow"
          :disabled="!canPrev && !props.autoplay"
          aria-label="Previous slide"
          @click="stopAutoplay(); step(-1)"
        >
          <LnIcon icon="fa6-solid:chevron-left" size="0.9rem" />
        </button>
        <button
          type="button"
          class="ln-carousel__arrow"
          :disabled="!canNext && !props.autoplay"
          aria-label="Next slide"
          @click="stopAutoplay(); step(1)"
        >
          <LnIcon icon="fa6-solid:chevron-right" size="0.9rem" />
        </button>
      </div>
    </div>

    <div
      ref="track"
      class="ln-carousel__track"
      role="region"
      :aria-label="props.ariaLabel ?? props.title ?? 'Carousel'"
      tabindex="0"
      @mouseenter="stopAutoplay"
      @focusin="stopAutoplay"
    >
      <div
        v-for="(item, i) in props.items"
        :key="`${item.title}-${i}`"
        class="ln-carousel__slide"
        :aria-label="`${i + 1} / ${slideCount}`"
      >
        <slot name="slide" :item="item" :index="i">
          <LnCard :link="item.link" hoverable padding="none" class="ln-carousel__card">
            <LnMedia
              v-if="item.image"
              :media="item.image"
              ratio="16/9"
              rounded="none"
              class="ln-carousel__media"
            />
            <div class="ln-carousel__body">
              <LnIcon v-if="item.icon" :icon="item.icon" class="ln-carousel__icon" />
              <p v-if="item.badge" class="ln-carousel__badge">{{ item.badge }}</p>
              <p v-if="item.eyebrow" class="ln-carousel__eyebrow">{{ item.eyebrow }}</p>
              <h3 v-if="item.title" class="ln-carousel__title" v-html="item.title" />
              <p v-if="item.text" class="ln-carousel__text" v-html="item.text" />
              <span v-if="item.linkText" class="ln-carousel__link">{{ item.linkText }}</span>
            </div>
          </LnCard>
        </slot>
      </div>
      <slot />
    </div>

    <div v-if="props.dots && slideCount > 1" class="ln-carousel__dots">
      <button
        v-for="(item, i) in props.items"
        :key="`dot-${i}`"
        type="button"
        class="ln-carousel__dot"
        :class="{ 'is-active': i === active }"
        :aria-label="`Go to slide ${i + 1}`"
        :aria-current="i === active ? 'true' : undefined"
        @click="stopAutoplay(); goTo(i)"
      />
    </div>
  </LnSection>
</template>

<style scoped>
.ln-carousel__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: clamp(1.5rem, 1rem + 1.5vw, 2.5rem);
}

.ln-carousel__arrows {
  display: none;
  gap: 0.5rem;
  flex: none;
}

@media (min-width: 640px) {
  .ln-carousel__arrows {
    display: flex;
  }
}

.ln-carousel__arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: var(--ln-border-width) solid var(--ln-c-border);
  border-radius: var(--ln-radius-pill);
  background-color: var(--ln-c-bg);
  color: var(--ln-c-text-1);
  cursor: pointer;
  transition:
    border-color var(--ln-duration) var(--ln-ease),
    color var(--ln-duration) var(--ln-ease),
    opacity var(--ln-duration) var(--ln-ease);
}

.ln-carousel__arrow:hover:not(:disabled) {
  border-color: var(--ln-c-brand);
  color: var(--ln-c-brand);
}

.ln-carousel__arrow:disabled {
  opacity: 0.4;
  cursor: default;
}

.ln-carousel__track {
  display: flex;
  gap: var(--ln-gap);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
  /* Room for card shadows and hover lift. */
  padding-block: 0.5rem;
}

.ln-carousel__track::-webkit-scrollbar {
  display: none;
}

.ln-carousel__track:focus-visible {
  outline: 2px solid var(--ln-c-brand);
  outline-offset: 4px;
  border-radius: var(--ln-radius-sm);
}

.ln-carousel__slide {
  flex: 0 0 85%;
  scroll-snap-align: start;
  min-width: 0;
}

@media (min-width: 640px) {
  .ln-carousel__slide {
    flex-basis: calc((100% - var(--ln-gap)) / 2);
  }
}

@media (min-width: 960px) {
  .ln-carousel__slide {
    flex-basis: calc(
      (100% - (var(--ln-carousel-per-view, 3) - 1) * var(--ln-gap)) /
        var(--ln-carousel-per-view, 3)
    );
  }
}

.ln-carousel--peek .ln-carousel__slide {
  flex-basis: 78%;
}

.ln-carousel__card {
  height: 100%;
  overflow: hidden;
}

.ln-carousel__body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: var(--ln-card-padding);
}

.ln-carousel__icon {
  color: var(--ln-c-brand);
}

.ln-carousel__badge {
  margin: 0;
  align-self: flex-start;
  border-radius: var(--ln-radius-pill);
  background-color: var(--ln-c-brand-soft);
  padding: 0.125rem 0.625rem;
  color: var(--ln-c-brand);
  font-size: 0.75rem;
  font-weight: 600;
}

.ln-carousel__eyebrow {
  margin: 0;
  color: var(--ln-c-text-2);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.ln-carousel__title {
  margin: 0;
  border: 0;
  padding: 0;
  font-family: var(--ln-font-display);
  font-size: var(--ln-h3-size);
  font-weight: var(--ln-heading-weight);
  line-height: 1.3;
  color: var(--ln-c-text-1);
}

.ln-carousel__text {
  margin: 0;
  color: var(--ln-c-text-2);
  font-size: 0.9375rem;
  line-height: var(--ln-body-lh);
}

.ln-carousel__link {
  margin-top: auto;
  padding-top: 0.5rem;
  color: var(--ln-c-brand);
  font-size: 0.875rem;
  font-weight: 600;
}

.ln-carousel__dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.ln-carousel__dot {
  width: 0.5rem;
  height: 0.5rem;
  border: 0;
  border-radius: var(--ln-radius-pill);
  background-color: var(--ln-c-border-strong);
  cursor: pointer;
  transition:
    width var(--ln-duration) var(--ln-ease),
    background-color var(--ln-duration) var(--ln-ease);
}

.ln-carousel__dot.is-active {
  width: 1.5rem;
  background-color: var(--ln-c-brand);
}
</style>
