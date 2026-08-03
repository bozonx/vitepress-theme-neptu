import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeCategories from '../../../src/components/utility/HomeCategories.vue'
import { mockLocaleIndex, mockTheme } from '../../mocks/vitepress'

const TagsListStub = {
  name: 'TagsList',
  props: ['tags', 'kind'],
  template: '<div class="tags-list-stub" />',
}
const HeaderStub = {
  name: 'UtilSubPageHeader',
  template: '<h2><slot /></h2>',
}

describe('HomeCategories', () => {
  afterEach(() => {
    mockLocaleIndex.value = 'en'
    mockTheme.value = { t: { categories: 'Categories' } }
  })

  it('renders category list with correct kind and header', () => {
    const wrapper = mount(HomeCategories, {
      props: { header: 'Categories', limit: 5 },
      global: {
        provide: {
          posts: {
            en: [
              { url: '/p1', categories: [{ name: 'Tech', slug: 'tech' }, { name: 'News', slug: 'news' }] },
              { url: '/p2', categories: [{ name: 'Tech', slug: 'tech' }] },
            ],
          },
        },
        stubs: { TagsList: TagsListStub, UtilSubPageHeader: HeaderStub },
      },
    })
    expect(wrapper.find('h2').text()).toBe('Categories')
    const listStub = wrapper.findComponent(TagsListStub)
    expect(listStub.props('kind')).toBe('category')
    expect(listStub.props('tags')).toEqual([
      { name: 'Tech', slug: 'tech', count: 2 },
      { name: 'News', slug: 'news', count: 1 },
    ])
  })

  it('renders nothing when there are no categories', () => {
    const wrapper = mount(HomeCategories, {
      props: { header: 'Categories', localePosts: [] },
      global: { stubs: { TagsList: TagsListStub, UtilSubPageHeader: HeaderStub } },
    })
    expect(wrapper.find('section').exists()).toBe(false)
  })
})
