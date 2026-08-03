<script setup lang="ts">
import BaseLink from '../BaseLink.vue'
import type { BreadcrumbItem } from '../../types.d.ts'

/**
 * Generic breadcrumb trail. Callers build the item list — hrefs are passed to
 * `BaseLink`, so locale-relative values (`categories/frontend/1`) are prefixed
 * with the active locale automatically.
 *
 * The matching `BreadcrumbList` JSON-LD is emitted at build time by the
 * `addJsonLd` transformer, not from here.
 */
defineProps<{
  items?: BreadcrumbItem[]
  /** Accessible name of the nav landmark. */
  label?: string
}>()
</script>

<template>
  <nav
    v-if="items && items.length > 1"
    :aria-label="label || 'Breadcrumb'"
    class="mb-4 overflow-x-auto py-1"
    data-pagefind-ignore
  >
    <ol
      class="flex items-center list-none p-0 m-0 whitespace-nowrap text-xs sm:text-sm text-[var(--vp-c-text-2)]"
    >
      <li
        v-for="(item, index) in items"
        :key="item.href || item.text || index"
        class="flex items-center"
      >
        <span v-if="index > 0" class="mx-1 sm:mx-1.5 opacity-50 select-none">/</span>

        <BaseLink
          v-if="item.href && index < items.length - 1"
          :href="item.href"
          active-compare-method="none"
          class="hover:text-[var(--vp-c-brand-1)] transition-colors duration-150"
        >
          {{ item.text }}
        </BaseLink>
        <span
          v-else
          class="font-medium text-[var(--vp-c-text-1)] truncate max-w-[200px] sm:max-w-[300px]"
          :aria-current="index === items.length - 1 ? 'page' : undefined"
        >
          {{ item.text }}
        </span>
      </li>
    </ol>
  </nav>
</template>
