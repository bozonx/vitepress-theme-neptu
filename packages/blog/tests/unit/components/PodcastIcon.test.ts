import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PodcastIcon from '../../../src/components/post/PodcastIcon.vue'

describe('PodcastIcon', () => {
  it('renders the built-in icon of a known platform', () => {
    const wrapper = mount(PodcastIcon, {
      props: { name: 'spotify' },
    })
    expect(wrapper.findComponent({ name: 'Icon' }).props('icon')).toBe(
      'simple-icons:spotify'
    )
  })

  it('falls back to the generic podcast icon for an unknown name', () => {
    const wrapper = mount(PodcastIcon, {
      props: { name: 'unknown' },
    })
    expect(wrapper.findComponent({ name: 'Icon' }).props('icon')).toBe('mdi:podcast')
  })

  it('prefers an explicit icon over the built-in one', () => {
    const wrapper = mount(PodcastIcon, {
      props: { name: 'spotify', icon: 'simple-icons:podbean' },
    })
    expect(wrapper.findComponent({ name: 'Icon' }).props('icon')).toBe(
      'simple-icons:podbean'
    )
  })

  it('renders an img when iconUrl is given', () => {
    const wrapper = mount(PodcastIcon, {
      props: { iconUrl: '/icons/podbean.svg', alt: 'Podbean' },
    })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/icons/podbean.svg')
    expect(img.attributes('alt')).toBe('Podbean')
    expect(wrapper.findComponent({ name: 'Icon' }).exists()).toBe(false)
  })
})
