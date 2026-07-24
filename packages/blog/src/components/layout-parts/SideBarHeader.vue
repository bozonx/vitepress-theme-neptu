<script setup lang="ts">
const props = defineProps<{
  text?: string
}>()
</script>

<template>
  <h4 class="font-bold w-full text-sm pl-3 mt-6 mb-1 muted">
    <span>{{ props.text }}</span>
  </h4>
</template>
