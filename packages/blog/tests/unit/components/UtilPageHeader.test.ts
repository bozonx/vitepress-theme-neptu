import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtilPageHeader from '../../../src/components/utility/UtilPageHeader.vue'

describe('UtilPageHeader', () => {
  it('renders slot content inside h1 with correct classes', () => {
    const wrapper = mount(UtilPageHeader, {
      slots: { default: 'Page Title' },
    })
    const h1 = wrapper.find('h1')
    expect(h1.exists()).toBe(true)
    expect(h1.classes()).toContain('font-bold')
    expect(h1.classes()).toContain('mb-2')
    expect(h1.text()).toBe('Page Title')
  })
})
