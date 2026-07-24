import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PostTags from '../../../src/components/post/PostTags.vue'
import { mockFrontmatter, mockTheme } from '../../mocks/vitepress'

const TagsListStub = {
  name: 'TagsList',
  template: '<div class="tags-stub"><slot name="after" /></div>',
  props: ['tags'],
}

const NeptuBtnLinkStub = {
  name: 'NeptuBtnLink',
  template: '<a class="btn-link-stub"><slot /></a>',
  props: ['href', 'icon'],
}

describe('PostTags', () => {
  beforeEach(() => {
    mockFrontmatter.value = {}
    mockTheme.value = {
      tagsIcon: 'mdi:tag',
      t: { tags: 'Tags', allTagsCall: 'All tags' },
    }
  })

  it('renders nothing when no tags', () => {
    mockFrontmatter.value = {}
    const wrapper = mount(PostTags, {
      global: { stubs: { TagsList: TagsListStub, NeptuBtnLink: NeptuBtnLinkStub } },
    })
    expect(wrapper.find('div').exists()).toBe(false)
  })

  it('renders tags list and all-tags link', () => {
    mockFrontmatter.value = {
      tags: [
        { name: 'Vue', slug: 'vue' },
        { name: 'TypeScript', slug: 'ts' },
      ],
    }
    const wrapper = mount(PostTags, {
      global: { stubs: { TagsList: TagsListStub, NeptuBtnLink: NeptuBtnLinkStub } },
    })
    expect(wrapper.findComponent({ name: 'TagsList' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'NeptuBtnLink' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'TagsList' }).props('tags')).toHaveLength(2)
  })

  it('sorts tags alphabetically by name', () => {
    mockFrontmatter.value = {
      tags: [
        { name: 'Zebra', slug: 'zebra' },
        { name: 'Apple', slug: 'apple' },
      ],
    }
    const wrapper = mount(PostTags, {
      global: { stubs: { TagsList: TagsListStub, NeptuBtnLink: NeptuBtnLinkStub } },
    })
    const tagsProp = wrapper.findComponent({ name: 'TagsList' }).props('tags')
    expect(tagsProp[0].name).toBe('Apple')
    expect(tagsProp[1].name).toBe('Zebra')
  })
})
