<script setup lang="ts">
import { computed, inject } from 'vue'
import { useData } from 'vitepress'
import PostSimilarList from './PostSimilarList.vue'
import PostNavigation from './PostNavigation.vue'
import PostAuthor from './PostAuthor.vue'
import PostComments from './PostComments.vue'
import PostDonateLink from './PostDonateLink.vue'
import PostSocialShare from './PostSocialShare.vue'
import PostTags from './PostTags.vue'
import PostCategories from './PostCategories.vue'
import EditLink from '../EditLink.vue'
import { useUiTheme } from '../../composables/useUiTheme.ts'
import type { PostLite } from '../../types.d.ts'

const DEFAULT_ORDER = [
  'author',
  'donate',
  'comments',
  'social-share',
  'edit-link',
  'categories',
  'tags',
  'navigation',
  'similar',
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
  <!--
    Everything here except the taxonomy lists is navigation chrome, not article
    text: it is marked with `data-pagefind-ignore` so it never leaks into search
    snippets. The tag and category lists stay indexed and provide the `tag` and
    `category` search filters.
  -->
  <template v-for="name in blocks" :key="name">
    <template v-if="name === 'author'">
      <div data-pagefind-ignore>
        <slot name="author">
          <PostAuthor class="mt-10" />
        </slot>
      </div>
    </template>

    <template v-else-if="name === 'donate'">
      <div data-pagefind-ignore>
        <slot name="donate">
          <PostDonateLink class="mt-10" />
        </slot>
      </div>
    </template>

    <template v-else-if="name === 'comments'">
      <div data-pagefind-ignore>
        <slot name="comments">
          <PostComments class="mt-10" />
        </slot>
      </div>
    </template>

    <template v-else-if="name === 'social-share'">
      <div data-pagefind-ignore>
        <slot name="social-share">
          <PostSocialShare class="mt-10" />
        </slot>
      </div>
    </template>

    <template v-else-if="name === 'edit-link'">
      <div class="flex mt-10" data-pagefind-ignore>
        <slot name="edit-link">
          <EditLink />
        </slot>
      </div>
    </template>

    <template v-else-if="name === 'categories'">
      <div>
        <slot name="categories">
          <PostCategories class="mt-10" />
        </slot>
      </div>
    </template>

    <template v-else-if="name === 'tags'">
      <div>
        <slot name="tags">
          <PostTags class="mt-10" />
        </slot>
      </div>
    </template>

    <template v-else-if="name === 'similar'">
      <div data-pagefind-ignore>
        <slot name="similar">
          <PostSimilarList class="mt-14" :locale-posts="localePosts" />
        </slot>
      </div>
    </template>

    <template v-else-if="name === 'navigation'">
      <div data-pagefind-ignore>
        <slot name="navigation">
          <PostNavigation class="mt-10" :locale-posts="localePosts" />
        </slot>
      </div>
    </template>

  </template>
</template>
