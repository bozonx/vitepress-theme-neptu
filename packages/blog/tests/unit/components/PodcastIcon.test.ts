import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PodcastIcon from '../../../src/components/post/PodcastIcon.vue'

describe('PodcastIcon', () => {
  it('renders Icon component for known podcast name', () => {
    const wrapper = mount(PodcastIcon, {
      props: { name: 'spotify' },
    })
    expect(wrapper.html()).toContain('aria-hidden')
  })

  it('renders yandexmusic svg', () => {
    const wrapper = mount(PodcastIcon, {
      props: { name: 'yandexmusic' },
    })
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('renders soundstream svg', () => {
    const wrapper = mount(PodcastIcon, {
      props: { name: 'soundstream' },
    })
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('renders zvuk svg', () => {
    const wrapper = mount(PodcastIcon, {
      props: { name: 'zvuk' },
    })
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('renders podcastaddiction svg', () => {
    const wrapper = mount(PodcastIcon, {
      props: { name: 'podcastaddiction' },
    })
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('renders nothing for unknown name', () => {
    const wrapper = mount(PodcastIcon, {
      props: { name: 'unknown' },
    })
    expect(wrapper.html()).toBe('<!--v-if-->')
  })
})
