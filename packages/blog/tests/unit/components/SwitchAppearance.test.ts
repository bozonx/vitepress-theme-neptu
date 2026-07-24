import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SwitchAppearance from '../../../src/components/layout-parts/SwitchAppearance.vue'
import { mockIsDark, mockTheme } from '../../mocks/vitepress'

describe('SwitchAppearance', () => {
  beforeEach(() => {
    mockIsDark.value = false
    mockTheme.value = {
      lightModeSwitchTitle: 'Light',
      darkModeSwitchTitle: 'Dark',
    }
  })

  it('renders switch button', () => {
    const wrapper = mount(SwitchAppearance)
    const btn = wrapper.find('button[role="switch"]')
    expect(btn.exists()).toBe(true)
  })

  it('shows dark mode title when not dark', async () => {
    mockIsDark.value = false
    const wrapper = mount(SwitchAppearance)
    await nextTick()
    const btn = wrapper.find('button[role="switch"]')
    expect(btn.attributes('title')).toBe('Dark')
  })

  it('shows light mode title when dark', async () => {
    mockIsDark.value = true
    const wrapper = mount(SwitchAppearance)
    await nextTick()
    const btn = wrapper.find('button[role="switch"]')
    expect(btn.attributes('title')).toBe('Light')
  })

  it('toggles isDark on click with default toggle', async () => {
    mockIsDark.value = false
    const wrapper = mount(SwitchAppearance)
    const btn = wrapper.find('button[role="switch"]')
    await btn.trigger('click')
    expect(mockIsDark.value).toBe(true)
    await btn.trigger('click')
    expect(mockIsDark.value).toBe(false)
  })

  it('uses injected toggle-appearance if provided', async () => {
    const injectedToggle = vi.fn()
    mockIsDark.value = false
    const wrapper = mount(SwitchAppearance, {
      global: {
        provide: {
          'toggle-appearance': injectedToggle,
        },
      },
    })
    const btn = wrapper.find('button[role="switch"]')
    await btn.trigger('click')
    expect(injectedToggle).toHaveBeenCalled()
    expect(mockIsDark.value).toBe(false)
  })

  it('reflects aria-checked state', async () => {
    mockIsDark.value = true
    const wrapper = mount(SwitchAppearance)
    await nextTick()
    expect(wrapper.find('button').attributes('aria-checked')).toBe('true')
  })
})
