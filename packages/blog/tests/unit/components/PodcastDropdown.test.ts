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
  props: ['icon', 'iconUrl', 'alt'],
}

function mountDropdown() {
  return mount(PodcastDropdown, {
    global: {
      stubs: {
        DropdownButton: DropdownButtonStub,
        MenuItem: MenuItemStub,
        PodcastIcon: PodcastIconStub,
      },
    },
  })
}

describe('PodcastDropdown', () => {
  beforeEach(() => {
    mockFrontmatter.value = {}
    mockTheme.value = {
      t: { listenPodcast: 'Listen', podcasts: { site: 'Episode page' } },
    }
  })

  it('renders nothing when no podcasts in frontmatter', () => {
    expect(mountDropdown().find('.dropdown-stub').exists()).toBe(false)
  })

  it('renders nothing for an empty list', () => {
    mockFrontmatter.value = { podcasts: [] }
    expect(mountDropdown().find('.dropdown-stub').exists()).toBe(false)
  })

  it('renders links in the authored order', () => {
    mockFrontmatter.value = {
      podcasts: [
        { spotify: 'https://open.spotify.com/show/abc' },
        { applepodcasts: 'https://podcasts.apple.com/xyz' },
      ],
    }
    const wrapper = mountDropdown()
    expect(wrapper.find('.dropdown-stub').exists()).toBe(true)
    const items = wrapper.findAllComponents({ name: 'MenuItem' })
    expect(items.length).toBe(2)
    expect(items[0]!.props('href')).toBe('https://open.spotify.com/show/abc')
    expect(items[1]!.props('href')).toBe('https://podcasts.apple.com/xyz')
    expect(wrapper.text()).toContain('Spotify')
    expect(wrapper.text()).toContain('Apple Podcasts')
  })

  it('labels the generic ids from the locale translations', () => {
    mockFrontmatter.value = { podcasts: [{ site: 'https://example.com/episode' }] }
    expect(mountDropdown().text()).toContain('Episode page')
  })

  it('uses the themeConfig registry for a custom platform', () => {
    mockTheme.value = {
      t: { listenPodcast: 'Listen', podcasts: {} },
      podcastPlatforms: {
        podbean: { label: 'Podbean', icon: 'simple-icons:podbean' },
      },
    }
    mockFrontmatter.value = { podcasts: [{ podbean: 'https://podbean.com/e/1' }] }
    const wrapper = mountDropdown()
    expect(wrapper.text()).toContain('Podbean')
    expect(wrapper.findComponent({ name: 'PodcastIcon' }).props('icon')).toBe(
      'simple-icons:podbean'
    )
  })

  it('accepts an inline platform definition', () => {
    mockFrontmatter.value = {
      podcasts: [
        {
          id: 'podimo',
          url: 'https://podimo.com/e/1',
          label: 'Podimo',
          iconUrl: '/icons/podimo.svg',
        },
      ],
    }
    const wrapper = mountDropdown()
    expect(wrapper.text()).toContain('Podimo')
    expect(wrapper.findComponent({ name: 'PodcastIcon' }).props('iconUrl')).toBe(
      '/icons/podimo.svg'
    )
  })
})
