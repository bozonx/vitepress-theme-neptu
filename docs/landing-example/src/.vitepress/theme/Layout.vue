<script setup lang="ts">
import LandingTheme from 'vitepress-theme-neptu-landing'
import {
  ColorThemePicker,
  StylePresetPicker,
} from 'vitepress-theme-neptu-landing/components'

const { Layout: LandingLayout } = LandingTheme
</script>

<template>
  <LandingLayout>
    <!--
      Both theme axes live in the nav bar: color (`data-theme`) and
      style (`data-style`). Each picker renders only when its own
      themeConfig flag is on — `colorPicker` / `stylePicker`, both of which
      this demo site enables in `site.yaml`. Language and dark mode come from
      the VitePress default theme.
    -->
    <template #nav-bar-content-after>
      <div class="demo-nav-tools">
        <ColorThemePicker />
        <StylePresetPicker />
      </div>
    </template>
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
