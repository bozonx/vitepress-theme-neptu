import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PodcastDropdown from '../../../src/components/post/PodcastDropdown.vue'
import { mockFrontmatter, mockTheme } from '../../mocks/vitepress'

const DropdownButtonStub = {
  name: 'DropdownButton',
  template: '<div class="dropdown-stub"><slot name="btn-text" /><slot /></div>',
  props: [],
}

const MenuItemStub = {
  name: 'MenuItem',
  template: '<a class="menu-item-stub"><slot /></a>',
  props: ['href', 'hide-external-icon'],
}

const PodcastIconStub = {
  name: 'PodcastIcon',
  template: '<span class="podcast-icon-stub" />',
  props: ['name', 'alt'],
}

describe('PodcastDropdown', () => {
  beforeEach(() => {
    mockFrontmatter.value = {}
    mockTheme.value = { t: { listenPodcast: 'Listen', podcasts: { spotify: 'Spotify', apple: 'Apple Podcasts' } } }
  })

  it('renders nothing when no podcasts in frontmatter', () => {
    mockFrontmatter.value = {}
    const wrapper = mount(PodcastDropdown, {
      global: {
        stubs: {
          DropdownButton: DropdownButtonStub,
          MenuItem: MenuItemStub,
          PodcastIcon: PodcastIconStub,
        },
      },
    })
    expect(wrapper.find('.dropdown-stub').exists()).toBe(false)
  })

  it('renders dropdown with podcast links', () => {
    mockFrontmatter.value = {
      podcasts: {
        spotify: 'https://open.spotify.com/show/abc',
        apple: 'https://podcasts.apple.com/xyz',
      },
    }
    const wrapper = mount(PodcastDropdown, {
      global: {
        stubs: {
          DropdownButton: DropdownButtonStub,
          MenuItem: MenuItemStub,
          PodcastIcon: PodcastIconStub,
        },
      },
    })
    expect(wrapper.find('.dropdown-stub').exists()).toBe(true)
    const items = wrapper.findAllComponents({ name: 'MenuItem' })
    expect(items.length).toBe(2)
    expect(items[0].props('href')).toBe('https://open.spotify.com/show/abc')
    expect(items[1].props('href')).toBe('https://podcasts.apple.com/xyz')
  })
})
