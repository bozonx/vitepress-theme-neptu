import { describe, expect, it, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TagPostsList from '../../../src/components/utility/TagPostsList.vue'
import { mockFrontmatter, mockLocaleIndex, mockTheme } from '../../mocks/vitepress'

const ListPageHeaderStub = {
  name: 'ListPageHeader',
  props: ['baseUrl', 'showPopularPostsSwitch'],
  template: '<header class="list-page-header-stub"><slot /></header>',
}

const PreviewListStub = {
  name: 'PreviewList',
  props: [
    'localePosts',
    'curPage',
    'perPage',
    'paginationMaxItems',
  ],
  template: '<div class="preview-list-stub" />',
}

const NeptuBtnLinkStub = {
  name: 'NeptuBtnLink',
  props: ['href', 'icon'],
  template: '<a class="btn-link-stub"><slot /></a>',
}

describe('TagPostsList', () => {
  beforeEach(() => {
    mockLocaleIndex.value = 'en'
    mockFrontmatter.value = { title: 'Tag page' }
    mockTheme.value = {
      ...mockTheme.value,
      tagsIcon: 'tag',
      t: { ...mockTheme.value.t, allTagsCall: 'All tags' },
      popularPosts: { enabled: false },
    }
  })

  it('filters posts by tag name', () => {
    const posts = [
      { url: '/a', tags: [{ name: 'Vue', slug: 'vue' }] },
      { url: '/b', tags: [{ name: 'React', slug: 'react' }] },
    ]

    const wrapper = mount(TagPostsList, {
      props: {
        localePosts: posts,
        curPage: 1,
        tagName: 'Vue',
        tagSlug: 'vue',
      },
      global: {
        stubs: {
          ListPageHeader: ListPageHeaderStub,
          PreviewList: PreviewListStub,
          NeptuBtnLink: NeptuBtnLinkStub,
        },
      },
    })

    expect(wrapper.findComponent({ name: 'PreviewList' }).props('localePosts')).toEqual([
      posts[0],
    ])
    expect(wrapper.findComponent({ name: 'ListPageHeader' }).props('baseUrl')).toBe(
      '/en/tags/vue'
    )
  })

  it('handles temporarily missing tag params without prop warnings', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const wrapper = mount(TagPostsList, {
      props: {
        localePosts: [{ url: '/a', tags: [{ name: 'Vue', slug: 'vue' }] }],
        curPage: 1,
      },
      global: {
        stubs: {
          ListPageHeader: ListPageHeaderStub,
          PreviewList: PreviewListStub,
          NeptuBtnLink: NeptuBtnLinkStub,
        },
      },
    })

    expect(wrapper.findComponent({ name: 'PreviewList' }).props('localePosts')).toEqual([])
    expect(wrapper.findComponent({ name: 'ListPageHeader' }).props('baseUrl')).toBe(
      '/en/tags'
    )
    expect(warnSpy).not.toHaveBeenCalled()

    warnSpy.mockRestore()
  })

  it('passes a locale-relative href to the "all tags" button', () => {
    const wrapper = mount(TagPostsList, {
      props: {
        localePosts: [{ url: '/a', tags: [{ name: 'Vue', slug: 'vue' }] }],
        curPage: 1,
        tagName: 'Vue',
        tagSlug: 'vue',
      },
      global: {
        stubs: {
          ListPageHeader: ListPageHeaderStub,
          PreviewList: PreviewListStub,
          NeptuBtnLink: NeptuBtnLinkStub,
        },
      },
    })

    expect(wrapper.findComponent({ name: 'NeptuBtnLink' }).props('href')).toBe('tags')
  })
})
