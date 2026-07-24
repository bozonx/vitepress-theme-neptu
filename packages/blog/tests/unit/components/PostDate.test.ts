import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PostDate from '../../../src/components/post/PostDate.vue'
import { mockPage, mockTheme } from '../../mocks/vitepress'

const BaseLinkStub = {
  name: 'BaseLink',
  template: '<a><slot /></a>',
  props: ['href'],
}

describe('PostDate', () => {
  beforeEach(() => {
    mockPage.value = { frontmatter: { date: '2024-06-15' } }
    mockTheme.value = {}
  })

  it('renders nothing when no date', () => {
    mockPage.value = { frontmatter: {} }
    const wrapper = mount(PostDate, {
      global: { stubs: { BaseLink: BaseLinkStub } },
    })
    expect(wrapper.find('div').exists()).toBe(false)
  })

  it('renders date with year as link', () => {
    mockPage.value = { frontmatter: { date: '2024-06-15' } }
    const wrapper = mount(PostDate, {
      global: { stubs: { BaseLink: BaseLinkStub } },
    })
    const yearLink = wrapper.findAllComponents({ name: 'BaseLink' }).find((l) => l.props('href')?.includes('/2024/'))
    expect(yearLink).toBeDefined()
  })

  it('renders date with month as link', () => {
    mockPage.value = { frontmatter: { date: '2024-06-15' } }
    const wrapper = mount(PostDate, {
      global: { stubs: { BaseLink: BaseLinkStub } },
    })
    const monthLink = wrapper.findAllComponents({ name: 'BaseLink' }).find((l) => l.props('href')?.includes('/month/6'))
    expect(monthLink).toBeDefined()
  })

  it('renders plain text tokens for non-year non-month', () => {
    mockPage.value = { frontmatter: { date: '2024-06-15' } }
    const wrapper = mount(PostDate, {
      global: { stubs: { BaseLink: BaseLinkStub } },
    })
    expect(wrapper.findAll('span').length).toBeGreaterThanOrEqual(1)
  })
})
