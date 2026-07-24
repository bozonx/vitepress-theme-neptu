import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import NeptuLayout from '../../../src/layouts/NeptuLayout.vue'
import { mockFrontmatter, mockPage } from '../../mocks/vitepress'

const CustomLayoutStub = {
  name: 'CustomLayout',
  template: '<div class="custom-layout-stub">Custom Layout</div>',
}

describe('NeptuLayout', () => {
  beforeEach(() => {
    mockFrontmatter.value = {}
    mockPage.value = { isNotFound: false, title: 'Hello' }
  })

  it('renders custom layout when frontmatter.layout matches a globally registered component', () => {
    mockFrontmatter.value = { layout: 'CustomLayout' }
    const wrapper = mount(NeptuLayout, {
      global: {
        components: { CustomLayout: CustomLayoutStub },
        stubs: {
          DefaultLayout: true,
          BlogHome: true,
          NotFound: true,
          Content: true,
          ImageLightbox: true,
        },
      },
    })
    expect(wrapper.find('.custom-layout-stub').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'DefaultLayout' }).exists()).toBe(false)
  })

  it('falls back to DefaultLayout for builtin layouts like post', () => {
    mockFrontmatter.value = { layout: 'post' }
    const wrapper = mount(NeptuLayout, {
      global: {
        components: { CustomLayout: CustomLayoutStub },
        stubs: {
          DefaultLayout: true,
          BlogHome: true,
          NotFound: true,
          Content: true,
          ImageLightbox: true,
        },
      },
    })
    expect(wrapper.findComponent({ name: 'DefaultLayout' }).exists()).toBe(true)
    expect(wrapper.find('.custom-layout-stub').exists()).toBe(false)
  })

  it('passes post layout slots to DefaultLayout', () => {
    mockFrontmatter.value = { layout: 'post' }
    const wrapper = mount(NeptuLayout, {
      slots: {
        'post-header-before': '<div class="header-before">Before</div>',
        'post-content-after': '<div class="content-after">After</div>',
        footer: '<div class="footer-slot">Footer</div>',
      },
      global: {
        stubs: {
          DefaultLayout: {
            name: 'DefaultLayout',
            template:
              '<main><slot name="post-header-before" /><slot name="post-content-after" /><slot name="footer" /></main>',
          },
          BlogHome: true,
          NotFound: true,
          Content: true,
          ImageLightbox: true,
        },
      },
    })

    expect(wrapper.find('.header-before').exists()).toBe(true)
    expect(wrapper.find('.content-after').exists()).toBe(true)
    expect(wrapper.find('.footer-slot').exists()).toBe(true)
  })

  it('renders BlogHome for layout: home', () => {
    mockFrontmatter.value = { layout: 'home' }
    const wrapper = mount(NeptuLayout, {
      global: {
        stubs: {
          DefaultLayout: true,
          BlogHome: true,
          NotFound: true,
          Content: true,
          ImageLightbox: true,
        },
      },
    })
    expect(wrapper.findComponent({ name: 'BlogHome' }).exists()).toBe(true)
  })

  it('renders raw Content for layout: false', () => {
    mockFrontmatter.value = { layout: false }
    const wrapper = mount(NeptuLayout, {
      global: {
        stubs: {
          DefaultLayout: true,
          BlogHome: true,
          NotFound: true,
          Content: true,
          ImageLightbox: true,
        },
      },
    })
    expect(wrapper.findComponent({ name: 'Content' }).exists()).toBe(true)
  })

  it('renders NotFound for 404 pages', () => {
    mockPage.value = { isNotFound: true, title: 'Not Found' }
    const wrapper = mount(NeptuLayout, {
      global: {
        stubs: {
          DefaultLayout: true,
          BlogHome: true,
          NotFound: true,
          Content: true,
          ImageLightbox: true,
        },
      },
    })
    expect(wrapper.findComponent({ name: 'NotFound' }).exists()).toBe(true)
  })
})
