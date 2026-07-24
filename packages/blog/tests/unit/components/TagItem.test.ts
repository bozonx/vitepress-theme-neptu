import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TagItem from '../../../src/components/TagItem.vue'
import { mockTheme } from '../../mocks/vitepress'

const BaseLinkStub = {
  name: 'BaseLink',
  template: '<a><slot /></a>',
  props: ['href', 'customClass', 'activeCompareMethod'],
}

const NeptuBadgeStub = {
  name: 'NeptuBadge',
  template: '<span class="badge-stub" />',
  props: ['count', 'title'],
}

describe('TagItem', () => {
  beforeEach(() => {
    mockTheme.value = { t: { tagBadgeCount: 'Posts' } }
  })

  it('renders with computed href', () => {
    const wrapper = mount(TagItem, {
      props: { name: 'Vue', slug: 'vue' },
      global: { stubs: { BaseLink: BaseLinkStub, NeptuBadge: NeptuBadgeStub } },
    })
    expect(wrapper.findComponent({ name: 'BaseLink' }).props('href')).toBe('tags/vue/1')
    expect(wrapper.text()).toContain('Vue')
  })

  it('applies xl size class', () => {
    const wrapper = mount(TagItem, {
      props: { name: 'Vue', slug: 'vue', sizeXl: true },
      global: { stubs: { BaseLink: BaseLinkStub, NeptuBadge: NeptuBadgeStub } },
    })
    expect(wrapper.find('a').classes()).toContain('text-xl')
  })

  it('applies sm size class', () => {
    const wrapper = mount(TagItem, {
      props: { name: 'Vue', slug: 'vue', sizeSm: true },
      global: { stubs: { BaseLink: BaseLinkStub, NeptuBadge: NeptuBadgeStub } },
    })
    expect(wrapper.find('a').classes()).toContain('text-sm')
  })

  it('renders badge when count is provided', () => {
    const wrapper = mount(TagItem, {
      props: { name: 'Vue', slug: 'vue', count: 5 },
      global: { stubs: { BaseLink: BaseLinkStub, NeptuBadge: NeptuBadgeStub } },
    })
    expect(wrapper.findComponent({ name: 'NeptuBadge' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'NeptuBadge' }).props('count')).toBe(5)
  })

  it('does not render badge when count is absent', () => {
    const wrapper = mount(TagItem, {
      props: { name: 'Vue', slug: 'vue' },
      global: { stubs: { BaseLink: BaseLinkStub, NeptuBadge: NeptuBadgeStub } },
    })
    expect(wrapper.findComponent({ name: 'NeptuBadge' }).exists()).toBe(false)
  })

  it('passes activeCompareMethod to BaseLink', () => {
    const wrapper = mount(TagItem, {
      props: { name: 'Vue', slug: 'vue', activeCompareMethod: 'softPagination' },
      global: { stubs: { BaseLink: BaseLinkStub, NeptuBadge: NeptuBadgeStub } },
    })
    expect(wrapper.findComponent({ name: 'BaseLink' }).props('activeCompareMethod')).toBe('softPagination')
  })
})
