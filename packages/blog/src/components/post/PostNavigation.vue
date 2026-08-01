<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import BaseLink from '../BaseLink.vue'
import { useUiTheme } from '../../composables/useUiTheme.ts'
import { findAdjacentPosts } from '../../utils/shared/index.ts'
import type { PostLite } from '../../types.d.ts'

const props = defineProps<{ localePosts?: PostLite[] }>()
const route = useRoute()
const { theme } = useUiTheme()

const adjacent = computed(() =>
  findAdjacentPosts(props.localePosts || [], route.path)
)
const previousLabel = computed(
  () => theme.value.t.previousPost || 'Previous post'
)
const nextLabel = computed(() => theme.value.t.nextPost || 'Next post')
</script>

<template>
  <nav
    v-if="adjacent.previous || adjacent.next"
    class="post-navigation grid gap-4 sm:grid-cols-2"
    aria-label="Post navigation"
  >
    <BaseLink
      v-if="adjacent.previous"
      :href="adjacent.previous.url"
      active-compare-method="none"
      custom-class="post-navigation__link post-navigation__link--previous"
      :aria-label="`${previousLabel}: ${adjacent.previous.title || ''}`"
    >
      <span class="post-navigation__label">← {{ previousLabel }}</span>
      <span class="post-navigation__title">{{ adjacent.previous.title }}</span>
    </BaseLink>
    <span v-else aria-hidden="true" />

    <BaseLink
      v-if="adjacent.next"
      :href="adjacent.next.url"
      active-compare-method="none"
      custom-class="post-navigation__link post-navigation__link--next"
      :aria-label="`${nextLabel}: ${adjacent.next.title || ''}`"
    >
      <span class="post-navigation__label">{{ nextLabel }} →</span>
      <span class="post-navigation__title">{{ adjacent.next.title }}</span>
    </BaseLink>
  </nav>
</template>

<style scoped>
.post-navigation__link {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1rem;
  color: var(--body-text-color);
  background: var(--neptu-card-bg);
  border: max(1px, var(--neptu-border-width)) solid var(--neptu-card-border-color);
  border-radius: var(--neptu-radius-md);
  box-shadow: var(--neptu-card-shadow);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.post-navigation__link:hover {
  transform: translateY(var(--neptu-lift));
  box-shadow: var(--neptu-card-shadow-hover);
}

.post-navigation__link--next {
  text-align: right;
}

.post-navigation__label {
  color: var(--gray-500);
  font-size: 0.875rem;
}

.post-navigation__title {
  overflow-wrap: anywhere;
  font-weight: 700;
}
</style>
