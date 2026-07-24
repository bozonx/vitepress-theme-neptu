import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ListPageHeader from '../../../src/components/ListPageHeader.vue'
import { mockTheme } from '../../mocks/vitepress'

describe('ListPageHeader', () => {
  beforeEach(() => {
    mockTheme.value = {
      t: { links: { recent: 'Recent', popular: 'Popular' } },
      popularPosts: { enabled: true },
      recentIcon: 'mdi:clock',
      popularIcon: 'mdi:fire',
    }
  })

  it('renders slot content in h1', () => {
    const wrapper = mount(ListPageHeader, {
      props: { baseUrl: '/en/blog' },
      slots: { default: 'Posts' },
    })
    expect(wrapper.find('h1').text()).toBe('Posts')
  })

  it('does not render switcher when showPopularPostsSwitch is false', () => {
    const wrapper = mount(ListPageHeader, {
      props: { baseUrl: '/en/blog', showPopularPostsSwitch: false },
    })
    expect(wrapper.find('.list-page-header-switcher').exists()).toBe(false)
  })

  it('renders switcher when enabled', () => {
    const wrapper = mount(ListPageHeader, {
      props: { baseUrl: '/en/blog', showPopularPostsSwitch: true },
    })
    const btns = wrapper.findAllComponents({ name: 'NeptuBtn' })
    expect(btns.length).toBe(2)
    expect(btns[0].props('text')).toBe('Recent')
    expect(btns[1].props('text')).toBe('Popular')
  })
})
