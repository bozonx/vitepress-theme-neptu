<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useLightbox, useLightboxLocales } from '../../composables/useLightbox.ts'

const { isOpen, currentIndex, items, close, next, prev } = useLightbox()
const locales = useLightboxLocales()

const currentItem = computed(() => items.value[currentIndex.value])
const hasMultiple = computed(() => items.value.length > 1)
const loaded = ref(false)
const containerRef = ref<HTMLDivElement | null>(null)

// Zoom / pan state
const scale = ref(1)
const panX = ref(0)
const panY = ref(0)
const isDragging = ref(false)
let dragStartX = 0
let dragStartY = 0

const isZoomed = computed(() => Math.abs(scale.value - 1) > 0.01)

const imgStyle = computed(() => ({
  transform: `translate(${panX.value}px, ${panY.value}px) scale(${scale.value})`,
  transition: isDragging.value ? 'none' : 'transform 0.2s ease',
  cursor: isZoomed.value ? (isDragging.value ? 'grabbing' : 'grab') : 'pointer',
}))

let touchStartX = 0
let touchStartY = 0
let hasDragged = false

watch(currentIndex, () => {
  loaded.value = false
  resetZoom()
})

watch(isOpen, async (open) => {
  if (open) {
    loaded.value = false
    await nextTick()
    containerRef.value?.focus()
  } else {
    resetZoom()
  }
})

function resetZoom() {
  scale.value = 1
  panX.value = 0
  panY.value = 0
  isDragging.value = false
  hasDragged = false
}

function onKeydown(e: KeyboardEvent) {
  if (!isOpen.value) return
  if (e.key === 'Escape') {
    e.preventDefault()
    if (isZoomed.value) {
      resetZoom()
    } else {
      close()
    }
    return
  }
  if (isZoomed.value) return // disable arrow nav while zoomed
  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault()
      prev()
      break
    case 'ArrowRight':
      e.preventDefault()
      next()
      break
  }
}

function onWheel(e: WheelEvent) {
  if (!isOpen.value) return
  e.preventDefault()
  const delta = e.deltaY > 0 ? -0.15 : 0.15
  const newScale = Math.min(5, Math.max(0.5, scale.value + delta))
  scale.value = newScale
  if (newScale <= 1) {
    panX.value = 0
    panY.value = 0
  }
}

function onMouseDown(e: MouseEvent) {
  if (e.button !== 0) return
  hasDragged = false
  if (!isZoomed.value) return
  isDragging.value = true
  dragStartX = e.clientX - panX.value
  dragStartY = e.clientY - panY.value
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
  e.preventDefault()
}

function onMouseMove(e: MouseEvent) {
  if (!isDragging.value) return
  const currentPanX = e.clientX - dragStartX
  const currentPanY = e.clientY - dragStartY
  if (Math.abs(currentPanX - panX.value) > 3 || Math.abs(currentPanY - panY.value) > 3) {
    hasDragged = true
  }
  panX.value = currentPanX
  panY.value = currentPanY
}

function onMouseUp() {
  if (isDragging.value) {
    isDragging.value = false
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }
}

function onTouchStart(e: TouchEvent) {
  const t = e.touches[0]
  if (!t) return
  touchStartX = t.clientX
  touchStartY = t.clientY
  hasDragged = false
}

function onTouchEnd(e: TouchEvent) {
  if (isZoomed.value) return // disable swipe nav while zoomed
  const t = e.changedTouches[0]
  if (!t) return
  const dx = t.clientX - touchStartX
  const dy = t.clientY - touchStartY
  if (Math.abs(dx) >= 10 || Math.abs(dy) >= 10) {
    hasDragged = true
  }
  if (Math.abs(dy) > Math.abs(dx)) return
  if (Math.abs(dx) < 50) return
  if (dx < 0) {
    next()
  } else {
    prev()
  }
}

function onImageClick(e: MouseEvent) {
  if (e.button !== 0) return
  if (hasDragged) {
    hasDragged = false
    return
  }
  close()
}

function onBackdropClick(e: MouseEvent) {
  if (e.button !== 0) return
  if (e.target === e.currentTarget) {
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
})
</script>

