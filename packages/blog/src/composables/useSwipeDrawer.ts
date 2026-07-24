import { inBrowser } from 'vitepress'
import { onMounted, onUnmounted } from 'vue'

import { SWIPE_OFFSET } from '../constants.ts'

export interface UseSwipeDrawerOptions {
  /** Gate, e.g. isMobile. */
  enabled: () => boolean
  /** Additional gate for opening, e.g. drawer is currently closed. */
  canOpen?: () => boolean
  /** Additional gate for closing, e.g. drawer is currently open. */
  canClose?: () => boolean
  /** Called when user swipes to open. */
  onOpen?: () => void
  /** Called when user swipes to close. */
  onClose?: () => void
  /** Left-edge trigger width. */
  edgePx?: number
  /** Horizontal px required to trigger. */
  threshold?: number
}

/**
 * Horizontal edge-swipe gestures: open drawer on right-swipe from the left
 * edge, close on left-swipe. Only active while `enabled` is truthy.
 */
export function useSwipeDrawer({
  enabled,
  canOpen = () => true,
  canClose = () => true,
  onOpen,
  onClose,
  edgePx = 50,
  threshold = SWIPE_OFFSET,
}: UseSwipeDrawerOptions): void {
  let initialX: number | null = null
  let initialY: number | null = null
  let processed = false

  function reset() {
    initialX = null
    initialY = null
    processed = false
  }

  function onTouchStart(e: TouchEvent) {
    if (!enabled()) return
    const t = e.touches[0]
    if (!t) return
    initialX = t.clientX
    initialY = t.clientY
    processed = false
  }

  function onTouchMove(e: TouchEvent) {
    if (!enabled() || initialX === null || initialY === null || processed) return

    const t = e.touches[0]
    if (!t) return
    const dx = t.clientX - initialX
    const dy = t.clientY - initialY

    if (Math.abs(dy) > Math.abs(dx)) {
      reset()
      return
    }
    if (Math.abs(dx) < threshold) return

    processed = true

    if (dx > 0) {
      if (initialX <= edgePx && canOpen()) {
        if (e.cancelable) e.preventDefault()
        onOpen?.()
        reset()
      }
    } else {
      if (canClose()) {
        if (e.cancelable) e.preventDefault()
        onClose?.()
        reset()
      }
    }
  }

  onMounted(() => {
    if (!inBrowser) return
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', reset, { passive: true })
    window.addEventListener('touchcancel', reset, { passive: true })
  })

  onUnmounted(() => {
    if (!inBrowser) return
    window.removeEventListener('touchstart', onTouchStart)
    window.removeEventListener('touchmove', onTouchMove)
    window.removeEventListener('touchend', reset)
    window.removeEventListener('touchcancel', reset)
  })
}
