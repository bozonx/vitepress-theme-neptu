<script setup lang="ts">
/**
 * Video block with a click-to-load facade.
 *
 * An embedded YouTube player costs upwards of a megabyte and sets cookies
 * before anyone presses play, so nothing is embedded until the visitor asks:
 * the poster is a plain image, and the `<iframe>` is created on click. That
 * keeps the page fast and keeps third-party cookies off the first visit —
 * which is also what makes the block usable in the EU without a consent
 * banner. YouTube is embedded through `youtube-nocookie.com`.
 *
 * Self-hosted files (`src`) get a native `<video controls>` instead.
 */
import { computed, ref } from 'vue'
import { useData } from 'vitepress'
import LnSection from '../primitives/LnSection.vue'
import LnHeading from '../primitives/LnHeading.vue'
import LnIcon from '../primitives/LnIcon.vue'
import LnButtonGroup from '../primitives/LnButtonGroup.vue'
import type { ActionItem, HeadingProps, SectionProps } from './types.ts'
import { useSectionProps } from './sectionProps.ts'
import { resolveUrl } from '../utils/url.ts'

const props = withDefaults(
  defineProps<
    SectionProps & HeadingProps & {
      /** YouTube id or URL. */
      youtube?: string
      /** Vimeo id or URL. */
      vimeo?: string
      /** Self-hosted file — rendered as a native player. */
      src?: string
      /** Poster image. Falls back to the YouTube thumbnail. */
      poster?: string
      /** Accessible name of the player. */
      caption?: string
      /** CSS aspect-ratio of the player frame, e.g. `16/9`. */
      mediaRatio?: string
      actions?: ActionItem[]
      /** Start muted and play immediately — self-hosted `src` only. */
      autoplay?: boolean
    }
  >(),
  { mediaRatio: '16/9', autoplay: false, align: 'center', width: 'default' }
)

const { theme } = useData()
const videoText = computed(() => {
  const t = theme.value.t as { landing?: { video?: Record<string, string> } } | undefined
  return t?.landing?.video ?? {}
})
const label = (key: string, fallback: string): string => videoText.value[key] ?? fallback

const playing = ref(false)

/** Accepts a bare id, a watch URL, a short URL or an embed URL. */
const youtubeId = computed(() => {
  const value = props.youtube
  if (!value) return undefined
  const match = value.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{6,})/)
  return match?.[1] ?? (/^[\w-]{6,}$/.test(value) ? value : undefined)
})

const vimeoId = computed(() => {
  const value = props.vimeo
  if (!value) return undefined
  const match = value.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return match?.[1] ?? (/^\d+$/.test(value) ? value : undefined)
})

const embedSrc = computed(() => {
  if (youtubeId.value) {
    return `https://www.youtube-nocookie.com/embed/${youtubeId.value}?autoplay=1&rel=0`
  }
  if (vimeoId.value) return `https://player.vimeo.com/video/${vimeoId.value}?autoplay=1`
  return undefined
})

const posterSrc = computed(() => {
  if (props.poster) return resolveUrl(props.poster)
  if (youtubeId.value) return `https://i.ytimg.com/vi/${youtubeId.value}/maxresdefault.jpg`
  return undefined
})

const fileSrc = computed(() => resolveUrl(props.src))
const playerLabel = computed(() => props.caption ?? props.title ?? label('player', 'Video'))
const sectionProps = useSectionProps(props)
</script>

<template>
  <LnSection
    v-bind="sectionProps"
    class="ln-video"
  >
    <LnHeading
      :eyebrow="props.eyebrow"
      :title="props.title"
      :text="props.text"
      :align="props.align"
    />

    <figure class="ln-video__figure">
      <div class="ln-video__frame" :style="{ aspectRatio: props.mediaRatio }">
        <!-- Self-hosted: no facade needed, the browser player is already cheap. -->
        <video
          v-if="fileSrc"
          class="ln-video__player"
          :src="fileSrc"
          :poster="posterSrc"
          :autoplay="props.autoplay"
          :muted="props.autoplay"
          :aria-label="playerLabel"
          controls
          playsinline
        />

        <iframe
          v-else-if="playing && embedSrc"
          class="ln-video__player"
          :src="embedSrc"
          :title="playerLabel"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          loading="lazy"
        />

        <button
          v-else-if="embedSrc"
          type="button"
          class="ln-video__facade"
          :aria-label="`${label('play', 'Play')}: ${playerLabel}`"
          @click="playing = true"
        >
          <img v-if="posterSrc" :src="posterSrc" alt="" loading="lazy" />
          <span class="ln-video__button" aria-hidden="true">
            <LnIcon icon="fa6-solid:play" size="1.25rem" />
          </span>
        </button>
      </div>

      <figcaption v-if="props.caption" class="ln-video__caption">{{ props.caption }}</figcaption>
    </figure>

    <LnButtonGroup
      v-if="props.actions?.length"
      :actions="props.actions"
      :align="props.align"
      class="ln-video__actions"
    />
    <slot />
  </LnSection>
</template>

<style scoped>
.ln-video__figure {
  margin: 0;
}

.ln-video__frame {
  position: relative;
  overflow: hidden;
  width: 100%;
  border-radius: var(--ln-radius-lg);
  background-color: var(--ln-c-bg-mute);
  box-shadow: var(--ln-shadow-3);
  line-height: 0;
}

.ln-video__player {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
  object-fit: cover;
}

.ln-video__facade {
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  border: 0;
  padding: 0;
  background: none;
  cursor: pointer;
}

.ln-video__facade img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s var(--ln-ease);
}

.ln-video__facade:hover img {
  transform: scale(1.03);
}

.ln-video__facade:focus-visible {
  outline: 2px solid var(--ln-c-brand);
  outline-offset: -4px;
}

.ln-video__button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4.5rem;
  height: 4.5rem;
  padding-left: 0.25rem;
  border-radius: var(--ln-radius-pill);
  background-color: var(--ln-c-brand);
  color: var(--ln-c-on-brand);
  box-shadow: var(--ln-shadow-3);
  transition:
    transform var(--ln-duration) var(--ln-ease),
    background-color var(--ln-duration) var(--ln-ease);
}

.ln-video__facade:hover .ln-video__button {
  transform: translate(-50%, -50%) scale(1.08);
  background-color: var(--ln-c-brand-active);
}

.ln-video__caption {
  margin: 0.875rem 0 0;
  color: var(--ln-c-text-2);
  font-size: 0.875rem;
  text-align: center;
}

.ln-video__actions {
  margin-top: 1.75rem;
}
</style>
