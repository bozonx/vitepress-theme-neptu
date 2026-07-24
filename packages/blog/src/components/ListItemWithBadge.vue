<script setup lang="ts">
import NeptuBadge from './NeptuBadge.vue'
import SimpleLink from './SimpleLink.vue'

interface Props {
  text?: string
  count?: number
}

// Declare only the props handled by this component
const { text, count } = defineProps<Props>()
</script>

<template>
  <SimpleLink
    v-bind="$attrs"
    class="no-underline text-2xl my-5 inline-flex gap-x-2"
  >
    <span>{{ text }}</span>
    <NeptuBadge v-if="typeof count === 'number'" :count="count" />
  </SimpleLink>
</template>
