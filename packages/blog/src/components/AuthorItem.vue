<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { pluralize } from '../utils/shared/index.ts'
import { useUiTheme } from '../composables/useUiTheme.ts'
import type { AuthorItem } from '../types.d.ts'

const props = defineProps<{ item: AuthorItem }>()
const { localeIndex } = useData()
const { theme } = useUiTheme()
</script>

<template>
  <a
    :href="withBase(`/${localeIndex}/authors/${props.item.id}/1`)"
    class="card-item author-preview"
  >
    <h2 class="card-item-header font-bold mb-3 text-2xl leading-8 tracking-tight">{{ props.item.name }}</h2>

    <div class="md:flex w-full">
      <!-- Author image -->
      <div v-if="props.item.image" class="card-item-img-col shrink-0 mr-4">
        <img
          :src="props.item.image.startsWith('/') ? withBase(props.item.image) : props.item.image"
          :height="props.item.imageHeight"
          :width="props.item.imageWidth"
          :alt="props.item.name"
          loading="lazy"
          decoding="async"
          class="card-item-img w-full h-auto rounded-[0.3125rem]"
        />
      </div>

      <!-- Author description -->
      <div class="max-md:mt-5 flex-1 author-content">
        <p v-if="props.item.description" class="card-item-description">
          {{ props.item.description }}
        </p>

        <div class="mt-4 muted">
          <span>{{ props.item.count }} {{ pluralize(props.item.count ?? 0, theme.t.postsCountForms) }}</span>
        </div>
      </div>
    </div>
  </a>
</template>
