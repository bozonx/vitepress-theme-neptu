import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LocaleSelector from '../../../src/components/LocaleSelector.vue'
import { mockSite } from '../../mocks/vitepress'

describe('LocaleSelector', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders locale links with the configured base and ignores the root locale', () => {
    mockSite.value = {
      base: '/project/',
      locales: {
        root: { label: 'Root' },
        en: { label: 'English', lang: 'en-US' },
        ru: { label: 'Русский', lang: 'ru-RU' },
      },
    }

    const wrapper = mount(LocaleSelector)
    const links = wrapper.findAll('.locale-selector__links a')

    expect(links).toHaveLength(2)
    expect(links[0]?.attributes('href')).toBe('/project/en/')
    expect(links[0]?.attributes('lang')).toBe('en-US')
    expect(links[1]?.attributes('href')).toBe('/project/ru/')
  })

  it('marks the browser locale visually without navigating automatically', async () => {
    vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('ru-RU')
    mockSite.value = {
      base: '/',
      locales: {
        en: { label: 'English', lang: 'en-US' },
        ru: { label: 'Русский', lang: 'ru-RU' },
      },
    }

    const wrapper = mount(LocaleSelector)
    await wrapper.vm.$nextTick()

    const detected = wrapper.find('a.locale-selector__link--detected')
    expect(detected.attributes('href')).toBe('/ru/')
    expect(detected.attributes('aria-current')).toBe('true')
    // Nothing labels the detection, so the page stays language-neutral.
    expect(wrapper.text()).not.toMatch(/recommend/i)
  })

  it('shows the site title and nothing else to translate', () => {
    mockSite.value = {
      base: '/',
      title: 'Neptu blog theme',
      locales: {
        en: { label: 'English', lang: 'en-US' },
        ru: { label: 'Русский', lang: 'ru-RU' },
      },
    }

    const wrapper = mount(LocaleSelector)

    expect(wrapper.get('h1').text()).toBe('Neptu blog theme')
    expect(wrapper.find('.locale-selector__description').exists()).toBe(false)
  })
})
