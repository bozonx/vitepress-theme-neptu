<script setup lang="ts">
import BaseLink from './BaseLink.vue'
import TagsList from './TagsList.vue'
import type { TagInfo } from '../types.d.ts'

const props = withDefaults(
  defineProps<{
    postUrl?: string
    date?: string
    localeDate?: string
    tags?: TagInfo[]
    preview?: string
    authorName?: string
    thumbnail?: string
    coverHeight?: number | string
    coverWidth?: number | string
    showDate?: boolean
    showTags?: boolean
    showThumbnail?: boolean
    showPreview?: boolean
  }>(),
  { showDate: true, showTags: true, showThumbnail: true, showPreview: true }
)
</script>

<template>
  <div v-if="props.thumbnail && props.showThumbnail" class="md:flex w-full">
    <div class="card-item-img-col shrink-0 mr-4">
      <BaseLink v-if="props.postUrl" :href="props.postUrl" class="block">
        <img
          :src="props.thumbnail"
          :height="coverHeight"
          :width="coverWidth"
          loading="lazy"
          decoding="async"
          aria-hidden="true"
          class="card-item-img w-full h-auto rounded-[0.3125rem]"
          alt=""
        />
      </BaseLink>
      <img
        v-else
        :src="props.thumbnail"
        :height="coverHeight"
        :width="coverWidth"
        loading="lazy"
        decoding="async"
        aria-hidden="true"
        class="card-item-img w-full h-auto rounded-[0.3125rem]"
        alt=""
      />

      <div
        v-if="props.showDate || props.authorName"
        class="mt-2 space-x-2 muted card-item-author-date text-sm leading-5"
      >
        <span v-if="props.authorName">{{ props.authorName }}.</span>
        <time v-if="props.showDate && props.date" :datetime="props.date">
          {{ props.localeDate }}
        </time>
      </div>

      <TagsList
        v-if="props.showTags"
        :tags="props.tags || []"
        class="mt-2 card-item-interactive"
        :size-sm="true"
        :active-compare-method="'softPagination'"
      />
    </div>

    <p
      v-if="props.showPreview && props.preview"
      class="max-md:mt-5 flex-1 card-item-description"
    >
      {{ props.preview }}
    </p>
  </div>
  <div v-else>
    <p v-if="props.showPreview && props.preview" class="card-item-description">
      {{ props.preview }}
    </p>

    <div
      v-if="props.showTags || props.showDate || props.authorName"
      class="flex max-sm:flex-col-reverse sm:items-end gap-x-1"
      :class="{ 'sm:mt-4': props.showPreview && props.preview }"
    >
      <TagsList
        v-if="props.showTags"
        :tags="props.tags || []"
        class="flex-1 card-item-interactive"
        :size-sm="true"
        :active-compare-method="'softPagination'"
      />

      <div
        v-if="props.showDate || props.authorName"
        class="space-x-2 max-sm:mt-2 max-sm:mb-4 text-right muted card-item-author-date text-sm leading-5"
      >
        <span v-if="props.authorName">{{ props.authorName }}.</span>
        <time v-if="props.showDate && props.date" :datetime="props.date">
          {{ props.localeDate }}
        </time>
      </div>
    </div>
  </div>
</template>
