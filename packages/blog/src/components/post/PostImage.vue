<script setup lang="ts">
const props = defineProps<{
  src?: string
  description?: string
  alt?: string
  height?: number | string
  width?: number | string
}>()
</script>

<template>
  <figure v-if="props.src">
    <a :href="props.src" class="lightbox" :aria-label="props.alt || 'Open image'">
      <img
        :src="props.src"
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
