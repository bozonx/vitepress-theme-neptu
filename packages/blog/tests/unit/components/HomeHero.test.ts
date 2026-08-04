import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeHero from '../../../src/components/utility/HomeHero.vue'
import { mockTheme, mockLocaleIndex, mockIsDark } from '../../mocks/vitepress'

const IconStub = { name: 'Icon', template: '<span class="icon-stub" />' }

describe('HomeHero', () => {
  beforeEach(() => {
    mockTheme.value = {
      t: { toHome: 'Go to home page' },
    }
    mockLocaleIndex.value = 'en'
  })

  it('renders first and second lines', () => {
    const wrapper = mount(HomeHero, {
      props: {
        firstLine: 'Hello',
        secondLine: 'World',
      },
    })

    expect(wrapper.text()).toContain('Hello')
    expect(wrapper.text()).toContain('World')
  })

  it('renders non-interactive image element', () => {
    const wrapper = mount(HomeHero, {
      props: {
        image: { src: '/logo.webp', alt: 'Logo' },
      },
    })

    const logo = wrapper.find('.home-logo')
    expect(logo.exists()).toBe(true)
    expect(logo.find('a').exists()).toBe(false)
    expect(logo.find('img').attributes('src')).toBe('/logo.webp')
    expect(logo.find('img').attributes('alt')).toBe('Logo')
  })

  it('does not render image when image.src is undefined', () => {
    const wrapper = mount(HomeHero, {
      props: {
        firstLine: 'Hello',
        image: { alt: 'Logo' },
      },
    })

    expect(wrapper.find('.home-logo').exists()).toBe(false)
  })

  it('does not render image when image is absent', () => {
    const wrapper = mount(HomeHero, {
      props: {
        firstLine: 'Hello',
      },
    })

    expect(wrapper.find('.home-logo').exists()).toBe(false)
  })

  it('renders buttons from props', () => {
    const wrapper = mount(HomeHero, {
      props: {
        buttons: [
          { text: 'Primary', href: '/blog', primary: true },
          { text: 'Secondary', href: '/about' },
        ],
      },
      global: { stubs: { Icon: IconStub } },
    })

    const buttons = wrapper.findAll('.home-hero-buttons li')
    expect(buttons.length).toBe(2)
  })

  it('does not render buttons section when buttons are absent', () => {
    const wrapper = mount(HomeHero, {
      props: {
        firstLine: 'Hello',
      },
    })

    expect(wrapper.find('.home-hero-buttons').exists()).toBe(false)
  })

  it('renders image when image is a string', () => {
    const wrapper = mount(HomeHero, {
      props: {
        image: '/logo-string.png',
      },
    })

    const logo = wrapper.find('.home-logo')
    expect(logo.exists()).toBe(true)
    expect(logo.find('img').attributes('src')).toBe('/logo-string.png')
  })

  it('renders light vs dark image based on isDark', async () => {
    mockIsDark.value = false
    const wrapper = mount(HomeHero, {
      props: {
        image: {
          light: '/logo-light.png',
          dark: '/logo-dark.png',
          alt: 'Theme logo',
        },
      },
    })

    expect(wrapper.find('img').attributes('src')).toBe('/logo-light.png')
    expect(wrapper.find('img').attributes('alt')).toBe('Theme logo')

    mockIsDark.value = true
    await wrapper.vm.$nextTick()
    expect(wrapper.find('img').attributes('src')).toBe('/logo-dark.png')
  })
})
