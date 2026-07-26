<script setup lang="ts">
  import DefaultTheme from "vitepress/theme";
  import { PageFindSearch, NavSearchButton, SwitchLang } from 'vitepress-theme-neptu-blog/components';

  const { Layout: DefaultLayout } = DefaultTheme;
</script>

<template>
  <DefaultLayout>
    <template #nav-bar-content-before>
      <PageFindSearch>
        <NavSearchButton />
      </PageFindSearch>
    </template>
    <template #nav-bar-content-after>
      <SwitchLang :no-bg="true" />
    </template>
  </DefaultLayout>
</template>
