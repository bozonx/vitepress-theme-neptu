<template>
  <div
    class="author-container flex flex-col md:flex-row gap-x-6 gap-y-1 items-start"
  >
    <!-- Author image -->
    <figure
      v-if="author?.image"
      class="author-image-container w-full mx-auto md:w-[280px] md:shrink-0"
    >
      <a :href="author.image" class="lightbox" :aria-label="author?.name || 'Open image'">
        <img
          :src="author.image"
          :alt="author?.name"
          :height="author?.imageHeight"
          :width="author?.imageWidth"
          loading="lazy"
          decoding="async"
          class="w-full max-w-full h-auto rounded-md transition-[transform,box-shadow] duration-200 ease-in-out will-change-[transform]"
        />
      </a>
    </figure>

    <!-- Author content -->
    <div class="author-content flex-1">
      <div class="mb-6 vp-doc" v-html="author?.description"></div>
      <SocialMediaLinks v-if="socialLinks.length" :links="socialLinks" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SocialMediaLinks from './SocialMediaLinks.vue'
import type { Author } from '../types.d.ts'

const props = defineProps<{ author?: Author }>()
const socialLinks = computed(() =>
  (props.author?.links || [])
    .filter((item) => item.url && item.type)
    .map((item) => ({
      url: item.url as string,
      title: item.title,
      type: item.type as string,
    }))
)
</script>
