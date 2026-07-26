<script setup lang="ts">
/** Image or video frame with a fixed aspect ratio and themed shape. */
import { computed } from 'vue'
import { withBase } from 'vitepress'
import type { MediaLike } from '../blocks/types.ts'

const props = withDefaults(
  defineProps<{
    media?: MediaLike
    alt?: string
    ratio?: string
    fit?: 'cover' | 'contain'
    /** Shape of the frame. */
    rounded?: 'none' | 'md' | 'lg'
    shadow?: boolean
    border?: boolean
    eager?: boolean
  }>(),
  { rounded: 'lg', shadow: false, border: false, eager: false }
)

const spec = computed(() =>
  typeof props.media === 'string' ? { src: props.media } : (props.media ?? {})
)

const isExternal = (url?: string) => /^(https?:)?\/\//.test(url ?? '')
const resolve = (url?: string) =>
  !url || isExternal(url) ? url : withBase(url)

const src = computed(() => resolve(spec.value.src))
const video = computed(() => resolve(spec.value.video))
const poster = computed(() => resolve(spec.value.poster))
const alt = computed(() => spec.value.alt ?? props.alt ?? '')
const ratio = computed(() => spec.value.ratio ?? props.ratio)
const fit = computed(() => spec.value.fit ?? props.fit ?? 'cover')
</script>

<template>
  <figure
    v-if="src || video || $slots.default"
    class="ln-media"
    :class="[
      `ln-media--r-${props.rounded}`,
      { 'ln-media--shadow': props.shadow, 'ln-media--border': props.border },
    ]"
    :style="ratio ? { aspectRatio: ratio } : undefined"
  >
    <slot>
      <video
        v-if="video"
        :src="video"
        :poster="poster"
        :style="{ objectFit: fit }"
        autoplay
        muted
        loop
        playsinline
      />
      <img
        v-else
        :src="src"
        :alt="alt"
        :width="spec.width"
        :height="spec.height"
        :loading="props.eager ? 'eager' : 'lazy'"
        :style="{ objectFit: fit }"
      />
    </slot>
    <figcaption v-if="$slots.caption" class="ln-media__caption">
      <slot name="caption" />
    </figcaption>
  </figure>
</template>

<style scoped>
.ln-media {
  position: relative;
  margin: 0;
  overflow: hidden;
  width: 100%;
  line-height: 0;
}

.ln-media :deep(img),
.ln-media :deep(video) {
  display: block;
  width: 100%;
  height: 100%;
  max-width: 100%;
}

.ln-media--r-md {
  border-radius: var(--ln-radius-md);
}
.ln-media--r-lg {
  border-radius: var(--ln-radius-lg);
}
.ln-media--shadow {
  box-shadow: var(--ln-shadow-3);
}
.ln-media--border {
  border: var(--ln-border-width) solid var(--ln-c-border);
}

.ln-media__caption {
  padding-top: 0.75rem;
  color: var(--ln-c-text-2);
  font-size: 0.875rem;
  line-height: 1.5;
}
</style>
