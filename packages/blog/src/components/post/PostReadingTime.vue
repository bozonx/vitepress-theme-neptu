<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

import { pluralize } from '../../utils/shared/i18n.ts'
import { isReadingTimeEnabled, toIsoDuration } from '../../utils/shared/readingTime.ts'
import { useTranslations } from '../../composables/useTranslations.ts'
import { useThemeConfig } from '../../composables/useThemeConfig.ts'
import type { PostFrontmatter } from '../../types.d.ts'

const props = withDefaults(
  defineProps<{
    /** Overrides the current page — lets list items reuse the badge. */
    minutes?: number
    /** Skips the layout check when the caller already decided. */
    forceShow?: boolean
    /** Prefixes the duration with the localized "Reading time" label. */
    showLabel?: boolean
  }>(),
  { forceShow: false, showLabel: false }
)

const { page, frontmatter } = useData()
const { theme } = useThemeConfig()
const translations = useTranslations()

const minutes = computed(() =>
  props.minutes ?? (page.value as { readingTime?: number }).readingTime ?? 0
)

const visible = computed(() => {
  if (minutes.value <= 0) return false
  if (theme.value.readingTime?.enabled === false) return false
  if (props.forceShow) return true

  return isReadingTimeEnabled(theme.value, frontmatter.value as PostFrontmatter)
})

const label = computed(() => {
  // Locale theme data can be absent while VitePress is resolving a locale
  // during dev navigation. Keep explicit site overrides first, then fall back
  // to the built-in translation selected from the current route.
  const configuredForms = theme.value.t?.readingTimeForms
  const forms = configuredForms?.length
    ? configuredForms
    : translations.value.t.readingTimeForms

  return `${minutes.value} ${pluralize(minutes.value, forms)}`.trim()
})

const title = computed(
  () => theme.value.t?.readingTime || translations.value.t.readingTime
)

const text = computed(() =>
  props.showLabel ? `${title.value}: ${label.value}` : label.value
)
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
    :title="title"
  >
    {{ text }}
  </time>
</template>
