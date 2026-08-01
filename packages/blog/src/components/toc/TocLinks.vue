<script setup lang="ts">
import type { TocItem } from '../../utils/shared/toc.ts'

// Bare list of TOC entries, shared by the aside column and the collapsible
// block above the article so both stay visually and structurally identical.

defineProps<{
  items: TocItem[]
  /** Anchor of the heading the reader is currently in, if tracked. */
  activeLink?: string
}>()

const emit = defineEmits<{ navigate: [] }>()
</script>

<template>
  <ul class="toc-links">
    <li
      v-for="item in items"
      :key="item.link"
      :style="{ '--toc-depth': item.depth }"
      class="toc-item"
    >
      <a
        :href="item.link"
        class="toc-link"
        :class="{ 'toc-link--active': activeLink === item.link }"
        :aria-current="activeLink === item.link ? 'true' : undefined"
        @click="emit('navigate')"
      >
        {{ item.title }}
      </a>
    </li>
  </ul>
</template>

<style scoped>
.toc-links {
  list-style: none;
  margin: 0;
  padding: 0;
}

.toc-item {
  padding-inline-start: calc(var(--toc-depth, 0) * var(--toc-indent));
}

.toc-link {
  display: block;
  padding: var(--toc-link-padding-y) 0;
  font-size: var(--toc-font-size);
  line-height: var(--toc-line-height);
  color: var(--toc-link-color);
  text-decoration: none;
  transition: color 0.15s ease;
  /* Long headings wrap rather than widen the column or clip mid-word. */
  overflow-wrap: break-word;
}

.toc-link:hover {
  color: var(--toc-link-hover-color);
}

.toc-link--active {
  color: var(--toc-link-active-color);
  font-weight: 600;
}

@media (prefers-reduced-motion: reduce) {
  .toc-link {
    transition: none;
  }
}
</style>
