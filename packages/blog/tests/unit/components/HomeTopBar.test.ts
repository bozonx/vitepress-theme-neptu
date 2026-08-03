import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeTopBar from '../../../src/components/layout-parts/HomeTopBar.vue'

const SwitchLangStub = { name: 'SwitchLang', template: '<div class="lang-stub" />' }
const SwitchAppearanceStub = { name: 'SwitchAppearance', template: '<div class="appearance-stub" />' }
const ColorThemePickerStub = { name: 'ColorThemePicker', template: '<div class="color-picker-stub" />' }
const StylePresetPickerStub = { name: 'StylePresetPicker', template: '<div class="preset-picker-stub" />' }

describe('HomeTopBar', () => {
  it('renders theme and language controls without mobile hidden class', () => {
    const wrapper = mount(HomeTopBar, {
      global: {
        stubs: {
          SwitchLang: SwitchLangStub,
          SwitchAppearance: SwitchAppearanceStub,
          ColorThemePicker: ColorThemePickerStub,
          StylePresetPicker: StylePresetPickerStub,
        },
      },
    })

    const switchComp = wrapper.findComponent({ name: 'SwitchAppearance' })
    expect(switchComp.exists()).toBe(true)
    expect(switchComp.element.parentElement?.classList.contains('max-lg:hidden')).toBe(false)

    const langComp = wrapper.findComponent({ name: 'SwitchLang' })
    expect(langComp.exists()).toBe(true)
    expect(langComp.element.parentElement?.classList.contains('max-lg:hidden')).toBe(false)
  })

  it('hides appearance switcher when hideAppearance prop is true', () => {
    const wrapper = mount(HomeTopBar, {
      props: { hideAppearance: true },
      global: {
        stubs: {
          SwitchLang: SwitchLangStub,
          SwitchAppearance: SwitchAppearanceStub,
          ColorThemePicker: ColorThemePickerStub,
          StylePresetPicker: StylePresetPickerStub,
        },
      },
    })

    expect(wrapper.findComponent({ name: 'SwitchAppearance' }).exists()).toBe(false)
    expect(wrapper.findComponent({ name: 'SwitchLang' }).exists()).toBe(true)
  })

  it('renders nav-bar-content-before slot', () => {
    const wrapper = mount(HomeTopBar, {
      global: {
        stubs: {
          SwitchLang: SwitchLangStub,
          SwitchAppearance: SwitchAppearanceStub,
          ColorThemePicker: ColorThemePickerStub,
          StylePresetPicker: StylePresetPickerStub,
        },
      },
      slots: {
        'nav-bar-content-before': '<div class="custom-before">Custom Content</div>',
      },
    })

    expect(wrapper.find('.custom-before').exists()).toBe(true)
  })
})
