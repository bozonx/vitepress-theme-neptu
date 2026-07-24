<script setup lang="ts">
import { useAttrs, computed } from 'vue'
import { isExternalUrl } from '../utils/shared/index.ts'
import BaseLink from './BaseLink.vue'
import { useUiTheme } from '../composables/useUiTheme.ts'

type ClassValue = string | Record<string, unknown> | unknown[]

interface Props {
  customClass?: ClassValue
  hideExternalIcon?: boolean
}

const props = defineProps<Props>()
const $attrs = useAttrs()

const { theme } = useUiTheme()
const isExternal = computed(
  () => !props.hideExternalIcon && isExternalUrl($attrs.href as string | undefined)
)
</script>

<template>
  <BaseLink
    v-bind="$attrs"
    :custom-class="[
      'simple-link no-underline',
      theme.externalLinkIcon && isExternal && 'vp-external-link-icon',
      props.customClass,
    ]"
  >
    <slot />
  </BaseLink>
</template>

<style scoped>
.simple-link {
  color: var(--vp-c-brand-1);
}

.simple-link:visited {
  color: var(--link-a-visited);
}

.simple-link:hover {
  filter: brightness(130%);
}
</style>
