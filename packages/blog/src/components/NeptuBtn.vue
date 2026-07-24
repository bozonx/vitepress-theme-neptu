<script setup lang="ts">
import { useSlots, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { isExternalUrl } from '../utils/shared/index.ts'
import BaseLink from './BaseLink.vue'
import { useUiTheme } from '../composables/useUiTheme.ts'

type ClassValue = string | Record<string, unknown> | unknown[]

interface Props {
  customClass?: ClassValue
  innerClass?: ClassValue
  href?: string
  target?: string
  disabled?: boolean
  activeCompareMethod?: 'soft' | 'pagination' | 'softPagination' | 'none' | 'strict'
  icon?: string
  text?: string
  iconClass?: ClassValue
  noBg?: boolean
  primary?: boolean
  hideExternalIcon?: boolean
}

const slots = useSlots()
const { theme } = useUiTheme()
const {
  customClass,
  innerClass,
  href,
  target,
  disabled = false,
  activeCompareMethod,
  icon,
  text,
  iconClass,
  noBg = false,
  primary = false,
  hideExternalIcon = false,
} = defineProps<Props>()

const isExternal = computed(() => !hideExternalIcon && isExternalUrl(href))
const hasText = computed(() => Boolean(text || slots.default))
const btnProps = computed(() => {
  if (href && !disabled) {
    // means just link
    return {
      tag: 'a' as const,
      href,
      target,
    }
  }
  // means Button
  return {
    tag: 'button' as const,
    disabled,
  }
})
</script>

<template>
  <BaseLink
    v-bind="btnProps"
    :custom-class="[
      'flex cursor-pointer items-center rounded-lg leading-6',
      hasText ? 'py-2 px-5' : 'p-3',
      'btn-base',
      btnProps.disabled && 'disabled',
      primary && 'btn--primary',
      noBg && 'btn--nobg',
      customClass,
    ]"
    :active-compare-method="activeCompareMethod"
  >
    <span :class="['flex items-center gap-x-2 btn-base-inner', innerClass]">
      <span
        v-if="icon"
        aria-hidden="true"
        class="btn-base__icon-container"
      >
        <Icon :icon="icon" :class="iconClass" />
      </span>
      <span
        v-if="hasText"
        :class="
          theme.externalLinkIcon &&
          isExternal &&
          hasText &&
          'vp-external-link-icon'
        "
      >
        <slot>{{ text }}</slot>
      </span>
    </span>
  </BaseLink>
</template>

<style scoped>
.btn-base {
  background: var(--btn-bg);
  color: var(--btn-text);
  will-change: transform, box-shadow, filter;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}

.btn-base:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.06);
  filter: brightness(97%);
}

.dark .btn-base:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  filter: brightness(110%);
}

.btn-base.btn--nobg {
  background: transparent;
}

.btn-base.btn--nobg:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  background: var(--btn-bg);
}

.dark .btn-base.btn--nobg:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-base.active {
  color: var(--gray-900);
}

.dark .btn-base.active {
  color: var(--gray-100);
}

.btn-base.btn--primary {
  background: var(--primary-btn-bg);
  color: var(--gray-100);
}

.btn-base.btn--primary.active {
  background: var(--primary-btn-bg-active);
}

.btn-base.disabled,
.btn-base.disabled:hover {
  background: var(--btn-bg-disabled);
  color: var(--gray-500);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.dark .btn-base.disabled,
.dark .btn-base.disabled:hover {
  color: var(--gray-400);
}
</style>
