import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Badge from '../../../src/components/NeptuBadge.vue'

describe('Badge', () => {
  it('renders numeric count', () => {
    const wrapper = mount(Badge, { props: { count: 42 } })
    expect(wrapper.text()).toBe('42')
  })

  it('renders string count', () => {
    const wrapper = mount(Badge, { props: { count: '10+' } })
    expect(wrapper.text()).toBe('10+')
  })

  it('sets title attribute', () => {
    const wrapper = mount(Badge, { props: { count: 5, title: 'Five items' } })
    expect(wrapper.find('span').attributes('title')).toBe('Five items')
  })

  it('renders empty when no count provided', () => {
    const wrapper = mount(Badge)
    expect(wrapper.text()).toBe('')
  })
})
