import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'

const themeConfig = ref<Record<string, unknown>>({})

vi.mock('vitepress', () => ({
  useData: () => ({ theme: themeConfig }),
  inBrowser: true,
}))

const { default: ColorThemePicker } = await import(
  '../../../src/components/theme/ColorThemePicker.vue'
)
const { default: StylePresetPicker } = await import(
  '../../../src/components/theme/StylePresetPicker.vue'
)
const { STYLE_PRESETS, STYLE_ATTRIBUTE } = await import(
  '../../../src/composables/useStylePreset.ts'
)
const { COLOR_THEME_PRESETS, COLOR_ATTRIBUTE } = await import(
  '../../../src/composables/useColorTheme.ts'
)

const mountPicker = (component: unknown) =>
  mount(component as never, { global: { stubs: { Icon: true } } })

beforeEach(() => {
  themeConfig.value = {}
  localStorage.clear()
  document.documentElement.removeAttribute(STYLE_ATTRIBUTE)
  document.documentElement.removeAttribute(COLOR_ATTRIBUTE)
})

describe('ColorThemePicker', () => {
  it('renders nothing until colorPicker is enabled', () => {
    expect(mountPicker(ColorThemePicker).find('button').exists()).toBe(false)
  })

  it('is unaffected by the other axis flag', () => {
    themeConfig.value = { stylePicker: true }

    expect(mountPicker(ColorThemePicker).find('button').exists()).toBe(false)
  })

  it('lists every color theme once enabled', () => {
    themeConfig.value = { colorPicker: true }

    const wrapper = mountPicker(ColorThemePicker)

    expect(wrapper.findAll('[role="menuitemradio"]')).toHaveLength(
      COLOR_THEME_PRESETS.length
    )
  })

  it('applies the picked theme to the document', async () => {
    themeConfig.value = { colorPicker: true }
    const wrapper = mountPicker(ColorThemePicker)

    await wrapper.findAll('[role="menuitemradio"]')[2]!.trigger('click')

    expect(document.documentElement.getAttribute(COLOR_ATTRIBUTE)).toBe(
      COLOR_THEME_PRESETS[2]!.id
    )
  })

  it('uses the configured label', () => {
    themeConfig.value = { colorPicker: true, colorThemeMenuLabel: 'Палитра' }

    expect(mountPicker(ColorThemePicker).find('button').attributes('aria-label')).toBe(
      'Палитра'
    )
  })
})

describe('StylePresetPicker', () => {
  it('renders nothing until stylePicker is enabled', () => {
    themeConfig.value = { colorPicker: true }

    expect(mountPicker(StylePresetPicker).find('button').exists()).toBe(false)
  })

  it('lists every preset once enabled', () => {
    themeConfig.value = { stylePicker: true }

    const wrapper = mountPicker(StylePresetPicker)

    expect(wrapper.findAll('[role="menuitemradio"]')).toHaveLength(
      STYLE_PRESETS.length
    )
  })

  it('applies the picked preset to the document', async () => {
    themeConfig.value = { stylePicker: true }
    const wrapper = mountPicker(StylePresetPicker)

    await wrapper.findAll('[role="menuitemradio"]')[2]!.trigger('click')

    expect(document.documentElement.getAttribute(STYLE_ATTRIBUTE)).toBe(
      STYLE_PRESETS[2]!.id
    )
  })

  it('renders regardless of config when forced', () => {
    const wrapper = mount(StylePresetPicker, {
      props: { force: true },
      global: { stubs: { Icon: true } },
    })

    expect(wrapper.find('button').exists()).toBe(true)
  })
})
