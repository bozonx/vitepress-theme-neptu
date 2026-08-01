import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LayoutAside from '../../../src/components/layout-parts/LayoutAside.vue'
import { mockFrontmatter, mockPage, mockTheme } from '../../mocks/vitepress'

const stubs = {
  TocAside: { name: 'TocAside', template: '<nav class="toc-aside-stub" />' },
  NeptuAd: {
    name: 'NeptuAd',
    props: ['placement', 'index'],
    template: '<div class="neptu-ad-stub" />',
  },
}

const mountAside = (slots: Record<string, string> = {}) =>
  mount(LayoutAside, { slots, global: { stubs } })

/** Three headings clear the default `minHeadings` threshold. */
const headers = [
  { level: 2, title: 'One', link: '#one' },
  { level: 2, title: 'Two', link: '#two' },
  { level: 2, title: 'Three', link: '#three' },
]

describe('LayoutAside', () => {
  beforeEach(() => {
    mockFrontmatter.value = { layout: 'post' }
    mockTheme.value = {}
    mockPage.value = { title: 'Hello', headers: [] }
  })

  it('renders nothing when there is no content for the column', () => {
    // An empty column would still consume its width and shove the article left.
    expect(mountAside().find('.aside-container').exists()).toBe(false)
  })

  it('renders the table of contents once the page has enough headings', () => {
    mockPage.value = { title: 'Hello', headers }

    const wrapper = mountAside()

    expect(wrapper.find('.aside-container').exists()).toBe(true)
    expect(wrapper.find('.toc-aside-stub').exists()).toBe(true)
  })

  it('leaves the table of contents out below the heading threshold', () => {
    mockPage.value = { title: 'Hello', headers: headers.slice(0, 2) }

    expect(mountAside().find('.toc-aside-stub').exists()).toBe(false)
  })

  it('keeps the table of contents out of the column when position is top', () => {
    mockPage.value = { title: 'Hello', headers }
    mockTheme.value = { toc: { position: 'top' } }

    expect(mountAside().find('.toc-aside-stub').exists()).toBe(false)
  })

  it('renders the configured ad unit', () => {
    mockTheme.value = { ads: { component: 'AdUnit' } }

    const wrapper = mountAside()

    expect(wrapper.find('.neptu-ad-stub').exists()).toBe(true)
  })

  it('omits the ad unit when the aside placement is off', () => {
    mockTheme.value = { ads: { component: 'AdUnit', aside: false } }

    expect(mountAside().find('.neptu-ad-stub').exists()).toBe(false)
  })

  it('omits the ad unit on a page that opts out of ads', () => {
    mockFrontmatter.value = { layout: 'post', ads: false }
    mockTheme.value = { ads: { component: 'AdUnit' } }

    expect(mountAside().find('.neptu-ad-stub').exists()).toBe(false)
  })

  it('renders slot content as-is, without the ad frame', () => {
    const wrapper = mountAside({ default: '<div class="promo">Promo</div>' })

    expect(wrapper.find('.aside-container').exists()).toBe(true)
    expect(wrapper.find('.promo').exists()).toBe(true)
    expect(wrapper.find('.neptu-ad-stub').exists()).toBe(false)
  })
})
