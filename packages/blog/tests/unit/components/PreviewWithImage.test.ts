import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PreviewWithImage from '../../../src/components/PreviewWithImage.vue'

const TagsListStub = {
  name: 'TagsList',
  template:
    '<ul class="tags-list-stub"><li v-for="t in tags" :key="t.slug">{{ t.name }}</li></ul>',
  props: ['tags', 'class', 'sizeSm', 'activeCompareMethod'],
}

describe('PreviewWithImage', () => {
  it('renders thumbnail layout when thumbnail is provided', () => {
    const wrapper = mount(PreviewWithImage, {
      props: {
        thumbnail: '/img/cover.jpg',
        date: '2024-01-01',
        localeDate: 'January 1, 2024',
        authorName: 'Alice',
        preview: 'Preview text',
        tags: [{ name: 'Vue', slug: 'vue' }],
      },
      global: { stubs: { TagsList: TagsListStub } },
    })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/img/cover.jpg')
    expect(img.attributes('alt')).toBe('')
    expect(wrapper.find('p.card-item-description').text()).toBe('Preview text')
    expect(wrapper.find('.card-item-author-date').text()).toContain('Alice')
    expect(wrapper.find('.card-item-author-date').text()).toContain(
      'January 1, 2024'
    )
    expect(wrapper.findComponent({ name: 'TagsList' }).exists()).toBe(true)
  })

  it('renders no-thumbnail layout when thumbnail is absent', () => {
    const wrapper = mount(PreviewWithImage, {
      props: {
        preview: 'No image preview',
        date: '2024-01-01',
        localeDate: 'Jan 1',
        authorName: 'Bob',
        tags: [],
      },
      global: { stubs: { TagsList: TagsListStub } },
    })
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('No image preview')
    expect(wrapper.text()).toContain('Bob')
    expect(wrapper.text()).toContain('Jan 1')
  })

  it('hides author and date when not provided', () => {
    const wrapper = mount(PreviewWithImage, {
      props: { thumbnail: '/img.jpg' },
      global: { stubs: { TagsList: TagsListStub } },
    })
    expect(wrapper.find('time').exists()).toBe(false)
    expect(wrapper.find('span').exists()).toBe(false)
  })

  it('uses coverHeight and coverWidth on image', () => {
    const wrapper = mount(PreviewWithImage, {
      props: { thumbnail: '/img.jpg', coverHeight: 200, coverWidth: 300 },
      global: { stubs: { TagsList: TagsListStub } },
    })
    const img = wrapper.find('img')
    expect(img.attributes('height')).toBe('200')
    expect(img.attributes('width')).toBe('300')
  })

  it('does not render preview paragraph when preview is absent', () => {
    const wrapper = mount(PreviewWithImage, {
      props: { thumbnail: '/img.jpg' },
      global: { stubs: { TagsList: TagsListStub } },
    })
    expect(wrapper.find('.card-item-description').exists()).toBe(false)
  })

  it('hides thumbnail layout when showThumbnail is false', () => {
    const wrapper = mount(PreviewWithImage, {
      props: {
        thumbnail: '/img.jpg',
        showThumbnail: false,
        preview: 'Preview text',
      },
      global: { stubs: { TagsList: TagsListStub } },
    })
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.card-item-description').text()).toBe('Preview text')
  })

  it('hides preview, tags, and date when disabled', () => {
    const wrapper = mount(PreviewWithImage, {
      props: {
        preview: 'Preview text',
        date: '2024-01-01',
        localeDate: 'Jan 1',
        tags: [{ name: 'Vue', slug: 'vue' }],
        showPreview: false,
        showTags: false,
        showDate: false,
      },
      global: { stubs: { TagsList: TagsListStub } },
    })
    expect(wrapper.find('.card-item-description').exists()).toBe(false)
    expect(wrapper.findComponent({ name: 'TagsList' }).exists()).toBe(false)
    expect(wrapper.find('time').exists()).toBe(false)
  })
})
