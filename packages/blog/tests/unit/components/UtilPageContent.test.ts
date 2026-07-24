import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtilPageContent from '../../../src/components/utility/UtilPageContent.vue'

describe('UtilPageContent', () => {
  it('renders slot content inside vp-doc div', () => {
    const wrapper = mount(UtilPageContent, {
      slots: { default: '<p>Hello content</p>' },
    })
    const div = wrapper.find('div')
    expect(div.exists()).toBe(true)
    expect(div.classes()).toContain('vp-doc')
    expect(div.html()).toContain('Hello content')
  })
})
