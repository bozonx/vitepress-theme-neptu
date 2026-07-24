import { describe, it, expect, vi, afterEach } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useScrollY } from '../../../src/composables/useScrollY.ts'

vi.mock('vitepress', () => ({ inBrowser: true }))

describe('useScrollY', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    window.scrollY = 0
  })

  function mountComposable() {
    const result = { scrollY: ref(0) }
    const TestComp = defineComponent({
      setup() {
        const composable = useScrollY()
        result.scrollY = composable.scrollY
        return () => h('div')
      },
    })
    mount(TestComp)
    return result
  }

  it('initializes with current scrollY', () => {
    window.scrollY = 150
    const { scrollY } = mountComposable()
    expect(scrollY.value).toBe(150)
  })

  it('updates on scroll event', async () => {
    window.scrollY = 0
    const { scrollY } = mountComposable()
    expect(scrollY.value).toBe(0)

    window.scrollY = 200
    window.dispatchEvent(new Event('scroll'))

    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(scrollY.value).toBe(200)
  })

  it('uses requestAnimationFrame', async () => {
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0)
      return 0
    })

    mountComposable()
    window.scrollY = 300
    window.dispatchEvent(new Event('scroll'))

    expect(rafSpy).toHaveBeenCalled()
  })

  it('removes listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')

    const TestComp = defineComponent({
      setup() {
        useScrollY()
        return () => h('div')
      },
    })
    const wrapper = mount(TestComp)
    wrapper.unmount()

    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
  })
})
