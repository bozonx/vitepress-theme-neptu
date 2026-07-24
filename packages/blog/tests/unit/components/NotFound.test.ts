import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import NotFound from '../../../src/components/layout-parts/NotFound.vue'
import { mockLocaleIndex, mockTheme } from '../../mocks/vitepress'

describe('NotFound', () => {
  beforeEach(() => {
    mockLocaleIndex.value = 'ru'
    mockTheme.value = {
      t: { pageNotFound: 'Страница не найдена', toHome: 'На главную' },
    }
  })

  it('renders localized copy and locale-aware home link', () => {
    const wrapper = mount(NotFound)

    expect(wrapper.text()).toContain('Страница не найдена')
    expect(wrapper.find('a').text()).toBe('На главную')
    expect(wrapper.find('a').attributes('href')).toBe('/ru/')
  })

  it('uses notFound.title when provided', () => {
    mockTheme.value = {
      notFound: { title: 'Custom 404 Title' },
      t: { pageNotFound: 'Default 404', toHome: 'Home' },
    }
    const wrapper = mount(NotFound)

    expect(wrapper.text()).toContain('Custom 404 Title')
    expect(wrapper.text()).not.toContain('Default 404')
  })

  it('uses notFound.linkText when provided', () => {
    mockTheme.value = {
      notFound: { linkText: 'Go back' },
      t: { pageNotFound: 'Not found', toHome: 'Home' },
    }
    const wrapper = mount(NotFound)

    expect(wrapper.find('a').text()).toBe('Go back')
  })

  it('falls back to t values when notFound options are missing', () => {
    mockTheme.value = {
      t: { pageNotFound: 'Fallback Not Found', toHome: 'Fallback Home' },
    }
    const wrapper = mount(NotFound)

    expect(wrapper.text()).toContain('Fallback Not Found')
    expect(wrapper.find('a').text()).toBe('Fallback Home')
  })

  it('links to "/" when localeIndex is "root" (single-locale site)', () => {
    mockLocaleIndex.value = 'root'
    mockTheme.value = {
      t: { pageNotFound: 'Not found', toHome: 'Home' },
    }
    const wrapper = mount(NotFound)

    expect(wrapper.find('a').attributes('href')).toBe('/')
  })
})
