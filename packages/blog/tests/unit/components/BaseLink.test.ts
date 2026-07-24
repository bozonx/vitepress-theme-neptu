import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseLink from '../../../src/components/BaseLink.vue'
import { mockLocaleIndex, mockRoute } from '../../mocks/vitepress'

describe('BaseLink', () => {
  beforeEach(() => {
    mockLocaleIndex.value = 'en'
    mockRoute.value = { path: '/en/blog/1' }
  })

  it('renders as anchor by default', () => {
    const wrapper = mount(BaseLink, { props: { href: '/page' } })
    expect(wrapper.find('a').exists()).toBe(true)
    expect(wrapper.find('a').attributes('href')).toBe('/page')
  })

  it('renders custom tag when provided', () => {
    const wrapper = mount(BaseLink, { props: { tag: 'button' } })
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('a').exists()).toBe(false)
  })

  it('resolves i18n href using localeIndex', () => {
    mockLocaleIndex.value = 'ru'
    const wrapper = mount(BaseLink, { props: { href: 'about' } })
    expect(wrapper.find('a').attributes('href')).toBe('/ru/about')
  })

  it('sets target to _blank for external links', () => {
    const wrapper = mount(BaseLink, { props: { href: 'https://example.com' } })
    expect(wrapper.find('a').attributes('target')).toBe('_blank')
  })

  it('sets rel for external links', () => {
    const wrapper = mount(BaseLink, { props: { href: 'https://example.com' } })
    expect(wrapper.find('a').attributes('rel')).toBe('noopener noreferrer')
  })

  it('uses custom rel when provided', () => {
    const wrapper = mount(BaseLink, {
      props: { href: 'https://example.com', rel: 'nofollow' },
    })
    expect(wrapper.find('a').attributes('rel')).toBe('nofollow')
  })

  it('does not set target or rel for non-anchor tags', () => {
    const wrapper = mount(BaseLink, { props: { tag: 'button', href: 'https://example.com' } })
    expect(wrapper.find('button').attributes('target')).toBeUndefined()
    expect(wrapper.find('button').attributes('rel')).toBeUndefined()
  })

  it('marks active with strict match', () => {
    mockRoute.value = { path: '/en/blog/1' }
    const wrapper = mount(BaseLink, {
      props: { href: '/en/blog/1', activeCompareMethod: 'strict' },
    })
    expect(wrapper.find('a').classes()).toContain('active')
  })

  it('does not mark active with strict mismatch', () => {
    mockRoute.value = { path: '/en/blog/2' }
    const wrapper = mount(BaseLink, {
      props: { href: '/en/blog/1', activeCompareMethod: 'strict' },
    })
    expect(wrapper.find('a').classes()).not.toContain('active')
  })

  it('marks active with soft match when route starts with href', () => {
    mockRoute.value = { path: '/en/blog/1' }
    const wrapper = mount(BaseLink, {
      props: { href: '/en/blog', activeCompareMethod: 'soft' },
    })
    expect(wrapper.find('a').classes()).toContain('active')
  })

  it('does not mark active when method is none', () => {
    mockRoute.value = { path: '/en/blog/1' }
    const wrapper = mount(BaseLink, {
      props: { href: '/en/blog/1', activeCompareMethod: 'none' },
    })
    expect(wrapper.find('a').classes()).not.toContain('active')
  })

  it('marks active on pagination match', () => {
    mockRoute.value = { path: '/en/blog/2' }
    const wrapper = mount(BaseLink, {
      props: { href: '/en/blog/1', activeCompareMethod: 'pagination' },
    })
    expect(wrapper.find('a').classes()).toContain('active')
  })

  it('marks active on softPagination match', () => {
    mockRoute.value = { path: '/en/blog/3' }
    const wrapper = mount(BaseLink, {
      props: { href: '/en/blog/1', activeCompareMethod: 'softPagination' },
    })
    expect(wrapper.find('a').classes()).toContain('active')
  })

  it('passes disabled attribute even on anchor', () => {
    const wrapper = mount(BaseLink, { props: { href: '/page', disabled: true } })
    expect(wrapper.find('a').attributes('disabled')).toBeDefined()
  })

  it('sets disabled on button tag', () => {
    const wrapper = mount(BaseLink, { props: { tag: 'button', disabled: true } })
    expect(wrapper.find('button').attributes('disabled')).toBe('')
  })

  it('applies custom class', () => {
    const wrapper = mount(BaseLink, {
      props: { href: '/page', customClass: 'my-class' },
    })
    expect(wrapper.find('a').classes()).toContain('my-class')
  })
})
