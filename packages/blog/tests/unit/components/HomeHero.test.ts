import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeHero from '../../../src/components/utility/HomeHero.vue'
import { mockTheme, mockLocaleIndex } from '../../mocks/vitepress'

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

  it('renders image with i18n aria-label', () => {
    const wrapper = mount(HomeHero, {
      props: {
        img: { src: '/logo.webp', alt: 'Logo' },
      },
    })

    const link = wrapper.find('a.home-logo')
    expect(link.exists()).toBe(true)
    expect(link.attributes('aria-label')).toBe('Go to home page')
    expect(link.find('img').attributes('src')).toBe('/logo.webp')
    expect(link.find('img').attributes('alt')).toBe('Logo')
  })

  it('does not render image link when img is absent', () => {
    const wrapper = mount(HomeHero, {
      props: {
        firstLine: 'Hello',
      },
    })

    expect(wrapper.find('a.home-logo').exists()).toBe(false)
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

  it('links to locale recent base url', () => {
    mockLocaleIndex.value = 'ru'

    const wrapper = mount(HomeHero, {
      props: {
        img: { src: '/logo.webp', alt: 'Logo' },
      },
    })

    const link = wrapper.find('a.home-logo')
    expect(link.attributes('href')).toBe('/ru/recent/1')
  })
})
