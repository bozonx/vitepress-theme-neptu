import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PostNavigation from '../../../src/components/post/PostNavigation.vue'
import { mockRoute, mockTheme } from '../../mocks/vitepress'

const BaseLinkStub = {
  name: 'BaseLink',
  props: ['href'],
  template: '<a :href="href"><slot /></a>',
}

describe('PostNavigation', () => {
  beforeEach(() => {
    mockRoute.value = { path: '/en/post/current' }
    mockTheme.value = {
      t: { previousPost: 'Previous post', nextPost: 'Next post' },
    }
  })

  it('renders chronological neighbours with their titles', () => {
    const wrapper = mount(PostNavigation, {
      props: {
        localePosts: [
          { url: '/en/post/old', title: 'Older', date: '2024-01-01' },
          { url: '/en/post/current', title: 'Current', date: '2024-02-01' },
          { url: '/en/post/new', title: 'Newer', date: '2024-03-01' },
        ],
      },
      global: { stubs: { BaseLink: BaseLinkStub } },
    })

    expect(wrapper.text()).toContain('Previous post')
    expect(wrapper.text()).toContain('Older')
    expect(wrapper.text()).toContain('Next post')
    expect(wrapper.text()).toContain('Newer')
    expect(wrapper.findAll('a').map((link) => link.attributes('href'))).toEqual([
      '/en/post/old',
      '/en/post/new',
    ])
  })

  it('does not render when the current post is the only post', () => {
    const wrapper = mount(PostNavigation, {
      props: {
        localePosts: [
          { url: '/en/post/current', title: 'Current', date: '2024-02-01' },
        ],
      },
      global: { stubs: { BaseLink: BaseLinkStub } },
    })
    expect(wrapper.find('nav').exists()).toBe(false)
  })
})
