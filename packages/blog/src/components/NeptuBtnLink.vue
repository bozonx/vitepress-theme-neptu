<script setup lang="ts">
import NeptuBtn from './NeptuBtn.vue'

type ClassValue = string | Record<string, unknown> | unknown[]

interface Props {
  customClass?: ClassValue
}

const props = defineProps<Props>()
</script>

<template>
  <NeptuBtn v-bind="$attrs" :custom-class="['inline-flex p-0! bg-transparent! shadow-none! border-0! btn-link', props.customClass]">
    <slot v-if="$slots.default" />
  </NeptuBtn>
</template>

<style scoped>
.btn-link.active :deep(.btn-base-inner) {
  text-decoration: underline;
}

.btn-link :deep(.btn-base.active) {
  color: var(--gray-400);
}

.btn-link :deep(.btn-base.active .btn-base-inner) {
  text-decoration: none;
}
</style>
