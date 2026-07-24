import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { mockTheme, mockFrontmatter } from '../../mocks/vitepress'
import BlogHome from '../../../src/layouts/BlogHome.vue'

const ContentStub = { name: 'Content', template: '<div class="content-stub" />' }

describe('BlogHome', () => {
  beforeEach(() => {
    mockTheme.value = {
      homeBgParallaxOffset: 300,
    }
    mockFrontmatter.value = {}
  })

  it('renders with default dark theme and parallax background', () => {
    const wrapper = mount(BlogHome, {
      props: { scrollY: 0 },
      global: { stubs: { Content: ContentStub } },
    })

    const root = wrapper.find('.home-layout')
    expect(root.exists()).toBe(true)
    expect(root.classes()).toContain('dark')
    expect(root.classes()).toContain('bg-no-repeat')
    expect(root.classes()).toContain('bg-center')
    expect(root.classes()).toContain('bg-fixed')
  })

  it('applies light theme via frontmatter', () => {
    mockFrontmatter.value = { homeTheme: 'light' }

    const wrapper = mount(BlogHome, {
      props: { scrollY: 0 },
      global: { stubs: { Content: ContentStub } },
    })

    const root = wrapper.find('.home-layout')
    expect(root.classes()).toContain('light')
    expect(root.classes()).not.toContain('text-white!')
  })

  it('disables background when homeBackground is none', () => {
    mockFrontmatter.value = { homeBackground: 'none' }

    const wrapper = mount(BlogHome, {
      props: { scrollY: 0 },
      global: { stubs: { Content: ContentStub } },
    })

    const root = wrapper.find('.home-layout')
    expect(root.classes()).not.toContain('bg-no-repeat')
    expect(root.classes()).not.toContain('bg-center')
    expect(root.classes()).not.toContain('bg-fixed')
  })

  it('applies custom max width from frontmatter', () => {
    mockFrontmatter.value = { homeMaxWidth: 1200 }

    const wrapper = mount(BlogHome, {
      props: { scrollY: 0 },
      global: { stubs: { Content: ContentStub } },
    })

    const page = wrapper.find('.home-layout-page')
    expect(page.attributes('style')).toContain('max-width: 1200px')
  })

  it('applies custom background image from frontmatter', () => {
    mockFrontmatter.value = { homeBackgroundImage: '/img/custom-bg.webp' }

    const wrapper = mount(BlogHome, {
      props: { scrollY: 0 },
      global: { stubs: { Content: ContentStub } },
    })

    const root = wrapper.find('.home-layout')
    expect(root.attributes('style')).toMatch(/background-image:\s*url\(["']?\/img\/custom-bg\.webp["']?\)/)
  })

  it('uses frontmatter homeBgParallaxOffset over theme default', () => {
    mockFrontmatter.value = { homeBgParallaxOffset: 500 }

    const wrapper = mount(BlogHome, {
      props: { scrollY: 0 },
      global: { stubs: { Content: ContentStub } },
    })

    const root = wrapper.find('.home-layout')
    expect(root.attributes('style')).toContain('500px')
  })

  it('renders named slots', () => {
    const wrapper = mount(BlogHome, {
      props: { scrollY: 0 },
      global: { stubs: { Content: ContentStub } },
      slots: {
        'home-before': '<div class="slot-before">Before</div>',
        'home-after': '<div class="slot-after">After</div>',
      },
    })

    expect(wrapper.find('.slot-before').exists()).toBe(true)
    expect(wrapper.find('.slot-after').exists()).toBe(true)
  })

  it('renders Content component', () => {
    const wrapper = mount(BlogHome, {
      props: { scrollY: 0 },
      global: { stubs: { Content: ContentStub } },
    })

    expect(wrapper.find('.content-stub').exists()).toBe(true)
  })

  it('uses default scrollY of 0 when not provided', () => {
    mockFrontmatter.value = { homeBackground: 'none' }

    const wrapper = mount(BlogHome, {
      global: { stubs: { Content: ContentStub } },
    })

    expect(wrapper.find('.home-layout').exists()).toBe(true)
  })
})
