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
    const links = wrapper.findAll('a')

    expect(links).toHaveLength(2)
    expect(links[0]?.attributes('href')).toBe('/project/en/')
    expect(links[0]?.attributes('lang')).toBe('en-US')
    expect(links[1]?.attributes('href')).toBe('/project/ru/')
  })

  it('recommends the browser locale without navigating automatically', async () => {
    vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('ru-RU')
    mockSite.value = {
      base: '/',
      locales: {
        en: { label: 'English', lang: 'en-US' },
        ru: { label: 'Русский', lang: 'ru-RU' },
      },
    }

    const wrapper = mount(LocaleSelector, {
      props: { recommendedLabel: 'Recommended' },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Recommended')
    expect(wrapper.find('a.locale-selector__link--recommended').attributes('href')).toBe('/ru/')
  })
})
