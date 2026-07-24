<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'
import { makeHumanDate } from '../utils/shared/index.ts'
import BaseLink from './BaseLink.vue'
import PreviewWithImage from './PreviewWithImage.vue'
import { useUiTheme } from '../composables/useUiTheme.ts'
import type { PostLite } from '../types.d.ts'

const { lang } = useData()
const { theme } = useUiTheme()

const props = defineProps<{ item: PostLite }>()
function formatPreview(preview: string | undefined): string | undefined {
  const normalized = typeof preview === 'string' ? preview.trim() : ''
  return normalized || undefined
}

const params = computed(() => ({
  tags: props.item.tags,
  date: props.item.date ? String(props.item.date) : undefined,
  localeDate: makeHumanDate(props.item.date, lang.value),
  preview: formatPreview(props.item.preview),
  authorName:
    (theme.value.postList?.showAuthor ?? true)
      ? theme.value.authors?.find(
          (item: { id: string; name: string }) =>
            item.id === props.item.authorId
        )?.name
      : undefined,
}))
</script>

<template>
  <article class="card-item preview">
    <BaseLink
      v-if="props.item.url"
      :href="props.item.url"
      class="card-item-title-link block no-underline text-inherit hover:no-underline"
    >
      <h2
        class="card-item-header font-bold mb-3 text-2xl leading-8 tracking-tight hover:brightness-125"
      >
        {{ props.item.title }}
      </h2>
    </BaseLink>
    <h2
      v-else
      class="card-item-header font-bold mb-3 text-2xl leading-8 tracking-tight"
    >
      {{ props.item.title }}
    </h2>

    <PreviewWithImage
      v-bind="params"
      :post-url="props.item.url"
      :thumbnail="props.item.thumbnail"
      :cover-height="props.item.coverHeight"
      :cover-width="props.item.coverWidth"
      :show-date="theme.postList?.showDate ?? true"
      :show-tags="theme.postList?.showTags ?? true"
      :show-thumbnail="theme.postList?.showThumbnail ?? true"
      :show-preview="theme.postList?.showPreview ?? true"
    />
  </article>
</template>
