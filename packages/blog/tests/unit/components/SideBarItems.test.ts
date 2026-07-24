import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SideBarItems from '../../../src/components/layout-parts/SideBarItems.vue'

const SideBarHeaderStub = {
  name: 'SideBarHeader',
  template: '<div class="header-stub" />',
  props: ['text', 'href', 'icon', 'class'],
}

const MenuItemStub = {
  name: 'MenuItem',
  template: '<div class="menu-stub" />',
  props: ['href', 'text', 'title', 'icon', 'activeCompareMethod'],
}

describe('SideBarItems', () => {
  it('renders nothing for empty items', () => {
    const wrapper = mount(SideBarItems, {
      props: { items: [] },
      global: { stubs: { SideBarHeader: SideBarHeaderStub, MenuItem: MenuItemStub } },
    })
    expect(wrapper.find('ul').exists()).toBe(false)
  })

  it('renders header items', () => {
    const wrapper = mount(SideBarItems, {
      props: { items: [{ header: 'Section A', href: '/a', icon: 'mdi:home' }] },
      global: { stubs: { SideBarHeader: SideBarHeaderStub, MenuItem: MenuItemStub } },
    })
    expect(wrapper.findComponent({ name: 'SideBarHeader' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'MenuItem' }).exists()).toBe(false)
  })

  it('renders menu items for non-header entries', () => {
    const wrapper = mount(SideBarItems, {
      props: { items: [{ text: 'Home', href: '/' }] },
      global: { stubs: { SideBarHeader: SideBarHeaderStub, MenuItem: MenuItemStub } },
    })
    expect(wrapper.findComponent({ name: 'MenuItem' }).exists()).toBe(true)
  })

  it('passes activeCompareMethod softPagination to MenuItem', () => {
    const wrapper = mount(SideBarItems, {
      props: { items: [{ text: 'Home', href: '/' }] },
      global: { stubs: { SideBarHeader: SideBarHeaderStub, MenuItem: MenuItemStub } },
    })
    expect(wrapper.findComponent({ name: 'MenuItem' }).props('activeCompareMethod')).toBe('softPagination')
  })

  it('hides mobile-only items on desktop', () => {
    const wrapper = mount(SideBarItems, {
      props: { items: [{ text: 'Mobile', href: '/m', mobile: true }], isMobile: false },
      global: { stubs: { SideBarHeader: SideBarHeaderStub, MenuItem: MenuItemStub } },
    })
    const li = wrapper.find('li')
    expect(li.classes()).toContain('lg:hidden')
  })

  it('shows mobile items on mobile', () => {
    const wrapper = mount(SideBarItems, {
      props: { items: [{ text: 'Mobile', href: '/m', mobile: true }], isMobile: true },
      global: { stubs: { SideBarHeader: SideBarHeaderStub, MenuItem: MenuItemStub } },
    })
    const li = wrapper.find('li')
    expect(li.classes()).not.toContain('hidden')
  })

  it('applies max-lg:hidden for desktop-only items', () => {
    const wrapper = mount(SideBarItems, {
      props: { items: [{ text: 'Desktop', href: '/d', desktopOnly: true }], isMobile: false },
      global: { stubs: { SideBarHeader: SideBarHeaderStub, MenuItem: MenuItemStub } },
    })
    const li = wrapper.find('li')
    expect(li.classes()).toContain('max-lg:hidden')
  })

  it('applies lg:hidden for mobile-only items', () => {
    const wrapper = mount(SideBarItems, {
      props: { items: [{ text: 'Mobile', href: '/m', mobileOnly: true }], isMobile: true },
      global: { stubs: { SideBarHeader: SideBarHeaderStub, MenuItem: MenuItemStub } },
    })
    const li = wrapper.find('li')
    expect(li.classes()).toContain('lg:hidden')
  })
})
