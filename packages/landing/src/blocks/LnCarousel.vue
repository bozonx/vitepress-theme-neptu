<script setup lang="ts">
/**
 * Scroll-snap carousel. No dependencies, no JS required to scroll — arrows,
 * dots and autoplay are progressive enhancements on top of a native scroller,
 * which keeps it accessible (keyboard, touch, screen readers) and SSR-safe.
 *
 * Use the `slide` scoped slot to render custom content instead of `items`.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useData } from 'vitepress'
import LnSection from '../primitives/LnSection.vue'
import LnHeading from '../primitives/LnHeading.vue'
import LnCard from '../primitives/LnCard.vue'
import LnIcon from '../primitives/LnIcon.vue'
import LnMedia from '../primitives/LnMedia.vue'
import LnButtonGroup from '../primitives/LnButtonGroup.vue'
import type { CarouselSlide, HeadingProps, SectionProps } from './types.ts'
import { useSectionProps } from './sectionProps.ts'

const props = withDefaults(
  defineProps<
    SectionProps &
      HeadingProps & {
        items?: CarouselSlide[]
      /** Slides visible at once on desktop. */
      perView?: 1 | 2 | 3 | 4
      arrows?: boolean
      dots?: boolean
      /** Autoplay interval in ms. `0` disables it. */
      autoplayInterval?: number
      /** Let slides bleed past the container edge. */
      peek?: boolean
      ariaLabel?: string
      /** Card display style. */
      variant?: 'card' | 'plain' | 'bordered'
    }
  >(),
  {
    perView: 3,
    arrows: true,
    dots: true,
    autoplayInterval: 0,
    peek: false,
    align: 'start',
    variant: 'card',
  }
)

const track = ref<HTMLElement | null>(null)
const { theme } = useData()
const landingText = computed(() => {
  const t = theme.value.t as { landing?: { carousel?: Record<string, string> } } | undefined
  return t?.landing?.carousel ?? {}
})
const message = (key: string, fallback: string, values: Record<string, string | number> = {}): string =>
  Object.entries(values).reduce(
    (text, [name, value]) => text.replace(`{${name}}`, String(value)),
    landingText.value[key] ?? fallback
  )
const active = ref(0)
const canPrev = ref(false)
const canNext = ref(true)
let timer: ReturnType<typeof setInterval> | null = null

const slideCount = computed(() => props.items?.length ?? 0)

const autoplayInterval = computed(() => props.autoplayInterval ?? 0)
const cardVariant = computed(() => props.variant ?? 'card')

const prefersReducedMotion = (): boolean =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

const slides = (): HTMLElement[] =>
  track.value
    ? (Array.from(track.value.children) as HTMLElement[]).filter((child) =>
        child.classList.contains('ln-carousel__slide')
      )
    : []

/**
 * Slide position inside the scroll container.
 *
 * `offsetLeft` is measured against the nearest positioned ancestor — which is
 * the section, not the track — so the track's own offset has to be subtracted
 * before it can be compared with `scrollLeft`.
 */
const offsetInTrack = (child: HTMLElement): number => {
  const el = track.value
  return child.offsetLeft - (el?.offsetLeft ?? 0)
}

const syncState = (): void => {
  const el = track.value
  if (!el) return

  const children = slides()
  const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
  let closest = 0
  let min = Number.POSITIVE_INFINITY

  /*
   * Slides snap on their leading edge, so the active one is the first visible
   * slide — not the one nearest the centre, which with `perView: 3` would light
   * up the middle dot on a freshly loaded page.
   */
  children.forEach((child, i) => {
    const distance = Math.abs(offsetInTrack(child) - el.scrollLeft)
    if (distance < min) {
      min = distance
      closest = i
    }
  })

  // At the end of the track the trailing slides can never lead: without this
  // the last dots would be unreachable.
  active.value = atEnd ? Math.max(children.length - 1, 0) : closest
  canPrev.value = el.scrollLeft > 4
  canNext.value = !atEnd
}

