import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SwitchLang from '../../../src/components/layout-parts/SwitchLang.vue'
import {
  mockSite,
  mockLocaleIndex,
  mockPage,
  mockTheme,
  mockRoute,
} from '../../mocks/vitepress'

describe('SwitchLang', () => {
  it('renders language dropdown when localeLinks exist', () => {
    mockSite.value = {
      locales: {
        en: { label: 'English', link: '/' },
        ru: { label: 'Русский', link: '/ru/' },
      },
      cleanUrls: true,
    }
    mockLocaleIndex.value = 'en'
    mockPage.value = { relativePath: 'en/index.md' }
    mockTheme.value = { i18nRouting: true, langMenuLabel: 'Change lang', t: { currentLang: 'Current' } }
    mockRoute.value = { path: '/' }

    const wrapper = mount(SwitchLang)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text().toLowerCase()).toContain('en')
    expect(wrapper.text()).toContain('Русский')
  })

  it('renders nothing when no other localeLinks are present', () => {
    mockSite.value = {
      locales: {
        en: { label: 'English', link: '/' },
      },
      cleanUrls: true,
    }
    mockLocaleIndex.value = 'en'
    mockPage.value = { relativePath: 'index.md' }
    mockTheme.value = { i18nRouting: true, t: { currentLang: 'Current' } }
    mockRoute.value = { path: '/' }

    const wrapper = mount(SwitchLang)
    expect(wrapper.find('.switch-lang-btn').exists()).toBe(false)
  })
})
