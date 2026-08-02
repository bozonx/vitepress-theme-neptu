<script setup lang="ts">
import { inject } from 'vue'
import { useData } from 'vitepress'
import { makeTagsList } from '../../list-helpers/listHelpers.ts'
import TagsList from '../TagsList.vue'
import UtilSubPageHeader from './UtilSubPageHeader.vue'
import type { PostLite } from '../../types.d.ts'

const props = defineProps<{
  localePosts?: PostLite[]
  header?: string
  limit?: number
}>()
const { localeIndex } = useData()
const allPosts = inject<Record<string, PostLite[]>>('posts', {})
const localePosts = props.localePosts || allPosts[localeIndex.value] || []
const allTags = makeTagsList(localePosts)
const tagList = props.limit ? allTags.slice(0, props.limit) : allTags
</script>

<template>
  <section v-if="tagList.length" class="home-tags">
    <UtilSubPageHeader>{{ props.header }}</UtilSubPageHeader>
    <TagsList :tags="tagList" class="home-hero-tags [&_.tag-item]:shadow-[8px_8px_20px_0px_rgba(0,0,0,0.3)]" />
  </section>
</template>
