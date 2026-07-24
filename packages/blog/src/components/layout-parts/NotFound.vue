<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'
import { useUiTheme } from '../../composables/useUiTheme.ts'

const { localeIndex } = useData()
const { theme } = useUiTheme()
const pageNotFoundText = computed(
  () => theme.value.notFound?.title || theme.value.t?.pageNotFound || 'Page not found'
)
const toHomeText = computed(
  () => theme.value.notFound?.linkText || theme.value.t?.toHome || 'Home'
)
// VitePress uses 'root' for the default locale; map it to '/' to avoid '/root/'
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
        <a class="simple-link" :href="withBase(homeLink)">{{ toHomeText }}</a>
      </div>
    </div>
  </div>
</template>
