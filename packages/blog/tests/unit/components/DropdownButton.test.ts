import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DropdownButton from '../../../src/components/DropdownButton.vue'

const NeptuBtnStub = {
  template: '<button @click.stop.prevent="$emit(\'click\', $event)"><slot /></button>',
}

describe('DropdownButton', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts with closed menu', () => {
    const wrapper = mount(DropdownButton, {
      global: { stubs: { NeptuNeptuBtn: NeptuBtnStub, Icon: true } },
    })
    expect(wrapper.find('[role="menu"]').classes()).toContain('hidden')
    expect(wrapper.find('button').attributes('aria-expanded')).toBe('false')
  })

  it('toggles menu open on button click', async () => {
    const wrapper = mount(DropdownButton, {
      global: { stubs: { NeptuNeptuBtn: NeptuBtnStub, Icon: true } },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('[role="menu"]').classes()).not.toContain('hidden')
    expect(wrapper.find('button').attributes('aria-expanded')).toBe('true')
  })

  it('sets aria-controls to menu id', () => {
    const wrapper = mount(DropdownButton, {
      global: { stubs: { NeptuNeptuBtn: NeptuBtnStub, Icon: true } },
    })
    const menuId = wrapper.find('[role="menu"]').attributes('id')
    expect(wrapper.find('button').attributes('aria-controls')).toBe(menuId)
    expect(menuId).toMatch(/^dropdown-menu-/)
  })

  it('renders btn-text and default slots', () => {
    const wrapper = mount(DropdownButton, {
      slots: {
        'btn-text': 'Open',
        default: '<a href="/link">Link</a>',
      },
      global: { stubs: { NeptuNeptuBtn: NeptuBtnStub, Icon: true } },
    })
    expect(wrapper.text()).toContain('Open')
    expect(wrapper.find('[role="menu"] a').exists()).toBe(true)
  })

  it('applies dropUp class when dropUp prop is set', () => {
    const wrapper = mount(DropdownButton, {
      props: { dropUp: true },
      global: { stubs: { NeptuNeptuBtn: NeptuBtnStub, Icon: true } },
    })
    expect(wrapper.find('[role="menu"]').classes()).toContain('dropdown--drop-up')
  })

  it('applies dropLeft class when dropLeft prop is set', () => {
    const wrapper = mount(DropdownButton, {
      props: { dropLeft: true },
      global: { stubs: { NeptuNeptuBtn: NeptuBtnStub, Icon: true } },
    })
    expect(wrapper.find('[role="menu"]').classes()).toContain('dropdown--drop-left')
  })
})
