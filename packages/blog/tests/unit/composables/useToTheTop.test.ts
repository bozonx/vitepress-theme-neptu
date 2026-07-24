import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useToTheTop } from '../../../src/composables/useToTheTop.ts'

describe('useToTheTop', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  function mountComposable(animationMs?: number) {
    const result = {
      showed: ref(false),
      opacity: ref(0),
      show: () => {},
      hide: () => {},
      handleClick: () => {},
    }
    const TestComp = defineComponent({
      setup() {
        const composable = animationMs !== undefined ? useToTheTop(animationMs) : useToTheTop()
        result.showed = composable.showed
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
    const { showed, opacity } = mountComposable()
    expect(showed.value).toBe(false)
    expect(opacity.value).toBe(0)
  })

  it('show sets showed and transitions opacity', () => {
    const { showed, opacity, show } = mountComposable()
    show()
    expect(showed.value).toBe(true)
    vi.runAllTimers()
    expect(opacity.value).toBe(1)
  })

  it('show is idempotent', () => {
    const { showed, opacity, show } = mountComposable()
    show()
    show()
    vi.runAllTimers()
    expect(opacity.value).toBe(1)
    expect(showed.value).toBe(true)
  })

  it('hide sets opacity to 0 and hides after timeout', () => {
    const { showed, opacity, show, hide } = mountComposable(500)
    show()
    vi.runAllTimers()
    expect(showed.value).toBe(true)
    expect(opacity.value).toBe(1)

    hide()
    expect(opacity.value).toBe(0)
    expect(showed.value).toBe(true)

    vi.advanceTimersByTime(500)
    expect(showed.value).toBe(false)
  })

  it('hide is idempotent when not shown', () => {
    const { showed, opacity, hide } = mountComposable()
    hide()
    expect(showed.value).toBe(false)
    expect(opacity.value).toBe(0)
  })

  it('hide clears previous timeout', () => {
    const { showed, show, hide } = mountComposable(500)
    show()
    hide()
    hide()
    vi.advanceTimersByTime(500)
    // After clearing timeout, showed should stay true because hide() already ran synchronously
    // Actually hide sets opacity=0 and starts timeout. Double hide should clear first timeout
    // and start second. After 500ms showed should become false.
    expect(showed.value).toBe(false)
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
        const { show, hide } = useToTheTop()
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
