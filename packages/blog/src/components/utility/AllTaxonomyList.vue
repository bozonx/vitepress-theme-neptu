<script setup lang="ts">
// Internal component — the shared body of `AllTagsList` and `AllCategoriesList`.
import { useData } from 'vitepress'
import { computed, inject } from 'vue'
import { makeTaxonomyList } from '../../list-helpers/listHelpers.ts'
import type { TaxonomyKind } from '../../list-helpers/listHelpers.ts'
import TagsList from '../TagsList.vue'
import UtilPageHeader from './UtilPageHeader.vue'
import type { PostLite } from '../../types.d.ts'

const props = defineProps<{
  kind: TaxonomyKind
  localePosts?: PostLite[]
}>()
const { frontmatter, localeIndex } = useData()
const allPosts = inject<Record<string, PostLite[]>>('posts', {})
const localePosts = computed(
  () => props.localePosts || allPosts[localeIndex.value] || []
)
const entries = computed(() => makeTaxonomyList(localePosts.value, props.kind))
</script>

<template>
  <UtilPageHeader>{{ frontmatter.title }}</UtilPageHeader>
  <TagsList
    :tags="entries"
    :kind="props.kind === 'categories' ? 'category' : 'tag'"
    :size-xl="true"
    class="flex-col"
  />
</template>
