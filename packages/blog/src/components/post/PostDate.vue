<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

import { makeHumanDate, isYear, isMonth } from '../../utils/shared/index.ts'
import BaseLink from '../BaseLink.vue'

const { page, lang } = useData()
const rawDate = computed(() => page.value.frontmatter.date)

// Extract year and month for link generation
const dateObj = computed(() => (rawDate.value ? new Date(rawDate.value) : null))
const year = computed(() => (dateObj.value ? dateObj.value.getUTCFullYear() : null))
const month = computed(() => (dateObj.value ? dateObj.value.getUTCMonth() + 1 : null))

const localeDate = computed(() => makeHumanDate(rawDate.value, lang.value || 'en') || '')
</script>

<template>
  <div v-if="rawDate" class="text-base muted post-date">
    <time :datetime="rawDate" class="space-x-1">
      <template v-for="item in localeDate.split(' ')" :key="item">
        <!-- Year link -->
        <BaseLink
          v-if="isYear(item)"
          :href="`archive/${year}/1`"
          class="underline hover:brightness-[1.4]"
        >
          {{ item }}
        </BaseLink>
        <!-- Month link -->
        <BaseLink
          v-else-if="isMonth(item)"
          :href="`archive/${year}/month/${month}`"
          class="underline hover:brightness-[1.4]"
        >
          {{ item }}
        </BaseLink>
        <!-- Plain text -->
        <span v-else>{{ item }}</span>
      </template>
    </time>
  </div>
</template>
