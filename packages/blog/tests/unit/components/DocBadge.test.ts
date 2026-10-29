import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Badge from '../../../src/components/doc-components/Badge.vue'

describe('DocBadge', () => {
  it('renders with default type "tip"', () => {
    const wrapper = mount(Badge, {
      props: { text: 'Default' },
    })
    expect(wrapper.classes()).toContain('VPBadge')
    expect(wrapper.classes()).toContain('tip')
    expect(wrapper.text()).toBe('Default')
  })

  it('renders with success type', () => {
    const wrapper = mount(Badge, {
      props: { type: 'success', text: 'Released' },
    })
    expect(wrapper.classes()).toContain('success')
    expect(wrapper.text()).toBe('Released')
  })

  it('renders all supported types', () => {
    const types = ['info', 'tip', 'warning', 'danger', 'success'] as const
    for (const type of types) {
      const wrapper = mount(Badge, {
        props: { type, text: type },
      })
      expect(wrapper.classes()).toContain(type)
    }
  })

  it('renders slot content over text prop', () => {
    const wrapper = mount(Badge, {
      props: { type: 'success', text: 'Fallback' },
      slots: { default: 'Slot content' },
    })
    expect(wrapper.text()).toBe('Slot content')
  })
})
