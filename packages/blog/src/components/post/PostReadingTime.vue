<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

import { pluralize } from '../../utils/shared/i18n.ts'
import { isReadingTimeEnabled, toIsoDuration } from '../../utils/shared/readingTime.ts'
import { useUiTheme } from '../../composables/useUiTheme.ts'
import type { PostFrontmatter } from '../../types.d.ts'

const props = withDefaults(
  defineProps<{
    /** Overrides the current page — lets list items reuse the badge. */
    minutes?: number
    /** Skips the layout check when the caller already decided. */
    forceShow?: boolean
  }>(),
  { forceShow: false }
)

const { page, frontmatter } = useData()
const { theme } = useUiTheme()

const minutes = computed(() =>
  props.minutes ?? (page.value as { readingTime?: number }).readingTime ?? 0
)

const visible = computed(() => {
  if (minutes.value <= 0) return false
  if (props.forceShow) return true

  return isReadingTimeEnabled(theme.value, frontmatter.value as PostFrontmatter)
})

const label = computed(() => {
  const forms = theme.value.t?.readingTimeForms || []

  return `${minutes.value} ${pluralize(minutes.value, forms)}`.trim()
})
</script>

<template>
  <!--
    `time[datetime]` carries the ISO 8601 duration, so the estimate is exposed
    as machine-readable data alongside the JSON-LD `timeRequired`.
  -->
  <time
    v-if="visible"
    class="post-reading-time text-base muted"
    :datetime="toIsoDuration(minutes)"
    :title="theme.t?.readingTime"
  >
    {{ label }}
  </time>
</template>
