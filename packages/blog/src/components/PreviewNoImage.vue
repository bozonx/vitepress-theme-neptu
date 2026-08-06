<script setup lang="ts">
import PreviewWithImage from './PreviewWithImage.vue'
import type { TaxonomyEntry } from '../types.d.ts'

const props = defineProps<{
  date?: string
  localeDate?: string
  tags?: TaxonomyEntry[]
  preview?: string
  authorName?: string
}>()
</script>

<template>
  <PreviewWithImage v-bind="props" />
</template>
