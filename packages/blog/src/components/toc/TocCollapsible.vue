<script setup lang="ts">
import { useData } from 'vitepress'
import { computed, ref } from 'vue'

import { useToc } from '../../composables/useToc.ts'
import TocLinks from './TocLinks.vue'
import type { ThemeConfig } from '../../types.d.ts'

// Table of contents above the article, for viewports too narrow for the aside
// column. Built on <details> so keyboard and screen-reader behaviour comes
// from the platform rather than from re-implemented ARIA.

const { theme } = useData<ThemeConfig>()
const { items, show, label } = useToc()

// Collapsed by default: expanded, a long TOC becomes a screenful the reader
// has to scroll past before reaching the first paragraph.
const open = ref(theme.value?.toc?.collapsed === false)

const position = computed(() => theme.value?.toc?.position ?? 'auto')
</script>

<template>
  <!-- Kept out of the search index: it sits inside the indexed article body
       and would otherwise duplicate every heading as searchable text. -->
  <details
    v-if="show"
    :open="open"
    data-pagefind-ignore
    class="toc-collapsible"
    :class="`toc-collapsible--${position}`"
    @toggle="open = ($event.target as HTMLDetailsElement).open"
  >
    <summary class="toc-collapsible__summary">
      <span>{{ label }}</span>
      <svg
        class="toc-collapsible__chevron"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        aria-hidden="true"
      >
        <path
          d="M6 9l6 6 6-6"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </summary>
    <TocLinks :items="items" @navigate="open = false" />
  </details>
</template>

<style scoped>
.toc-collapsible {
  margin-block: 1.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--toc-box-border);
  border-radius: var(--toc-box-radius);
  background: var(--toc-box-bg);
}

.toc-collapsible__summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  cursor: pointer;
  font-size: var(--toc-label-font-size);
  font-weight: 600;
  color: var(--toc-label-color);
  /* Hide the native marker; the chevron below replaces it in both engines. */
  list-style: none;
}

.toc-collapsible__summary::-webkit-details-marker {
  display: none;
}

.toc-collapsible__chevron {
  flex: none;
  transition: transform 0.2s ease;
}

.toc-collapsible[open] .toc-collapsible__chevron {
  transform: rotate(180deg);
}

/* `position: aside` keeps the TOC in the column only — this block never
   appears, and narrow viewports simply get no TOC. */
.toc-collapsible--aside {
  display: none;
}

/* `position: auto` (the default) hands over to the aside column once it is
   wide enough to exist. Keep in sync with --aside-breakpoint in
   blog-vars.css: media queries cannot read CSS custom properties. */
@media (min-width: 1550px) {
  .toc-collapsible--auto {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .toc-collapsible__chevron {
    transition: none;
  }
}
</style>
