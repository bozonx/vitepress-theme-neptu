<script setup lang="ts">
import { inject } from 'vue'
import { useData } from 'vitepress'
import PreviewList from '../PreviewList.vue'
import UtilSubPageHeader from './UtilSubPageHeader.vue'
import { sortPosts } from '../../utils/shared/index.ts'
import { useUiTheme } from '../../composables/useUiTheme.ts'
import type { PostLite } from '../../types.d.ts'

const props = defineProps<{ localePosts?: PostLite[]; limit?: number }>()
const { localeIndex } = useData()
const { theme } = useUiTheme()
const allPosts = inject<Record<string, PostLite[]>>('posts', {})
const localePosts = props.localePosts || allPosts[localeIndex.value] || []
const limit = props.limit || theme.value.perPage || 1
const posts = sortPosts(localePosts).slice(0, limit)
</script>

<template>
  <section v-if="posts.length" class="home-latest-posts relative">
    <UtilSubPageHeader class="mb-3">{{ theme.t.links.recent }}</UtilSubPageHeader>
    <PreviewList :locale-posts="posts" :cur-page="1" :per-page="limit" />
  </section>
</template>
