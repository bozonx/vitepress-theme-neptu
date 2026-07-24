import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PostTopBar from '../../../src/components/post/PostTopBar.vue'
import { mockFrontmatter } from '../../mocks/vitepress'

const PostVideoLinkStub = { name: 'PostVideoLink', template: '<div class="video-stub" />' }
const PodcastDropdownStub = { name: 'PodcastDropdown', template: '<div class="podcast-stub" />' }

describe('PostTopBar', () => {
  it('renders nothing when no videoLink or podcasts', () => {
    mockFrontmatter.value = {}
    const wrapper = mount(PostTopBar, {
      global: { stubs: { PostVideoLink: PostVideoLinkStub, PodcastDropdown: PodcastDropdownStub } },
    })
    expect(wrapper.find('div').exists()).toBe(false)
  })

  it('renders when videoLink is present', () => {
    mockFrontmatter.value = { videoLink: 'https://youtube.com/watch?v=abc' }
    const wrapper = mount(PostTopBar, {
      global: { stubs: { PostVideoLink: PostVideoLinkStub, PodcastDropdown: PodcastDropdownStub } },
    })
    expect(wrapper.find('.video-stub').exists()).toBe(true)
    expect(wrapper.find('.podcast-stub').exists()).toBe(true)
  })

  it('renders when podcasts is present', () => {
    mockFrontmatter.value = { podcasts: ['https://anchor.fm/ep1'] }
    const wrapper = mount(PostTopBar, {
      global: { stubs: { PostVideoLink: PostVideoLinkStub, PodcastDropdown: PodcastDropdownStub } },
    })
    expect(wrapper.find('.video-stub').exists()).toBe(true)
    expect(wrapper.find('.podcast-stub').exists()).toBe(true)
  })
})
