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

describe('DefaultLayout aside', () => {
  beforeEach(() => {
    mockFrontmatter.value = {}
    mockTheme.value = {}
  })

  const mountLayout = (slots: Record<string, string> = {}) =>
    mount(DefaultLayout, {
      slots,
      global: {
        stubs: layoutStubs,
      },
    })

  it('does not reserve the aside column when no aside slot is given', () => {
    expect(mountLayout().find('.layout-aside-stub').exists()).toBe(false)
  })

  it('renders the aside slot content on a post', () => {
    const wrapper = mountLayout({ aside: '<div class="ad-unit">Ad</div>' })

    expect(wrapper.find('.layout-aside-stub').exists()).toBe(true)
    expect(wrapper.find('.ad-unit').exists()).toBe(true)
  })

  it('skips the aside on layouts excluded by default', () => {
    mockFrontmatter.value = { layout: 'page' }

    expect(
      mountLayout({ aside: '<div class="ad-unit">Ad</div>' })
        .find('.layout-aside-stub')
        .exists()
    ).toBe(false)
  })

  it('skips the aside when the page opts out via frontmatter', () => {
    mockFrontmatter.value = { layout: 'post', aside: false }

    expect(
      mountLayout({ aside: '<div class="ad-unit">Ad</div>' })
        .find('.layout-aside-stub')
        .exists()
    ).toBe(false)
  })

  it('renders the aside on a layout enabled through themeConfig', () => {
    mockFrontmatter.value = { layout: 'page' }
    mockTheme.value = { asideLayouts: ['post', 'page'] }

    expect(
      mountLayout({ aside: '<div class="ad-unit">Ad</div>' })
        .find('.layout-aside-stub')
        .exists()
    ).toBe(true)
  })
})
