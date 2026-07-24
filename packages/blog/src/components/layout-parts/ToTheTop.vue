<script setup lang="ts">
import ToTheTopDesktop from './ToTheTopDesktop.vue'
import ToTheTopMobile from './ToTheTopMobile.vue'

defineProps<{
  scrollY: number
  isMobile: boolean
}>()
</script>

<template>
  <ToTheTopMobile class="lg:hidden" :scroll-y="scrollY" />
  <ToTheTopDesktop class="max-lg:hidden" :scroll-y="scrollY" />
</template>
