<script setup lang="ts">
import { useActiveHeading, useToc } from '../../composables/useToc.ts'
import TocLinks from './TocLinks.vue'

// Table of contents as it appears in the right-hand column, the standard
// placement for wide viewports. Below the aside breakpoint the column is not
// rendered at all and `TocCollapsible` takes over above the article.

const { items, show, label } = useToc()
const { activeLink } = useActiveHeading(items)

defineExpose({ show })
</script>

<template>
  <nav v-if="show" class="toc-aside" :aria-label="label">
    <div class="toc-aside__label">{{ label }}</div>
    <TocLinks :items="items" :active-link="activeLink" />
  </nav>
</template>

<style scoped>
.toc-aside {
  /* The column itself is sticky; capping the height keeps a long TOC
     scrollable instead of running off the bottom of the viewport. */
  max-height: calc(100vh - var(--aside-top) - 2rem);
  overflow-y: auto;
  overscroll-behavior: contain;
}

.toc-aside__label {
  font-size: var(--toc-label-font-size);
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--toc-label-color);
  margin-bottom: 0.5rem;
}
</style>
