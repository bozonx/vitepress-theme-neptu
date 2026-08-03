<script setup lang="ts">
import AllTaxonomyList from './AllTaxonomyList.vue'
import type { PostLite } from '../../types.d.ts'

defineProps<{ localePosts?: PostLite[] }>()
</script>

<template>
  <AllTaxonomyList kind="categories" :locale-posts="localePosts" />
</template>
