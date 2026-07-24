<script setup lang="ts">
import { useData } from 'vitepress'
import { inject } from 'vue'
import { makeTagsList } from '../../list-helpers/listHelpers.ts'
import TagsList from '../TagsList.vue'
import UtilPageHeader from './UtilPageHeader.vue'
import type { PostLite } from '../../types.d.ts'

const props = defineProps<{ localePosts?: PostLite[] }>()
const { frontmatter, localeIndex } = useData()
const allPosts = inject<Record<string, PostLite[]>>('posts', {})
const localePosts = props.localePosts || allPosts[localeIndex.value] || []
const tagList = makeTagsList(localePosts)
</script>

<template>
  <UtilPageHeader>{{ frontmatter.title }}</UtilPageHeader>
  <TagsList :tags="tagList" :size-xl="true" class="flex-col" />
</template>
