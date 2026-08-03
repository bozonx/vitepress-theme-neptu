<script setup lang="ts">
import { computed } from 'vue'
import { useUiTheme } from '../../composables/useUiTheme.ts'
import HomeFeaturedPosts from './HomeFeaturedPosts.vue'
import HomeLatestPosts from './HomeLatestPosts.vue'
import HomePopularPosts from './HomePopularPosts.vue'
import HomeTags from './HomeTags.vue'
import HomeCategories from './HomeCategories.vue'
import type { HomeSectionConfig } from '../../types.d.ts'

const { theme } = useUiTheme()
const sections = computed(() =>
  (theme.value.home?.sections || []).filter((section) => section.enabled !== false)
)
const limit = (section: HomeSectionConfig) => section.limit || theme.value.perPage || 1
</script>

<template>
  <div class="home-sections flex flex-col gap-14 md:gap-20">
    <template v-for="section in sections" :key="section.type">
      <HomeFeaturedPosts v-if="section.type === 'featured'" :max-posts="limit(section)" />
      <HomeLatestPosts v-else-if="section.type === 'latest'" :limit="limit(section)" />
      <HomePopularPosts v-else-if="section.type === 'popular'" :limit="limit(section)" />
      <HomeTags v-else-if="section.type === 'tags'" :header="theme.t.tags" :limit="limit(section)" />
      <HomeCategories v-else-if="section.type === 'categories'" :header="theme.t.categories" :limit="limit(section)" />
    </template>
  </div>
</template>
