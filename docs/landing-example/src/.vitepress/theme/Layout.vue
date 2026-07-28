<script setup lang="ts">
import LandingTheme from 'vitepress-theme-neptu-landing'
import { LnThemePicker } from 'vitepress-theme-neptu-landing/components'

const { Layout: LandingLayout } = LandingTheme
</script>

<template>
  <LandingLayout>
    <!--
      Both theme axes live in the nav bar: color (`data-theme`) and
      style (`data-ln-style`). Language and dark mode come from the
      VitePress default theme.
    -->
    <template #nav-bar-content-after>
      <div class="demo-nav-tools">
        <LnThemePicker axis="color" />
        <LnThemePicker axis="style" />
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
