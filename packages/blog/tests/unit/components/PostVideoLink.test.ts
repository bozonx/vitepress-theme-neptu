import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PostVideoLink from '../../../src/components/post/PostVideoLink.vue'
import { mockFrontmatter, mockTheme } from '../../mocks/vitepress'

const NeptuBtnStub = {
  name: 'NeptuBtn',
  template: '<button class="neptu-btn-stub"><slot /></button>',
  props: ['href', 'text', 'icon', 'target'],
}

describe('PostVideoLink', () => {
  beforeEach(() => {
    mockFrontmatter.value = {}
    mockTheme.value = { youtubeIcon: 'mdi:youtube', t: { postVideoButton: 'Watch video' } }
  })

  it('renders button with video link and default text', () => {
    mockFrontmatter.value = { videoLink: 'https://youtube.com/watch?v=abc' }
    const wrapper = mount(PostVideoLink, {
      global: { stubs: { NeptuBtn: NeptuBtnStub } },
    })
    const btn = wrapper.findComponent({ name: 'NeptuBtn' })
    expect(btn.exists()).toBe(true)
    expect(btn.props('href')).toBe('https://youtube.com/watch?v=abc')
    expect(btn.props('text')).toBe('Watch video')
    expect(btn.props('icon')).toBe('mdi:youtube')
    expect(btn.props('target')).toBe('_blank')
  })

  it('appends language when videoLinkLang is set', () => {
    mockFrontmatter.value = { videoLink: 'https://youtube.com/watch?v=abc', videoLinkLang: 'EN' }
    const wrapper = mount(PostVideoLink, {
      global: { stubs: { NeptuBtn: NeptuBtnStub } },
    })
    const btn = wrapper.findComponent({ name: 'NeptuBtn' })
    expect(btn.props('text')).toBe('Watch video (EN)')
  })
})
