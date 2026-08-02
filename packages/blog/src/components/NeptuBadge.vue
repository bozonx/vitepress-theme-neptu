<script setup lang="ts">
interface Props {
  count?: string | number
  title?: string
}

const props = defineProps<Props>()
</script>

<template>
  <span
    class="badge-item inline-flex items-center justify-center shrink-0 min-w-[1.25rem] h-5 px-1.5 rounded-full text-xs font-semibold leading-none select-none"
    :title="props.title"
  >
    {{ props.count }}
  </span>
</template>

<style scoped>
.badge-item {
  color: #ffffff !important;
  background-color: rgba(0, 0, 0, 0.22) !important;
}
</style>
