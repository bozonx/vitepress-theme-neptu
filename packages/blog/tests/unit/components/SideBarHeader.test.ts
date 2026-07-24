import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SideBarHeader from '../../../src/components/layout-parts/SideBarHeader.vue'

describe('SideBarHeader', () => {
  it('renders text prop inside h4', () => {
    const wrapper = mount(SideBarHeader, {
      props: { text: 'Tags' },
    })
    const h4 = wrapper.find('h4')
    expect(h4.exists()).toBe(true)
    expect(h4.classes()).toContain('font-bold')
    expect(h4.text()).toBe('Tags')
  })

  it('renders empty when no text prop', () => {
    const wrapper = mount(SideBarHeader)
    expect(wrapper.find('h4').exists()).toBe(true)
    expect(wrapper.text()).toBe('')
  })
})
