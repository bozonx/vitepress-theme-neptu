<script setup lang="ts">
import LandingTheme from 'vitepress-theme-neptu-landing'
// Demo-only pickers for the color (`data-theme`) and style (`data-style`) axes.
// Each renders only when its own themeConfig flag is on — `colorPicker` /
// `stylePicker`, both false by default in this template. Enable them in
// `src/site.yaml` to get a runtime theme switcher in the nav bar.
// import {
//   ColorThemePicker,
//   StylePresetPicker,
// } from 'vitepress-theme-neptu-landing/components'

const { Layout: LandingLayout } = LandingTheme
</script>

<template>
  <LandingLayout>
    <!--
      Add nav bar slots here. Uncomment the import above and the block below to
      mount the demo pickers once colorPicker / stylePicker are enabled:

      <template #nav-bar-content-after>
        <div class="demo-nav-tools">
          <ColorThemePicker />
          <StylePresetPicker />
        </div>
      </template>
    -->
  </LandingLayout>
</template>

<style scoped>
.demo-nav-tools {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  margin-left: 0.5rem;
}
</style>
