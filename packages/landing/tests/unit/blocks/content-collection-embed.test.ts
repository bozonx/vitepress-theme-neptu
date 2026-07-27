import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import LnContent from '../../../src/blocks/LnContent.vue'
import LnCollection from '../../../src/blocks/LnCollection.vue'
import LnEmbed from '../../../src/blocks/LnEmbed.vue'
import LnGallery from '../../../src/blocks/LnGallery.vue'
import LnStats from '../../../src/blocks/LnStats.vue'
import LnBanner from '../../../src/blocks/LnBanner.vue'

describe('new general-purpose blocks', () => {
  it('renders trusted content with media and actions', () => {
    const wrapper = mount(LnContent, {
      props: { content: '<p><strong>Story</strong></p>', image: '/story.svg', actions: [{ text: 'More', link: '/more' }] },
    })
    expect(wrapper.find('.ln-content__prose strong').text()).toBe('Story')
    expect(wrapper.find('.ln-btn').attributes('href')).toBe('/more')
  })

  it('renders collection metadata, tags and item actions', () => {
    const wrapper = mount(LnCollection, {
      props: { items: [{ title: 'Guide', date: '2026-07-27', tags: ['Docs'], actions: [{ text: 'Read', link: '/guide' }] }] },
    })
    expect(wrapper.find('.ln-collection__meta').text()).toContain('2026-07-27')
    expect(wrapper.find('.ln-collection__tags').text()).toContain('Docs')
    expect(wrapper.find('.ln-btn').attributes('href')).toBe('/guide')
  })

  it('renders a lazy, titled embed', () => {
    const wrapper = mount(LnEmbed, { props: { src: '/map', embedTitle: 'Office map' } })
    expect(wrapper.find('iframe').attributes('loading')).toBe('lazy')
    expect(wrapper.find('iframe').attributes('title')).toBe('Office map')
  })
})

describe('extended blocks', () => {
  it('turns gallery entries into case-study cards', () => {
    const wrapper = mount(LnGallery, {
      props: { items: [{ src: '/case.svg', title: 'Case', text: 'Result', tags: ['SaaS'], actions: [{ text: 'Open', link: '/case' }] }] },
    })
    expect(wrapper.find('.ln-gallery__body h3').text()).toBe('Case')
    expect(wrapper.find('.ln-gallery__tags').text()).toContain('SaaS')
  })

  it('renders stat trend and source while keeping the card linkable', () => {
    const wrapper = mount(LnStats, { props: { items: [{ value: '42%', trend: '+8%', source: 'Analytics', link: '/report' }] } })
    expect(wrapper.find('.ln-stat').attributes('href')).toBe('/report')
    expect(wrapper.find('.ln-stat__trend').text()).toBe('+8%')
    expect(wrapper.find('.ln-stat__source').text()).toBe('Analytics')
  })

  it('honors banner width, padding and sticky placement', () => {
    const wrapper = mount(LnBanner, { props: { text: 'News', width: 'narrow', padding: 'sm', placement: 'bottom', sticky: true } })
    expect(wrapper.find('.ln-section__inner--narrow').exists()).toBe(true)
    expect(wrapper.find('.ln-section--pad-sm').exists()).toBe(true)
    expect(wrapper.find('.ln-banner--bottom.ln-banner--sticky').exists()).toBe(true)
  })
})
