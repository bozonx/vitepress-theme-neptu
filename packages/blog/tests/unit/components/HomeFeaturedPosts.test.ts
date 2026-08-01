import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeFeaturedPosts from '../../../src/components/utility/HomeFeaturedPosts.vue'
import { mockLocaleIndex, mockTheme } from '../../mocks/vitepress'

const PreviewListStub = {
  name: 'PreviewList',
  props: ['localePosts', 'curPage', 'perPage'],
  template: '<div class="preview-list-stub" />',
}
const HeaderStub = {
  name: 'UtilSubPageHeader',
  template: '<h2><slot /></h2>',
}

describe('HomeFeaturedPosts', () => {
  afterEach(() => {
    mockLocaleIndex.value = 'en'
    mockTheme.value = { t: { featuredPosts: 'Featured Posts' } }
  })

  it('renders only explicitly featured posts, newest first', () => {
    const wrapper = mount(HomeFeaturedPosts, {
      props: { maxPosts: 2 },
      global: {
        provide: {
          posts: {
            en: [
              { url: '/old', date: '2024-01-01', featured: true },
              { url: '/regular', date: '2024-03-01' },
              { url: '/new', date: '2024-02-01', featured: true },
            ],
          },
        },
        stubs: { PreviewList: PreviewListStub, UtilSubPageHeader: HeaderStub },
      },
    })
    expect(wrapper.find('h2').text()).toBe('Featured Posts')
    expect(wrapper.findComponent(PreviewListStub).props('localePosts')).toEqual([
      expect.objectContaining({ url: '/new' }),
      expect.objectContaining({ url: '/old' }),
    ])
  })

  it('renders nothing when no posts are featured', () => {
    const wrapper = mount(HomeFeaturedPosts, {
      props: { localePosts: [{ url: '/regular', date: '2024-01-01' }] },
      global: { stubs: { PreviewList: PreviewListStub, UtilSubPageHeader: HeaderStub } },
    })
    expect(wrapper.find('section').exists()).toBe(false)
  })
})
