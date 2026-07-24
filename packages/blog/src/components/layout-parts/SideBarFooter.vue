<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'

import NeptuBtn from '../NeptuBtn.vue'
import SwitchAppearance from './SwitchAppearance.vue'
import SwitchTheme from './SwitchTheme.vue'
import { useUiTheme } from '../../composables/useUiTheme.ts'
import type { SocialLinkItem } from '../../types.d.ts'

const props = defineProps<{
  class?: string
}>()
const { localeIndex } = useData()
const { theme } = useUiTheme()

const configuredFormats = computed(() =>
  Array.isArray(theme.value.feeds?.formats)
    ? (theme.value.feeds!.formats as string[])
        .filter((format) => typeof format === 'string')
        .map((format) => format.trim().toLowerCase())
    : ['rss', 'atom', 'json']
)

const hasFormat = (format: string) => configuredFormats.value.includes(format)

const socialLinks = computed<SocialLinkItem[]>(() => {
  const links: SocialLinkItem[] = [
    ...(theme.value.sidebar?.socialLinks || []).map((item) => ({
      href: item.url || item.link,
      icon: item.icon,
      class: item.class,
      iconClass: item.iconClass,
      desktopOnly: item.desktopOnly,
      mobileOnly: item.mobileOnly,
    })),
  ].filter((item) => Boolean(item.href)) as SocialLinkItem[]

  if (theme.value.sidebar?.rssFeed && hasFormat('rss')) {
    links.push({
      href: withBase(`/${localeIndex.value}/feed.rss`),
      icon: theme.value.rssIcon,
      title: theme.value.t.links.rssFeed,
      target: '_blank',
    })
  }

  if (theme.value.sidebar?.atomFeed && hasFormat('atom')) {
    links.push({
      href: withBase(`/${localeIndex.value}/feed.atom`),
      icon: theme.value.atomIcon,
      title: theme.value.t.links.atomFeed,
      target: '_blank',
    })
  }

  return links
})
</script>

<template>
  <div :class="['w-full flex pt-6 pb-3 pr-2 pl-2', props.class]">
    <ul v-if="socialLinks.length" class="flex space-x-1">
      <li
        v-for="(item, index) in socialLinks"
        :key="item.href || index"
        :class="{
          'max-lg:hidden': item.desktopOnly,
          'lg:hidden': item.mobileOnly,
        }"
      >
        <NeptuBtn :no-bg="true" v-bind="item" :class="[item.class]" />
      </li>
    </ul>

    <div class="flex-1 flex justify-end items-center gap-1">
      <div v-if="theme.themeSwitcher" class="lg:hidden">
        <SwitchTheme :no-bg="true" @click.stop />
      </div>
      <div class="lg:hidden">
        <SwitchAppearance @click.stop />
      </div>
    </div>
  </div>
</template>
