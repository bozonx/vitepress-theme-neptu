<script setup lang="ts">
import DefaultTheme from 'vitepress/theme-without-fonts'
import { useData } from 'vitepress'
import { LocaleSelector } from 'vitepress-theme-neptu/components'

const { Layout: DefaultLayout } = DefaultTheme
const { frontmatter } = useData()
</script>

<template>
  <LocaleSelector v-if="frontmatter.layout === 'locale-selector'" />
  <DefaultLayout v-else>
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData || {}" />
    </template>
  </DefaultLayout>
</template>
