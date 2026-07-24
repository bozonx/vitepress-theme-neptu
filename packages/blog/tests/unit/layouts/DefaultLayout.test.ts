import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DefaultLayout from '../../../src/layouts/DefaultLayout.vue'
import { mockFrontmatter, mockTheme } from '../../mocks/vitepress'

const layoutStubs = {
  SideBar: {
    name: 'SideBar',
    template: '<aside><slot /></aside>',
  },
  TopBar: {
    name: 'TopBar',
    template: '<nav><slot /></nav>',
  },
  PageContent: {
    name: 'PageContent',
    template: '<section class="page-content-stub"><slot /></section>',
  },
  LayoutAside: {
    name: 'LayoutAside',
    template: '<aside class="layout-aside-stub"><slot /></aside>',
  },
  ToTheTop: true,
  NeptuFooter: {
    name: 'NeptuFooter',
    template: '<footer class="theme-footer-stub" />',
  },
}

describe('DefaultLayout', () => {
  beforeEach(() => {
    mockFrontmatter.value = {}
    mockTheme.value = {}
  })

  it('renders a custom footer slot without the theme footer wrapper', () => {
    mockTheme.value = {
      footer: {
        message: 'Theme footer',
      },
    }

    const wrapper = mount(DefaultLayout, {
      slots: {
        footer: '<footer class="custom-footer">Custom footer</footer>',
      },
      global: {
        stubs: layoutStubs,
      },
    })

    expect(wrapper.find('.custom-footer').exists()).toBe(true)
    expect(wrapper.find('.theme-footer-stub').exists()).toBe(false)
    expect(wrapper.find('.mt-30.pb-12').exists()).toBe(false)
  })

  it('does not leave footer spacing when the theme footer is disabled', () => {
    const wrapper = mount(DefaultLayout, {
      global: {
        stubs: layoutStubs,
      },
    })

    expect(wrapper.find('.theme-footer-stub').exists()).toBe(false)
    expect(wrapper.find('.mt-30.pb-12').exists()).toBe(false)
  })

  it('renders the theme footer inside theme spacing when configured', () => {
    mockTheme.value = {
      footer: {
        message: 'Theme footer',
      },
    }

    const wrapper = mount(DefaultLayout, {
      global: {
        stubs: layoutStubs,
      },
    })

    expect(wrapper.find('.theme-footer-stub').exists()).toBe(true)
    expect(wrapper.find('.mt-30.pb-12').exists()).toBe(true)
  })
})
