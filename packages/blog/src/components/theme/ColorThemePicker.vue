<script setup lang="ts">
/**
 * Switches the color axis of the theme (`data-theme`).
 *
 * Off unless `themeConfig.colorPicker` is `true` — a production site normally
 * ships one chosen theme, so this control exists for demos and for blogs that
 * deliberately hand the choice to the reader.
 */
import { computed } from 'vue'
import ThemeAxisPicker from './ThemeAxisPicker.vue'
import { useColorTheme } from '../../composables/useColorTheme.ts'
import { useThemeConfig } from '../../composables/useThemeConfig.ts'

const props = defineProps<{
  /** Renders the control even when `colorPicker` is off. */
  force?: boolean
  label?: string
  icon?: string
}>()

const { activeTheme, setColorTheme, colorThemes } = useColorTheme()
const { theme } = useThemeConfig()

const enabled = computed(() => props.force || theme.value.colorPicker === true)
const label = computed(
  () => props.label || theme.value.colorThemeMenuLabel || 'Change color theme'
)
const options = computed(() =>
  colorThemes.map((item) => ({
    id: item.id,
    label: item.label,
    color: item.color,
  }))
)
</script>

<template>
  <ThemeAxisPicker
    v-if="enabled"
    class="color-theme-picker"
    :options="options"
    :active-id="activeTheme"
    :label="label"
    :icon="props.icon || 'fa6-solid:palette'"
    @select="setColorTheme"
  />
</template>
