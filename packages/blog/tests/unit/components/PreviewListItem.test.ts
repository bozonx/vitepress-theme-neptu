import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PreviewListItem from '../../../src/components/PreviewListItem.vue'
import { mockTheme } from '../../mocks/vitepress'

const PreviewWithImageStub = {
  name: 'PreviewWithImage',
  template: '<div class="preview-stub" />',
  props: [
    'tags',
    'date',
    'localeDate',
    'preview',
    'authorName',
    'thumbnail',
    'coverHeight',
    'coverWidth',
    'showDate',
    'showTags',
    'showThumbnail',
    'showPreview',
  ],
}

describe('PreviewListItem', () => {
  beforeEach(() => {
    mockTheme.value = { postList: { showAuthor: false }, authors: [] }
  })

  it('renders title as link', () => {
    const wrapper = mount(PreviewListItem, {
      props: { item: { url: '/post-1', title: 'Hello' } },
      global: { stubs: { PreviewWithImage: PreviewWithImageStub } },
    })
    expect(wrapper.find('a').attributes('href')).toBe('/post-1')
    expect(wrapper.find('h2').text()).toBe('Hello')
  })

  it('trims preview text without changing punctuation', () => {
    const wrapper = mount(PreviewListItem, {
      props: { item: { url: '/p', preview: '  Some preview text.  ' } },
      global: { stubs: { PreviewWithImage: PreviewWithImageStub } },
    })
    const stub = wrapper.findComponent({ name: 'PreviewWithImage' })
    expect(stub.props('preview')).toBe('Some preview text.')
  })

  it('preserves existing trailing punctuation', () => {
    const wrapper = mount(PreviewListItem, {
      props: { item: { url: '/p', preview: 'Question?' } },
      global: { stubs: { PreviewWithImage: PreviewWithImageStub } },
    })
    const stub = wrapper.findComponent({ name: 'PreviewWithImage' })
    expect(stub.props('preview')).toBe('Question?')
  })

  it('passes undefined preview for empty string', () => {
    const wrapper = mount(PreviewListItem, {
      props: { item: { url: '/p', preview: '   ' } },
      global: { stubs: { PreviewWithImage: PreviewWithImageStub } },
    })
    const stub = wrapper.findComponent({ name: 'PreviewWithImage' })
    expect(stub.props('preview')).toBeUndefined()
  })

  it('passes author name when configured', () => {
    mockTheme.value = {
      postList: { showAuthor: true },
      authors: [{ id: 'alice', name: 'Alice' }],
    }
    const wrapper = mount(PreviewListItem, {
      props: { item: { url: '/p', authorId: 'alice' } },
      global: { stubs: { PreviewWithImage: PreviewWithImageStub } },
    })
    const stub = wrapper.findComponent({ name: 'PreviewWithImage' })
    expect(stub.props('authorName')).toBe('Alice')
  })

  it('passes author name by default when postList is missing', () => {
    mockTheme.value = { authors: [{ id: 'alice', name: 'Alice' }] }
    const wrapper = mount(PreviewListItem, {
      props: { item: { url: '/p', title: 'T', authorId: 'alice' } },
      global: { stubs: { PreviewWithImage: PreviewWithImageStub } },
    })
    const stub = wrapper.findComponent({ name: 'PreviewWithImage' })
    expect(stub.props('authorName')).toBe('Alice')
  })

  it('passes undefined author when author not found', () => {
    mockTheme.value = {
      postList: { showAuthor: true },
      authors: [{ id: 'bob', name: 'Bob' }],
    }
    const wrapper = mount(PreviewListItem, {
      props: { item: { url: '/p', authorId: 'alice' } },
      global: { stubs: { PreviewWithImage: PreviewWithImageStub } },
    })
    const stub = wrapper.findComponent({ name: 'PreviewWithImage' })
    expect(stub.props('authorName')).toBeUndefined()
  })

  it('passes postList flags to PreviewWithImage', () => {
    mockTheme.value = {
      postList: {
        showDate: false,
        showTags: false,
        showThumbnail: false,
        showPreview: false,
        showAuthor: false,
      },
    }
    const wrapper = mount(PreviewListItem, {
      props: { item: { url: '/p', title: 'T' } },
      global: { stubs: { PreviewWithImage: PreviewWithImageStub } },
    })
    const stub = wrapper.findComponent({ name: 'PreviewWithImage' })
    expect(stub.props('showDate')).toBe(false)
    expect(stub.props('showTags')).toBe(false)
    expect(stub.props('showThumbnail')).toBe(false)
    expect(stub.props('showPreview')).toBe(false)
  })

  it('passes coverHeight and coverWidth to PreviewWithImage', () => {
    const wrapper = mount(PreviewListItem, {
      props: { item: { url: '/p', title: 'T', coverHeight: 300, coverWidth: 600 } },
      global: { stubs: { PreviewWithImage: PreviewWithImageStub } },
    })
    const stub = wrapper.findComponent({ name: 'PreviewWithImage' })
    expect(stub.props('coverHeight')).toBe(300)
    expect(stub.props('coverWidth')).toBe(600)
  })

  it('computes localeDate from item date and lang', () => {
    const wrapper = mount(PreviewListItem, {
      props: { item: { url: '/p', title: 'T', date: '2024-06-15' } },
      global: { stubs: { PreviewWithImage: PreviewWithImageStub } },
    })
    const stub = wrapper.findComponent({ name: 'PreviewWithImage' })
    expect(stub.props('date')).toBe('2024-06-15')
    expect(stub.props('localeDate')).toBeDefined()
    expect(typeof stub.props('localeDate')).toBe('string')
  })
})
