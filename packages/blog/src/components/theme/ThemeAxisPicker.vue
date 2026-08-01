<script setup lang="ts">
/**
 * Dropdown shell behind {@link ColorThemePicker} and {@link StylePresetPicker}.
 *
 * Deliberately styled with plain scoped CSS and the shared `--neptu-*` tokens
 * instead of the blog's Tailwind primitives: the landing package ships without
 * Tailwind, and this control has to render identically in both.
 */
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useOnClickOutside } from '../../composables/useOnClickOutside.ts'

export interface ThemeAxisOption {
  id: string
  label: string
  hint?: string
  /** Rendered as a swatch when present. */
  color?: string
}

const props = defineProps<{
  options: ThemeAxisOption[]
  activeId: string
  label: string
  icon: string
}>()

const emit = defineEmits<{ (e: 'select', id: string): void }>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

useOnClickOutside(root, () => {
  open.value = false
})

const select = (id: string): void => {
  emit('select', id)
  open.value = false
}
</script>

<template>
  <div ref="root" class="neptu-picker">
    <button
      type="button"
      class="neptu-picker__btn"
      :title="props.label"
      :aria-label="props.label"
      :aria-expanded="open"
      aria-haspopup="menu"
      @click="open = !open"
    >
      <Icon :icon="props.icon" width="1.1rem" height="1.1rem" aria-hidden="true" />
    </button>

    <div v-show="open" class="neptu-picker__menu" role="menu">
      <button
        v-for="option in props.options"
        :key="option.id"
        type="button"
        role="menuitemradio"
        :aria-checked="option.id === props.activeId"
        class="neptu-picker__item"
        :class="{ 'is-active': option.id === props.activeId }"
        @click="select(option.id)"
      >
        <span
          v-if="option.color"
          class="neptu-picker__swatch"
          :style="{ backgroundColor: option.color }"
        />
        <span class="neptu-picker__labels">
          <span class="neptu-picker__label">{{ option.label }}</span>
          <span v-if="option.hint" class="neptu-picker__hint">{{ option.hint }}</span>
        </span>
        <Icon
          v-if="option.id === props.activeId"
          icon="fa6-solid:check"
          width="0.8rem"
          height="0.8rem"
          aria-hidden="true"
        />
      </button>
    </div>
  </div>
</template>

<style scoped>
.neptu-picker {
  position: relative;
  display: inline-flex;
}

.neptu-picker__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border: 0;
  border-radius: var(--neptu-radius-sm);
  background-color: transparent;
  color: var(--neptu-c-ink);
  cursor: pointer;
  opacity: 0.75;
  transition:
    background-color 0.2s ease,
    opacity 0.2s ease;
}

.neptu-picker__btn:hover {
  background-color: color-mix(in srgb, var(--neptu-c-ink) 8%, transparent);
  opacity: 1;
}

.neptu-picker__menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  z-index: 60;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 13rem;
  border: var(--neptu-border-width) solid var(--neptu-c-border);
  border-radius: var(--neptu-radius-md);
  background-color: var(--neptu-c-surface);
  box-shadow: var(--neptu-shadow-3);
  padding: 0.375rem;
}

.neptu-picker__item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
  border: 0;
  border-radius: var(--neptu-radius-xs);
  background-color: transparent;
  padding: 0.5rem 0.625rem;
  color: var(--neptu-c-ink);
  font: inherit;
  font-size: 0.875rem;
  line-height: 1.3;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.neptu-picker__item:hover {
  background-color: color-mix(in srgb, var(--neptu-c-ink) 8%, transparent);
}

.neptu-picker__item.is-active {
  color: var(--neptu-c-accent);
}

.neptu-picker__swatch {
  flex: none;
  width: 0.875rem;
  height: 0.875rem;
  border: 1px solid color-mix(in srgb, var(--neptu-c-ink) 20%, transparent);
  border-radius: 999px;
}

.neptu-picker__labels {
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-right: auto;
}

.neptu-picker__hint {
  opacity: 0.65;
  font-size: 0.75rem;
}
</style>
