<script setup lang="ts">
/**
 * One icon slot, three accepted shapes:
 *  - Iconify name — `fa6-solid:rocket`
 *  - emoji or any short text — `🚀`
 *  - image — `/img/icon.svg` or `{ src, alt }`
 */
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import type { IconLike } from '../blocks/types.ts'
import { resolveUrl } from '../utils/url.ts'

const props = withDefaults(
  defineProps<{
    icon?: IconLike
    /** Any CSS length. */
    size?: string
    label?: string
  }>(),
  { size: '1.75rem' }
)

const kind = computed<'none' | 'iconify' | 'image' | 'text'>(() => {
  const icon = props.icon
  if (!icon) return 'none'
  if (typeof icon === 'object') return 'image'
  if (/^(https?:)?\/|^\/|\.(svg|png|jpe?g|webp|avif|gif)$/i.test(icon)) return 'image'
  if (/^[\w-]+:[\w-]+$/.test(icon)) return 'iconify'
  return 'text'
})

const imageSrc = computed(() =>
  resolveUrl(typeof props.icon === 'object' ? props.icon.src : (props.icon as string))
)
const imageAlt = computed(() =>
  typeof props.icon === 'object' ? (props.icon.alt ?? '') : (props.label ?? '')
)
</script>

<template>
  <span
    v-if="kind !== 'none'"
    class="ln-icon"
    :style="{ '--ln-icon-size': props.size }"
    :aria-hidden="props.label ? undefined : 'true'"
    :aria-label="props.label"
    :role="props.label ? 'img' : undefined"
  >
    <Icon v-if="kind === 'iconify'" :icon="props.icon as string" width="1em" height="1em" />
    <img v-else-if="kind === 'image'" :src="imageSrc" :alt="imageAlt" loading="lazy" />
    <span v-else class="ln-icon__text">{{ props.icon }}</span>
  </span>
</template>

<style scoped>
.ln-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: var(--ln-icon-size);
  height: var(--ln-icon-size);
  font-size: var(--ln-icon-size);
  line-height: 1;
}

.ln-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.ln-icon__text {
  font-size: 0.9em;
  line-height: 1;
}
</style>
