<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

import { isDraft } from '../../utils/shared/publication.ts'
import { useThemeConfig } from '../../composables/useThemeConfig.ts'

const props = withDefaults(
  defineProps<{
    /** Overrides the current page — lets list items reuse the badge. */
    draft?: boolean
  }>(),
  { draft: undefined }
)

const { frontmatter } = useData()
const { theme } = useThemeConfig()

const visible = computed(() => {
  return props.draft ?? isDraft(frontmatter.value)
})
</script>

<template>
  <!--
    Only ever rendered while drafts are visible (the dev server, or an explicit
    `drafts.showDrafts: true`), since a hidden draft never reaches a list.
    On the post page itself the badge is the one signal that the article is
    unlisted and marked noindex.
  -->
  <span
    v-if="visible"
    class="post-draft-badge badge-item rounded-[var(--neptu-radius-pill)] border border-current px-2 py-0.5 text-sm leading-5 muted"
    :title="theme.t?.draftTitle"
  >
    {{ theme.t?.draftLabel }}
  </span>
</template>
