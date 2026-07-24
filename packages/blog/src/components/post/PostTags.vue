<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'
import TagsList from '../TagsList.vue'
import NeptuBtnLink from '../NeptuBtnLink.vue'
import { useUiTheme } from '../../composables/useUiTheme.ts'

const { frontmatter } = useData()
const { theme } = useUiTheme()
const tags = computed(() =>
  [...(frontmatter.value.tags || [])].sort((a, b) =>
    String(a.name).localeCompare(b.name)
  )
)
</script>

<template>
  <div v-if="frontmatter.tags?.length">
    <div class="md:flex">
      <p class="md:mt-1 md:mr-2 max-md:mb-3 muted">{{ theme.t.tags }}:</p>

      <TagsList :tags="tags">
        <template #after>
          <li class="flex items-center ml-2 max-md:mt-2">
            <NeptuBtnLink href="tags" :icon="theme.tagsIcon">{{
              theme.t.allTagsCall
            }}</NeptuBtnLink>
          </li>
        </template>
      </TagsList>
    </div>
  </div>
</template>
