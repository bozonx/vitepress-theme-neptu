import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SiteHome from '../../../src/layouts/SiteHome.vue'

describe('SiteHome', () => {
  it('renders hero section with name and text', () => {
    const wrapper = mount(SiteHome, {
      props: {
        hero: {
          name: 'Neptu',
          text: 'Landing Page',
        },
      },
    })
    expect(wrapper.find('.hero').exists()).toBe(true)
    expect(wrapper.find('.name').text()).toBe('Neptu')
    expect(wrapper.find('.text').text()).toBe('Landing Page')
  })

  it('renders hero tagline', () => {
    const wrapper = mount(SiteHome, {
      props: {
        hero: { tagline: 'A modern landing theme' },
      },
    })
    expect(wrapper.find('.tagline').text()).toBe('A modern landing theme')
  })

  it('renders hero actions with correct classes', () => {
    const wrapper = mount(SiteHome, {
      props: {
        hero: {
          actions: [
            { text: 'Get Started', link: '/start', theme: 'brand' },
            { text: 'Docs', link: '/docs', theme: 'alt' },
          ],
        },
      },
    })
    const actions = wrapper.findAll('.action')
    expect(actions).toHaveLength(2)
    expect(actions[0].classes()).toContain('action-brand')
    expect(actions[1].classes()).toContain('action-alt')
    expect(actions[0].attributes('href')).toBe('/start')
    expect(actions[1].attributes('href')).toBe('/docs')
  })

  it('renders hero image from string src', () => {
    const wrapper = mount(SiteHome, {
      props: {
        hero: { image: '/img/hero.png' },
      },
    })
    const img = wrapper.find('.hero-image img')
    expect(img.attributes('src')).toBe('/img/hero.png')
    expect(img.attributes('alt')).toBe('')
  })

  it('renders hero image from object with alt', () => {
    const wrapper = mount(SiteHome, {
      props: {
        hero: {
          image: { src: '/img/hero.png', alt: 'Hero Image' },
        },
      },
    })
    const img = wrapper.find('.hero-image img')
    expect(img.attributes('src')).toBe('/img/hero.png')
    expect(img.attributes('alt')).toBe('Hero Image')
  })

  it('does not render hero section when hero prop is missing', () => {
    const wrapper = mount(SiteHome, {})
    expect(wrapper.find('.hero').exists()).toBe(false)
  })

  it('renders features section with title and details', () => {
    const wrapper = mount(SiteHome, {
      props: {
        features: [
          { title: 'Feature 1', details: 'Details 1' },
          { title: 'Feature 2', details: 'Details 2' },
        ],
      },
    })
    expect(wrapper.find('.features').exists()).toBe(true)
    const features = wrapper.findAll('.feature')
    expect(features).toHaveLength(2)
    expect(features[0].find('.feature-title').text()).toBe('Feature 1')
    expect(features[0].find('.feature-details').text()).toBe('Details 1')
  })

  it('renders feature with link and linkText', () => {
    const wrapper = mount(SiteHome, {
      props: {
        features: [
          {
            title: 'Feature 1',
            details: 'Details 1',
            link: '/feature-1',
            linkText: 'Learn more',
          },
        ],
      },
    })
    const feature = wrapper.find('.feature')
    expect(feature.attributes('href')).toBe('/feature-1')
    expect(feature.find('.feature-link-text').text()).toBe('Learn more')
  })

  it('renders feature with string icon', () => {
    const wrapper = mount(SiteHome, {
      props: {
        features: [
          {
            title: 'Feature 1',
            details: 'Details 1',
            icon: '/img/icon.png',
          },
        ],
      },
    })
    const iconImg = wrapper.find('.feature-icon img')
    expect(iconImg.attributes('src')).toBe('/img/icon.png')
    expect(iconImg.attributes('alt')).toBe('Feature 1')
  })

  it('renders feature with object icon', () => {
    const wrapper = mount(SiteHome, {
      props: {
        features: [
          {
            title: 'Feature 1',
            details: 'Details 1',
            icon: { src: '/img/icon.png', alt: 'Icon' },
          },
        ],
      },
    })
    const iconImg = wrapper.find('.feature-icon img')
    expect(iconImg.attributes('src')).toBe('/img/icon.png')
    expect(iconImg.attributes('alt')).toBe('Icon')
  })

  it('does not render features section when features prop is missing', () => {
    const wrapper = mount(SiteHome, {})
    expect(wrapper.find('.features').exists()).toBe(false)
  })

  it('does not render features section when features is empty', () => {
    const wrapper = mount(SiteHome, {
      props: { features: [] },
    })
    expect(wrapper.find('.features').exists()).toBe(false)
  })

  it('renders slot content in home-content', () => {
    const wrapper = mount(SiteHome, {
      props: { hero: { name: 'Test' } },
      slots: {
        default: '<p class="slot-content">Slot content</p>',
      },
    })
    expect(wrapper.find('.home-content').exists()).toBe(true)
    expect(wrapper.find('.slot-content').text()).toBe('Slot content')
  })

  it('applies target and rel attributes to action links', () => {
    const wrapper = mount(SiteHome, {
      props: {
        hero: {
          actions: [
            {
              text: 'External',
              link: 'https://example.com',
              target: '_blank',
              rel: 'noopener',
            },
          ],
        },
      },
    })
    const action = wrapper.find('.action')
    expect(action.attributes('target')).toBe('_blank')
    expect(action.attributes('rel')).toBe('noopener')
  })
})
