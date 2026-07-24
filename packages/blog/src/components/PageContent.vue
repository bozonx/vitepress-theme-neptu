<script setup lang="ts">
import { useData } from 'vitepress'
import { computed, ref, resolveDynamicComponent, watchEffect } from 'vue'
import {
  resolveArticlePreview,
  isPage,
  isUtilPage,
} from '../utils/shared/index.ts'
import type { PostFrontmatter } from '../types.d.ts'
import PostFooter from './post/PostFooter.vue'
import PostDate from './post/PostDate.vue'
import PostTopBar from './post/PostTopBar.vue'
import PostImage from './post/PostImage.vue'

const { page, frontmatter } = useData()
const articlePreviewText = ref<string | null | undefined>(null)

watchEffect(() => {
  articlePreviewText.value = resolveArticlePreview(
    frontmatter.value as PostFrontmatter
  )
})

const BUILTIN_CONTENT_LAYOUTS = [
  'post',
  'page',
  'util',
  'tag',
  'archive',
  'author',
  'home',
]

const customContent = computed(() => {
  const l = frontmatter.value?.contentLayout || frontmatter.value?.layout
  if (!l || typeof l !== 'string') return null
  if (BUILTIN_CONTENT_LAYOUTS.includes(l)) return null
  const resolved = resolveDynamicComponent(l)
  return typeof resolved === 'object' ? resolved : null
})
</script>

<template>
  <component :is="customContent" v-if="customContent" />
  <div
    v-else-if="isUtilPage(frontmatter)"
    class="content-page min-h-[calc(100vh-400px)]"
  >
    <div class="simple-page mt-4">
      <Content />
    </div>
  </div>
  <div
    v-else-if="isPage(frontmatter)"
    class="content-page min-h-[calc(100vh-400px)]"
  >
    <div class="simple-page mt-4 vp-doc">
      <Content />
    </div>
  </div>
  <article v-else class="content-page min-h-[calc(100vh-400px)]">
    <slot name="post-header-before" />

    <header>
      <h1
        v-if="page.title"
        class="text-4xl max-md:text-2xl mb-5 tracking-tight"
      >
        {{ page.title }}
      </h1>
      <div class="mt-4 flex items-start justify-between gap-4 max-sm:flex-col">
        <PostDate />
      </div>
      <PostTopBar class="mt-10" />
    </header>

    <slot name="post-header-after" />

    <div v-if="articlePreviewText && !frontmatter.cover" class="mt-10 italic">
      {{ articlePreviewText }}
    </div>

    <PostImage
      :src="frontmatter.cover"
      :description="frontmatter.coverDescr"
      :alt="frontmatter.coverAlt"
      :height="frontmatter.coverHeight"
      :width="frontmatter.coverWidth"
    />

    <slot name="post-content-before" />

    <div class="mt-10 vp-doc">
      <Content />
    </div>

    <slot name="post-content-after" />

    <slot name="post-footer">
      <PostFooter />
    </slot>
  </article>
</template>
