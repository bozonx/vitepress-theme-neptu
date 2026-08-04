import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { mockTheme, mockFrontmatter, mockIsDark } from '../../mocks/vitepress'
import BlogHome from '../../../src/layouts/BlogHome.vue'

const ContentStub = { name: 'Content', template: '<div class="content-stub" />' }

describe('BlogHome', () => {
  beforeEach(() => {
    mockTheme.value = {
      home: { appearance: 'auto', background: { type: 'none', parallaxOffset: 300 }, sections: [] },
    }
    mockFrontmatter.value = {}
    mockIsDark.value = false
  })

  it('follows appearance and background defaults from home config', () => {
    const wrapper = mount(BlogHome, {
      props: { scrollY: 0 },
      global: { stubs: { Content: ContentStub } },
    })

    const root = wrapper.find('.home-layout')
    expect(root.exists()).toBe(true)
    expect(root.classes()).toContain('home-appearance-auto')
    expect(root.classes()).not.toContain('bg-no-repeat')
  })

  it('applies light theme via frontmatter', () => {
    mockFrontmatter.value = { homeTheme: 'light' }

    const wrapper = mount(BlogHome, {
      props: { scrollY: 0 },
      global: { stubs: { Content: ContentStub } },
    })

    const root = wrapper.find('.home-layout')
    expect(root.classes()).toContain('home-appearance-light')
    expect(mockIsDark.value).toBe(false)
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

  it('applies custom background image and home-has-bg class from frontmatter', () => {
    mockFrontmatter.value = { homeBackgroundImage: '/img/custom-bg.webp', homeBackground: 'parallax' }

    const wrapper = mount(BlogHome, {
      props: { scrollY: 0 },
      global: { stubs: { Content: ContentStub } },
    })

    const root = wrapper.find('.home-layout')
    expect(root.attributes('style')).toMatch(/background-image:\s*url\(["']?\/img\/custom-bg\.webp["']?\)/)
    expect(root.classes()).toContain('home-has-bg')
  })

  it('does not add home-has-bg class when background image is missing or background is none', () => {
    const wrapper = mount(BlogHome, {
      props: { scrollY: 0 },
      global: { stubs: { Content: ContentStub } },
    })

    const root = wrapper.find('.home-layout')
    expect(root.classes()).not.toContain('home-has-bg')
  })

  it('uses frontmatter homeBgParallaxOffset over theme default', () => {
    mockFrontmatter.value = { homeBgParallaxOffset: 500, homeBackground: 'parallax' }

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
