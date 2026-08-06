<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'
import TagsList from '../TagsList.vue'
import NeptuBtnLink from '../NeptuBtnLink.vue'
import { useUiTheme } from '../../composables/useUiTheme.ts'
import type { TaxonomyEntry } from '../../types.d.ts'

const { frontmatter } = useData()
const { theme } = useUiTheme()
// `transformPageMeta` folds `category` sugar into this normalized list.
const categories = computed<TaxonomyEntry[]>(
  () => frontmatter.value.categories || []
)
</script>

<template>
  <div v-if="categories.length">
    <div class="md:flex">
      <p class="md:mt-1 md:mr-2 max-md:mb-3 muted">{{ theme.t.categories }}:</p>

      <TagsList :tags="categories" kind="category" pagefind-filter="category">
        <template #after>
          <li class="flex items-center ml-2 max-md:mt-2">
            <NeptuBtnLink
              href="categories"
              :icon="theme.categoriesIcon || theme.tagsIcon"
              >{{ theme.t.allCategoriesCall }}</NeptuBtnLink
            >
          </li>
        </template>
      </TagsList>
    </div>
  </div>
</template>
