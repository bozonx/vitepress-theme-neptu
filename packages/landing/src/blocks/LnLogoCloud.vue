<script setup lang="ts">
/**
 * Row of customer / sponsor / integration logos. `variant="marquee"` scrolls
 * them infinitely; it pauses on hover and is disabled under reduced motion.
 */
import { computed } from 'vue'
import LnSection from '../primitives/LnSection.vue'
import LnHeading from '../primitives/LnHeading.vue'
import { externalTarget, resolveUrl } from '../utils/url.ts'
import type { LogoItem, SectionProps } from './types.ts'

const props = withDefaults(
  defineProps<
    SectionProps & {
      eyebrow?: string
      title?: string
      text?: string
      items?: LogoItem[]
      variant?: 'row' | 'grid' | 'marquee'
      /** Render logos in a single flat color that follows the theme. */
      monochrome?: boolean
      /** Marquee cycle duration in seconds. */
      speed?: number
      logoHeight?: string
    }
  >(),
  {
    variant: 'row',
    monochrome: true,
    speed: 32,
    logoHeight: '2rem',
    padding: 'sm',
    align: 'center',
  }
)

/**
 * The marquee scrolls one full group and restarts. Both groups must be
 * *separate flex items* with their own inner gap: translating a single flat
 * list by -50% lands half a gap off and the loop visibly jumps.
 */
const marqueeGroups = computed(() => [false, true])
</script>

<template>
  <LnSection
    :id="props.id"
    :bg="props.bg"
    :width="props.variant === 'marquee' ? 'full' : props.width"
    :padding="props.padding"
    :divider="props.divider"
    :no-reveal="props.noReveal"
    class="ln-logos"
    :class="[`ln-logos--${props.variant}`, { 'ln-logos--mono': props.monochrome }]"
    :style="{ '--ln-logo-h': props.logoHeight, '--ln-marquee-speed': `${props.speed}s` }"
  >
    <LnHeading
      v-if="props.eyebrow || props.title || props.text"
      :eyebrow="props.eyebrow"
      :title="props.title"
      :text="props.text"
      :align="props.align"
      size="card"
      class="ln-logos__heading"
    />

    <div v-if="props.variant === 'marquee'" class="ln-logos__marquee">
      <div class="ln-logos__track">
        <!-- The second group is a visual duplicate: hide it from screen readers. -->
        <div
          v-for="(isClone, g) in marqueeGroups"
          :key="`group-${g}`"
          class="ln-logos__group"
          :aria-hidden="isClone ? 'true' : undefined"
        >
          <component
            :is="logo.link && !isClone ? 'a' : 'span'"
            v-for="(logo, i) in props.items"
            :key="`${logo.src}-${i}`"
            class="ln-logos__item"
            :href="!isClone ? resolveUrl(logo.link) : undefined"
            :target="!isClone ? externalTarget(logo.link) : undefined"
            :rel="logo.link && !isClone && externalTarget(logo.link) ? 'noreferrer' : undefined"
            :tabindex="isClone ? -1 : undefined"
          >
            <img
              :src="resolveUrl(logo.src)"
              :alt="isClone ? '' : (logo.alt ?? '')"
              :style="logo.height ? { height: logo.height } : undefined"
              loading="lazy"
            />
          </component>
        </div>
      </div>
    </div>

    <div v-else class="ln-logos__list">
      <component
        :is="logo.link ? 'a' : 'span'"
        v-for="(logo, i) in props.items"
        :key="`${logo.src}-${i}`"
        class="ln-logos__item"
        :href="resolveUrl(logo.link)"
        :target="externalTarget(logo.link)"
        :rel="logo.link && externalTarget(logo.link) ? 'noreferrer' : undefined"
      >
        <img
          :src="resolveUrl(logo.src)"
          :alt="logo.alt ?? ''"
          :style="logo.height ? { height: logo.height } : undefined"
          loading="lazy"
        />
      </component>
      <slot />
    </div>
  </LnSection>
</template>

<style scoped>
.ln-logos__heading {
  margin-bottom: 1.75rem;
}

.ln-logos__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: clamp(1.5rem, 1rem + 3vw, 4rem);
}

.ln-logos--grid .ln-logos__list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
  gap: var(--ln-gap);
}

.ln-logos__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  transition:
    opacity var(--ln-duration) var(--ln-ease),
    filter var(--ln-duration) var(--ln-ease);
}

.ln-logos__item img {
  height: var(--ln-logo-h);
  width: auto;
  max-width: 12rem;
  object-fit: contain;
}

.ln-logos--mono .ln-logos__item img {
  filter: grayscale(1);
  opacity: 0.65;
}

.ln-logos--mono .ln-logos__item:hover img {
  filter: none;
  opacity: 1;
}

/**** Marquee */
.ln-logos {
  --ln-marquee-gap: clamp(2rem, 1rem + 4vw, 5rem);
}

.ln-logos__marquee {
  overflow: hidden;
  width: 100%;
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}

.ln-logos__track {
  display: flex;
  align-items: center;
  /* Same gap between groups as inside them, so the seam is invisible. */
  gap: var(--ln-marquee-gap);
  width: max-content;
  animation: ln-marquee var(--ln-marquee-speed) linear infinite;
}

.ln-logos__group {
  display: flex;
  align-items: center;
  gap: var(--ln-marquee-gap);
  flex: none;
}

.ln-logos__marquee:hover .ln-logos__track,
.ln-logos__marquee:focus-within .ln-logos__track {
  animation-play-state: paused;
}

/**
 * Distance = one group + one gap. The track is `2 × group + gap`, so a group is
 * `(track − gap) / 2` and the shift becomes `50% + gap / 2` of the track — the
 * clone lands exactly where the original started. A plain `-50%` is off by half
 * a gap, which is the classic marquee stutter.
 */
@keyframes ln-marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-50% - var(--ln-marquee-gap) / 2));
  }
}

@media (prefers-reduced-motion: reduce) {
  .ln-logos__track {
    animation: none;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
  }

  .ln-logos__group[aria-hidden='true'] {
    display: none;
  }

  .ln-logos__group {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
