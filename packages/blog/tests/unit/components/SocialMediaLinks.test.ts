import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SocialMediaLinks from '../../../src/components/SocialMediaLinks.vue'

const NeptuBtnStub = {
  template: '<a :href="$attrs.href" :title="$attrs.title" class="btn-stub"><slot /></a>',
}

describe('SocialMediaLinks', () => {
  it('renders nothing when links array is empty', () => {
    const wrapper = mount(SocialMediaLinks, {
      props: { links: [] },
      global: { stubs: { NeptuBtn: NeptuBtnStub } },
    })
    expect(wrapper.findAll('.btn-stub')).toHaveLength(0)
  })

  it('renders all valid links', () => {
    const wrapper = mount(SocialMediaLinks, {
      props: {
        links: [
          { url: 'https://example.com', title: 'Site', type: 'site' },
          { url: 'https://youtube.com/user', type: 'youtube' },
        ],
      },
      global: { stubs: { NeptuBtn: NeptuBtnStub } },
    })
    const anchors = wrapper.findAll('.btn-stub')
    expect(anchors).toHaveLength(2)
    expect(anchors[0].attributes('href')).toBe('https://example.com')
    expect(anchors[0].attributes('title')).toBe('Site')
    expect(anchors[1].attributes('href')).toBe('https://youtube.com/user')
  })

  it('maps known types to icon prop', () => {
    const wrapper = mount(SocialMediaLinks, {
      props: {
        links: [
          { url: 'https://x.com', type: 'x' },
          { url: 'https://fb.com', type: 'facebook' },
          { url: 'https://insta.com', type: 'instagram' },
        ],
      },
      global: { stubs: { NeptuBtn: { template: '<a :data-icon="$attrs.icon"><slot /></a>' } } },
    })
    const anchors = wrapper.findAll('a')
    expect(anchors[0].attributes('data-icon')).toBe('mdi:twitter')
    expect(anchors[1].attributes('data-icon')).toBe('mdi:facebook')
    expect(anchors[2].attributes('data-icon')).toBe('mdi:instagram')
  })

  it('falls back to site icon for unknown type', () => {
    const wrapper = mount(SocialMediaLinks, {
      props: {
        links: [{ url: 'https://unknown.com', type: 'unknown' }],
      },
      global: { stubs: { NeptuBtn: { template: '<a :data-icon="$attrs.icon"><slot /></a>' } } },
    })
    expect(wrapper.find('a').attributes('data-icon')).toBe('mdi:web')
  })
})
