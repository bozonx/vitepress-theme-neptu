import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PostSimilarList from '../../../src/components/post/PostSimilarList.vue'
import {
  mockTheme,
  mockFrontmatter,
  mockRoute,
} from '../../mocks/vitepress'

const PreviewListStub = {
  name: 'PreviewList',
  template: '<div class="preview-list-stub"><slot /></div>',
  props: ['localePosts', 'curPage', 'perPage', 'paginationMaxItems'],
}

describe('PostSimilarList', () => {
  afterEach(() => {
    mockTheme.value = {
      perPage: 10,
      paginationMaxItems: 7,
      t: {
        similarPosts: 'Similar Posts',
        paginationToStart: 'To start',
        paginationToEnd: 'To end',
        tagBadgeCount: 'Posts count',
        postsCountForms: ['post', 'posts', 'posts'],
        links: { recent: 'Recent', popular: 'Popular' },
      },
      popularPosts: { enabled: false },
      similarPostsCount: 5,
      externalLinkIcon: true,
    }
    mockFrontmatter.value = {}
    mockRoute.value = { path: '/en/post/current' }
  })

  it('does not render when frontmatter has no tags', () => {
    mockFrontmatter.value = {}
    const wrapper = mount(PostSimilarList, {
      props: {
        localePosts: [
          { url: '/en/post/a', title: 'A', tags: [{ slug: 'js' }] },
        ],
      },
      global: { stubs: { PreviewList: PreviewListStub } },
    })
    expect(wrapper.find('.preview-list-stub').exists()).toBe(false)
    expect(wrapper.find('h2').exists()).toBe(false)
  })

  it('does not render when no similar posts are found', () => {
    mockFrontmatter.value = { tags: [{ slug: 'python' }] }
    mockRoute.value = { path: '/en/post/current' }
    const wrapper = mount(PostSimilarList, {
      props: {
        localePosts: [
          { url: '/en/post/a', title: 'A', tags: [{ slug: 'js' }] },
          { url: '/en/post/b', title: 'B', tags: [{ slug: 'ts' }] },
        ],
      },
      global: { stubs: { PreviewList: PreviewListStub } },
    })
    expect(wrapper.find('.preview-list-stub').exists()).toBe(false)
  })

  it('renders similar posts sorted by tag match', () => {
    mockFrontmatter.value = { tags: [{ slug: 'js' }] }
    mockRoute.value = { path: '/en/post/current' }
    const wrapper = mount(PostSimilarList, {
      props: {
        localePosts: [
          { url: '/en/post/a', title: 'A', tags: [{ slug: 'js' }, { slug: 'ts' }] },
          { url: '/en/post/b', title: 'B', tags: [{ slug: 'js' }] },
          { url: '/en/post/c', title: 'C', tags: [{ slug: 'rust' }] },
        ],
      },
      global: { stubs: { PreviewList: PreviewListStub } },
    })
    expect(wrapper.find('h2').text()).toBe('Similar Posts')
    const list = wrapper.findComponent(PreviewListStub)
    expect(list.exists()).toBe(true)
    expect(list.props('localePosts')).toHaveLength(2)
    expect(list.props('localePosts')[0].url).toBe('/en/post/a')
    expect(list.props('localePosts')[1].url).toBe('/en/post/b')
  })

  it('excludes the current post even with trailing slash difference', () => {
    mockFrontmatter.value = { tags: [{ slug: 'js' }] }
    mockRoute.value = { path: '/en/post/current/' }
    const wrapper = mount(PostSimilarList, {
      props: {
        localePosts: [
          { url: '/en/post/current', title: 'Current', tags: [{ slug: 'js' }] },
          { url: '/en/post/other', title: 'Other', tags: [{ slug: 'js' }] },
        ],
      },
      global: { stubs: { PreviewList: PreviewListStub } },
    })
    const list = wrapper.findComponent(PreviewListStub)
    expect(list.props('localePosts')).toHaveLength(1)
    expect(list.props('localePosts')[0].url).toBe('/en/post/other')
  })

  it('passes correct pagination props to PreviewList', () => {
    mockFrontmatter.value = { tags: [{ slug: 'js' }] }
    mockRoute.value = { path: '/en/post/current' }
    mockTheme.value.similarPostsCount = 3
    const wrapper = mount(PostSimilarList, {
      props: {
        localePosts: [
          { url: '/en/post/a', title: 'A', tags: [{ slug: 'js' }] },
          { url: '/en/post/b', title: 'B', tags: [{ slug: 'js' }] },
        ],
      },
      global: { stubs: { PreviewList: PreviewListStub } },
    })
    const list = wrapper.findComponent(PreviewListStub)
    expect(list.props('curPage')).toBe(1)
    expect(list.props('perPage')).toBe(3)
    expect(list.props('paginationMaxItems')).toBe(7)
  })

  it('uses popularity sortBy when popularPosts are enabled', () => {
    mockFrontmatter.value = { tags: [{ slug: 'js' }] }
    mockRoute.value = { path: '/en/post/current' }
    mockTheme.value.popularPosts = { enabled: true, sortBy: 'pageviews' }
    const wrapper = mount(PostSimilarList, {
      props: {
        localePosts: [
          { url: '/en/post/a', title: 'A', tags: [{ slug: 'js' }], analyticsStats: { pageviews: 10 } },
          { url: '/en/post/b', title: 'B', tags: [{ slug: 'js' }], analyticsStats: { pageviews: 50 } },
        ],
      },
      global: { stubs: { PreviewList: PreviewListStub } },
    })
    const list = wrapper.findComponent(PreviewListStub)
    // b has higher popularity (50) so it should come first when tag counts are equal
    expect(list.props('localePosts')[0].url).toBe('/en/post/b')
    expect(list.props('localePosts')[1].url).toBe('/en/post/a')
  })
})
