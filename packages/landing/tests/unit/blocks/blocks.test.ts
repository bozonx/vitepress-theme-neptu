import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LnHero from '../../../src/blocks/LnHero.vue'
import LnFeatureGrid from '../../../src/blocks/LnFeatureGrid.vue'
import LnPricing from '../../../src/blocks/LnPricing.vue'
import LnFaq from '../../../src/blocks/LnFaq.vue'
import LnCarousel from '../../../src/blocks/LnCarousel.vue'
import LnGallery from '../../../src/blocks/LnGallery.vue'
import { blockTypes, resolveBlock } from '../../../src/blocks/registry.ts'

describe('block registry', () => {
  it('exposes every block type', () => {
    expect(blockTypes).toHaveLength(21)
    expect(blockTypes).toEqual(
      expect.arrayContaining([
        'hero', 'features', 'faq', 'cta',
        'code', 'tabs', 'compare', 'newsletter', 'video', 'banner',
      ])
    )
  })

  it('resolves known types and returns undefined for unknown ones', () => {
    expect(resolveBlock('hero')).toBeTruthy()
    expect(resolveBlock('nope')).toBeUndefined()
  })
})

describe('LnHero', () => {
  it('renders the title as an h1 with actions and media', () => {
    const wrapper = mount(LnHero, {
      props: {
        title: 'Build from blocks',
        text: 'Landing and docs',
        image: '/img/hero.svg',
        actions: [{ text: 'Start', link: '/doc' }],
      },
    })

    expect(wrapper.find('h1').text()).toContain('Build from blocks')
    expect(wrapper.find('.ln-hero__media img').attributes('src')).toBe('/img/hero.svg')
    expect(wrapper.find('.ln-btn').attributes('href')).toBe('/doc')
  })

  it('moves the image to the background in the cover variant', () => {
    const wrapper = mount(LnHero, {
      props: { variant: 'cover', title: 'Cover', image: '/img/bg.jpg' },
    })

    expect(wrapper.find('.ln-hero__bg img').attributes('src')).toBe('/img/bg.jpg')
    expect(wrapper.find('.ln-hero__media').exists()).toBe(false)
    expect(wrapper.find('.ln-hero__overlay').exists()).toBe(true)
  })
})

describe('LnFeatureGrid', () => {
  it('renders one card per item and links them when asked', () => {
    const wrapper = mount(LnFeatureGrid, {
      props: {
        title: 'Features',
        cols: 3,
        items: [
          { title: 'One', text: 'First', icon: '🚀' },
          { title: 'Two', text: 'Second', link: '/two', linkText: 'More' },
        ],
      },
    })

    expect(wrapper.findAll('.ln-feature')).toHaveLength(2)
    expect(wrapper.find('.ln-grid--3').exists()).toBe(true)
    expect(wrapper.findAll('.ln-feature')[1].attributes('href')).toBe('/two')
    expect(wrapper.find('.ln-feature__link').text()).toBe('More')
  })
})

describe('LnPricing', () => {
  const plans = [
    { title: 'Free', price: '$0', features: ['One', { text: 'Two', included: false }] },
    { title: 'Pro', price: '$9', priceYearly: '$90', period: '/ mo', periodYearly: '/ yr', featured: true },
  ]

  it('shows the period switch only when a yearly price exists', () => {
    const withYearly = mount(LnPricing, { props: { items: plans } })
    const withoutYearly = mount(LnPricing, { props: { items: [plans[0]] } })

    expect(withYearly.find('.ln-pricing__toggle').exists()).toBe(true)
    expect(withoutYearly.find('.ln-pricing__toggle').exists()).toBe(false)
  })

  it('switches prices when the yearly tab is selected', async () => {
    const wrapper = mount(LnPricing, { props: { items: plans } })

    expect(wrapper.text()).toContain('$9')
    await wrapper.findAll('.ln-pricing__toggle-btn')[1].trigger('click')
    expect(wrapper.text()).toContain('$90')
    expect(wrapper.text()).toContain('/ yr')
  })

  it('marks excluded features', () => {
    const wrapper = mount(LnPricing, { props: { items: plans } })

    expect(wrapper.findAll('.ln-plan__features li.is-excluded')).toHaveLength(1)
    expect(wrapper.find('.ln-card--featured').exists()).toBe(true)
  })
})

describe('LnFaq', () => {
  it('renders native details elements and groups them when exclusive', () => {
    const wrapper = mount(LnFaq, {
      props: {
        id: 'faq',
        exclusive: true,
        items: [
          { question: 'First?', answer: 'Yes', open: true },
          { question: 'Second?', answer: 'Also yes' },
        ],
      },
    })

    const items = wrapper.findAll('details')
    expect(items).toHaveLength(2)
    expect(items[0].attributes('open')).toBeDefined()
    expect(items[0].attributes('name')).toBe('ln-faq-faq')
  })
})

describe('LnCarousel', () => {
  it('renders a slide per item plus dots and arrows', () => {
    const wrapper = mount(LnCarousel, {
      props: {
        title: 'Presets',
        items: [
          { title: 'One', image: '/img/1.svg' },
          { title: 'Two', image: '/img/2.svg' },
          { title: 'Three' },
        ],
      },
    })

    expect(wrapper.findAll('.ln-carousel__slide')).toHaveLength(3)
    expect(wrapper.findAll('.ln-carousel__dot')).toHaveLength(3)
    expect(wrapper.findAll('.ln-carousel__arrow')).toHaveLength(2)
    // A labelled `group` with a role description is what AT needs here — an
    // `aria-label` on a plain region says nothing about the slides.
    const track = wrapper.find('.ln-carousel__track')
    expect(track.attributes('role')).toBe('group')
    expect(track.attributes('aria-roledescription')).toBe('carousel')
    expect(wrapper.find('.ln-carousel__slide').attributes('aria-roledescription')).toBe('slide')
  })

  it('hides the controls for a single slide', () => {
    const wrapper = mount(LnCarousel, { props: { items: [{ title: 'Only' }] } })

    expect(wrapper.findAll('.ln-carousel__dot')).toHaveLength(0)
    expect(wrapper.findAll('.ln-carousel__arrow')).toHaveLength(0)
  })
})

describe('LnGallery', () => {
  it('renders a lightbox dialog when enabled', () => {
    const wrapper = mount(LnGallery, {
      props: { items: [{ src: '/img/1.svg', caption: 'One' }, { src: '/img/2.svg' }] },
    })

    expect(wrapper.findAll('.ln-gallery__item')).toHaveLength(2)
    expect(wrapper.find('dialog.ln-gallery__dialog').exists()).toBe(true)
  })

  it('omits the dialog when the lightbox is off', () => {
    const wrapper = mount(LnGallery, {
      props: { lightbox: false, items: [{ src: '/img/1.svg' }] },
    })

    expect(wrapper.find('dialog').exists()).toBe(false)
  })
})
