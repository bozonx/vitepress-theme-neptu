<script setup lang="ts">
/**
 * Switches the shape axis of the theme (`data-style`).
 *
 * Off unless `themeConfig.stylePicker` is `true`. Like the color picker this is
 * primarily a demo control: a site normally picks one preset through
 * `defaultStylePreset` and never offers the choice to visitors.
 */
import { computed } from 'vue'
import ThemeAxisPicker from './ThemeAxisPicker.vue'
import { useStylePreset } from '../../composables/useStylePreset.ts'
import { useUiTheme } from '../../composables/useUiTheme.ts'

const props = defineProps<{
  /** Renders the control even when `stylePicker` is off. */
  force?: boolean
  label?: string
  icon?: string
}>()

const { activeStyle, setStylePreset, stylePresets } = useStylePreset()
const { theme } = useUiTheme()

const enabled = computed(() => props.force || theme.value.stylePicker === true)
const label = computed(
  () => props.label || theme.value.stylePresetMenuLabel || 'Change style preset'
)
const options = computed(() =>
  stylePresets.map((item) => ({
    id: item.id,
    label: item.label,
    hint: item.hint,
  }))
)
</script>

<template>
  <ThemeAxisPicker
    v-if="enabled"
    class="style-preset-picker"
    :options="options"
    :active-id="activeStyle"
    :label="label"
    :icon="props.icon || 'fa6-solid:shapes'"
    @select="setStylePreset"
  />
</template>