const goTo = (index: number): void => {
  const el = track.value
  const child = slides()[index]
  if (!el || !child) return
  el.scrollTo({ left: offsetInTrack(child), behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

const step = (delta: number): void => {
  const next = active.value + delta
  if (next < 0 || next >= slideCount.value) {
    goTo(delta > 0 ? 0 : slideCount.value - 1)
    return
  }
  goTo(next)
}

/** Autoplay is on until the visitor takes over — see `paused`. */
const paused = ref(false)

const clearTimer = (): void => {
  if (timer) clearInterval(timer)
  timer = null
}

const runTimer = (): void => {
  clearTimer()
  if (!autoplayInterval.value || paused.value || slideCount.value < 2) return
  if (typeof document !== 'undefined' && document.hidden) return
  timer = setInterval(() => step(1), autoplayInterval.value)
}

/** Visitor interaction wins over autoplay, permanently. */
const stopAutoplay = (): void => {
  paused.value = true
  clearTimer()
}

const togglePlay = (): void => {
  paused.value = !paused.value
  runTimer()
}

/** A background tab must not keep scrolling — and must resume when it returns. */
const onVisibility = (): void => runTimer()

onMounted(() => {
  syncState()
  track.value?.addEventListener('scroll', syncState, { passive: true })
  window.addEventListener('resize', syncState, { passive: true })
  document.addEventListener('visibilitychange', onVisibility)

  paused.value = prefersReducedMotion()
  runTimer()
})

onBeforeUnmount(() => {
  clearTimer()
  track.value?.removeEventListener('scroll', syncState)
  window.removeEventListener('resize', syncState)
  document.removeEventListener('visibilitychange', onVisibility)
})
const sectionProps = useSectionProps(props)
</script>

<template>
  <LnSection
    v-bind="sectionProps"
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

      <div v-if="(props.arrows || autoplayInterval) && slideCount > 1" class="ln-carousel__arrows">
        <!-- WCAG 2.2.2: moving content needs a visible pause control. -->
        <button
          v-if="autoplayInterval"
          type="button"
          class="ln-carousel__arrow"
          :aria-label="paused ? message('play', 'Start the slideshow') : message('pause', 'Pause the slideshow')"
          @click="togglePlay"
        >
          <LnIcon :icon="paused ? 'fa6-solid:play' : 'fa6-solid:pause'" size="0.8rem" />
        </button>
        <template v-if="props.arrows">
          <button
            type="button"
            class="ln-carousel__arrow"
            :disabled="!canPrev && !autoplayInterval"
            :aria-label="message('previous', 'Previous slide')"
            @click="stopAutoplay(); step(-1)"
          >
            <LnIcon icon="fa6-solid:chevron-left" size="0.9rem" />
          </button>
          <button
            type="button"
            class="ln-carousel__arrow"
            :disabled="!canNext && !autoplayInterval"
            :aria-label="message('next', 'Next slide')"
            @click="stopAutoplay(); step(1)"
          >
            <LnIcon icon="fa6-solid:chevron-right" size="0.9rem" />
          </button>
        </template>
      </div>
    </div>

    <div
      ref="track"
      class="ln-carousel__track"
      role="group"
      aria-roledescription="carousel"
      :aria-label="props.ariaLabel ?? props.title ?? message('region', 'Carousel')"
      tabindex="0"
      @mouseenter="stopAutoplay"
      @focusin="stopAutoplay"
    >
      <div
        v-for="(item, i) in props.items"
        :key="`${item.title}-${i}`"
        class="ln-carousel__slide"
        role="group"
        aria-roledescription="slide"
        :aria-label="message('slideOf', `${i + 1} of ${slideCount}`, { slide: i + 1, total: slideCount })"
      >
        <slot name="slide" :item="item" :index="i">
          <LnCard
            :link="item.actions?.length ? undefined : item.link"
            :target="item.target" :rel="item.rel"
            :plain="cardVariant !== 'card'" :hoverable="cardVariant === 'card'"
            padding="none" class="ln-carousel__card"
            :class="`ln-carousel__card--${cardVariant}`"
          >
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
              <div v-if="item.meta?.length" class="ln-carousel__meta"><span v-for="meta in item.meta" :key="meta">{{ meta }}</span></div>
              <div v-if="item.tags?.length" class="ln-carousel__tags"><span v-for="tag in item.tags" :key="tag">{{ tag }}</span></div>
              <LnButtonGroup v-if="item.actions?.length" :actions="item.actions" size="sm" />
              <span v-else-if="item.linkText" class="ln-carousel__link">{{ item.linkText }}</span>
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
        :aria-label="message('goTo', `Go to slide ${i + 1}`, { slide: i + 1 })"
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
  color: var(--ln-c-brand-text);
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

@media (prefers-reduced-motion: reduce) {
  .ln-carousel__track {
    scroll-behavior: auto;
  }
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
  color: var(--ln-c-brand-text);
}

.ln-carousel__badge {
  margin: 0;
  align-self: flex-start;
  border-radius: var(--ln-radius-pill);
  background-color: var(--ln-c-brand-soft);
  padding: 0.125rem 0.625rem;
  color: var(--ln-c-brand-text);
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
  color: var(--ln-c-brand-text);
  font-size: 0.875rem;
  font-weight: 600;
}
.ln-carousel__meta, .ln-carousel__tags { display: flex; flex-wrap: wrap; gap: 0.4rem; color: var(--ln-c-text-2); font-size: 0.8125rem; }
.ln-carousel__tags span { border-radius: var(--ln-radius-pill); background: var(--ln-c-brand-soft); padding: 0.15rem 0.5rem; color: var(--ln-c-brand-text); }
.ln-carousel__card--bordered { border-color: var(--ln-c-border-strong); }

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
