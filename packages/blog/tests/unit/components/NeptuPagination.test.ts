import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import NeptuPagination from '../../../src/components/NeptuPagination.vue'
import { mockTheme, mockRoute } from '../../mocks/vitepress'

describe('NeptuPagination', () => {
  beforeEach(() => {
    mockTheme.value = {
      paginationMaxItems: 7,
      t: {
        paginationToStart: 'To start',
        paginationToEnd: 'To end',
      },
    }
    mockRoute.value = { path: '/en/blog/1' }
  })

  it('renders nothing when totalPages is 1', () => {
    const wrapper = mount(NeptuPagination, {
      props: { curPage: 1, totalPages: 1 },
    })
    expect(wrapper.find('ul').exists()).toBe(false)
  })

  it('renders nothing when curPage is out of range', () => {
    const wrapper = mount(NeptuPagination, {
      props: { curPage: 0, totalPages: 5 },
    })
    expect(wrapper.find('ul').exists()).toBe(false)
  })

  it('renders page numbers within maxItems window', () => {
    const wrapper = mount(NeptuPagination, {
      props: { curPage: 3, totalPages: 10, paginationMaxItems: 5 },
    })
    const btns = wrapper.findAllComponents({ name: 'NeptuBtn' })
    // 5 page numbers + to-end button
    expect(btns.length).toBe(6)
    expect(btns[0].props('text')).toBe('1')
    expect(btns[1].props('text')).toBe('2')
    expect(btns[2].props('text')).toBe('3')
    expect(btns[3].props('text')).toBe('4')
    expect(btns[4].props('text')).toBe('5')
  })

  it('shows to-start button when first page is not visible', () => {
    const wrapper = mount(NeptuPagination, {
      props: { curPage: 5, totalPages: 10, paginationMaxItems: 5 },
    })
    const btns = wrapper.findAllComponents({ name: 'NeptuBtn' })
    // to-start + 5 page numbers + to-end
    expect(btns.length).toBe(7)
    expect(btns[0].props('icon')).toBe('mdi:page-first')
    expect(btns[0].props('href')).toBe('/en/blog/1')
  })

  it('shows to-end button when last page is not visible', () => {
    const wrapper = mount(NeptuPagination, {
      props: { curPage: 2, totalPages: 10, paginationMaxItems: 5 },
    })
    const btns = wrapper.findAllComponents({ name: 'NeptuBtn' })
    // 4 page numbers + to-end
    expect(btns.length).toBe(5)
    const last = btns[btns.length - 1]
    expect(last.props('icon')).toBe('mdi:page-last')
    expect(last.props('href')).toBe('/en/blog/10')
  })

  it('uses paginationBaseUrl prop when provided', () => {
    const wrapper = mount(NeptuPagination, {
      props: { curPage: 1, totalPages: 3, paginationBaseUrl: '/custom' },
    })
    const btns = wrapper.findAllComponents({ name: 'NeptuBtn' })
    expect(btns[0].props('href')).toBe('/custom/1')
  })

  it('derives baseUrl from route path when prop is absent', () => {
    mockRoute.value = { path: '/en/tags/vue/2' }
    const wrapper = mount(NeptuPagination, {
      props: { curPage: 1, totalPages: 3 },
    })
    const btns = wrapper.findAllComponents({ name: 'NeptuBtn' })
    expect(btns[0].props('href')).toBe('/en/tags/vue/1')
  })

  it('falls back to theme paginationMaxItems', () => {
    mockTheme.value.paginationMaxItems = 5
    const wrapper = mount(NeptuPagination, {
      props: { curPage: 1, totalPages: 10 },
    })
    const btns = wrapper.findAllComponents({ name: 'NeptuBtn' })
    // 3 page numbers + to-end
    expect(btns.length).toBe(4)
  })

  it('centers window around current page for odd maxItems', () => {
    const wrapper = mount(NeptuPagination, {
      props: { curPage: 5, totalPages: 10, paginationMaxItems: 5 },
    })
    const btns = wrapper.findAllComponents({ name: 'NeptuBtn' })
    // to-start + [3,4,5,6,7] + to-end
    expect(btns.length).toBe(7)
    expect(btns[1].props('text')).toBe('3')
    expect(btns[3].props('text')).toBe('5')
    expect(btns[5].props('text')).toBe('7')
  })
})
