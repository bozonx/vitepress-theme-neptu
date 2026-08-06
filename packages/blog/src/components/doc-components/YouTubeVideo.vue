<script setup lang="ts">
// Got from https://github.com/lando/vitepress-theme-default-plus/blob/main/components/VPLYouTube.vue
// also see https://github.com/miletorix/vitepress-youtube-embed/blob/main/packages/src/YouTubeEmbed.vue

import { computed } from 'vue'

const props = defineProps<{ id?: string; videoId?: string }>()

/** Validates a YouTube video ID (11 chars, alphanumeric, hyphens, underscores). */
function isValidYouTubeId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{11}$/.test(id)
}

const url = computed(() => {
  const id = props.id || props.videoId || ''
  if (!isValidYouTubeId(id)) {
    if (id) console.warn(`Invalid YouTube ID: ${id}`)
    return ''
  }
  return `https://www.youtube.com/embed/${id}`
})
</script>

<template>
  <div v-if="url" class="video-responsive mt-4 overflow-hidden relative aspect-video max-md:px-0 max-md:rounded-none max-md:w-auto max-md:my-[0.85rem] max-md:-mx-6">
    <iframe
      class="absolute inset-0 w-full h-full"
      :src="url"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
  </div>
</template>
