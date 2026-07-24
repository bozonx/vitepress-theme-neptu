<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useData } from 'vitepress'
import { computed } from 'vue'
import DropdownButton from '../DropdownButton.vue'
import MenuItem from '../MenuItem.vue'
import PodcastIcon from './PodcastIcon.vue'
import { useUiTheme } from '../../composables/useUiTheme.ts'

import type { ThemeConfig, PostFrontmatter } from '../../types.d.ts'

const { frontmatter } = useData<ThemeConfig>()
const { theme } = useUiTheme()
const fm = computed(() => frontmatter.value as PostFrontmatter)
const btnText = computed(() => theme.value.t.listenPodcast)
</script>

<template>
  <DropdownButton v-if="frontmatter.podcasts" class="podcasts-btn w-fit [&>.btn-base]:bg-[var(--podcast-btn-bg)]! [&>.btn-base]:text-white [&>.btn-base]:py-3 [&>.btn-base]:hover:brightness-110">
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

    <template v-for="(link, name) in (fm.podcasts || {})" :key="String(name)">
      <MenuItem v-if="link" :href="link" :hide-external-icon="true">
        <span class="flex">
          <span class="mr-2">
            <PodcastIcon :name="String(name)" :alt="String(name) + ' podcast service icon'" />
          </span>
          {{ (theme.t.podcasts || {})[name] }}
        </span>
      </MenuItem>
    </template>
  </DropdownButton>
</template>
