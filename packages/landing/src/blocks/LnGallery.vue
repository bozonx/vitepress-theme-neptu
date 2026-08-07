<script setup lang="ts">
/**
 * Screenshot / photo gallery. The optional lightbox uses a native `<dialog>`,
 * so focus trapping and Esc-to-close come from the platform.
 */
import { computed, ref } from 'vue'
import { useData } from 'vitepress'
import LnSection from '../primitives/LnSection.vue'
import LnHeading from '../primitives/LnHeading.vue'
import LnIcon from '../primitives/LnIcon.vue'
import LnButtonGroup from '../primitives/LnButtonGroup.vue'
import { externalLinkTarget, resolveUrl } from '../utils/url.ts'
import type { GalleryItem, HeadingProps, SectionProps } from './types.ts'
import { useSectionProps } from './sectionProps.ts'

const emit = defineEmits<{
  /** Fired when the lightbox dialog opens. */
  lightboxOpen: [index: number]
  /** Fired when the lightbox dialog closes. */
  lightboxClose: []
}>()

const props = withDefaults(
  defineProps<
    SectionProps & HeadingProps & {
      items?: GalleryItem[]
      cols?: 2 | 3 | 4
      variant?: 'grid' | 'masonry'
      /** Open images in a modal viewer. */
      lightbox?: boolean
      /** CSS aspect-ratio of each tile, e.g. `4/3`. */
      mediaRatio?: string
      /** Accessible name for the lightbox dialog. Defaults to the section title. */
      ariaLabel?: string
    }
  >(),
  { cols: 3, variant: 'grid', lightbox: true, mediaRatio: '4/3', align: 'start' }
)

const sectionProps = useSectionProps(props)

const dialog = ref<HTMLDialogElement | null>(null)
const current = ref(0)

const { theme } = useData()
const galleryText = computed(() => {
  const t = theme.value.t as { landing?: { gallery?: Record<string, string> } } | undefined
  return t?.landing?.gallery ?? {}
})
const label = (key: string, fallback: string): string => galleryText.value[key] ?? fallback

const activeItem = computed(() => props.items?.[current.value])

const open = (index: number): void => {
  if (!props.lightbox) return
  current.value = index
  dialog.value?.showModal?.()
  emit('lightboxOpen', index)
}

const close = (): void => {
  dialog.value?.close?.()
}

/** Native `close` event covers Esc, backdrop click and programmatic close. */
const onDialogClose = (): void => {
  emit('lightboxClose')
}

const move = (delta: number): void => {
  const total = props.items?.length ?? 0
  if (!total) return
  current.value = (current.value + delta + total) % total
}

/** Esc comes from `<dialog>` itself; arrows have to be wired up by hand. */
const onKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'ArrowRight') move(1)
  else if (event.key === 'ArrowLeft') move(-1)
  else return
  event.preventDefault()
}
</script>

<template>
  <LnSection
    v-bind="sectionProps"
    class="ln-gallery"
  >
    <LnHeading
      :eyebrow="props.eyebrow"
      :title="props.title"
      :text="props.text"
      :align="props.align"
    />

    <div
      class="ln-gallery__list"
      :class="`ln-gallery__list--${props.variant}`"
      :style="{ '--ln-gallery-cols': props.cols }"
    >
      <article
        v-for="(item, i) in props.items"
        :key="`${item.src}-${i}`"
        class="ln-gallery__item"
      >
        <component
          :is="item.link ? 'a' : props.lightbox ? 'button' : 'div'"
          class="ln-gallery__media"
          :class="{ 'ln-gallery__media--static': !item.link && !props.lightbox }"
          :href="resolveUrl(item.link)" :target="externalLinkTarget(item.link)"
          :rel="item.link && externalLinkTarget(item.link) ? 'noreferrer' : undefined"
          :type="!item.link && props.lightbox ? 'button' : undefined"
          @click="!item.link && open(i)"
        >
          <img :src="resolveUrl(item.src)" :alt="item.alt ?? ''" loading="lazy" :style="props.variant === 'grid' ? { aspectRatio: item.mediaRatio ?? props.mediaRatio } : undefined" />
          <span v-if="item.caption" class="ln-gallery__caption">{{ item.caption }}</span>
        </component>
        <div v-if="item.title || item.text || item.tags?.length || item.actions?.length" class="ln-gallery__body">
          <h3 v-if="item.title">{{ item.title }}</h3>
          <p v-if="item.text">{{ item.text }}</p>
          <div v-if="item.tags?.length" class="ln-gallery__tags"><span v-for="tag in item.tags" :key="tag">{{ tag }}</span></div>
          <LnButtonGroup v-if="item.actions?.length" :actions="item.actions" size="sm" />
        </div>
      </article>
      <slot />
    </div>

    <dialog
      v-if="props.lightbox"
      ref="dialog"
      class="ln-gallery__dialog"
      :aria-label="props.ariaLabel ?? props.title ?? label('region', 'Image viewer')"
      @click="close"
      @close="onDialogClose"
      @keydown="onKeydown"
    >
      <div class="ln-gallery__viewer" @click.stop>
        <img
          v-if="activeItem"
          :src="resolveUrl(activeItem.src)"
          :alt="activeItem.alt ?? ''"
        />
        <p v-if="activeItem?.caption" class="ln-gallery__viewer-caption">
          {{ activeItem.caption }}
        </p>

        <button
          v-if="(props.items?.length ?? 0) > 1"
          type="button"
          class="ln-gallery__nav ln-gallery__nav--prev"
          :aria-label="label('previous', 'Previous image')"
          @click="move(-1)"
        >
          <LnIcon icon="fa6-solid:chevron-left" size="1rem" />
        </button>
        <button
          v-if="(props.items?.length ?? 0) > 1"
          type="button"
          class="ln-gallery__nav ln-gallery__nav--next"
          :aria-label="label('next', 'Next image')"
          @click="move(1)"
        >
          <LnIcon icon="fa6-solid:chevron-right" size="1rem" />
        </button>
        <button
          type="button"
          class="ln-gallery__close"
          :aria-label="label('close', 'Close')"
          @click="close"
        >
          <LnIcon icon="fa6-solid:xmark" size="1rem" />
        </button>
      </div>
    </dialog>
  </LnSection>
