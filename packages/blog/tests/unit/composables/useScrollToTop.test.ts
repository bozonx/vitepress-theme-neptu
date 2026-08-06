import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useScrollToTop } from '../../../src/composables/useScrollToTop.ts'

describe('useScrollToTop', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  function mountComposable(animationMs?: number) {
    const result = {
      isShown: ref(false),
      opacity: ref(0),
      show: () => {},
      hide: () => {},
      handleClick: () => {},
    }
    const TestComp = defineComponent({
      setup() {
        const composable = animationMs !== undefined ? useScrollToTop(animationMs) : useScrollToTop()
        result.isShown = composable.isShown
        result.opacity = composable.opacity
        result.show = composable.show
        result.hide = composable.hide
        result.handleClick = composable.handleClick
        return () => h('div')
      },
    })
    mount(TestComp)
    return result
  }

  it('initial state is hidden', () => {
    const { isShown, opacity } = mountComposable()
    expect(isShown.value).toBe(false)
    expect(opacity.value).toBe(0)
  })

  it('show sets isShown and transitions opacity', () => {
    const { isShown, opacity, show } = mountComposable()
    show()
    expect(isShown.value).toBe(true)
    vi.runAllTimers()
    expect(opacity.value).toBe(1)
  })

  it('show is idempotent', () => {
    const { isShown, opacity, show } = mountComposable()
    show()
    show()
    vi.runAllTimers()
    expect(opacity.value).toBe(1)
    expect(isShown.value).toBe(true)
  })

  it('hide sets opacity to 0 and hides after timeout', () => {
    const { isShown, opacity, show, hide } = mountComposable(500)
    show()
    vi.runAllTimers()
    expect(isShown.value).toBe(true)
    expect(opacity.value).toBe(1)

    hide()
    expect(opacity.value).toBe(0)
    expect(isShown.value).toBe(true)

    vi.advanceTimersByTime(500)
    expect(isShown.value).toBe(false)
  })

  it('hide is idempotent when not shown', () => {
    const { isShown, opacity, hide } = mountComposable()
    hide()
    expect(isShown.value).toBe(false)
    expect(opacity.value).toBe(0)
  })

  it('hide clears previous timeout', () => {
    const { isShown, show, hide } = mountComposable(500)
    show()
    hide()
    hide()
    vi.advanceTimersByTime(500)
    expect(isShown.value).toBe(false)
  })

  it('handleClick scrolls to top', () => {
    const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const { handleClick } = mountComposable()
    handleClick()
    expect(scrollSpy).toHaveBeenCalledWith(0, 0)
  })

  it('clears timeout on unmount', () => {
    const clearSpy = vi.spyOn(globalThis, 'clearTimeout')
    const TestComp = defineComponent({
      setup() {
        const { show, hide } = useScrollToTop()
        show()
        hide()
        return {}
      },
      render() {
        return h('div')
      },
    })
    const wrapper = mount(TestComp)
    wrapper.unmount()
    expect(clearSpy).toHaveBeenCalled()
    clearSpy.mockRestore()
  })
})
