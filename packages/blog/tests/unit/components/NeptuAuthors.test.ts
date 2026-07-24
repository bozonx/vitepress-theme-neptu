import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import NeptuAuthors from '../../../src/components/utility/NeptuAuthors.vue'
import { mockTheme, mockFrontmatter, mockLocaleIndex } from '../../mocks/vitepress'

describe('NeptuAuthors', () => {
  beforeEach(() => {
    mockTheme.value = {
      authors: [
        { id: 'john', name: 'John', description: 'Writer' },
        { id: 'jane', name: 'Jane', description: 'Editor' },
      ],
      t: {
        postsCountForms: ['post', 'posts'],
      },
    }
    mockFrontmatter.value = { title: 'Authors' }
    mockLocaleIndex.value = 'en'
  })

  it('renders authors list from injected posts', () => {
    const posts = {
      en: [
        { url: '/a', authorId: 'john' },
        { url: '/b', authorId: 'john' },
        { url: '/c', authorId: 'jane' },
      ],
    }
    const wrapper = mount(NeptuAuthors, {
      global: {
        provide: { posts },
      },
    })
    expect(wrapper.find('h1').text()).toBe('Authors')
    const items = wrapper.findAllComponents({ name: 'AuthorItem' })
    expect(items.length).toBe(2)
  })

  it('renders empty list when no posts', () => {
    const wrapper = mount(NeptuAuthors, {
      global: {
        provide: { posts: {} },
      },
    })
    expect(wrapper.find('ul').exists()).toBe(true)
    expect(wrapper.findAll('li').length).toBe(0)
  })
})
