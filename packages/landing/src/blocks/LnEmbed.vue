<script setup lang="ts">
/** Lazy iframe for maps, calendars, demos and booking widgets. */
import LnSection from '../primitives/LnSection.vue'
import LnHeading from '../primitives/LnHeading.vue'
import LnButtonGroup from '../primitives/LnButtonGroup.vue'
import type { ActionItem, SectionProps } from './types.ts'
import { resolveUrl } from '../utils/url.ts'

const props = withDefaults(
  defineProps<
    SectionProps & {
      eyebrow?: string
      title?: string
      text?: string
      src?: string
      embedTitle?: string
      caption?: string
      ratio?: string
      loading?: 'lazy' | 'eager'
      allow?: string
      sandbox?: string
      actions?: ActionItem[]
    }
  >(),
  { ratio: '16/9', loading: 'lazy', align: 'center', width: 'default' }
)
</script>

<template>
  <LnSection :id="props.id" :bg="props.bg" :width="props.width" :padding="props.padding" :divider="props.divider" :no-reveal="props.noReveal" class="ln-embed">
    <LnHeading :eyebrow="props.eyebrow" :title="props.title" :text="props.text" :align="props.align" />
    <figure v-if="props.src" class="ln-embed__frame">
      <iframe :src="resolveUrl(props.src)" :title="props.embedTitle ?? props.title ?? 'Embedded content'" :loading="props.loading" :allow="props.allow" :sandbox="props.sandbox" :style="{ aspectRatio: props.ratio }" />
      <figcaption v-if="props.caption">{{ props.caption }}</figcaption>
    </figure>
    <LnButtonGroup v-if="props.actions?.length" :actions="props.actions" :align="props.align" class="ln-embed__actions" />
    <slot />
  </LnSection>
</template>

<style scoped>
.ln-embed__frame { margin: 0; }
.ln-embed__frame iframe { display: block; width: 100%; height: auto; border: var(--ln-border-width) solid var(--ln-c-border); border-radius: var(--ln-radius-lg); background: var(--ln-c-bg-soft); }
.ln-embed__frame figcaption { margin-top: 0.75rem; color: var(--ln-c-text-2); font-size: 0.875rem; text-align: center; }
.ln-embed__actions { margin-top: 1.5rem; }
</style>
