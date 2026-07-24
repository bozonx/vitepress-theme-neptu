<template>
  <div class="flex flex-col md:flex-row gap-x-1 items-baseline gap-y-4 mb-7">
    <h1 class="font-bold flex-1 m-0!">
      <slot />
    </h1>

    <div
      v-if="shouldShowPopularSwitch"
      class="flex flex-row items-center gap-1 gap-y-4 list-page-header-switcher max-[460px]:flex-col max-[460px]:items-start"
    >
      <NeptuBtn
        :text="theme.t.links.recent"
        :href="`${props.baseUrl}/1`"
        :icon="theme.recentIcon"
        active-compare-method="pagination"
      />
      <NeptuBtn
        :text="theme.t.links.popular"
        :href="`${popularBaseUrl}/1`"
        :icon="theme.popularIcon"
        active-compare-method="pagination"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import NeptuBtn from './NeptuBtn.vue'
import { useUiTheme } from '../composables/useUiTheme.ts'

const { theme } = useUiTheme()

const props = withDefaults(
  defineProps<{
    baseUrl: string
    showPopularPostsSwitch?: boolean
  }>(),
  {
    showPopularPostsSwitch: false,
  }
)

const popularBaseUrl = computed(() => {
  return `${props.baseUrl}/popular`
})
const shouldShowPopularSwitch = computed(
  () => props.showPopularPostsSwitch && theme.value.popularPosts?.enabled
)
</script>
