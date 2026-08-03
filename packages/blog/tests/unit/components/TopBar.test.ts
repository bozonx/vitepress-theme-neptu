import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TopBar from '../../../src/components/layout-parts/TopBar.vue'
import { mockTheme } from '../../mocks/vitepress'

const NeptuBtnStub = {
  name: 'NeptuBtn',
  template: '<button class="btn-stub" :class="$props.class" :title="$props.title"><span v-if="$props.text" :class="$props.textClass">{{ $props.text }}</span><slot /></button>',
  props: ['icon', 'noBg', 'class', 'iconClass', 'text', 'textClass', 'title', 'href'],
}
const SwitchLangStub = { name: 'SwitchLang', template: '<div class="lang-stub" />', props: ['noBg'] }
const SwitchAppearanceStub = { name: 'SwitchAppearance', template: '<div class="appearance-stub" />' }
const ColorThemePickerStub = { name: 'ColorThemePicker', template: '<div class="color-picker-stub" />' }
const StylePresetPickerStub = { name: 'StylePresetPicker', template: '<div class="style-picker-stub" />' }

const globalStubs = {
  stubs: {
    NeptuBtn: NeptuBtnStub,
    SwitchLang: SwitchLangStub,
    SwitchAppearance: SwitchAppearanceStub,
    ColorThemePicker: ColorThemePickerStub,
    StylePresetPicker: StylePresetPickerStub,
  },
}

