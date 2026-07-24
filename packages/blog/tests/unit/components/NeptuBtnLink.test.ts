import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NeptuBtnLink from '../../../src/components/NeptuBtnLink.vue'

describe('NeptuBtnLink', () => {
  it('renders NeptuBtn with link classes', () => {
    const wrapper = mount(NeptuBtnLink, {
      attrs: { href: '/page' },
      slots: { default: 'Click me' },
    })
    const btn = wrapper.findComponent({ name: 'NeptuBtn' })
    expect(btn.exists()).toBe(true)
    expect(btn.props('href')).toBe('/page')
    const classes = btn.props('customClass') as (string | undefined)[]
    expect(classes.some((c) => c && c.includes('btn-link'))).toBe(true)
  })

  it('applies extra custom class', () => {
    const wrapper = mount(NeptuBtnLink, {
      props: { customClass: 'underline' },
      attrs: { href: '/page' },
    })
    const btn = wrapper.findComponent({ name: 'NeptuBtn' })
    const classes = btn.props('customClass') as (string | undefined)[]
    expect(classes).toContain('underline')
  })
})
