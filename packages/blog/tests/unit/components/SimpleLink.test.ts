import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SimpleLink from '../../../src/components/SimpleLink.vue'
import { mockTheme } from '../../mocks/vitepress'

describe('SimpleLink', () => {
  beforeEach(() => {
    mockTheme.value = { externalLinkIcon: true }
  })

  it('renders as anchor with href', () => {
    const wrapper = mount(SimpleLink, {
      attrs: { href: '/page' },
      slots: { default: 'Link text' },
    })
    expect(wrapper.find('a').exists()).toBe(true)
    expect(wrapper.find('a').attributes('href')).toBe('/page')
    expect(wrapper.text()).toContain('Link text')
  })

  it('applies custom class', () => {
    const wrapper = mount(SimpleLink, {
      props: { customClass: 'extra-class' },
      attrs: { href: '/page' },
    })
    expect(wrapper.find('a').classes()).toContain('extra-class')
  })
})