describe('TopBar', () => {
  beforeEach(() => {
    mockTheme.value = {
      nav: {
        links: [
          { text: 'Home', href: '/', desktopOnly: true },
          { text: 'Mobile', href: '/m', mobileOnly: true },
        ],
        socialLinks: [{ url: 'https://x.com/test', icon: 'x' }],
      },
      donate: null,
      sidebarMenuLabel: 'Menu',
    }
  })

  it('renders nav links with correct text and props', () => {
    const wrapper = mount(TopBar, { global: globalStubs })
    const btns = wrapper.findAllComponents({ name: 'NeptuBtn' })
    const texts = btns.map((b) => b.props('text'))
    expect(texts).toContain('Home')
    expect(texts).toContain('Mobile')
    expect(texts).toContain('Menu')
  })

  it('applies responsive visibility classes to nav links', () => {
    const wrapper = mount(TopBar, { global: globalStubs })
    const listItems = wrapper.findAll('li')
    const homeLi = listItems.find((li) => li.classes().includes('max-lg:hidden'))
    const mobileLi = listItems.find((li) => li.classes().includes('lg:hidden'))
    expect(homeLi).toBeDefined()
    expect(mobileLi).toBeDefined()
  })

  it('renders donate link when nav.donate and theme.donate are set', () => {
    mockTheme.value = {
      nav: {
        links: [],
        socialLinks: [],
        donate: true,
      },
      donate: { url: 'https://donate.example.com', icon: 'mdi:heart' },
      t: { links: { donate: 'Donate' } },
      sidebarMenuLabel: 'Menu',
    }
    const wrapper = mount(TopBar, { global: globalStubs })
    const btns = wrapper.findAllComponents({ name: 'NeptuBtn' })
    const donateBtn = btns.find((b) => b.props('text') === 'Donate')
    expect(donateBtn).toBeDefined()
    expect(donateBtn!.props('icon')).toBe('mdi:heart')
    expect(donateBtn!.props('href')).toBe('https://donate.example.com')
  })

  it('donate button has title attribute and hides text on mobile', () => {
    mockTheme.value = {
      nav: {
        links: [],
        socialLinks: [],
        donate: true,
      },
      donate: { url: 'https://donate.example.com', icon: 'mdi:heart' },
      t: { links: { donate: 'Donate' } },
      sidebarMenuLabel: 'Menu',
    }
    const wrapper = mount(TopBar, { global: globalStubs })
    const donateBtn = wrapper.findAllComponents({ name: 'NeptuBtn' }).find((b) => b.props('text') === 'Donate')
    expect(donateBtn).toBeDefined()
    expect(donateBtn!.props('title')).toBe('Donate')
    expect(donateBtn!.props('textClass')).toBe('max-lg:hidden')
  })

  it('hides donate button in minimal (home) mode', () => {
    mockTheme.value = {
      nav: {
        links: [],
        socialLinks: [],
        donate: true,
      },
      donate: { url: 'https://donate.example.com', icon: 'mdi:heart' },
      t: { links: { donate: 'Donate' } },
      sidebarMenuLabel: 'Menu',
    }
    const wrapper = mount(TopBar, {
      global: globalStubs,
      props: { minimal: true, hideMenuButton: true },
    })
    const donateBtn = wrapper.findAllComponents({ name: 'NeptuBtn' }).find((b) => b.props('text') === 'Donate')
    expect(donateBtn).toBeUndefined()
  })

  it('emits openDrawer when menu button clicked', () => {
    const wrapper = mount(TopBar, { global: globalStubs })
    const menuBtn = wrapper.findAllComponents({ name: 'NeptuBtn' }).find((b) => b.props('icon') === 'fa6-solid:bars')
    expect(menuBtn).toBeDefined()
    menuBtn!.vm.$emit('click')
    expect(wrapper.emitted('openDrawer')).toHaveLength(1)
  })

  it('renders switch appearance in topbar with mobile hidden class (default mode)', () => {
    const wrapper = mount(TopBar, { global: globalStubs })
    const switchComp = wrapper.findComponent({ name: 'SwitchAppearance' })
    expect(switchComp.exists()).toBe(true)
    expect(switchComp.element.parentElement?.classList.contains('max-lg:hidden')).toBe(true)
  })

  it('hides language switcher in topbar on mobile (default mode)', () => {
    const wrapper = mount(TopBar, { global: globalStubs })
    const langComp = wrapper.findComponent({ name: 'SwitchLang' })
    expect(langComp.exists()).toBe(true)
    expect(langComp.element.parentElement?.classList.contains('max-lg:hidden')).toBe(true)
  })

  it('keeps switch appearance visible on mobile in minimal (home) mode', () => {
    const wrapper = mount(TopBar, {
      global: globalStubs,
      props: { minimal: true, hideMenuButton: true },
    })
    const switchComp = wrapper.findComponent({ name: 'SwitchAppearance' })
    expect(switchComp.exists()).toBe(true)
    expect(switchComp.element.parentElement?.classList.contains('max-lg:hidden')).toBe(false)
  })

  it('keeps language switcher visible on mobile in minimal (home) mode', () => {
    const wrapper = mount(TopBar, {
      global: globalStubs,
      props: { minimal: true, hideMenuButton: true },
    })
    const langComp = wrapper.findComponent({ name: 'SwitchLang' })
    expect(langComp.exists()).toBe(true)
    expect(langComp.element.parentElement?.classList.contains('max-lg:hidden')).toBe(false)
  })

  it('does not apply mobile fixed bg classes in minimal (home) mode', () => {
    const wrapper = mount(TopBar, {
      global: globalStubs,
      props: { minimal: true, hideMenuButton: true },
    })
    const nav = wrapper.find('nav')
    expect(nav.classes().some((c) => c.includes('topbar--mobile'))).toBe(false)
    expect(nav.classes().some((c) => c.includes('max-lg:fixed'))).toBe(false)
  })

  it('passes iconClass for social links', () => {
    mockTheme.value = {
      nav: {
        links: [],
        socialLinks: [{ url: 'https://x.com/test', icon: 'x', iconClass: 'text-xl' }],
      },
      donate: null,
      sidebarMenuLabel: 'Menu',
    }
    const wrapper = mount(TopBar, { global: globalStubs })
    const socialBtns = wrapper.findAllComponents({ name: 'NeptuBtn' }).filter((b) => b.props('icon') === 'x')
    expect(socialBtns.length).toBe(1)
    expect(socialBtns[0].props('iconClass')).toBe('text-xl')
  })
})
