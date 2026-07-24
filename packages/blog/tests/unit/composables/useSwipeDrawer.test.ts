import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useSwipeDrawer } from '../../../src/composables/useSwipeDrawer.ts'

vi.mock('vitepress', () => ({ inBrowser: true }))

describe('useSwipeDrawer', () => {
  let onOpen: () => void
  let onClose: () => void
  let enabled: () => boolean
  let wrappers: Array<ReturnType<typeof mount>> = []

  beforeEach(() => {
    onOpen = vi.fn() as unknown as () => void
    onClose = vi.fn() as unknown as () => void
    enabled = () => true
    wrappers = []
  })

  afterEach(() => {
    wrappers.forEach((wrapper) => wrapper.unmount())
    vi.restoreAllMocks()
  })

  function mountComposable(options: Partial<{
    enabled: () => boolean
    canOpen: () => boolean
    canClose: () => boolean
    onOpen: () => void
    onClose: () => void
    edgePx: number
    threshold: number
  }> = {}) {
    const TestComp = defineComponent({
      setup() {
        useSwipeDrawer({
          enabled: options.enabled ?? enabled,
          canOpen: options.canOpen,
          canClose: options.canClose,
          onOpen: options.onOpen ?? onOpen,
          onClose: options.onClose ?? onClose,
          edgePx: options.edgePx ?? 50,
          threshold: options.threshold ?? 50,
        })
        return () => h('div')
      },
    })
    const wrapper = mount(TestComp)
    wrappers.push(wrapper)
    return wrapper
  }

  function createTouchEvent(type: string, touches: Array<{ clientX: number; clientY: number }>): TouchEvent {
    return new TouchEvent(type, {
      touches: touches.map((t, i) =>
        new Touch({
          identifier: i,
          target: document.body,
          clientX: t.clientX,
          clientY: t.clientY,
        })
      ),
      cancelable: true,
      bubbles: true,
    })
  }

  it('calls onOpen on right swipe from edge', () => {
    mountComposable()

    window.dispatchEvent(createTouchEvent('touchstart', [{ clientX: 20, clientY: 100 }]))
    window.dispatchEvent(createTouchEvent('touchmove', [{ clientX: 80, clientY: 100 }]))

    expect(onOpen).toHaveBeenCalled()
    expect(onClose).not.toHaveBeenCalled()
  })

  it('does not call onOpen if swipe starts beyond edge', () => {
    mountComposable()

    window.dispatchEvent(createTouchEvent('touchstart', [{ clientX: 100, clientY: 100 }]))
    window.dispatchEvent(createTouchEvent('touchmove', [{ clientX: 160, clientY: 100 }]))

    expect(onOpen).not.toHaveBeenCalled()
  })

  it('calls onClose on left swipe', () => {
    mountComposable()

    window.dispatchEvent(createTouchEvent('touchstart', [{ clientX: 200, clientY: 100 }]))
    window.dispatchEvent(createTouchEvent('touchmove', [{ clientX: 100, clientY: 100 }]))

    expect(onClose).toHaveBeenCalled()
    expect(onOpen).not.toHaveBeenCalled()
  })

  it('does not prevent default or close when canClose returns false', () => {
    mountComposable({ canClose: () => false })

    window.dispatchEvent(createTouchEvent('touchstart', [{ clientX: 200, clientY: 100 }]))
    const touchMove = createTouchEvent('touchmove', [{ clientX: 100, clientY: 100 }])
    const preventDefaultSpy = vi.spyOn(touchMove, 'preventDefault')
    window.dispatchEvent(touchMove)

    expect(onClose).not.toHaveBeenCalled()
    expect(preventDefaultSpy).not.toHaveBeenCalled()
  })

  it('does not prevent default or open when canOpen returns false', () => {
    mountComposable({ canOpen: () => false })

    window.dispatchEvent(createTouchEvent('touchstart', [{ clientX: 20, clientY: 100 }]))
    const touchMove = createTouchEvent('touchmove', [{ clientX: 80, clientY: 100 }])
    const preventDefaultSpy = vi.spyOn(touchMove, 'preventDefault')
    window.dispatchEvent(touchMove)

    expect(onOpen).not.toHaveBeenCalled()
    expect(preventDefaultSpy).not.toHaveBeenCalled()
  })

  it('does not trigger if vertical movement dominates', () => {
    mountComposable()

    window.dispatchEvent(createTouchEvent('touchstart', [{ clientX: 20, clientY: 100 }]))
    window.dispatchEvent(createTouchEvent('touchmove', [{ clientX: 30, clientY: 300 }]))

    expect(onOpen).not.toHaveBeenCalled()
    expect(onClose).not.toHaveBeenCalled()
  })

  it('does not trigger if below threshold', () => {
    mountComposable()

    window.dispatchEvent(createTouchEvent('touchstart', [{ clientX: 20, clientY: 100 }]))
    window.dispatchEvent(createTouchEvent('touchmove', [{ clientX: 60, clientY: 100 }]))

    expect(onOpen).not.toHaveBeenCalled()
  })

  it('does nothing when disabled', () => {
    mountComposable({ enabled: () => false })

    window.dispatchEvent(createTouchEvent('touchstart', [{ clientX: 20, clientY: 100 }]))
    window.dispatchEvent(createTouchEvent('touchmove', [{ clientX: 80, clientY: 100 }]))

    expect(onOpen).not.toHaveBeenCalled()
    expect(onClose).not.toHaveBeenCalled()
  })

  it('resets state after touchend', () => {
    mountComposable()

    window.dispatchEvent(createTouchEvent('touchstart', [{ clientX: 20, clientY: 100 }]))
    window.dispatchEvent(createTouchEvent('touchend', []))
    window.dispatchEvent(createTouchEvent('touchmove', [{ clientX: 80, clientY: 100 }]))

    expect(onOpen).not.toHaveBeenCalled()
  })

  it('uses custom edge and threshold', () => {
    mountComposable({ edgePx: 10, threshold: 20 })

    window.dispatchEvent(createTouchEvent('touchstart', [{ clientX: 5, clientY: 100 }]))
    window.dispatchEvent(createTouchEvent('touchmove', [{ clientX: 30, clientY: 100 }]))

    expect(onOpen).toHaveBeenCalled()
  })

  it('calls preventDefault when cancelable', () => {
    mountComposable()

    const touchStart = createTouchEvent('touchstart', [{ clientX: 20, clientY: 100 }])
    window.dispatchEvent(touchStart)

    const touchMove = createTouchEvent('touchmove', [{ clientX: 80, clientY: 100 }])
    const preventDefaultSpy = vi.spyOn(touchMove, 'preventDefault')
    window.dispatchEvent(touchMove)

    expect(preventDefaultSpy).toHaveBeenCalled()
  })

  it('removes listeners on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')

    const TestComp = defineComponent({
      setup() {
        useSwipeDrawer({
          enabled,
          onOpen: onOpen as unknown as (() => void) | undefined,
          onClose: onClose as unknown as (() => void) | undefined,
        })
        return () => h('div')
      },
    })
    const wrapper = mount(TestComp)
    wrapper.unmount()

    expect(removeSpy).toHaveBeenCalledWith('touchstart', expect.any(Function))
    expect(removeSpy).toHaveBeenCalledWith('touchmove', expect.any(Function))
    expect(removeSpy).toHaveBeenCalledWith('touchend', expect.any(Function))
    expect(removeSpy).toHaveBeenCalledWith('touchcancel', expect.any(Function))
  })
})
