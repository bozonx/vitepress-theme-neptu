<template>
  <div
    ref="triggerRef"
    class="pagefind-search-wrapper"
    role="button"
    tabindex="0"
    @click="showSearchModal"
    @keydown.enter="showSearchModal"
    @keydown.space.prevent="showSearchModal"
  >
    <slot />
  </div>

  <Teleport v-if="isMounted" :to="`#${GLOBAL_MODALS_CONTAINER_ID}`">
    <div
      v-show="isModalVisible"
      :id="MODAL_ID"
      ref="modalRef"
      class="search-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      tabindex="-1"
      :class="{
        active: isActive,
        'fade-in': isAnimatingIn,
        'fade-out': isAnimatingOut
      }"
      :style="{ display: isModalVisible ? 'flex' : 'none' }"
      @click="handleBackdropClick"
      @keydown="handleModalKeydown"
    >
      <div class="search-modal-inner-wrapper">
        <button type="button" class="search-modal-close-button" aria-label="Close search">×</button>
        <div class="search-modal-content">
          <div class="search-modal-top-bar">
            <button type="button" class="search-modal-mobile-close-button" aria-label="Close search">×</button>
          </div>
          <div id="pagefind-search"></div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import { useData, withBase } from 'vitepress'
import { GLOBAL_MODALS_CONTAINER_ID } from '../../constants.ts'
import type { ThemeConfig } from '../../types.ts'

declare global {
  interface Window {
    PagefindUI: {
      new (options: unknown): { destroy(): void }
    }
  }
}

const MODAL_ID = 'search-modal'
const HISTORY_STATE_KEY = 'neptuPagefindModal'
const CLOSE_BUTTON_CLASS = 'search-modal-close-button'
const MOBILE_CLOSE_BUTTON_CLASS = 'search-modal-mobile-close-button'

const { theme } = useData<ThemeConfig>()

const pageFind = ref<InstanceType<typeof window.PagefindUI> | null>(null)
const isModalOpen = ref(false)
const isModalVisible = ref(false)
const isActive = ref(false)
const isAnimatingIn = ref(false)
const isAnimatingOut = ref(false)
const isMounted = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const modalRef = ref<HTMLElement | null>(null)
let closeTimeout: ReturnType<typeof setTimeout> | null = null
let focusTimeout: ReturnType<typeof setTimeout> | null = null

const clearTimers = () => {
  if (closeTimeout) clearTimeout(closeTimeout)
  if (focusTimeout) clearTimeout(focusTimeout)
  closeTimeout = null
  focusTimeout = null
}

const destroyPagefind = () => {
  pageFind.value?.destroy()
  pageFind.value = null
}

const showSearchModal = async () => {
  if (isModalOpen.value) return

  isModalVisible.value = true
  isModalOpen.value = true

  await nextTick()

  isActive.value = true
  isAnimatingIn.value = true
  isAnimatingOut.value = false

  document.body.classList.add('modal-open')
  history.pushState({ ...history.state, [HISTORY_STATE_KEY]: true }, '', window.location.href)

  if (window.PagefindUI && !pageFind.value) {
    const customOptions = theme.value?.search?.options || {}
    const { bodyMarker: _bodyMarker, ...runtimeOptions } = customOptions as Record<string, unknown>

    pageFind.value = new window.PagefindUI({
      element: '#pagefind-search',
      bundlePath: withBase('/pagefind/'),
      showSubResults: true,
      showImages: true,
      ...runtimeOptions,
    })
  }

  focusTimeout = setTimeout(() => {
    if (modalRef.value) {
      const searchInput = modalRef.value.querySelector('.pagefind-ui__search-input') as HTMLInputElement | null
      if (searchInput) searchInput.focus()
    }
    focusTimeout = null
  }, 100)
}

const finishHiding = () => {
  isModalVisible.value = false
  isActive.value = false
  isAnimatingOut.value = false
  isModalOpen.value = false
  closeTimeout = null

  document.body.classList.remove('modal-open')
  destroyPagefind()
  triggerRef.value?.focus()
}

const hideSearchModal = (fromPopState = false) => {
  if (!isModalOpen.value) return

  if (!fromPopState && history.state?.[HISTORY_STATE_KEY]) {
    history.back()
    return
  }

  isAnimatingIn.value = false
  isAnimatingOut.value = true

  if (closeTimeout) clearTimeout(closeTimeout)
  closeTimeout = setTimeout(finishHiding, 300)
}

const handleBackdropClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (
    target.id === MODAL_ID ||
    target.classList.contains(CLOSE_BUTTON_CLASS) ||
    target.classList.contains(MOBILE_CLOSE_BUTTON_CLASS) ||
    target.classList.contains('pagefind-ui__result-link') ||
    target.closest('.pagefind-ui__result-link')
  ) {
    hideSearchModal()
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    if (isModalOpen.value) hideSearchModal()
  }
}

const handleModalKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Tab' || !modalRef.value) return

  const focusable = Array.from(
    modalRef.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  )
  if (!focusable.length) {
    event.preventDefault()
    modalRef.value.focus()
    return
  }

  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

const handlePopState = (event: PopStateEvent) => {
  if (isModalOpen.value && !event.state?.[HISTORY_STATE_KEY]) {
    hideSearchModal(true)
  }
}

onMounted(() => {
  isMounted.value = true
  document.addEventListener('keydown', handleKeydown)
  window.addEventListener('popstate', handlePopState)
})

onUnmounted(() => {
  clearTimers()
  document.body.classList.remove('modal-open')
  document.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('popstate', handlePopState)
  destroyPagefind()
})

// Expose show for external usage
defineExpose({ show: showSearchModal })
</script>
