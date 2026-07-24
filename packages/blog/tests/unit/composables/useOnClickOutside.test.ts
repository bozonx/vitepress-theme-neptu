import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useOnClickOutside } from '../../../src/composables/useOnClickOutside.ts'

describe('useOnClickOutside', () => {
  it('calls handler when pointerdown occurs outside target', () => {
    const handler = vi.fn()

    const TestComp = defineComponent({
      setup() {
        const target = ref<HTMLElement | null>(null)
        useOnClickOutside(target, handler)
        return () =>
          h('div', { id: 'container' }, [
            h('div', { id: 'inside', ref: target }, 'Inside'),
            h('div', { id: 'outside' }, 'Outside'),
          ])
      },
    })

    const wrapper = mount(TestComp, { attachTo: document.body })
    const outsideEl = wrapper.find('#outside').element

    const event = new PointerEvent('pointerdown', { bubbles: true })
    outsideEl.dispatchEvent(event)

    expect(handler).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })

  it('does not call handler when pointerdown occurs inside target', () => {
    const handler = vi.fn()

    const TestComp = defineComponent({
      setup() {
        const target = ref<HTMLElement | null>(null)
        useOnClickOutside(target, handler)
        return () =>
          h('div', { id: 'container' }, [
            h('div', { id: 'inside', ref: target }, 'Inside'),
          ])
      },
    })

    const wrapper = mount(TestComp, { attachTo: document.body })
    const insideEl = wrapper.find('#inside').element

    const event = new PointerEvent('pointerdown', { bubbles: true })
    insideEl.dispatchEvent(event)

    expect(handler).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('does nothing when target ref is null', () => {
    const handler = vi.fn()

    const TestComp = defineComponent({
      setup() {
        const target = ref<HTMLElement | null>(null)
        useOnClickOutside(target, handler)
        return () => h('div', { id: 'outside' }, 'Outside')
      },
    })

    const wrapper = mount(TestComp, { attachTo: document.body })
    const outsideEl = wrapper.find('#outside').element

    const event = new PointerEvent('pointerdown', { bubbles: true })
    outsideEl.dispatchEvent(event)

    expect(handler).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('removes event listener on unmount', () => {
    const handler = vi.fn()
    const removeSpy = vi.spyOn(document, 'removeEventListener')

    const TestComp = defineComponent({
      setup() {
        const target = ref<HTMLElement | null>(null)
        useOnClickOutside(target, handler)
        return () => h('div')
      },
    })

    const wrapper = mount(TestComp)
    wrapper.unmount()

    expect(removeSpy).toHaveBeenCalledWith('pointerdown', expect.any(Function), true)
  })

  it('supports custom document injection for isolated testing', () => {
    const handler = vi.fn()
    const customDoc = document.implementation.createHTMLDocument()

    const TestComp = defineComponent({
      setup() {
        const target = ref<HTMLElement | null>(null)
        useOnClickOutside(target, handler, customDoc)
        return () =>
          h('div', { id: 'container' }, [
            h('div', { id: 'inside', ref: target }, 'Inside'),
          ])
      },
    })

    const wrapper = mount(TestComp, { attachTo: customDoc.body })
    const outsideEl = customDoc.createElement('div')
    customDoc.body.appendChild(outsideEl)

    const event = new PointerEvent('pointerdown', { bubbles: true })
    outsideEl.dispatchEvent(event)

    expect(handler).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })
})