</template>

<style scoped>
.ln-gallery__list--grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ln-gap-sm);
}

@media (min-width: 860px) {
  .ln-gallery__list--grid {
    grid-template-columns: repeat(var(--ln-gallery-cols, 3), minmax(0, 1fr));
  }
}

.ln-gallery__list--masonry {
  columns: 2;
  column-gap: var(--ln-gap-sm);
}

@media (min-width: 860px) {
  .ln-gallery__list--masonry {
    columns: var(--ln-gallery-cols, 3);
  }
}

.ln-gallery__list--masonry .ln-gallery__item {
  break-inside: avoid;
  margin-bottom: var(--ln-gap-sm);
}

.ln-gallery__item {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: var(--ln-border-width) solid var(--ln-c-border);
  border-radius: var(--ln-radius-md);
  background: var(--ln-card-bg);
}

.ln-gallery__media {
  display: block;
  position: relative;
  overflow: hidden;
  border: 0;
  padding: 0;
  background: none;
  cursor: pointer;
  line-height: 0;
}

.ln-gallery__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s var(--ln-ease);
}

.ln-gallery__media:hover img {
  transform: scale(1.03);
}

/* Nothing to click — do not pretend otherwise. */
.ln-gallery__media--static {
  cursor: default;
}

.ln-gallery__media--static:hover img {
  transform: none;
}

.ln-gallery__media:focus-visible {
  outline: 2px solid var(--ln-c-brand);
  outline-offset: 3px;
}

.ln-gallery__body { display: flex; flex-direction: column; gap: 0.65rem; padding: var(--ln-card-padding); line-height: var(--ln-body-lh); }
.ln-gallery__body h3, .ln-gallery__body p { margin: 0; }
.ln-gallery__body h3 { font-family: var(--ln-font-display); font-size: var(--ln-h3-size); }
.ln-gallery__body p { color: var(--ln-c-text-2); }
.ln-gallery__tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.ln-gallery__tags span { border-radius: var(--ln-radius-pill); background: var(--ln-c-brand-soft); padding: 0.15rem 0.5rem; color: var(--ln-c-brand-text); font-size: 0.75rem; }

.ln-gallery__caption {
  position: absolute;
  inset: auto 0 0 0;
  padding: 2rem 0.875rem 0.75rem;
  background: linear-gradient(transparent, var(--ln-c-media-scrim));
  color: var(--ln-c-on-media);
  font-size: 0.8125rem;
  line-height: 1.4;
  text-align: left;
}

/**** Lightbox */
.ln-gallery__dialog {
  margin: auto;
  border: 0;
  border-radius: var(--ln-radius-lg);
  padding: 0;
  max-width: min(92vw, 72rem);
  max-height: 92vh;
  background: transparent;
  overflow: visible;
}

.ln-gallery__dialog::backdrop {
  background: var(--ln-c-backdrop);
}

.ln-gallery__viewer {
  position: relative;
  line-height: 0;
}

.ln-gallery__viewer img {
  max-width: 100%;
  max-height: 82vh;
  border-radius: var(--ln-radius-md);
  object-fit: contain;
}

.ln-gallery__viewer-caption {
  margin: 0.75rem 0 0;
  color: var(--ln-c-on-media);
  font-size: 0.875rem;
  line-height: 1.5;
  text-align: center;
}

.ln-gallery__nav,
.ln-gallery__close {
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 0;
  border-radius: var(--ln-radius-pill);
  background-color: var(--ln-c-on-media-veil);
  color: var(--ln-c-on-media);
  cursor: pointer;
  transition: background-color var(--ln-duration) var(--ln-ease);
}

.ln-gallery__nav:hover,
.ln-gallery__close:hover {
  background-color: var(--ln-c-on-media-veil-hover);
}

.ln-gallery__nav--prev {
  top: 50%;
  left: 0.75rem;
  transform: translateY(-50%);
}

.ln-gallery__nav--next {
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);
}

.ln-gallery__close {
  top: 0.75rem;
  right: 0.75rem;
}
</style>
