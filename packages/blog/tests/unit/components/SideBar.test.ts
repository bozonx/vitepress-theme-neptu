import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SideBar from '../../../src/components/layout-parts/SideBar.vue'
import { mockTheme } from '../../mocks/vitepress'

const SideBarGroupStub = { name: 'SideBarGroup', template: '<div><slot /></div>' }
const SideBarItemsStub = { name: 'SideBarItems', template: '<ul />', props: ['items', 'isMobile'] }
const SideBarTagsStub = { name: 'SideBarTags', template: '<div />', props: ['localePosts'] }
const SideBarFooterStub = { name: 'SideBarFooter', template: '<footer />' }
const IconStub = { name: 'Icon', template: '<span />', props: ['icon'] }

function mountSideBar(isMobile = true) {
  return mount(SideBar, {
    props: { isMobile },
    global: {
      stubs: {
        SideBarGroup: SideBarGroupStub,
        SideBarItems: SideBarItemsStub,
        SideBarTags: SideBarTagsStub,
        SideBarFooter: SideBarFooterStub,
        Icon: IconStub,
      },
    },
  })
}

describe('SideBar drawer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockTheme.value = {
      sidebarMenuLabel: 'Menu',
      sidebar: {
        links: [{ text: 'Home', href: '/' }],
        tags: true,
      },
      t: {
        closeMenu: 'Close menu',
        toHome: 'Home',
        links: { recent: 'Recent', popular: 'Popular', byDate: 'Archive', authors: 'Authors', donate: 'Donate' },
      },
    }
    document.body.style.overflow = ''
  })

  afterEach(() => {
    vi.useRealTimers()
    document.body.style.overflow = ''
  })

  it('renders mobile drawer closed by default', () => {
    const wrapper = mountSideBar(true)

    expect(wrapper.classes()).toContain('max-lg:hidden')
    expect(wrapper.vm.isDrawerOpen()).toBe(false)
  })

  it('keeps desktop sidebar visible when close timer was pending', async () => {
    const wrapper = mountSideBar(true)

    wrapper.vm.openDrawer()
    await nextTick()
    wrapper.vm.handleLeftSwipe()
    await wrapper.setProps({ isMobile: false })
    vi.advanceTimersByTime(400)
    await nextTick()

    expect(wrapper.classes()).not.toContain('max-lg:hidden')
    expect(wrapper.vm.isDrawerOpen()).toBe(true)
  })

  it('resets animation state when returning to mobile', async () => {
    const wrapper = mountSideBar(true)

    wrapper.vm.openDrawer()
    await nextTick()
    await wrapper.setProps({ isMobile: false })
    await wrapper.setProps({ isMobile: true })

    const drawer = wrapper.find('.app-drawer')
    expect(wrapper.classes()).toContain('max-lg:hidden')
    expect(drawer.attributes('style')).toContain('translate3d(-320px, 0, 0)')
  })

  it('closes on Escape and restores body scroll', async () => {
    const wrapper = mountSideBar(true)

    wrapper.vm.openDrawer()
    await nextTick()
    expect(document.body.style.overflow).toBe('hidden')

    await wrapper.find('.app-drawer').trigger('keydown', { key: 'Escape' })
    vi.advanceTimersByTime(400)
    await nextTick()

    expect(wrapper.classes()).toContain('max-lg:hidden')
    expect(document.body.style.overflow).toBe('')
  })

  it('marks mobile drawer as a modal dialog', () => {
    const wrapper = mountSideBar(true)

    wrapper.vm.openDrawer()
    const drawer = wrapper.find('.app-drawer')
    const closeButton = wrapper.find('button')

    expect(drawer.attributes('role')).toBe('dialog')
    expect(drawer.attributes('aria-modal')).toBe('true')
    expect(closeButton.attributes('aria-label')).toBe('Close menu')
  })
})
