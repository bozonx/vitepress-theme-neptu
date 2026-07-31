<script setup lang="ts">
import { withBase } from 'vitepress'

const props = defineProps<{
  src?: string
  description?: string
  alt?: string
  height?: number | string
  width?: number | string
}>()

// Site-root paths need the configured `base` prefix; relative and external
// URLs are used as-is.
const imageSrc = (src?: string): string | undefined =>
  src?.startsWith('/') ? withBase(src) : src
</script>

<template>
  <figure v-if="props.src">
    <a :href="imageSrc(props.src)" class="lightbox" :aria-label="props.alt || 'Open image'">
      <img
        :src="imageSrc(props.src)"
        :alt="props.alt || undefined"
        :height="props.height"
        :width="props.width"
        fetchpriority="high"
        decoding="async"
        class="max-w-full h-auto rounded-md transition-[transform,box-shadow] duration-200 ease-in-out will-change-[transform]"
      />
    </a>
    <figcaption
      v-if="props.description"
      class="vp-doc"
      v-html="props.description"
    ></figcaption>
  </figure>
</template>
