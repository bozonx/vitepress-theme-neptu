<script setup lang="ts">
/**
 * Screenshot / photo gallery. The optional lightbox uses a native `<dialog>`,
 * so focus trapping and Esc-to-close come from the platform.
 */
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import LnSection from '../primitives/LnSection.vue'
import LnHeading from '../primitives/LnHeading.vue'
import LnIcon from '../primitives/LnIcon.vue'
import type { GalleryItem, SectionProps } from './types.ts'

const props = withDefaults(
  defineProps<
    SectionProps & {
      eyebrow?: string
      title?: string
      text?: string
      items?: GalleryItem[]
      cols?: 2 | 3 | 4
      variant?: 'grid' | 'masonry'
      /** Open images in a modal viewer. */
      lightbox?: boolean
      ratio?: string
    }
  >(),
  { cols: 3, variant: 'grid', lightbox: true, ratio: '4/3', align: 'start' }
)

const dialog = ref<HTMLDialogElement | null>(null)
const current = ref(0)

const resolve = (url: string) => (/^(https?:)?\/\//.test(url) ? url : withBase(url))
const activeItem = computed(() => props.items?.[current.value])

const open = (index: number): void => {
  if (!props.lightbox) return
  current.value = index
  dialog.value?.showModal?.()
}

const close = (): void => dialog.value?.close?.()

const move = (delta: number): void => {
  const total = props.items?.length ?? 0
  if (!total) return
  current.value = (current.value + delta + total) % total
}
</script>

<template>
  <LnSection
    :id="props.id"
    :bg="props.bg"
    :width="props.width"
    :padding="props.padding"
    :divider="props.divider"
    :no-reveal="props.noReveal"
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
      <component
        :is="item.link ? 'a' : props.lightbox ? 'button' : 'div'"
        v-for="(item, i) in props.items"
        :key="`${item.src}-${i}`"
        class="ln-gallery__item"
        :href="item.link"
        :type="!item.link && props.lightbox ? 'button' : undefined"
        @click="!item.link && open(i)"
      >
        <img
          :src="resolve(item.src)"
          :alt="item.alt ?? ''"
          loading="lazy"
          :style="
            props.variant === 'grid'
              ? { aspectRatio: item.ratio ?? props.ratio }
              : undefined
          "
        />
        <span v-if="item.caption" class="ln-gallery__caption">{{ item.caption }}</span>
      </component>
      <slot />
    </div>

    <dialog v-if="props.lightbox" ref="dialog" class="ln-gallery__dialog" @click="close">
      <div class="ln-gallery__viewer" @click.stop>
        <img
          v-if="activeItem"
          :src="resolve(activeItem.src)"
          :alt="activeItem.alt ?? ''"
        />
        <p v-if="activeItem?.caption" class="ln-gallery__viewer-caption">
          {{ activeItem.caption }}
        </p>

        <button type="button" class="ln-gallery__nav ln-gallery__nav--prev" aria-label="Previous image" @click="move(-1)">
          <LnIcon icon="fa6-solid:chevron-left" size="1rem" />
        </button>
        <button type="button" class="ln-gallery__nav ln-gallery__nav--next" aria-label="Next image" @click="move(1)">
          <LnIcon icon="fa6-solid:chevron-right" size="1rem" />
        </button>
        <button type="button" class="ln-gallery__close" aria-label="Close" @click="close">
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
  display: block;
  position: relative;
  overflow: hidden;
  border: var(--ln-border-width) solid var(--ln-c-border);
  border-radius: var(--ln-radius-md);
  padding: 0;
  background: none;
  cursor: pointer;
  line-height: 0;
}

.ln-gallery__item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s var(--ln-ease);
}

.ln-gallery__item:hover img {
  transform: scale(1.03);
}

.ln-gallery__item:focus-visible {
  outline: 2px solid var(--ln-c-brand);
  outline-offset: 3px;
}

.ln-gallery__caption {
  position: absolute;
  inset: auto 0 0 0;
  padding: 2rem 0.875rem 0.75rem;
  background: linear-gradient(transparent, rgb(0 0 0 / 72%));
  color: #fff;
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
  background: rgb(0 0 0 / 82%);
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
  color: #fff;
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
  background-color: rgb(255 255 255 / 14%);
  color: #fff;
  cursor: pointer;
  transition: background-color var(--ln-duration) var(--ln-ease);
}

.ln-gallery__nav:hover,
.ln-gallery__close:hover {
  background-color: rgb(255 255 255 / 28%);
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
