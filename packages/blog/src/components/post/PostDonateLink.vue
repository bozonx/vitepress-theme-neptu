<script setup lang="ts">
import { computed } from 'vue'
import NeptuBtnLink from '../NeptuBtnLink.vue'
import { useThemeConfig } from '../../composables/useThemeConfig.ts'
import { externalTarget } from '../../utils/shared/index.ts'

const { theme } = useThemeConfig()

const donateTarget = computed(() => externalTarget(theme.value.donate?.url))
</script>

<template>
  <div v-if="theme.donate?.postDonateCall" class="vp-doc">
    <span>{{ theme.donate.postDonateCall }}</span>
    <NeptuBtnLink
      :href="theme.donate.url"
      :text="theme.t.links.donate"
      :target="donateTarget"
      :icon="theme.donate.icon || theme.donateIcon"
      class="ml-2 inline-flex"
    />
  </div>
</template>
