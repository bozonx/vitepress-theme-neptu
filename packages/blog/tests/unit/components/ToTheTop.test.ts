import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ToTheTop from '../../../src/components/layout-parts/ToTheTop.vue'

const ToTheTopMobileStub = { name: 'ToTheTopMobile', template: '<div class="to-top-mobile" />', props: ['scrollY'] }
const ToTheTopDesktopStub = { name: 'ToTheTopDesktop', template: '<div class="to-top-desktop" />', props: ['scrollY'] }

describe('ToTheTop', () => {
  it('renders both variants with responsive visibility classes', () => {
    const wrapper = mount(ToTheTop, {
      props: { scrollY: 2000, isMobile: true },
      global: { stubs: { ToTheTopMobile: ToTheTopMobileStub, ToTheTopDesktop: ToTheTopDesktopStub } },
    })
    const mobile = wrapper.find('.to-top-mobile')
    const desktop = wrapper.find('.to-top-desktop')
    expect(mobile.exists()).toBe(true)
    expect(desktop.exists()).toBe(true)
    expect(mobile.classes()).toContain('lg:hidden')
    expect(desktop.classes()).toContain('max-lg:hidden')
  })
})
