<script setup lang="ts">
import { useData } from 'vitepress'
import { inject } from 'vue'
import { makeAuthorsList } from '../../list-helpers/listHelpers.ts'
import AuthorItem from '../AuthorItem.vue'
import UtilPageHeader from './UtilPageHeader.vue'
import { useUiTheme } from '../../composables/useUiTheme.ts'
import type { PostLite } from '../../types.d.ts'

const props = defineProps<{ localePosts?: PostLite[] }>()
const { frontmatter, localeIndex } = useData()
const { theme } = useUiTheme()
const allPosts = inject<Record<string, PostLite[]>>('posts', {})
const localePosts = props.localePosts || allPosts[localeIndex.value] || []
const authorsList = makeAuthorsList(localePosts, theme.value.authors)
</script>

<template>
  <UtilPageHeader>{{ frontmatter.title }}</UtilPageHeader>
  <ul v-if="authorsList.length">
    <template v-for="item in authorsList" :key="item.id">
      <li v-if="item.count">
        <AuthorItem :item="item" />
      </li>
    </template>
  </ul>
</template>
