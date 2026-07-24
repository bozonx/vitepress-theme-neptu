<script setup>
  import DefaultTheme from "vitepress/theme";
  import { PageFindSearch, NavSearchButton } from 'vitepress-theme-neptu-blog/components';

  const { Layout: DefaultLayout } = DefaultTheme;
</script>

<template>
  <div id="modals"></div>

  <DefaultLayout>
    <template #nav-bar-content-before>
      <PageFindSearch>
        <NavSearchButton />
      </PageFindSearch>
    </template>
  </DefaultLayout>
</template>
