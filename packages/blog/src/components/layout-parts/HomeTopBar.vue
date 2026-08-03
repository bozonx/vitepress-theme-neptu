<script setup lang="ts">
import SwitchAppearance from './SwitchAppearance.vue'
import ColorThemePicker from '../theme/ColorThemePicker.vue'
import StylePresetPicker from '../theme/StylePresetPicker.vue'
import SwitchLang from './SwitchLang.vue'

defineProps<{
  hideAppearance?: boolean
}>()
</script>

<template>
  <nav class="flex w-full py-2 px-2 gap-x-1 home-top-bar pl-[0.675rem] min-w-0 items-center">
    <div class="flex-1 flex gap-x-3 min-w-0">
      <slot name="nav-bar-content-before" />
    </div>

    <div>
      <SwitchLang :no-bg="true" />
    </div>

    <div v-if="!hideAppearance">
      <SwitchAppearance />
    </div>

    <!-- Both pickers gate themselves on their own themeConfig flag. -->
    <ColorThemePicker />
    <StylePresetPicker />
  </nav>
</template>

<style scoped>
.home-top-bar .btn-base.active {
  background: var(--btn-bg-active);
  color: var(--btn-text);
}
</style>
