<script setup lang="ts">
/**
 * First screen of the landing page. Four layouts, one prop set.
 *
 * - `split` (default) — copy on the left, media on the right
 * - `centered` — copy centered, media below
 * - `cover` — copy over a full-bleed background image/video
 * - `plain` — copy only
 */
import { computed, onMounted, ref } from 'vue'
import LnSection from '../primitives/LnSection.vue'
import LnHeading from '../primitives/LnHeading.vue'
import LnButtonGroup from '../primitives/LnButtonGroup.vue'
import LnMedia from '../primitives/LnMedia.vue'
import type { ActionItem, MediaLike, SectionProps } from './types.ts'
import { resolveUrl } from '../utils/url.ts'

const props = withDefaults(
  defineProps<
    SectionProps & {
      eyebrow?: string
      title?: string
      text?: string
      actions?: ActionItem[]
      image?: MediaLike
      /** Small print under the actions — pricing note, license, "no card needed". */
      note?: string
      variant?: 'split' | 'centered' | 'cover' | 'plain'
      /** `cover` only: darken the background so the copy stays readable. */
      overlay?: boolean
      /** Decorative brand glow behind the copy. */
      glow?: boolean
    }
  >(),
  {
    variant: 'split',
    padding: 'lg',
    bg: 'base',
    width: 'default',
    overlay: true,
    glow: false,
  }
)

const isCover = computed(() => props.variant === 'cover')
const coverVideo = ref<HTMLVideoElement | null>(null)
const motionAllowed = ref(false)
const videoPaused = ref(false)
onMounted(() => {
  motionAllowed.value = typeof matchMedia !== 'function' || !matchMedia('(prefers-reduced-motion: reduce)').matches
})
const toggleBackgroundVideo = (): void => {
  const video = coverVideo.value
  if (!video) return
  if (video.paused) {
    void video.play()
    videoPaused.value = false
  } else {
    video.pause()
    videoPaused.value = true
  }
}
const isCentered = computed(() => props.variant === 'centered' || isCover.value)
const align = computed(() => props.align ?? (isCentered.value ? 'center' : 'start'))
const coverSpec = computed(() => {
  const spec = typeof props.image === 'string' ? { src: props.image } : (props.image ?? {})
  return {
    ...spec,
    src: resolveUrl(spec.src),
    video: resolveUrl(spec.video),
    poster: resolveUrl(spec.poster),
  }
})
</script>

<template>
  <div class="ln-hero-wrap" :class="{ 'ln-hero-wrap--cover': isCover }">
    <div v-if="isCover" class="ln-hero__bg" aria-hidden="true">
      <video
        v-if="coverSpec.video"
        ref="coverVideo"
        :src="coverSpec.video"
        :poster="coverSpec.poster"
        :autoplay="motionAllowed"
        muted
        loop
        playsinline
      />
      <!-- The cover image is the LCP element: never lazy, always first in line. -->
      <img
        v-else-if="coverSpec.src"
        :src="coverSpec.src"
        alt=""
        loading="eager"
        fetchpriority="high"
      />
      <div v-if="props.overlay" class="ln-hero__overlay" />
    </div>

    <LnSection
      :id="props.id"
      :bg="isCover ? 'transparent' : props.bg"
      :width="props.width"
      :padding="props.padding"
      :divider="props.divider"
      no-reveal
      class="ln-hero"
      :class="[`ln-hero--${props.variant}`, { 'ln-hero--on-media': isCover }]"
    >
      <div v-if="props.glow" class="ln-hero__glow" aria-hidden="true" />

      <button
        v-if="isCover && coverSpec.video && motionAllowed"
        type="button"
        class="ln-hero__motion-toggle"
        :aria-pressed="videoPaused"
        @click="toggleBackgroundVideo"
      >
        {{ videoPaused ? 'Play background video' : 'Pause background video' }}
      </button>

      <div class="ln-hero__grid">
        <div class="ln-hero__copy">
          <slot name="before" />
          <LnHeading
            :eyebrow="props.eyebrow"
            :title="props.title"
            :text="props.text"
            :align="align"
            level="h1"
            size="display"
            :spacing="false"
          >
            <template v-if="$slots.title" #title><slot name="title" /></template>
            <template v-if="$slots.text" #text><slot name="text" /></template>
          </LnHeading>

          <LnButtonGroup
            v-if="props.actions?.length"
            :actions="props.actions"
            :align="align"
            size="lg"
            class="ln-hero__actions"
          />

          <p v-if="props.note" class="ln-hero__note">{{ props.note }}</p>
          <slot name="after" />
        </div>

        <div v-if="props.image && !isCover" class="ln-hero__media">
          <slot name="media">
            <LnMedia :media="props.image" eager fit="contain" rounded="lg" />
          </slot>
        </div>
      </div>

      <slot />
    </LnSection>
  </div>
</template>

<style scoped>
.ln-hero-wrap {
  position: relative;
}

.ln-hero-wrap--cover {
  isolation: isolate;
}

.ln-hero__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.ln-hero__bg img,
.ln-hero__bg video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ln-hero__overlay {
  position: absolute;
  inset: 0;
  background: var(--ln-c-overlay);
}

.ln-hero {
  position: relative;
  z-index: 1;
}

.ln-hero--on-media {
  --ln-c-text-1: var(--ln-c-on-media);
  --ln-c-text-2: var(--ln-c-on-media-muted);
  color: var(--ln-c-on-media);
  min-height: min(80vh, 46rem);
  display: flex;
  align-items: center;
}

.ln-hero__glow {
  position: absolute;
  top: -20%;
  left: 50%;
  z-index: -1;
  width: min(60rem, 100%);
  height: 32rem;
  transform: translateX(-50%);
  background: radial-gradient(closest-side, var(--ln-c-accent-glow), transparent);
  pointer-events: none;
}

.ln-hero__motion-toggle {
  position: absolute;
  right: var(--ln-page-px);
  bottom: 1rem;
  z-index: 2;
  border: var(--ln-border-width) solid var(--ln-c-border);
  border-radius: var(--ln-radius-pill);
  background: var(--ln-c-on-media-veil);
  padding: 0.45rem 0.75rem;
  color: var(--ln-c-on-media);
  font: inherit;
  font-size: 0.8125rem;
  cursor: pointer;
}

.ln-hero__motion-toggle:focus-visible {
  outline: 2px solid var(--ln-c-brand);
  outline-offset: 2px;
}

.ln-hero__grid {
  display: grid;
  gap: clamp(2rem, 1rem + 4vw, 4rem);
  align-items: center;
  width: 100%;
}

.ln-hero--split .ln-hero__grid {
  grid-template-columns: 1fr;
}

@media (min-width: 960px) {
  .ln-hero--split .ln-hero__grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
}

.ln-hero--centered .ln-hero__grid,
.ln-hero--cover .ln-hero__grid {
  justify-items: center;
  text-align: center;
}

.ln-hero__copy {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  min-width: 0;
}

.ln-hero--centered .ln-hero__copy,
.ln-hero--cover .ln-hero__copy {
  align-items: center;
  max-width: 46rem;
}

.ln-hero__actions {
  margin-top: 0.25rem;
}

.ln-hero__note {
  margin: 0;
  color: var(--ln-c-text-2);
  font-size: 0.875rem;
}

.ln-hero__media {
  min-width: 0;
}

.ln-hero--centered .ln-hero__media {
  width: 100%;
  max-width: var(--ln-container);
}
</style>
