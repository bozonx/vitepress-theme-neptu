<script setup lang="ts">
import { computed, inject } from 'vue'
import { useData } from 'vitepress'
import PostSimilarList from './PostSimilarList.vue'
import PostAuthor from './PostAuthor.vue'
import PostComments from './PostComments.vue'
import PostDonateLink from './PostDonateLink.vue'
import PostSocialShare from './PostSocialShare.vue'
import PostTags from './PostTags.vue'
import EditLink from '../EditLink.vue'
import NeptuBtnLink from '../NeptuBtnLink.vue'
import { useUiTheme } from '../../composables/useUiTheme.ts'
import type { PostLite } from '../../types.d.ts'

const DEFAULT_ORDER = [
  'author',
  'donate',
  'comments',
  'social-share',
  'edit-link',
  'tags',
  'similar',
  'popular-link',
]

const props = defineProps<{ localePosts?: PostLite[] }>()
const { localeIndex } = useData()
const { theme } = useUiTheme()
const allPosts = inject<Record<string, PostLite[]>>('posts', {})
const localePosts = computed(
  () => props.localePosts || allPosts[localeIndex.value] || []
)

const blocks = computed(() => {
  const configured = theme.value.postFooter
  if (configured === undefined) return DEFAULT_ORDER
  return configured
})
</script>

<template>
  <template v-for="name in blocks" :key="name">
    <template v-if="name === 'author'">
      <slot name="author">
        <PostAuthor class="mt-10" />
      </slot>
    </template>

    <template v-else-if="name === 'donate'">
      <slot name="donate">
        <PostDonateLink class="mt-10" />
      </slot>
    </template>

    <template v-else-if="name === 'comments'">
      <slot name="comments">
        <PostComments class="mt-10" />
      </slot>
    </template>

    <template v-else-if="name === 'social-share'">
      <slot name="social-share">
        <PostSocialShare class="mt-10" />
      </slot>
    </template>

    <template v-else-if="name === 'edit-link'">
      <div class="flex mt-10">
        <slot name="edit-link">
          <EditLink />
        </slot>
      </div>
    </template>

    <template v-else-if="name === 'tags'">
      <slot name="tags">
        <PostTags class="mt-10" />
      </slot>
    </template>

    <template v-else-if="name === 'similar'">
      <slot name="similar">
        <PostSimilarList class="mt-14" :locale-posts="localePosts" />
      </slot>
    </template>

    <template v-else-if="name === 'popular-link'">
      <div v-if="theme.popularPosts?.enabled" class="mt-10">
        <slot name="popular-link">
          <NeptuBtnLink
            :href="`/popular/1`"
            :text="theme.t.popularPostsCall"
            :icon="theme.popularIcon"
          />
        </slot>
      </div>
    </template>
  </template>
</template>
