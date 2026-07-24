import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AuthorItem from '../../../src/components/AuthorItem.vue'
import { mockTheme, mockLocaleIndex } from '../../mocks/vitepress'

describe('AuthorItem', () => {
  beforeEach(() => {
    mockTheme.value = {
      t: { postsCountForms: ['post', 'posts', 'posts'] },
    }
    mockLocaleIndex.value = 'en'
  })

  it('renders author name and description', () => {
    const wrapper = mount(AuthorItem, {
      props: {
        item: {
          id: 'john',
          name: 'John Doe',
          description: 'A writer',
          count: 5,
        },
      },
    })
    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('A writer')
  })

  it('renders author image when provided', () => {
    const wrapper = mount(AuthorItem, {
      props: {
        item: {
          id: 'john',
          name: 'John',
          image: '/img/john.jpg',
          imageHeight: 100,
          imageWidth: 100,
          count: 1,
        },
      },
    })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/img/john.jpg')
    expect(img.attributes('alt')).toBe('John')
    expect(img.attributes('height')).toBe('100')
    expect(img.attributes('width')).toBe('100')
  })

  it('does not render image when absent', () => {
    const wrapper = mount(AuthorItem, {
      props: {
        item: { id: 'john', name: 'John', count: 2 },
      },
    })
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('builds correct href with locale and authors', () => {
    mockLocaleIndex.value = 'ru'
    const wrapper = mount(AuthorItem, {
      props: {
        item: { id: 'jane', name: 'Jane', count: 3 },
      },
    })
    expect(wrapper.find('a').attributes('href')).toBe('/ru/authors/jane/1')
  })

  it('pluralizes count correctly for 1 post', () => {
    mockTheme.value.t.postsCountForms = ['post', 'posts', 'posts']
    const wrapper = mount(AuthorItem, {
      props: {
        item: { id: 'john', name: 'John', count: 1 },
      },
    })
    expect(wrapper.text()).toContain('1 post')
  })

  it('pluralizes count correctly for multiple posts', () => {
    mockTheme.value.t.postsCountForms = ['post', 'posts', 'posts']
    const wrapper = mount(AuthorItem, {
      props: {
        item: { id: 'john', name: 'John', count: 5 },
      },
    })
    expect(wrapper.text()).toContain('5 posts')
  })
})
