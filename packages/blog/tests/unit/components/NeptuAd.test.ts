import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import NeptuAd from '../../../src/components/NeptuAd.vue'
import { mockFrontmatter, mockRoute, mockTheme } from '../../mocks/vitepress'

const AdUnit = {
  name: 'AdUnit',
  props: ['placement', 'index'],
  template: '<div class="ad-unit" />',
}

const mountAd = (props = {}, slots = {}) =>
  mount(NeptuAd, {
    props,
    slots,
    global: { components: { AdUnit } },
  })

describe('NeptuAd', () => {
  beforeEach(() => {
    mockFrontmatter.value = { layout: 'post' }
    mockRoute.value = { path: '/en/posts/hello' }
    mockTheme.value = { ads: { component: 'AdUnit' } }
  })

  it('renders the configured unit', () => {
    const wrapper = mountAd()

    expect(wrapper.find('.neptu-ad').exists()).toBe(true)
    expect(wrapper.find('.ad-unit').exists()).toBe(true)
  })

  it('renders nothing when no unit is configured and no slot is given', () => {
    // Slots are placed by config and by the markdown plugin whether or not a
    // site ever wired up an ad network; an empty labelled box is worse than
    // no box at all.
    mockTheme.value = { ads: {} }

    expect(mountAd().find('.neptu-ad').exists()).toBe(false)
  })

  it('renders slot content in place of the configured unit', () => {
    const wrapper = mountAd({}, { default: '<span class="custom">Ad</span>' })

    expect(wrapper.find('.custom').exists()).toBe(true)
    expect(wrapper.find('.ad-unit').exists()).toBe(false)
  })

  it('passes the placement through to the unit', () => {
    const wrapper = mountAd({ placement: 'aside', index: 2 })

    expect(wrapper.findComponent(AdUnit).props()).toMatchObject({
      placement: 'aside',
      index: 2,
    })
  })

  it('keys the unit by route so a new page requests a new creative', () => {
    const first = mountAd().findComponent(AdUnit).vm.$.vnode.key
    mockRoute.value = { path: '/en/posts/other' }
    const second = mountAd().findComponent(AdUnit).vm.$.vnode.key

    expect(first).not.toBe(second)
  })

  it('renders a disclosure label from the translations', () => {
    mockTheme.value = { ads: { component: 'AdUnit' }, t: { adLabel: 'Ad' } }

    expect(mountAd().find('.neptu-ad__label').text()).toBe('Ad')
  })

  it('drops the label when it is configured empty', () => {
    mockTheme.value = { ads: { component: 'AdUnit', label: '' } }

    expect(mountAd().find('.neptu-ad__label').exists()).toBe(false)
  })

  it('reserves the configured height so the page does not shift', () => {
    mockTheme.value = {
      ads: { component: 'AdUnit', minHeight: { 'in-content': 250 } },
    }

    expect(mountAd().find('.neptu-ad').attributes('style')).toContain(
      'min-height: 250px'
    )
  })

  it('skips placements that are turned off', () => {
    mockTheme.value = { ads: { component: 'AdUnit', aside: false } }

    expect(mountAd({ placement: 'aside' }).find('.neptu-ad').exists()).toBe(false)
    // after-content is opt-in
    expect(
      mountAd({ placement: 'after-content' }).find('.neptu-ad').exists()
    ).toBe(false)
  })

  it('skips pages that opt out of ads', () => {
    mockFrontmatter.value = { layout: 'post', ads: false }

    expect(mountAd().find('.neptu-ad').exists()).toBe(false)
  })

  it('renders without consent unless the site asks for a gate', () => {
    // A certified CMP already withholds personalised ads on its own, so the
    // default must not blank the slot for everyone.
    expect(mountAd().find('.neptu-ad').exists()).toBe(true)
  })

  it('withholds the unit when consent is required and not granted', () => {
    mockTheme.value = { ads: { component: 'AdUnit', requireConsent: true } }

    expect(mountAd().find('.neptu-ad').exists()).toBe(false)
  })
})
