import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LnSection from '../../../src/primitives/LnSection.vue'
import LnButton from '../../../src/primitives/LnButton.vue'
import LnButtonGroup from '../../../src/primitives/LnButtonGroup.vue'
import LnCard from '../../../src/primitives/LnCard.vue'
import LnIcon from '../../../src/primitives/LnIcon.vue'
import LnHeading from '../../../src/primitives/LnHeading.vue'

describe('LnSection', () => {
  it('applies surface, padding and width modifiers', () => {
    const wrapper = mount(LnSection, {
      props: { id: 'features', bg: 'soft', padding: 'lg', width: 'narrow', divider: true },
    })

    const section = wrapper.find('section')
    expect(section.attributes('id')).toBe('features')
    expect(section.classes()).toContain('ln-section--bg-soft')
    expect(section.classes()).toContain('ln-section--pad-lg')
    expect(section.classes()).toContain('ln-section--divider')
    expect(wrapper.find('.ln-section__inner--narrow').exists()).toBe(true)
  })

  it('defaults to the base surface and medium padding', () => {
    const wrapper = mount(LnSection)

    expect(wrapper.find('section').classes()).toEqual(
      expect.arrayContaining(['ln-section--bg-base', 'ln-section--pad-md'])
    )
  })
})

describe('LnButton', () => {
  it('renders an anchor when a link is given', () => {
    const wrapper = mount(LnButton, { props: { text: 'Docs', link: '/doc' } })

    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/doc')
    expect(link.classes()).toContain('ln-btn--brand')
    expect(link.text()).toContain('Docs')
  })

  it('opens external links in a new tab', () => {
    const wrapper = mount(LnButton, {
      props: { text: 'GitHub', link: 'https://example.com' },
    })

    expect(wrapper.find('a').attributes('target')).toBe('_blank')
    expect(wrapper.find('a').attributes('rel')).toBe('noreferrer')
  })

  it('renders a button element without a link', () => {
    const wrapper = mount(LnButton, { props: { text: 'Send', variant: 'alt' } })

    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('button').classes()).toContain('ln-btn--alt')
  })

  it('never renders a disabled link as clickable', () => {
    const wrapper = mount(LnButton, {
      props: { text: 'Soon', link: '/doc', disabled: true },
    })

    expect(wrapper.find('a').exists()).toBe(false)
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })
})

describe('LnButtonGroup', () => {
  it('makes the first action brand and the rest alt by default', () => {
    const wrapper = mount(LnButtonGroup, {
      props: {
        actions: [
          { text: 'Start', link: '/a' },
          { text: 'Docs', link: '/b' },
          { text: 'Ghost', link: '/c', variant: 'ghost' },
        ],
      },
    })

    const buttons = wrapper.findAll('.ln-btn')
    expect(buttons).toHaveLength(3)
    expect(buttons[0].classes()).toContain('ln-btn--brand')
    expect(buttons[1].classes()).toContain('ln-btn--alt')
    expect(buttons[2].classes()).toContain('ln-btn--ghost')
  })

  it('renders nothing without actions or slot content', () => {
    const wrapper = mount(LnButtonGroup)

    expect(wrapper.find('.ln-actions').exists()).toBe(false)
  })
})

describe('LnCard', () => {
  it('becomes a link and hoverable when given a link', () => {
    const wrapper = mount(LnCard, { props: { link: '/doc' } })

    expect(wrapper.find('a').attributes('href')).toBe('/doc')
    expect(wrapper.classes()).toContain('ln-card--hoverable')
  })
})

describe('LnIcon', () => {
  it('detects an Iconify name', () => {
    const wrapper = mount(LnIcon, { props: { icon: 'fa6-solid:rocket' } })

    expect(wrapper.find('.iconify-stub').attributes('data-icon')).toBe('fa6-solid:rocket')
  })

  it('detects an image path', () => {
    const wrapper = mount(LnIcon, { props: { icon: '/img/icon.svg' } })

    expect(wrapper.find('img').attributes('src')).toBe('/img/icon.svg')
  })

  it('falls back to text for an emoji', () => {
    const wrapper = mount(LnIcon, { props: { icon: '🚀' } })

    expect(wrapper.find('.ln-icon__text').text()).toBe('🚀')
  })

  it('renders nothing without an icon', () => {
    const wrapper = mount(LnIcon)

    expect(wrapper.find('.ln-icon').exists()).toBe(false)
  })
})

describe('LnHeading', () => {
  it('renders inline HTML in the title and honors the level', () => {
    const wrapper = mount(LnHeading, {
      props: { title: 'Hello <span class="ln-accent">world</span>', level: 'h1', size: 'display' },
    })

    expect(wrapper.find('h1').exists()).toBe(true)
    expect(wrapper.find('.ln-accent').text()).toBe('world')
    expect(wrapper.classes()).toContain('ln-heading--display')
  })
})
