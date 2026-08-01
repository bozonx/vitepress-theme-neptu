<script setup lang="ts">
import DefaultTheme from 'vitepress/theme-without-fonts'
import { useData } from 'vitepress'
import { computed, useSlots } from 'vue'
import { LocaleSelector, NeptuAd } from 'vitepress-theme-neptu/components'
import type { LandingThemeConfig } from '../types.d.ts'

const { Layout: DefaultLayout } = DefaultTheme
const { frontmatter, theme } = useData<LandingThemeConfig>()
const slots = useSlots()

// The default theme's ad zone sits below the outline, so the column keeps the
// table of contents at the top where readers look for it. A site passing its
// own `aside-ads-before` slot wins — the theme steps aside rather than
// rendering two units in the same place.
const showAsideAd = computed(
  () => Boolean(theme.value?.ads?.component) && !slots['aside-ads-before']
)
</script>

<template>
  <LocaleSelector v-if="frontmatter.layout === 'locale-selector'" />
  <DefaultLayout v-else>
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData || {}" />
    </template>
    <template v-if="showAsideAd" #aside-ads-before>
      <NeptuAd placement="aside" />
    </template>
  </DefaultLayout>
</template>