<template>
  <teleport to="#modals">
    <transition name="lightbox">
      <div
        v-if="isOpen"
        ref="containerRef"
        class="lightbox-overlay"
        role="dialog"
        aria-modal="true"
        :aria-label="locales.dialogTitle || 'Image'"
        tabindex="-1"
        @click="onBackdropClick"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
      >
        <!-- Close button -->
        <button
          type="button"
          class="lightbox-btn lightbox-close"
          :aria-label="locales.close || 'Close'"
          @click="close"
        >
          <Icon icon="mdi:close" />
        </button>

        <!-- Prev button -->
        <button
          v-if="hasMultiple"
          type="button"
          class="lightbox-btn lightbox-prev"
          :aria-label="locales.prev || 'Previous'"
          @click="prev"
        >
          <Icon icon="mdi:chevron-left" />
        </button>

        <!-- Image container -->
        <div
          class="lightbox-img-wrap"
          @wheel.prevent="onWheel"
          @mousedown="onMouseDown"
        >
          <div v-if="!loaded" class="lightbox-loader" role="status">
            <Icon icon="mdi:loading" class="lightbox-spinner" />
            <span class="sr-only">{{ locales.loadingIndicatorLabel || 'Loading...' }}</span>
          </div>
          <img
            v-show="loaded"
            :src="currentItem?.src"
            :alt="currentItem?.alt || ''"
            class="lightbox-img will-change-[transform]"
            :class="{ 'lightbox-img--zoomed': isZoomed }"
            :style="imgStyle"
            @load="loaded = true"
            @dblclick="resetZoom"
            @click="onImageClick"
          />
        </div>

        <!-- Caption -->
        <div
          v-if="currentItem?.alt"
          class="lightbox-caption-fixed"
        >
          {{ currentItem.alt }}
        </div>

        <!-- Next button -->
        <button
          v-if="hasMultiple"
          type="button"
          class="lightbox-btn lightbox-next"
          :aria-label="locales.next || 'Next'"
          @click="next"
        >
          <Icon icon="mdi:chevron-right" />
        </button>

        <!-- Counter / zoom reset -->
        <div
          v-if="hasMultiple || isZoomed"
          class="lightbox-counter"
        >
          <span v-if="hasMultiple" aria-hidden="true">{{ currentIndex + 1 }} / {{ items.length }}</span>
          <button
            v-if="isZoomed"
            type="button"
            class="lightbox-zoom-level"
            :aria-label="locales.resetZoom || 'Reset zoom'"
            @click="resetZoom"
          >
            {{ Math.round(scale * 100) }}%
          </button>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--backdrop-bg);
  backdrop-filter: blur(4px);
  outline: none;
}

.lightbox-img-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-img {
  max-width: 85vw;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  user-select: none;
  -webkit-user-drag: none;
}

.lightbox-img--zoomed {
  max-width: none;
  max-height: none;
}

.lightbox-loader {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.lightbox-spinner {
  width: 40px;
  height: 40px;
  animation: lightbox-spin 1s linear infinite;
}

@keyframes lightbox-spin {
  to {
    transform: rotate(360deg);
  }
}

.lightbox-btn {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease;
  font-size: 24px;
  z-index: 101;
}

.lightbox-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.lightbox-close {
  top: 16px;
  right: 16px;
}

.lightbox-prev {
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
}

.lightbox-next {
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
}

.lightbox-caption-fixed {
  position: fixed;
  bottom: 44px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.875rem;
  text-align: center;
  max-width: 90vw;
  padding: 0 1rem;
  z-index: 101;
  pointer-events: none;
}

.lightbox-counter {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  display: flex;
  gap: 8px;
}

.lightbox-zoom-level {
  font-weight: 600;
  background: none;
  border: none;
  color: inherit;
  font-size: inherit;
  font-variant-numeric: inherit;
  padding: 0;
  cursor: pointer;
  line-height: inherit;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .lightbox-img {
    max-width: 90vw;
    max-height: 75vh;
  }

  .lightbox-prev,
  .lightbox-next {
    width: 36px;
    height: 36px;
    font-size: 20px;
  }

  .lightbox-prev {
    left: 8px;
  }

  .lightbox-next {
    right: 8px;
  }
}

/* Vue transition */
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.25s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
