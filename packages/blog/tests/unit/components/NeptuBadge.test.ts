import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NeptuBadge from '../../../src/components/NeptuBadge.vue'

describe('NeptuBadge', () => {
  it('renders count prop', () => {
    const wrapper = mount(NeptuBadge, {
      props: { count: 5 },
    })
    expect(wrapper.text()).toBe('5')
  })

  it('renders string count', () => {
    const wrapper = mount(NeptuBadge, {
      props: { count: '12+' },
    })
    expect(wrapper.text()).toBe('12+')
  })

  it('applies title attribute', () => {
    const wrapper = mount(NeptuBadge, {
      props: { count: 3, title: 'Posts count' },
    })
    expect(wrapper.find('span').attributes('title')).toBe('Posts count')
  })

  it('has badge-item class', () => {
    const wrapper = mount(NeptuBadge, {
      props: { count: 1 },
    })
    expect(wrapper.find('span').classes()).toContain('badge-item')
  })
})
