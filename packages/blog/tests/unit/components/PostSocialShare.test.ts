import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PostSocialShare from '../../../src/components/post/PostSocialShare.vue'
import { mockTheme } from '../../mocks/vitepress'

const IconStub = {
  name: 'Icon',
  template: '<span :data-icon="$attrs.icon" class="icon-stub" />',
}

describe('PostSocialShare', () => {
  beforeEach(() => {
    mockTheme.value = { t: { shareSocialMedia: 'Share' } }
  })

  it('renders nothing when socialMediaShares is absent', () => {
    const wrapper = mount(PostSocialShare, {
      global: { stubs: { Icon: IconStub } },
    })
    expect(wrapper.find('div').exists()).toBe(false)
  })

  it('renders nothing when socialMediaShares is empty array', () => {
    mockTheme.value = {
      socialMediaShares: [],
      t: { shareSocialMedia: 'Share' },
    }
    const wrapper = mount(PostSocialShare, {
      global: { stubs: { Icon: IconStub } },
    })
    expect(wrapper.find('div').exists()).toBe(false)
  })

  it('renders share links from config', () => {
    mockTheme.value = {
      socialMediaShares: [
        { name: 'telegram', icon: 'logos:telegram', title: 'Telegram', urlTemplate: 'https://t.me/share/url?url={url}&text={title}' },
        { name: 'x', icon: 'ri:twitter-x-fill', title: 'X', urlTemplate: 'https://x.com/intent/tweet?text={title}&url={url}' },
      ],
      t: { shareSocialMedia: 'Share' },
    }
    const wrapper = mount(PostSocialShare, {
      global: { stubs: { Icon: IconStub } },
    })
    const anchors = wrapper.findAll('a')
    expect(anchors).toHaveLength(2)
    expect(anchors[0].attributes('title')).toBe('Telegram')
    expect(anchors[1].attributes('title')).toBe('X')
  })

  it('replaces {url} and {title} placeholders', () => {
    mockTheme.value = {
      socialMediaShares: [
        { name: 'test', icon: 'mdi:test', title: 'Test', urlTemplate: 'https://example.com?u={url}&t={title}' },
      ],
      t: { shareSocialMedia: 'Share' },
    }
    const wrapper = mount(PostSocialShare, {
      global: { stubs: { Icon: IconStub } },
    })
    const anchor = wrapper.find('a')
    expect(anchor.exists()).toBe(true)
    const href = anchor.attributes('href')
    expect(href).toContain(encodeURIComponent(document.URL))
    expect(href).toContain('t=')
  })

  it('applies custom class from config', () => {
    mockTheme.value = {
      socialMediaShares: [
        { name: 'vk', icon: 'cib:vk', title: 'VK', urlTemplate: 'https://vk.com/share.php?url={url}', class: 'custom-class' },
      ],
      t: { shareSocialMedia: 'Share' },
    }
    const wrapper = mount(PostSocialShare, {
      global: { stubs: { Icon: IconStub } },
    })
    const anchor = wrapper.find('a')
    expect(anchor.classes()).toContain('custom-class')
  })
})
