<script setup lang="ts">
/**
 * Dropdown that switches one axis of the theme: `color` (`data-theme`) or
 * `style` (`data-ln-style`). Drop it into a nav bar slot:
 *
 * ```vue
 * <template #nav-bar-content-after>
 *   <LnThemePicker axis="color" />
 *   <LnThemePicker axis="style" />
 * </template>
 * ```
 */
import { computed, ref } from 'vue'
import { useData } from 'vitepress'
import { useColorTheme, useOnClickOutside } from 'vitepress-theme-neptu-blog/composables'
import { useLandingStyle } from '../composables/useLandingStyle.ts'
import LnIcon from '../primitives/LnIcon.vue'

const props = withDefaults(
  defineProps<{
    axis?: 'color' | 'style'
    label?: string
    icon?: string
  }>(),
  { axis: 'color' }
)

const { activeTheme, setColorTheme, colorThemes } = useColorTheme()
const { activeStyle, setLandingStyle, stylePresets } = useLandingStyle()
const { theme } = useData()
const enabled = computed(() => theme.value.themePicker === true)

const open = ref(false)
const root = ref<HTMLElement | null>(null)

useOnClickOutside(root, () => {
  open.value = false
})

const isColor = computed(() => props.axis === 'color')
const icon = computed(
  () => props.icon ?? (isColor.value ? 'fa6-solid:palette' : 'fa6-solid:shapes')
)
const label = computed(
  () => props.label ?? (isColor.value ? 'Color theme' : 'Style preset')
)

const options = computed(() =>
  isColor.value
    ? colorThemes.map((t) => ({ id: t.id, label: t.label, hint: undefined, color: t.color }))
    : stylePresets.map((s) => ({ id: s.id, label: s.label, hint: s.hint, color: undefined }))
)

const activeId = computed(() => (isColor.value ? activeTheme.value : activeStyle.value))

const select = (id: string): void => {
  if (isColor.value) setColorTheme(id)
  else setLandingStyle(id)
  open.value = false
}
</script>

<template>
  <div v-if="enabled" ref="root" class="ln-picker">
    <button
      type="button"
      class="ln-picker__btn"
      :title="label"
      :aria-label="label"
      :aria-expanded="open"
      aria-haspopup="menu"
      @click="open = !open"
    >
      <LnIcon :icon="icon" size="1.1rem" />
    </button>

    <div v-show="open" class="ln-picker__menu" role="menu">
      <button
        v-for="option in options"
        :key="option.id"
        type="button"
        role="menuitemradio"
        :aria-checked="option.id === activeId"
        class="ln-picker__item"
        :class="{ 'is-active': option.id === activeId }"
        @click="select(option.id)"
      >
        <span v-if="option.color" class="ln-picker__swatch" :style="{ backgroundColor: option.color }" />
        <span class="ln-picker__labels">
          <span class="ln-picker__label">{{ option.label }}</span>
          <span v-if="option.hint" class="ln-picker__hint">{{ option.hint }}</span>
        </span>
        <LnIcon v-if="option.id === activeId" icon="fa6-solid:check" size="0.8rem" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.ln-picker {
  position: relative;
  display: inline-flex;
}

.ln-picker__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border: 0;
  border-radius: var(--ln-radius-sm);
  background-color: transparent;
  color: var(--ln-c-text-2);
  cursor: pointer;
  transition:
    background-color var(--ln-duration) var(--ln-ease),
    color var(--ln-duration) var(--ln-ease);
}

.ln-picker__btn:hover {
  background-color: var(--ln-c-bg-mute);
  color: var(--ln-c-text-1);
}

.ln-picker__menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  z-index: 60;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 13rem;
  border: var(--ln-border-width) solid var(--ln-c-border);
  border-radius: var(--ln-radius-md);
  background-color: var(--ln-c-bg-elevated);
  box-shadow: var(--ln-shadow-3);
  padding: 0.375rem;
}

.ln-picker__item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
  border: 0;
  border-radius: var(--ln-radius-sm);
  background-color: transparent;
  padding: 0.5rem 0.625rem;
  color: var(--ln-c-text-1);
  font: inherit;
  font-size: 0.875rem;
  text-align: left;
  cursor: pointer;
  transition: background-color var(--ln-duration) var(--ln-ease);
}

.ln-picker__item:hover {
  background-color: var(--ln-c-bg-mute);
}

.ln-picker__item.is-active {
  color: var(--ln-c-brand);
}

.ln-picker__swatch {
  flex: none;
  width: 0.875rem;
  height: 0.875rem;
  border: 1px solid rgb(0 0 0 / 12%);
  border-radius: var(--ln-radius-pill);
}

.ln-picker__labels {
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-right: auto;
}

.ln-picker__hint {
  color: var(--ln-c-text-2);
  font-size: 0.75rem;
}
</style>
