import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PostDonateLink from '../../../src/components/post/PostDonateLink.vue'
import { mockTheme } from '../../mocks/vitepress'

const NeptuBtnLinkStub = {
  name: 'NeptuBtnLink',
  template: '<a class="btn-link-stub"><slot /></a>',
  props: ['href', 'text', 'icon'],
}

describe('PostDonateLink', () => {
  beforeEach(() => {
    mockTheme.value = { t: { links: { donate: 'Donate' } } }
  })

  it('renders nothing when donate config absent', () => {
    const wrapper = mount(PostDonateLink, {
      global: { stubs: { NeptuBtnLink: NeptuBtnLinkStub } },
    })
    expect(wrapper.find('div').exists()).toBe(false)
  })

  it('renders donate link when configured', () => {
    mockTheme.value = {
      donate: { postDonateCall: 'Support us', url: '/donate', icon: 'mdi:heart' },
      t: { links: { donate: 'Donate' } },
    }
    const wrapper = mount(PostDonateLink, {
      global: { stubs: { NeptuBtnLink: NeptuBtnLinkStub } },
    })
    expect(wrapper.text()).toContain('Support us')
    const link = wrapper.findComponent({ name: 'NeptuBtnLink' })
    expect(link.exists()).toBe(true)
    expect(link.props('href')).toBe('/donate')
    expect(link.props('text')).toBe('Donate')
  })

  it('uses donateIcon fallback when icon not set', () => {
    mockTheme.value = {
      donate: { postDonateCall: 'Support us', url: '/donate' },
      donateIcon: 'mdi:coffee',
      t: { links: { donate: 'Donate' } },
    }
    const wrapper = mount(PostDonateLink, {
      global: { stubs: { NeptuBtnLink: NeptuBtnLinkStub } },
    })
    const link = wrapper.findComponent({ name: 'NeptuBtnLink' })
    expect(link.props('icon')).toBe('mdi:coffee')
  })
})
