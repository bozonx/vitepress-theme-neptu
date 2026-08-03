import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SideBarCategories from '../../../src/components/layout-parts/SideBarCategories.vue'
import SideBarTags from '../../../src/components/layout-parts/SideBarTags.vue'
import { mockTheme } from '../../mocks/vitepress'
import type { PostLite } from '../../../src/types'

describe('SideBar Taxonomy Headers logic', () => {
  beforeEach(() => {
    mockTheme.value = {
      sidebarCategoriesCount: 10,
      sidebarTagsCount: 10,
      t: {
        categories: 'Categories',
        tags: 'Tags',
        allCategoriesCall: 'All categories',
        allTagsCall: 'All tags',
      },
    }
  })

  const postsWithCategoriesOnly: PostLite[] = [
    {
      id: '1',
      title: 'Post 1',
      date: '2026-01-01',
      categories: [{ name: 'Tech', slug: 'tech' }],
    },
  ]

  const postsWithTagsOnly: PostLite[] = [
    {
      id: '2',
      title: 'Post 2',
      date: '2026-01-01',
      tags: [{ name: 'Vue', slug: 'vue' }],
    },
  ]

  const postsWithBoth: PostLite[] = [
    {
      id: '3',
      title: 'Post 3',
      date: '2026-01-01',
      categories: [{ name: 'Tech', slug: 'tech' }],
      tags: [{ name: 'Vue', slug: 'vue' }],
    },
  ]

  it('hides header for SideBarCategories when only categories exist', () => {
    const wrapper = mount(SideBarCategories, {
      props: { localePosts: postsWithCategoriesOnly },
    })
    expect(wrapper.text()).not.toContain('Categories')
  })

  it('hides header for SideBarTags when only tags exist', () => {
    const wrapper = mount(SideBarTags, {
      props: { localePosts: postsWithTagsOnly },
    })
    expect(wrapper.text()).not.toContain('Tags')
  })

  it('shows header for SideBarCategories and SideBarTags when both exist', () => {
    const catWrapper = mount(SideBarCategories, {
      props: { localePosts: postsWithBoth },
    })
    expect(catWrapper.text()).toContain('Categories')

    const tagWrapper = mount(SideBarTags, {
      props: { localePosts: postsWithBoth },
    })
    expect(tagWrapper.text()).toContain('Tags')
  })

  it('respects explicit showHeader prop override', () => {
    const catWrapper = mount(SideBarCategories, {
      props: { localePosts: postsWithCategoriesOnly, showHeader: true },
    })
    expect(catWrapper.text()).toContain('Categories')

    const tagWrapper = mount(SideBarTags, {
      props: { localePosts: postsWithBoth, showHeader: false },
    })
    expect(tagWrapper.text()).not.toContain('Tags')
  })
})
