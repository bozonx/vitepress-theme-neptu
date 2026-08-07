<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'
import { useThemeConfig } from '../../composables/useThemeConfig.ts'
import SimpleLink from '../SimpleLink.vue'

const { localeIndex } = useData()
const { theme } = useThemeConfig()
const pageNotFoundText = computed(
  () => theme.value.notFound?.title || theme.value.t?.pageNotFound || 'Page not found'
)
const toHomeText = computed(
  () => theme.value.notFound?.linkText || theme.value.t?.toHome || 'Home'
)
// `root` here is VitePress' runtime sentinel, not a content locale: `useData()`
// resolves `localeIndex` to `'root'` whenever the path matches no locale prefix
// — which is exactly the 404 case and the neutral language selector. Neptu
// rejects `root` as a *configured* locale (see `assertStrictLocaleStructure`),
// so the sentinel always means "no locale" and maps to `/`.
const homeLink = computed(() =>
  localeIndex.value === 'root' ? '/' : `/${localeIndex.value}/`
)
</script>

<template>
  <div
    class="notfound-page bg-[var(--body-bg)] flex items-center justify-center h-screen"
  >
    <div>
      <h1 class="text-[var(--body-text-color)] text-4xl">{{ pageNotFoundText }}</h1>
      <div class="text-xl mt-1">
        <SimpleLink :href="withBase(homeLink)">{{ toHomeText }}</SimpleLink>
      </div>
    </div>
  </div>
</template>
