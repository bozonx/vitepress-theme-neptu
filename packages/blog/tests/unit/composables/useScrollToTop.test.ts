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
      isButtonVisible: ref(false),
      opacity: ref(0),
      show: () => {},
      hide: () => {},
      handleClick: () => {},
    }
    const TestComp = defineComponent({
      setup() {
        const composable = animationMs !== undefined ? useScrollToTop(animationMs) : useScrollToTop()
        result.isButtonVisible = composable.isButtonVisible
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
    const { isButtonVisible, opacity } = mountComposable()
    expect(isButtonVisible.value).toBe(false)
    expect(opacity.value).toBe(0)
  })

  it('show sets isButtonVisible and transitions opacity', () => {
    const { isButtonVisible, opacity, show } = mountComposable()
    show()
    expect(isButtonVisible.value).toBe(true)
    vi.runAllTimers()
    expect(opacity.value).toBe(1)
  })

  it('show is idempotent', () => {
    const { isButtonVisible, opacity, show } = mountComposable()
    show()
    show()
    vi.runAllTimers()
    expect(opacity.value).toBe(1)
    expect(isButtonVisible.value).toBe(true)
  })

  it('hide sets opacity to 0 and hides after timeout', () => {
    const { isButtonVisible, opacity, show, hide } = mountComposable(500)
    show()
    vi.runAllTimers()
    expect(isButtonVisible.value).toBe(true)
    expect(opacity.value).toBe(1)

    hide()
    expect(opacity.value).toBe(0)
    expect(isButtonVisible.value).toBe(true)

    vi.advanceTimersByTime(500)
    expect(isButtonVisible.value).toBe(false)
  })

  it('hide is idempotent when not shown', () => {
    const { isButtonVisible, opacity, hide } = mountComposable()
    hide()
    expect(isButtonVisible.value).toBe(false)
    expect(opacity.value).toBe(0)
  })

  it('hide clears previous timeout', () => {
    const { isButtonVisible, show, hide } = mountComposable(500)
    show()
    hide()
    hide()
    vi.advanceTimersByTime(500)
    expect(isButtonVisible.value).toBe(false)
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
