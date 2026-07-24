import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Author from '../../../src/components/NeptuAuthor.vue'

describe('Author', () => {
  let wrapper: ReturnType<typeof mount>

  afterEach(() => {
    wrapper?.unmount()
  })

  it('renders author image with correct attributes', () => {
    wrapper = mount(Author, {
      attachTo: document.body,
      props: {
        author: {
          id: 'john-doe',
          name: 'John Doe',
          image: '/img/john.jpg',
          imageHeight: 200,
          imageWidth: 300,
          description: '<p>Writer</p>',
          links: [],
        },
      },
    })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/img/john.jpg')
    expect(img.attributes('alt')).toBe('John Doe')
    expect(img.attributes('height')).toBe('200')
    expect(img.attributes('width')).toBe('300')
  })

  it('does not render image when absent', () => {
    wrapper = mount(Author, {
      attachTo: document.body,
      props: {
        author: {
          id: 'jane',
          name: 'Jane',
          description: 'Bio text',
          links: [],
        },
      },
    })
    expect(wrapper.find('figure').exists()).toBe(false)
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('renders description html', () => {
    wrapper = mount(Author, {
      attachTo: document.body,
      props: {
        author: {
          id: 'john',
          name: 'John',
          description: '<p>Hello world</p>',
          links: [],
        },
      },
    })
    expect(wrapper.html()).toContain('Hello world')
  })

  it('passes filtered social links to SocialMediaLinks', () => {
    wrapper = mount(Author, {
      attachTo: document.body,
      props: {
        author: {
          id: 'john',
          name: 'John',
          links: [
            { url: 'https://x.com/john', type: 'x', title: 'X' },
            { url: '', type: 'facebook' },
            { type: 'youtube', url: 'https://youtube.com' },
          ],
        },
      },
    })
    const social = wrapper.findComponent({ name: 'SocialMediaLinks' })
    expect(social.exists()).toBe(true)
    expect(social.props('links')).toHaveLength(2)
    expect(social.props('links')).toEqual([
      { url: 'https://x.com/john', title: 'X', type: 'x' },
      { url: 'https://youtube.com', title: undefined, type: 'youtube' },
    ])
  })

  it('does not render SocialMediaLinks when no valid links', () => {
    wrapper = mount(Author, {
      attachTo: document.body,
      props: {
        author: {
          id: 'no-links',
          name: 'No Links',
          links: [
            { url: '', type: 'x' },
            { type: 'facebook' },
          ],
        },
      },
    })
    expect(wrapper.findComponent({ name: 'SocialMediaLinks' }).exists()).toBe(false)
  })
})
