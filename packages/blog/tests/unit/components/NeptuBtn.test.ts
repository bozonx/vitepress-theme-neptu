import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import NeptuBtn from '../../../src/components/NeptuBtn.vue'
import { mockTheme, mockLocaleIndex } from '../../mocks/vitepress'

const IconStub = { name: 'Icon', template: '<span class="icon-stub" />' }

describe('NeptuBtn', () => {
  beforeEach(() => {
    mockTheme.value = { externalLinkIcon: true }
    mockLocaleIndex.value = 'en'
  })

  it('renders as anchor when href is provided', () => {
    const wrapper = mount(NeptuBtn, {
      props: { href: '/page', text: 'Click' },
      global: { stubs: { Icon: IconStub } },
    })
    expect(wrapper.find('a').exists()).toBe(true)
    expect(wrapper.find('a').attributes('href')).toBe('/page')
  })

  it('renders as button when href is absent', () => {
    const wrapper = mount(NeptuBtn, {
      props: { text: 'Submit' },
      global: { stubs: { Icon: IconStub } },
    })
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('button').attributes('type')).toBeUndefined()
  })

  it('disables button and does not render href', () => {
    const wrapper = mount(NeptuBtn, {
      props: { href: '/page', disabled: true, text: 'Disabled' },
      global: { stubs: { Icon: IconStub } },
    })
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('button').attributes('disabled')).toBe('')
  })

  it('renders icon container when icon prop is set', () => {
    const wrapper = mount(NeptuBtn, {
      props: { icon: 'mdi:home', text: 'Home' },
    })
    expect(wrapper.find('.btn-base__icon-container').exists()).toBe(true)
  })

  it('renders slot content as text', () => {
    const wrapper = mount(NeptuBtn, {
      slots: { default: 'Slot text' },
      global: { stubs: { Icon: IconStub } },
    })
    expect(wrapper.text()).toContain('Slot text')
  })

  it('applies primary class when primary prop is set', () => {
    const wrapper = mount(NeptuBtn, {
      props: { primary: true, text: 'Primary' },
      global: { stubs: { Icon: IconStub } },
    })
    const link = wrapper.findComponent({ name: 'BaseLink' })
    const classes = link.props('customClass')
    expect(classes).toEqual(expect.arrayContaining(['btn--primary']))
  })

  it('applies noBg class when noBg prop is set', () => {
    const wrapper = mount(NeptuBtn, {
      props: { noBg: true, text: 'Ghost' },
      global: { stubs: { Icon: IconStub } },
    })
    const link = wrapper.findComponent({ name: 'BaseLink' })
    const classes = link.props('customClass')
    expect(classes).toEqual(expect.arrayContaining(['btn--nobg']))
  })

  it('applies activeCompareMethod to BaseLink', () => {
    const wrapper = mount(NeptuBtn, {
      props: { href: '/page', activeCompareMethod: 'soft', text: 'Link' },
      global: { stubs: { Icon: IconStub } },
    })
    const link = wrapper.findComponent({ name: 'BaseLink' })
    expect(link.props('activeCompareMethod')).toBe('soft')
  })

  it('adds external link icon class for external href', () => {
    const wrapper = mount(NeptuBtn, {
      props: { href: 'https://example.com', text: 'External' },
      global: { stubs: { Icon: IconStub } },
    })
    const span = wrapper.find('span.vp-external-link-icon')
    expect(span.exists()).toBe(true)
  })

  it('hides external icon when hideExternalIcon is true', () => {
    const wrapper = mount(NeptuBtn, {
      props: { href: 'https://example.com', text: 'External', hideExternalIcon: true },
      global: { stubs: { Icon: IconStub } },
    })
    const span = wrapper.find('span.vp-external-link-icon')
    expect(span.exists()).toBe(false)
  })
})
