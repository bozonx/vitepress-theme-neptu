<script setup lang="ts">
import { useData } from 'vitepress'
import { computed, ref, resolveDynamicComponent, watchEffect } from 'vue'
import {
  resolvePreviewText,
  isPage,
  isUtilPage,
} from '../utils/shared/index.ts'
import { useUiTheme } from '../composables/useUiTheme.ts'
import type { BreadcrumbItem, TaxonomyEntry, PostFrontmatter } from '../types.d.ts'
import NeptuAd from './NeptuAd.vue'
import TocCollapsible from './toc/TocCollapsible.vue'
import PostFooter from './post/PostFooter.vue'
import PostDate from './post/PostDate.vue'
import PostDraftBadge from './post/PostDraftBadge.vue'
import PostReadingTime from './post/PostReadingTime.vue'
import PostTopBar from './post/PostTopBar.vue'
import PostImage from './post/PostImage.vue'
import NeptuBreadcrumbs from './utility/NeptuBreadcrumbs.vue'

const { page, frontmatter } = useData()
const { theme } = useUiTheme()
const articlePreviewText = ref<string | null | undefined>(null)

/**
 * A post is filed under its first category, so that is the trail we show.
 * Without a category there is no hierarchy to express and the trail is
 * omitted — "Home / <post title>" tells the reader nothing.
 *
 * Hrefs stay locale-relative; `BaseLink` inside `NeptuBreadcrumbs` adds it.
 * `addJsonLd` builds the matching `BreadcrumbList` from the same data.
 */
const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const category = (frontmatter.value.categories as TaxonomyEntry[] | undefined)?.[0]
  if (!category?.slug) return []

  const items: BreadcrumbItem[] = [
    { text: theme.value.t.breadcrumbHome, href: '/' },
    { text: theme.value.t.categories, href: 'categories' },
    { text: category.name, href: `categories/${category.slug}/1` },
  ]

  if (page.value.title) items.push({ text: page.value.title })

  return items
})

watchEffect(() => {
  articlePreviewText.value = resolvePreviewText(
    frontmatter.value as PostFrontmatter
  )
})

const BUILTIN_CONTENT_LAYOUTS = [
  'post',
  'page',
  'util',
  'tag',
  'category',
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

    <NeptuBreadcrumbs :items="breadcrumbs" />

    <header>
      <h1
        v-if="page.title"
        class="text-4xl max-md:text-2xl mb-5 tracking-tight"
      >
        {{ page.title }}
      </h1>
      <div class="mt-4 flex items-start justify-between gap-4">
        <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
          <PostDate />
          <PostDraftBadge />
        </div>
        <PostReadingTime show-label class="ml-auto shrink-0 text-right" />
      </div>
      <PostTopBar class="mt-10" />
    </header>

    <slot name="post-header-after" />

    <div v-if="articlePreviewText && !frontmatter.cover" class="mt-10 italic">
      {{ articlePreviewText }}
    </div>

    <PostImage
      :src="frontmatter.cover"
      :description="frontmatter.coverDescription"
      :alt="frontmatter.coverAlt"
      :height="frontmatter.coverHeight"
      :width="frontmatter.coverWidth"
    />

    <slot name="post-content-before" />

    <!-- Narrow-viewport home of the table of contents; above the aside
         breakpoint it hides itself and the column takes over. -->
    <TocCollapsible />

    <div class="mt-10 vp-doc">
      <Content />
    </div>

    <NeptuAd placement="after-content" />

    <slot name="post-content-after" />

    <slot name="post-footer">
      <PostFooter />
    </slot>
  </article>
</template>
