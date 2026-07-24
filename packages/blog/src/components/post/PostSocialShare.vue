<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

import { Icon } from '@iconify/vue'
import { useUiTheme } from '../../composables/useUiTheme.ts'
import type { NeptuBlogTheme } from '../../types.d.ts'

const { title } = useData()
const { theme } = useUiTheme()
const siteFullTitle = computed(() => encodeURIComponent(title.value || ''))

interface ShareItem {
  href: string
  icon: string
  title: string
  class?: string
}

const socialItems = computed(() => theme.value.socialMediaShares || [])

const items = computed<ShareItem[]>(() => {
  const currentUrl = typeof document !== 'undefined' ? document.URL : ''
  const encodedDocUrl = encodeURIComponent(currentUrl)

  return socialItems.value.map((item: NeptuBlogTheme.SocialMediaShare) => {
    const href = item.urlTemplate
      .replaceAll('{url}', encodedDocUrl)
      .replaceAll('{title}', siteFullTitle.value)

    return { href, icon: item.icon, title: item.title, class: item.class }
  })
})
</script>

<template>
  <div
    v-if="socialItems.length > 0"
    class="flex gap-y-3 max-sm:flex-col sm:items-center"
  >
    <div class="mr-2 muted">{{ theme.t.shareSocialMedia }}:</div>
    <div class="flex gap-x-2">
      <template v-for="item in items" :key="item.title">
        <a
          :href="item.href"
          :title="item.title"
          target="_blank"
          rel="nofollow noopener"
          :class="[
            'social-btn hover-animation-rise inline-flex items-center justify-center w-12 h-12 rounded-lg no-underline transition-transform duration-200 ease-in-out hover:-translate-y-0.5 hover:filter-none will-change-[transform]',
            item.class,
          ]"
        >
          <Icon :icon="item.icon" aria-hidden="true" class="w-9 h-9" />
        </a>
      </template>
    </div>
  </div>
</template>
