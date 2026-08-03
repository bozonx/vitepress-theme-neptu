<script setup lang="ts">
import { inject } from 'vue'
import { useData } from 'vitepress'
import { makeCategoriesList } from '../../list-helpers/listHelpers.ts'
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
const allCategories = makeCategoriesList(localePosts)
const categoryList = props.limit ? allCategories.slice(0, props.limit) : allCategories
</script>

<template>
  <section v-if="categoryList.length" class="home-categories">
    <UtilSubPageHeader>{{ props.header }}</UtilSubPageHeader>
    <TagsList
      :tags="categoryList"
      kind="category"
      class="home-hero-categories [&_.category-item]:shadow-[8px_8px_20px_0px_rgba(0,0,0,0.3)] [&_.tag-item]:shadow-[8px_8px_20px_0px_rgba(0,0,0,0.3)]"
    />
  </section>
</template>
