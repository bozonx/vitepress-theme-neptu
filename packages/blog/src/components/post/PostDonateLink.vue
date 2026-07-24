<script setup lang="ts">
import NeptuBtnLink from '../NeptuBtnLink.vue'
import { useUiTheme } from '../../composables/useUiTheme.ts'

const { theme } = useUiTheme()
</script>

<template>
  <div v-if="theme.donate?.postDonateCall" class="vp-doc">
    <span>{{ theme.donate.postDonateCall }}</span>
    <NeptuBtnLink
      :href="theme.donate.url"
      :text="theme.t.links.donate"
      target="_blank"
      :icon="theme.donate.icon || theme.donateIcon"
      class="ml-2 inline-flex"
    />
  </div>
</template>
