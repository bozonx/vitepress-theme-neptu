import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PreviewList from '../../../src/components/PreviewList.vue'

const PreviewListItemStub = {
  name: 'PreviewListItem',
  template: '<div class="preview-item-stub" />',
  props: ['item'],
}

const PaginationStub = {
  name: 'NeptuPagination',
  template: '<div class="pagination-stub" />',
  props: ['curPage', 'totalPages', 'paginationMaxItems', 'paginationBaseUrl'],
}

describe('PreviewList', () => {
  const posts = Array.from({ length: 25 }, (_, i) => ({
    url: `/post-${i + 1}`,
    title: `Post ${i + 1}`,
    date: '2024-01-01',
  }))

  it('renders first page items by default', () => {
    const wrapper = mount(PreviewList, {
      props: { localePosts: posts, curPage: 1, perPage: 10 },
      global: { stubs: { PreviewListItem: PreviewListItemStub, NeptuPagination: PaginationStub } },
    })
    expect(wrapper.findAllComponents({ name: 'PreviewListItem' })).toHaveLength(10)
  })

  it('renders second page items', () => {
    const wrapper = mount(PreviewList, {
      props: { localePosts: posts, curPage: 2, perPage: 10 },
      global: { stubs: { PreviewListItem: PreviewListItemStub, NeptuPagination: PaginationStub } },
    })
    expect(wrapper.findAllComponents({ name: 'PreviewListItem' })).toHaveLength(10)
  })

  it('updates rendered items when posts prop changes', async () => {
    const wrapper = mount(PreviewList, {
      props: { localePosts: posts.slice(0, 2), curPage: 1, perPage: 10 },
      global: { stubs: { PreviewListItem: PreviewListItemStub, NeptuPagination: PaginationStub } },
    })

    expect(wrapper.findAllComponents({ name: 'PreviewListItem' })).toHaveLength(2)

    await wrapper.setProps({ localePosts: posts.slice(0, 4) })

    expect(wrapper.findAllComponents({ name: 'PreviewListItem' })).toHaveLength(4)
  })

  it('renders last partial page', () => {
    const wrapper = mount(PreviewList, {
      props: { localePosts: posts, curPage: 3, perPage: 10 },
      global: { stubs: { PreviewListItem: PreviewListItemStub, NeptuPagination: PaginationStub } },
    })
    expect(wrapper.findAllComponents({ name: 'PreviewListItem' })).toHaveLength(5)
  })

  it('renders nothing when items array is empty', () => {
    const wrapper = mount(PreviewList, {
      props: { localePosts: [], curPage: 1 },
      global: { stubs: { PreviewListItem: PreviewListItemStub, NeptuPagination: PaginationStub } },
    })
    expect(wrapper.find('div').exists()).toBe(false)
  })

  it('shows pagination when totalPages > 1', () => {
    const wrapper = mount(PreviewList, {
      props: { localePosts: posts, curPage: 1, perPage: 10 },
      global: { stubs: { PreviewListItem: PreviewListItemStub, NeptuPagination: PaginationStub } },
    })
    expect(wrapper.findComponent({ name: 'NeptuPagination' }).exists()).toBe(true)
  })

  it('hides pagination when totalPages <= 1', () => {
    const wrapper = mount(PreviewList, {
      props: { localePosts: posts.slice(0, 5), curPage: 1, perPage: 10 },
      global: { stubs: { PreviewListItem: PreviewListItemStub, NeptuPagination: PaginationStub } },
    })
    expect(wrapper.findComponent({ name: 'NeptuPagination' }).exists()).toBe(false)
  })
})
