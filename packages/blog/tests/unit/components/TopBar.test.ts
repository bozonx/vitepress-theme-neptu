import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TopBar from '../../../src/components/layout-parts/TopBar.vue'
import { mockTheme } from '../../mocks/vitepress'

const NeptuBtnStub = {
  name: 'NeptuBtn',
  template: '<button class="btn-stub" :class="$props.class"><span v-if="$props.text">{{ $props.text }}</span><slot /></button>',
  props: ['icon', 'noBg', 'class', 'iconClass', 'text'],
}
const SwitchLangStub = { name: 'SwitchLang', template: '<div class="lang-stub" />', props: ['noBg'] }
const SwitchAppearanceStub = { name: 'SwitchAppearance', template: '<div class="appearance-stub" />' }

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
    const wrapper = mount(TopBar, {
      global: { stubs: { NeptuNeptuBtn: NeptuBtnStub, SwitchLang: SwitchLangStub, SwitchAppearance: SwitchAppearanceStub } },
    })
    const btns = wrapper.findAllComponents({ name: 'NeptuBtn' })
    const texts = btns.map((b) => b.props('text'))
    expect(texts).toContain('Home')
    expect(texts).toContain('Mobile')
    expect(texts).toContain('Menu')
  })

  it('applies responsive visibility classes to nav links', () => {
    const wrapper = mount(TopBar, {
      global: { stubs: { NeptuNeptuBtn: NeptuBtnStub, SwitchLang: SwitchLangStub, SwitchAppearance: SwitchAppearanceStub } },
    })
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
    const wrapper = mount(TopBar, {
      global: { stubs: { NeptuNeptuBtn: NeptuBtnStub, SwitchLang: SwitchLangStub, SwitchAppearance: SwitchAppearanceStub } },
    })
    const btns = wrapper.findAllComponents({ name: 'NeptuBtn' })
    const donateBtn = btns.find((b) => b.props('text') === 'Donate')
    expect(donateBtn).toBeDefined()
    expect(donateBtn!.props('icon')).toBe('mdi:heart')
    expect(donateBtn!.props('href')).toBe('https://donate.example.com')
  })

  it('emits openDrawer when menu button clicked', () => {
    const wrapper = mount(TopBar, {
      global: { stubs: { NeptuNeptuBtn: NeptuBtnStub, SwitchLang: SwitchLangStub, SwitchAppearance: SwitchAppearanceStub } },
    })
    const menuBtn = wrapper.findAllComponents({ name: 'NeptuBtn' }).find((b) => b.props('icon') === 'fa6-solid:bars')
    expect(menuBtn).toBeDefined()
    menuBtn!.vm.$emit('click')
    expect(wrapper.emitted('openDrawer')).toHaveLength(1)
  })

  it('hides switch appearance and language switcher in topbar on mobile when hideMenuButton is false', () => {
    const wrapper = mount(TopBar, {
      global: { stubs: { NeptuNeptuBtn: NeptuBtnStub, SwitchLang: SwitchLangStub, SwitchAppearance: SwitchAppearanceStub } },
    })
    const switchComp = wrapper.findComponent({ name: 'SwitchAppearance' })
    expect(switchComp.exists()).toBe(true)
    expect(switchComp.element.parentElement?.classList.contains('max-lg:hidden')).toBe(true)

    const langComp = wrapper.findComponent({ name: 'SwitchLang' })
    expect(langComp.exists()).toBe(true)
    expect(langComp.element.parentElement?.classList.contains('max-lg:hidden')).toBe(true)
  })

  it('keeps controls visible on mobile when hideMenuButton is true', () => {
    const wrapper = mount(TopBar, {
      props: { hideMenuButton: true },
      global: { stubs: { NeptuNeptuBtn: NeptuBtnStub, SwitchLang: SwitchLangStub, SwitchAppearance: SwitchAppearanceStub } },
    })
    const switchComp = wrapper.findComponent({ name: 'SwitchAppearance' })
    expect(switchComp.exists()).toBe(true)
    expect(switchComp.element.parentElement?.classList.contains('max-lg:hidden')).toBe(false)

    const langComp = wrapper.findComponent({ name: 'SwitchLang' })
    expect(langComp.exists()).toBe(true)
    expect(langComp.element.parentElement?.classList.contains('max-lg:hidden')).toBe(false)
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
    const wrapper = mount(TopBar, {
      global: { stubs: { NeptuNeptuBtn: NeptuBtnStub, SwitchLang: SwitchLangStub, SwitchAppearance: SwitchAppearanceStub } },
    })
    const socialBtns = wrapper.findAllComponents({ name: 'NeptuBtn' }).filter((b) => b.props('icon') === 'x')
    expect(socialBtns.length).toBe(1)
    expect(socialBtns[0].props('iconClass')).toBe('text-xl')
  })
})
