import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PostAuthor from '../../../src/components/post/PostAuthor.vue'
import { mockFrontmatter, mockTheme } from '../../mocks/vitepress'

const SimpleLinkStub = {
  name: 'SimpleLink',
  template: '<a class="simple-link-stub"><slot /></a>',
  props: ['href'],
}

describe('PostAuthor', () => {
  beforeEach(() => {
    mockFrontmatter.value = {}
    mockTheme.value = { authors: [], t: { author: 'Author' } }
  })

  it('renders nothing when no authorId in frontmatter', () => {
    mockFrontmatter.value = {}
    const wrapper = mount(PostAuthor, {
      global: { stubs: { SimpleLink: SimpleLinkStub } },
    })
    expect(wrapper.find('address').exists()).toBe(false)
  })

  it('renders nothing when author not found in theme', () => {
    mockFrontmatter.value = { authorId: 'unknown' }
    mockTheme.value = { authors: [{ id: 'john', name: 'John' }], t: { author: 'Author' } }
    const wrapper = mount(PostAuthor, {
      global: { stubs: { SimpleLink: SimpleLinkStub } },
    })
    expect(wrapper.find('address').exists()).toBe(false)
  })

  it('renders author link when author found', () => {
    mockFrontmatter.value = { authorId: 'john' }
    mockTheme.value = {
      authors: [{ id: 'john', name: 'John Doe' }],
      t: { author: 'Author' },
    }
    const wrapper = mount(PostAuthor, {
      global: { stubs: { SimpleLink: SimpleLinkStub } },
    })
    expect(wrapper.find('address').exists()).toBe(true)
    expect(wrapper.text()).toContain('John Doe')
    const link = wrapper.findComponent({ name: 'SimpleLink' })
    expect(link.props('href')).toBe('/authors/john/1')
  })

  it('uses aboutUrl when provided', () => {
    mockFrontmatter.value = { authorId: 'john' }
    mockTheme.value = {
      authors: [{ id: 'john', name: 'John Doe', aboutUrl: '/about/john' }],
      t: { author: 'Author' },
    }
    const wrapper = mount(PostAuthor, {
      global: { stubs: { SimpleLink: SimpleLinkStub } },
    })
    const link = wrapper.findComponent({ name: 'SimpleLink' })
    expect(link.props('href')).toBe('/about/john')
  })
})
