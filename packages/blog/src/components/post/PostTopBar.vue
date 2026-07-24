<script setup lang="ts">
import { useData } from 'vitepress'
import PostVideoLink from './PostVideoLink.vue'
import PodcastDropdown from './PodcastDropdown.vue'

const { frontmatter } = useData()
</script>

<template>
  <div
    v-if="frontmatter.videoLink || frontmatter.podcasts"
    class="flex max-sm:flex-col sm:gap-x-3 max-sm:gap-y-7"
  >
    <PostVideoLink />
    <PodcastDropdown />
  </div>
</template>
