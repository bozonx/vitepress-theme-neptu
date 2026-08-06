<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

import NeptuBtn from '../NeptuBtn.vue'
import { useThemeConfig } from '../../composables/useThemeConfig.ts'

const { frontmatter } = useData()
const { theme } = useThemeConfig()
const text = computed(
  () =>
    theme.value.t.postVideoButton +
    (frontmatter.value.videoLinkLang
      ? ` (${frontmatter.value.videoLinkLang})`
      : '')
)
</script>

<template>
  <NeptuBtn
    :href="frontmatter.videoLink"
    :text="text"
    :icon="theme.youtubeIcon"
    target="_blank"
    class="video-link w-fit py-3 text-white! bg-[var(--video-link-bg)]! hover:brightness-110"
    :hide-external-icon="true"
  />
</template>

<style scoped>
.video-link:hover {
  transform: none;
}
</style>

