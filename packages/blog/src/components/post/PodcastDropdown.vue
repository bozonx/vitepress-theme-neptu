<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useData } from 'vitepress'
import { computed } from 'vue'
import DropdownButton from '../DropdownButton.vue'
import MenuItem from '../MenuItem.vue'
import PodcastIcon from './PodcastIcon.vue'
import { useThemeConfig } from '../../composables/useThemeConfig.ts'
import { resolvePodcasts } from '../../utils/shared/podcasts.ts'

import type { ThemeConfig, PostFrontmatter } from '../../types.d.ts'

const { frontmatter, localeIndex } = useData<ThemeConfig>()
const { theme } = useThemeConfig()
const fm = computed(() => frontmatter.value as PostFrontmatter)
const btnText = computed(() => theme.value.t.listenPodcast)

const podcasts = computed(() =>
  resolvePodcasts(fm.value.podcasts, {
    platforms: theme.value.podcastPlatforms,
    translations: theme.value.t?.podcasts,
    localeIndex: localeIndex.value,
  })
)
</script>

<template>
  <DropdownButton v-if="podcasts.length" class="podcasts-btn w-fit [&>.btn-base]:bg-[var(--podcast-btn-bg)]! [&>.btn-base]:text-white [&>.btn-base]:py-3 [&>.btn-base]:hover:brightness-110">
    <template #btn-text>
      <span class="mr-1" aria-hidden="true">
        <Icon
          icon="material-symbols:headphones-outline"
          width="1.6rem"
          height="1.6rem"
        />
      </span>
      {{ btnText }}
    </template>

    <MenuItem
      v-for="podcast in podcasts"
      :key="podcast.id"
      :href="podcast.url"
      :hide-external-icon="true"
    >
      <span class="flex">
        <span class="mr-2">
          <PodcastIcon
            :icon="podcast.icon"
            :icon-url="podcast.iconUrl"
            :alt="podcast.label + ' podcast service icon'"
          />
        </span>
        {{ podcast.label }}
      </span>
    </MenuItem>
  </DropdownButton>
</template>

<style scoped>
.podcasts-btn :deep(.btn-base:hover) {
  transform: none;
}
</style>
