import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useBreakpoint } from '../../../src/composables/useBreakpoint.ts'

vi.mock('vitepress', async (importOriginal) => ({
  ...(await importOriginal<typeof import('vitepress')>()),
  inBrowser: true,
}))

describe('useBreakpoint', () => {
  const originalInnerWidth = window.innerWidth

  beforeEach(() => {
    window.innerWidth = 1024
  })

  afterEach(() => {
    window.innerWidth = originalInnerWidth
    vi.restoreAllMocks()
  })

  function mountComposable(breakpoint?: number) {
    const result = { windowWidth: ref(0), isMobile: ref(true) }
    const TestComp = defineComponent({
      setup() {
        const composable = breakpoint !== undefined ? useBreakpoint(breakpoint) : useBreakpoint()
        result.windowWidth = composable.windowWidth
        result.isMobile = composable.isMobile
        return () => h('div')
      },
    })
    mount(TestComp)
    return result
  }

  it('defaults to MOBILE_BREAKPOINT (1024)', () => {
    const { isMobile } = mountComposable()
    expect(isMobile.value).toBe(false)
  })

  it('is mobile when width < breakpoint', () => {
    window.innerWidth = 500
    const { isMobile } = mountComposable()
    expect(isMobile.value).toBe(true)
  })

  it('is not mobile when width === breakpoint', () => {
    window.innerWidth = 1024
    const { isMobile } = mountComposable()
    expect(isMobile.value).toBe(false)
  })

  it('is not mobile when width > breakpoint', () => {
    window.innerWidth = 1200
    const { isMobile } = mountComposable()
    expect(isMobile.value).toBe(false)
  })

  it('accepts custom breakpoint', () => {
    window.innerWidth = 800
    const { isMobile } = mountComposable(900)
    expect(isMobile.value).toBe(true)

    window.innerWidth = 1000
    window.dispatchEvent(new Event('resize'))
    expect(isMobile.value).toBe(false)
  })

  it('updates on window resize', async () => {
    const { isMobile } = mountComposable()
    expect(isMobile.value).toBe(false)

    window.innerWidth = 500
    window.dispatchEvent(new Event('resize'))

    expect(isMobile.value).toBe(true)
  })

  it('removes listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')

    const TestComp = defineComponent({
      setup() {
        useBreakpoint()
        return () => h('div')
      },
    })
    const wrapper = mount(TestComp)
    wrapper.unmount()

    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function))
  })

  it('supports custom window injection for isolated testing', () => {
    const listeners: Record<string, EventListener> = {}
    const mockWinObj = {
      innerWidth: 600,
      addEventListener: vi.fn((type: string, fn: EventListener) => {
        listeners[type] = fn
      }),
      removeEventListener: vi.fn(),
    }
    const mockWin = mockWinObj as unknown as Window

    const TestComp = defineComponent({
      setup() {
        const { windowWidth, isMobile } = useBreakpoint(800, mockWin)
        return () => h('div', `${windowWidth.value}-${isMobile.value}`)
      },
    })

    const wrapper = mount(TestComp)
    expect(wrapper.text()).toBe('600-true')

    mockWinObj.innerWidth = 900
    listeners.resize?.(new Event('resize'))
    expect(mockWin.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function))
    wrapper.unmount()
    expect(mockWin.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function))
  })
})
