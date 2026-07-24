import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TagsList from '../../../src/components/TagsList.vue'

const TagItemStub = {
  name: 'TagItem',
  template: '<span class="tag-item-stub"><slot /></span>',
  props: ['name', 'slug', 'count', 'sizeXl', 'sizeSm', 'activeCompareMethod'],
  emits: ['click'],
}

describe('TagsList', () => {
  it('renders nothing when tags array is empty', () => {
    const wrapper = mount(TagsList, {
      props: { tags: [] },
      global: { stubs: { TagItem: TagItemStub } },
    })
    expect(wrapper.find('ul').exists()).toBe(false)
  })

  it('renders list of tags', () => {
    const wrapper = mount(TagsList, {
      props: {
        tags: [
          { name: 'Vue', slug: 'vue', count: 5 },
          { name: 'TypeScript', slug: 'ts' },
        ],
      },
      global: { stubs: { TagItem: TagItemStub } },
    })
    const items = wrapper.findAllComponents({ name: 'TagItem' })
    expect(items).toHaveLength(2)
    expect(items[0].props('name')).toBe('Vue')
    expect(items[0].props('count')).toBe(5)
    expect(items[1].props('name')).toBe('TypeScript')
  })

  it('applies xl size class', () => {
    const wrapper = mount(TagsList, {
      props: { tags: [{ name: 'A', slug: 'a' }], sizeXl: true },
      global: { stubs: { TagItem: TagItemStub } },
    })
    expect(wrapper.find('ul').classes()).toContain('gap-x-3')
    expect(wrapper.find('ul').classes()).toContain('gap-y-4')
  })

  it('applies sm size class', () => {
    const wrapper = mount(TagsList, {
      props: { tags: [{ name: 'A', slug: 'a' }], sizeSm: true },
      global: { stubs: { TagItem: TagItemStub } },
    })
    expect(wrapper.find('ul').classes()).toContain('gap-x-2')
    expect(wrapper.find('ul').classes()).toContain('gap-y-3')
  })

  it('defaults to md size class', () => {
    const wrapper = mount(TagsList, {
      props: { tags: [{ name: 'A', slug: 'a' }] },
      global: { stubs: { TagItem: TagItemStub } },
    })
    expect(wrapper.find('ul').classes()).toContain('gap-x-2')
    expect(wrapper.find('ul').classes()).toContain('gap-y-3')
  })

  it('emits itemClick on tag click', () => {
    const wrapper = mount(TagsList, {
      props: { tags: [{ name: 'A', slug: 'a' }] },
      global: { stubs: { TagItem: TagItemStub } },
    })
    wrapper.findComponent({ name: 'TagItem' }).vm.$emit('click')
    expect(wrapper.emitted('itemClick')).toHaveLength(1)
  })

  it('applies custom class', () => {
    const wrapper = mount(TagsList, {
      props: { tags: [{ name: 'A', slug: 'a' }], class: 'my-class' },
      global: { stubs: { TagItem: TagItemStub } },
    })
    expect(wrapper.find('ul').classes()).toContain('my-class')
  })

  it('uses index as fallback key when slug and name are missing', () => {
    const wrapper = mount(TagsList, {
      props: { tags: [{ count: 1 }, { count: 2 }] },
      global: { stubs: { TagItem: TagItemStub } },
    })
    expect(wrapper.findAllComponents({ name: 'TagItem' })).toHaveLength(2)
  })
})
