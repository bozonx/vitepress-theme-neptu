<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import { BUILTIN_PODCAST_PLATFORMS, FALLBACK_PODCAST_ICON } from '../../configs/podcastPlatforms.ts'

const props = withDefaults(
  defineProps<{
    /** Platform id, looked up in the built-in registry. */
    name?: string
    /** Iconify name, overriding whatever `name` resolves to. */
    icon?: string
    /** Icon file URL, overriding both `icon` and `name`. */
    iconUrl?: string
    alt?: string
    width?: string
  }>(),
  {
    width: '1.6rem',
  }
)

const builtin = computed(() =>
  props.name ? BUILTIN_PODCAST_PLATFORMS[props.name] : undefined
)

const resolvedIconUrl = computed(() => props.iconUrl ?? builtin.value?.iconUrl)

const resolvedIcon = computed(
  () => props.icon ?? builtin.value?.icon ?? FALLBACK_PODCAST_ICON
)
</script>

<template>
  <img
    v-if="resolvedIconUrl"
    :src="resolvedIconUrl"
    :alt="props.alt || ''"
    :width="props.width"
    :height="props.width"
    :style="{ width: props.width, height: props.width }"
    loading="lazy"
    decoding="async"
  />
  <Icon
    v-else
    :icon="resolvedIcon"
    :width="props.width"
    :height="props.width"
    :alt="props.alt"
    aria-hidden="true"
  />
</template>
