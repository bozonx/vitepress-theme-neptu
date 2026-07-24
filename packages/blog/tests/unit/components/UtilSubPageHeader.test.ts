import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtilSubPageHeader from '../../../src/components/utility/UtilSubPageHeader.vue'

describe('UtilSubPageHeader', () => {
  it('renders slot content inside h2 with correct classes', () => {
    const wrapper = mount(UtilSubPageHeader, {
      slots: { default: 'Sub Title' },
    })
    const h2 = wrapper.find('h2')
    expect(h2.exists()).toBe(true)
    expect(h2.classes()).toContain('font-bold')
    expect(h2.classes()).toContain('mb-2')
    expect(h2.text()).toBe('Sub Title')
  })
})
