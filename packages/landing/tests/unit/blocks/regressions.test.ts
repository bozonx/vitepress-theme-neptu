/**
 * Regression tests for bugs that were shipped once. Each case names the thing
 * that was actually broken, so a future refactor cannot quietly undo the fix.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LnHero from '../../../src/blocks/LnHero.vue'
import LnFeatureSplit from '../../../src/blocks/LnFeatureSplit.vue'
import LnFeatureGrid from '../../../src/blocks/LnFeatureGrid.vue'
import LnLogoCloud from '../../../src/blocks/LnLogoCloud.vue'
import LnBento from '../../../src/blocks/LnBento.vue'
import LnFaq from '../../../src/blocks/LnFaq.vue'
import LnIcon from '../../../src/primitives/LnIcon.vue'
import LnCta from '../../../src/blocks/LnCta.vue'
import { mockSite } from '../../mocks/vitepress'

describe('site base handling', () => {
  beforeEach(() => {
    mockSite.value = { ...mockSite.value, base: '/project/' }
  })

  it('prefixes the hero cover background', () => {
    const wrapper = mount(LnHero, {
      props: { variant: 'cover', title: 'Hi', image: '/img/cover.jpg' },
    })

    expect(wrapper.find('.ln-hero__bg img').attributes('src')).toBe('/project/img/cover.jpg')
  })

  it('prefixes an image icon', () => {
    const wrapper = mount(LnIcon, { props: { icon: '/img/icon.svg' } })

    expect(wrapper.find('img').attributes('src')).toBe('/project/img/icon.svg')
  })

  it('prefixes the inline link of a feature-split row', () => {
    const wrapper = mount(LnFeatureSplit, {
      props: { items: [{ title: 'One', link: '/doc', linkText: 'Read' }] },
    })

    expect(wrapper.find('.ln-split__link').attributes('href')).toBe('/project/doc')
  })

  it('leaves external URLs and anchors alone', () => {
    const wrapper = mount(LnFeatureSplit, {
      props: {
        items: [
          { title: 'One', link: 'https://example.com', linkText: 'Out' },
          { title: 'Two', link: '#pricing', linkText: 'Down' },
        ],
      },
    })

    const links = wrapper.findAll('.ln-split__link')
    expect(links[0].attributes('href')).toBe('https://example.com')
    expect(links[0].attributes('target')).toBe('_blank')
    expect(links[1].attributes('href')).toBe('#pricing')
    expect(links[1].attributes('target')).toBeUndefined()
  })
})

describe('LnLogoCloud marquee', () => {
  const items = [{ src: '/a.svg', alt: 'A', link: '/a' }, { src: '/b.svg', alt: 'B' }]

  it('duplicates the group but hides the clone from assistive tech', () => {
    const wrapper = mount(LnLogoCloud, { props: { variant: 'marquee', items } })

    const groups = wrapper.findAll('.ln-logos__group')
    expect(groups).toHaveLength(2)
    expect(groups[0].attributes('aria-hidden')).toBeUndefined()
    expect(groups[1].attributes('aria-hidden')).toBe('true')
    // The clone must not be reachable by keyboard or announced twice.
    expect(groups[1].findAll('a')).toHaveLength(0)
    expect(groups[1].find('img').attributes('alt')).toBe('')
  })

  it('keeps logo links in the marquee, not just the static row', () => {
    const wrapper = mount(LnLogoCloud, { props: { variant: 'marquee', items } })

    expect(wrapper.find('.ln-logos__group a').exists()).toBe(true)
  })
})

describe('LnBento spans', () => {
  it('clamps a span to the column count and emits a plain integer', () => {
    const wrapper = mount(LnBento, {
      props: { cols: 2, items: [{ title: 'Wide', span: 2 as const }] },
    })

    // `span min(…)` in CSS is not portable — the number is resolved here.
    expect(wrapper.find('.ln-bento__tile').attributes('style')).toContain('--ln-tile-span: 2')
  })
})

describe('LnFeatureGrid slot', () => {
  it('appends slotted cards instead of replacing the items', () => {
    const wrapper = mount(LnFeatureGrid, {
      props: { items: [{ title: 'One' }, { title: 'Two' }] },
      slots: { default: '<div class="extra">Three</div>' },
    })

    expect(wrapper.findAll('.ln-feature')).toHaveLength(2)
    expect(wrapper.find('.extra').exists()).toBe(true)
  })
})

describe('LnFaq structured data', () => {
  const items = [{ question: 'Is it <em>free</em>?', answer: '<p>Yes, MIT.</p>' }]

  it('emits FAQPage JSON-LD built from the same items', () => {
    const wrapper = mount(LnFaq, { props: { items } })
    const script = wrapper.find('script[type="application/ld+json"]')

    expect(script.exists()).toBe(true)
    const data = JSON.parse(script.element.textContent ?? '{}')
    expect(data['@type']).toBe('FAQPage')
    // Tags are stripped: search engines index the text, not the markup.
    expect(data.mainEntity[0].name).toBe('Is it free ?')
    expect(data.mainEntity[0].acceptedAnswer.text).toBe('Yes, MIT.')
  })

  it('writes real JSON, not HTML entities', () => {
    const wrapper = mount(LnFaq, { props: { items } })
    // A `<script>` body is raw text: `&quot;` would reach the crawler verbatim
    // and the JSON would not parse.
    expect(wrapper.html()).not.toContain('&quot;@type&quot;')
  })

  it('neutralises a closing tag hidden in an answer', () => {
    const wrapper = mount(LnFaq, {
      props: { items: [{ question: 'Q', answer: 'a </script> b' }] },
    })
    const script = wrapper.find('script[type="application/ld+json"]')

    expect(script.element.innerHTML).not.toContain('</script>')
    expect(JSON.parse(script.element.textContent ?? '{}')['@type']).toBe('FAQPage')
  })

  it('can be turned off', () => {
    const wrapper = mount(LnFaq, { props: { items, schema: false } })

    expect(wrapper.find('script[type="application/ld+json"]').exists()).toBe(false)
  })
})

describe('LnCta card variant', () => {
  it('lets the surrounding strip keep the page background alternation', () => {
    const wrapper = mount(LnCta, {
      props: { variant: 'card', bg: 'brand', surface: 'soft', title: 'Go' },
    })

    expect(wrapper.find('.ln-section').classes()).toContain('ln-section--bg-soft')
    expect(wrapper.find('.ln-cta__panel').attributes('data-ln-cta-bg')).toBe('brand')
  })
})
