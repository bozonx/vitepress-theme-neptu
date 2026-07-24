<script setup lang="ts">
// Internal component — consumed by other components only.
import { useData, useRoute, withBase } from 'vitepress'
import { computed } from 'vue'
import { resolveI18Href, isExternalUrl } from '../utils/shared/index.ts'

type ClassValue = string | Record<string, unknown> | unknown[]

interface Props {
  customClass?: ClassValue
  tag?: string
  href?: string
  target?: string
  rel?: string
  disabled?: boolean
  activeCompareMethod?: 'soft' | 'pagination' | 'softPagination' | 'none' | 'strict'
}

// Normalize path — removes the trailing numeric segment if path ends with /\d+
function normalizePath(path = ''): string {
  const match = path.match(/^(.+\/)\d+$/)
  return match ? match[1] : path
}

const { localeIndex } = useData()
const route = useRoute()
const props = defineProps<Props>()
// Reactive computed properties
const i18nHref = computed(() =>
  resolveI18Href(props.href || '', localeIndex.value)
)
const isExternal = computed(() => isExternalUrl(props.href))
const resolvedHref = computed(() =>
  isExternal.value ? i18nHref.value : withBase(i18nHref.value)
)
const tag = computed(() => props.tag || 'a')
const target = computed(() => {
  if (tag.value === 'a') {
    if (typeof props.target === 'undefined') {
      return isExternal.value ? '_blank' : props.target
    } else {
      return props.target
    }
  }
  return undefined
})
const rel = computed(() => {
  if (tag.value !== 'a') return undefined
  if (props.rel) return props.rel
  return target.value === '_blank' ? 'noopener noreferrer' : undefined
})

const active = computed(() => {
  const targetHref = i18nHref.value
  switch (props.activeCompareMethod) {
    case 'soft':
      return route.path.startsWith(targetHref)

    case 'pagination': {
      const routeEndsWithDigit = /\d+$/.test(route.path)

      if (routeEndsWithDigit) {
        const hrefEndsWithDigit = /\d+$/.test(targetHref)
        if (!hrefEndsWithDigit) return false

        const normalizedRoutePath = normalizePath(route.path)
        const normalizedHref = normalizePath(targetHref)
        return normalizedRoutePath === normalizedHref
      }
      return route.path.startsWith(targetHref)
    }

    case 'softPagination': {
      const normalizedHrefForSoft = normalizePath(targetHref)
      return route.path.startsWith(normalizedHrefForSoft)
    }

    case 'none':
      return false

    case 'strict':
      return route.path === targetHref

    default:
      return route.path === targetHref
  }
})
</script>

<template>
  <component
    :is="tag"
    :target="target"
    :rel="rel"
    :href="resolvedHref"
    :disabled="props.disabled"
    :class="[active && 'active', props.customClass]"
  >
    <slot />
  </component>
</template>
