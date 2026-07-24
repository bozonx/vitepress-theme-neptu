<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useUiTheme } from '../../composables/useUiTheme.ts'

const { theme } = useUiTheme()

const searchText = computed(
  () =>
    theme.value.search?.options?.translations?.button?.buttonText ||
    theme.value.t?.search ||
    'Search'
)

const searchAriaLabel = computed(
  () =>
    theme.value.search?.options?.translations?.button?.buttonAriaLabel ||
    theme.value.t?.searchInBlog ||
    'Search in blog'
)
</script>

<template>
  <div
    class="nav-search-button flex items-center h-full w-40 md:w-56 max-[490px]:w-[120px] max-[439px]:w-full"
  >
    <button
      type="button"
      class="search-input-btn w-full flex items-center cursor-pointer text-left gap-2 p-[8px_12px] rounded-md transition-colors duration-200 border border-[var(--search-input-btn-border-color)] bg-[var(--vp-c-bg-soft)] hover:border-[var(--vp-c-brand-1)] hover:bg-[var(--vp-c-bg)] text-[var(--vp-c-text-2)] will-change-[background-color,border-color]"
      :title="searchAriaLabel"
      :aria-label="searchAriaLabel"
    >
      <Icon
        icon="fa6-solid:magnifying-glass"
        class="search-icon w-4 shrink-0"
      />
      <span class="search-placeholder text-sm flex-1 max-[439px]:hidden"
        >{{ searchText }}...</span
      >
    </button>
  </div>
</template>
