import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { defineComponent, h, nextTick, provide, type ComputedRef, computed } from 'vue'
import { mount } from '@vue/test-utils'
import { useLightbox, useLightboxLocales, LightboxLocalesKey } from '../../../src/composables/useLightbox.ts'

vi.mock('vitepress', () => ({ inBrowser: true }))

describe('useLightbox', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  function mountComposable(doc: Document = document) {
    const result = { isOpen: false, currentIndex: 0, items: [], open: () => {}, close: () => {}, next: () => {}, prev: () => {} }
    const TestComp = defineComponent({
      setup() {
        const lb = useLightbox(doc)
        Object.assign(result, { isOpen: lb.isOpen, currentIndex: lb.currentIndex, items: lb.items, open: lb.open, close: lb.close, next: lb.next, prev: lb.prev })
        return () => h('div')
      },
    })
    mount(TestComp)
    return result as any
  }

  it('initializes with closed state and zero items', () => {
    const lb = mountComposable()
    expect(lb.isOpen.value).toBe(false)
    expect(lb.currentIndex.value).toBe(0)
    expect(lb.items.value).toEqual([])
  })

  it('opens at valid index', () => {
    document.body.innerHTML = '<a class="lightbox" href="/a.jpg"><img src="/a.jpg" alt="A" /></a>'
    const lb = mountComposable()
    lb.open(0)
    expect(lb.isOpen.value).toBe(true)
    expect(lb.currentIndex.value).toBe(0)
    expect(lb.items.value).toHaveLength(1)
  })

  it('ignores open for negative index', () => {
    document.body.innerHTML = '<a class="lightbox" href="/a.jpg"><img src="/a.jpg" alt="A" /></a>'
    const lb = mountComposable()
    lb.open(-1)
    expect(lb.isOpen.value).toBe(false)
  })

  it('ignores open for out-of-bounds index', () => {
    document.body.innerHTML = '<a class="lightbox" href="/a.jpg"><img src="/a.jpg" alt="A" /></a>'
    const lb = mountComposable()
    lb.open(5)
    expect(lb.isOpen.value).toBe(false)
  })

  it('cycles next through items', () => {
    document.body.innerHTML = '<a class="lightbox" href="/a.jpg"><img alt="A" /></a><a class="lightbox" href="/b.jpg"><img alt="B" /></a>'
    const lb = mountComposable()
    lb.open(0)
    lb.next()
    expect(lb.currentIndex.value).toBe(1)
    lb.next()
    expect(lb.currentIndex.value).toBe(0)
  })

  it('cycles prev through items', () => {
    document.body.innerHTML = '<a class="lightbox" href="/a.jpg"><img alt="A" /></a><a class="lightbox" href="/b.jpg"><img alt="B" /></a>'
    const lb = mountComposable()
    lb.open(0)
    lb.prev()
    expect(lb.currentIndex.value).toBe(1)
  })

  it('does not next/prev with single item', () => {
    document.body.innerHTML = '<a class="lightbox" href="/a.jpg"><img alt="A" /></a>'
    const lb = mountComposable()
    lb.open(0)
    lb.next()
    expect(lb.currentIndex.value).toBe(0)
    lb.prev()
    expect(lb.currentIndex.value).toBe(0)
  })

  it('closes lightbox', () => {
    document.body.innerHTML = '<a class="lightbox" href="/a.jpg"><img alt="A" /></a>'
    const lb = mountComposable()
    lb.open(0)
    lb.close()
    expect(lb.isOpen.value).toBe(false)
  })

  it('adds modal-open class on open', async () => {
    document.body.innerHTML = '<a class="lightbox" href="/a.jpg"><img alt="A" /></a>'
    const lb = mountComposable()
    lb.open(0)
    await nextTick()
    expect(document.body.classList.contains('modal-open')).toBe(true)
    lb.close()
    await nextTick()
    expect(document.body.classList.contains('modal-open')).toBe(false)
  })

  it('works with an injected Document instance', () => {
    const parser = new DOMParser()
    const fakeDoc = parser.parseFromString(
      '<a class="lightbox" href="/x.jpg"><img alt="X" /></a>',
      'text/html'
    )
    const lb = mountComposable(fakeDoc)
    lb.open(0)
    expect(lb.isOpen.value).toBe(true)
    expect(lb.items.value).toEqual([{ src: '/x.jpg', alt: 'X' }])
    expect(fakeDoc.body.classList.contains('modal-open')).toBe(true)
    lb.close()
    expect(fakeDoc.body.classList.contains('modal-open')).toBe(false)
  })
})

describe('useLightboxLocales', () => {
  it('returns empty object when no provider is present', () => {
    const TestComp = defineComponent({
      setup() {
        const locales = useLightboxLocales()
        return () => h('div', JSON.stringify(locales))
      },
    })
    const wrapper = mount(TestComp)
    expect(wrapper.text()).toBe('{}')
  })

  it('returns provided plain object', () => {
    const Child = defineComponent({
      setup() {
        const locales = useLightboxLocales()
        return () => h('div', `${locales.close},${locales.next}`)
      },
    })
    const Parent = defineComponent({
      setup() {
        provide(LightboxLocalesKey, { close: 'Close', next: 'Next' })
        return () => h(Child)
      },
    })
    const wrapper = mount(Parent)
    expect(wrapper.text()).toBe('Close,Next')
  })

  it('unwraps provided ComputedRef', () => {
    const Child = defineComponent({
      setup() {
        const locales = useLightboxLocales()
        return () => h('div', locales.prev)
      },
    })
    const Parent = defineComponent({
      setup() {
        const refLocales: ComputedRef<Record<string, string>> = computed(() => ({ prev: 'Previous' }))
        provide(LightboxLocalesKey, refLocales)
        return () => h(Child)
      },
    })
    const wrapper = mount(Parent)
    expect(wrapper.text()).toBe('Previous')
  })
})
