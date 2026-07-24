import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import EditLink from '../../../src/components/EditLink.vue'
import { mockTheme, mockPage, mockFrontmatter } from '../../mocks/vitepress'

describe('EditLink', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    mockTheme.value = {
      t: { editLink: 'Edit' },
      editLink: { pattern: 'https://example.com/edit/:path' },
    }
    mockPage.value = { relativePath: 'posts/hello.md' }
    mockFrontmatter.value = {}
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  it('renders when editLink is configured and frontmatter allows it', () => {
    mockFrontmatter.value = { layout: 'page' }
    wrapper = mount(EditLink, { attachTo: document.body })
    expect(wrapper.find('a').exists()).toBe(true)
    expect(wrapper.text()).toContain('Edit')
  })

  it('uses editLink.text when provided', () => {
    mockTheme.value = {
      t: { editLink: 'Default Edit' },
      editLink: {
        pattern: 'https://example.com/edit/:path',
        text: 'Custom Edit Text',
      },
    }
    mockFrontmatter.value = { layout: 'page' }
    wrapper = mount(EditLink, { attachTo: document.body })
    expect(wrapper.text()).toContain('Custom Edit Text')
    expect(wrapper.text()).not.toContain('Default Edit')
  })

  it('falls back to t.editLink when editLink.text is not provided', () => {
    mockTheme.value = {
      t: { editLink: 'Fallback Edit' },
      editLink: { pattern: 'https://example.com/edit/:path' },
    }
    mockFrontmatter.value = { layout: 'page' }
    wrapper = mount(EditLink, { attachTo: document.body })
    expect(wrapper.text()).toContain('Fallback Edit')
  })

  it('hides when frontmatter.editLink is false', () => {
    mockFrontmatter.value = { layout: 'page', editLink: false }
    wrapper = mount(EditLink, { attachTo: document.body })
    expect(wrapper.find('a').exists()).toBe(false)
  })

  it('hides when page is not a post or page', () => {
    mockFrontmatter.value = { layout: 'home' }
    wrapper = mount(EditLink, { attachTo: document.body })
    expect(wrapper.find('a').exists()).toBe(false)
  })

  it('uses string pattern for href', () => {
    mockFrontmatter.value = { layout: 'page' }
    wrapper = mount(EditLink, { attachTo: document.body })
    expect(wrapper.find('a').attributes('href')).toBe(
      'https://example.com/edit/posts/hello.md'
    )
  })

  it('uses function pattern for href', () => {
    mockTheme.value.t = { editLink: 'Edit' }
    mockTheme.value.editLink = {
      pattern: (page: any) => `https://git.example.com/${page.relativePath}`,
    }
    mockFrontmatter.value = { layout: 'page' }
    wrapper = mount(EditLink, { attachTo: document.body })
    expect(wrapper.find('a').attributes('href')).toBe(
      'https://git.example.com/posts/hello.md'
    )
  })

  it('hides when editLink config is missing', () => {
    mockTheme.value = { t: {} }
    mockFrontmatter.value = { layout: 'page' }
    wrapper = mount(EditLink, { attachTo: document.body })
    expect(wrapper.find('a').exists()).toBe(false)
  })
})
