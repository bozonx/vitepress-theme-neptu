<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'
import NeptuBtnLink from '../NeptuBtnLink.vue'
import { useThemeConfig } from '../../composables/useThemeConfig.ts'

const { localeIndex } = useData()
const { theme } = useThemeConfig()

const footerLinksCount = computed(() => theme.value.footer?.links?.length || 0)
const hasMultipleFooterLinks = computed(
  () => footerLinksCount.value > 1
)

const configuredFormats = computed(() =>
  Array.isArray(theme.value.feeds?.formats)
    ? (theme.value.feeds!.formats as string[])
        .filter((format) => typeof format === 'string')
        .map((format) => format.trim().toLowerCase())
    : ['rss', 'atom', 'json']
)

const hasFormat = (format: string) => configuredFormats.value.includes(format)

const feedLinks = computed(() => {
  const links: Array<{
    text: string
    href: string
    icon?: string
    target?: string
  }> = []

  if (
    theme.value.footer?.rssFeed !== false &&
    hasFormat('rss')
  ) {
    links.push({
      text: theme.value.t?.links?.rssFeed || 'RSS feed',
      href: withBase(`/${localeIndex.value}/feed.rss`),
      icon: theme.value.rssIcon || 'bi:rss-fill',
      target: '_blank',
    })
  }

  if (
    theme.value.footer?.atomFeed !== false &&
    hasFormat('atom')
  ) {
    links.push({
      text: theme.value.t?.links?.atomFeed || 'Atom feed',
      href: withBase(`/${localeIndex.value}/feed.atom`),
      icon: theme.value.atomIcon || 'vscode-icons:file-type-atom',
      target: '_blank',
    })
  }

  for (const item of theme.value.footer?.socialLinks || []) {
    if (!item.href) continue
    links.push({
      text: item.title || '',
      href: item.href,
      icon: item.icon,
      target: '_blank',
    })
  }

  return links
})
</script>

<template>
  <footer
    v-if="theme.footer"
    class="flex flex-col w-full gap-y-6 text-sm muted"
  >
    <div
      v-if="feedLinks.length"
      class="w-full flex items-center justify-center flex-wrap gap-x-3 gap-y-2 pb-6 border-b border-[var(--vp-c-divider)] text-sm font-medium"
    >
      <template v-for="(item, index) in feedLinks" :key="item.href + index">
        <span
          v-if="index > 0"
          class="select-none opacity-40"
          aria-hidden="true"
          >·</span
        >
        <NeptuBtnLink
          :text="item.text"
          :href="item.href"
          :icon="item.icon"
          :target="item.target || '_blank'"
          class="hover:opacity-80 transition-opacity"
        />
      </template>
    </div>

    <div
      v-if="theme.footer?.message || theme.footer?.copyright || theme.footer.links?.length"
      class="flex flex-wrap w-full items-start justify-between gap-x-10 gap-y-6"
    >
      <div
        v-if="theme.footer?.message || theme.footer?.copyright"
        class="min-w-0 flex-1 basis-64"
      >
        <div>{{ theme.footer.message }}</div>
        <div>{{ theme.footer.copyright }}</div>
      </div>

      <nav
        v-if="theme.footer.links?.length"
        :class="[
          'min-w-0',
          hasMultipleFooterLinks ? 'flex-1 basis-64' : 'ml-auto',
        ]"
        aria-label="Footer navigation"
      >
        <ul
          :class="[
            'grid min-w-0 gap-x-9 gap-y-3',
            hasMultipleFooterLinks ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1',
            hasMultipleFooterLinks ? 'justify-start md:justify-end' : 'justify-end',
          ]"
        >
          <li
            v-for="(item, index) in theme.footer.links"
            :key="item.href + index"
            class="min-w-0"
            :class="{
              'max-lg:hidden': item.desktopOnly,
              'lg:hidden': item.mobileOnly,
            }"
          >
            <NeptuBtnLink
              :text="item.text"
              :title="item.title"
              :href="item.href"
              :icon="item.icon"
              :icon-class="item.iconClass"
              :class="[item.class, 'underline']"
            />
          </li>
        </ul>
      </nav>
    </div>
  </footer>
</template>
