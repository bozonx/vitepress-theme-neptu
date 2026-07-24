import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AllTagsList from '../../../src/components/utility/AllTagsList.vue'
import { mockFrontmatter, mockLocaleIndex } from '../../mocks/vitepress'

describe('AllTagsList', () => {
  it('renders header and tag list from injected posts', () => {
    mockFrontmatter.value = { title: 'All Tags' }
    mockLocaleIndex.value = 'en'

    const posts = {
      en: [
        { url: '/p1', tags: [{ slug: 'vue', name: 'Vue' }] },
        { url: '/p2', tags: [{ slug: 'vue', name: 'Vue' }, { slug: 'js', name: 'JS' }] },
      ],
    }

    const wrapper = mount(AllTagsList, {
      global: {
        provide: {
          posts,
        },
      },
    })

    expect(wrapper.text()).toContain('All Tags')
    expect(wrapper.text()).toContain('Vue')
    expect(wrapper.text()).toContain('JS')
  })

  it('accepts explicit localePosts prop', () => {
    mockFrontmatter.value = { title: 'Tags' }
    mockLocaleIndex.value = 'en'

    const customPosts = [
      { url: '/p1', tags: [{ slug: 'testing', name: 'Testing' }] },
    ]

    const wrapper = mount(AllTagsList, {
      props: {
        localePosts: customPosts,
      },
    })

    expect(wrapper.text()).toContain('Testing')
  })
})
