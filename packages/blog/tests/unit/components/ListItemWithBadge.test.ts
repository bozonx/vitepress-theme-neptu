import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ListItemWithBadge from '../../../src/components/ListItemWithBadge.vue'

describe('ListItemWithBadge', () => {
  it('renders text and badge when count is a number', () => {
    const wrapper = mount(ListItemWithBadge, {
      props: { text: 'Posts', count: 5 },
    })
    expect(wrapper.text()).toContain('Posts')
    const badge = wrapper.findComponent({ name: 'NeptuBadge' })
    expect(badge.exists()).toBe(true)
    expect(badge.props('count')).toBe(5)
  })

  it('hides badge when count is not provided', () => {
    const wrapper = mount(ListItemWithBadge, {
      props: { text: 'Posts' },
    })
    expect(wrapper.findComponent({ name: 'NeptuBadge' }).exists()).toBe(false)
    expect(wrapper.text()).toContain('Posts')
  })

  it('passes attributes to SimpleLink', () => {
    const wrapper = mount(ListItemWithBadge, {
      attrs: { href: '/posts' },
      props: { text: 'Posts' },
    })
    const link = wrapper.findComponent({ name: 'SimpleLink' })
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('/posts')
  })

  it('applies custom class to SimpleLink', () => {
    const wrapper = mount(ListItemWithBadge, {
      props: { text: 'Tags' },
    })
    expect(wrapper.find('a').classes()).toContain('no-underline')
    expect(wrapper.find('a').classes()).toContain('text-2xl')
  })
})
