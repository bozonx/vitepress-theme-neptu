import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PostImage from '../../../src/components/post/PostImage.vue'

describe('PostImage', () => {
  it('renders nothing when src is absent', () => {
    const wrapper = mount(PostImage, { props: {} })
    expect(wrapper.find('figure').exists()).toBe(false)
  })

  it('renders image with src and alt', () => {
    const wrapper = mount(PostImage, {
      props: { src: '/img.jpg', alt: 'Description' },
    })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/img.jpg')
    expect(img.attributes('alt')).toBe('Description')
    expect(img.attributes('fetchpriority')).toBe('high')
  })

  it('renders figcaption when description is provided', () => {
    const wrapper = mount(PostImage, {
      props: { src: '/img.jpg', description: 'Image caption' },
    })
    expect(wrapper.find('figcaption').exists()).toBe(true)
    expect(wrapper.find('figcaption').html()).toContain('Image caption')
  })

  it('does not render figcaption when description is absent', () => {
    const wrapper = mount(PostImage, {
      props: { src: '/img.jpg' },
    })
    expect(wrapper.find('figcaption').exists()).toBe(false)
  })

  it('wraps image in lightbox link', () => {
    const wrapper = mount(PostImage, {
      props: { src: '/img.jpg' },
    })
    const link = wrapper.find('a.lightbox')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('/img.jpg')
  })

  it('applies width and height attributes when provided', () => {
    const wrapper = mount(PostImage, {
      props: { src: '/img.jpg', width: 300, height: 200 },
    })
    const img = wrapper.find('img')
    expect(img.attributes('width')).toBe('300')
    expect(img.attributes('height')).toBe('200')
  })
})
