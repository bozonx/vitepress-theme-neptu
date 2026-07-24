import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import NeptuYears from '../../../src/components/utility/NeptuYears.vue'
import { mockTheme, mockFrontmatter, mockLocaleIndex } from '../../mocks/vitepress'

describe('NeptuYears', () => {
  beforeEach(() => {
    mockTheme.value = {}
    mockFrontmatter.value = { title: 'Archive' }
    mockLocaleIndex.value = 'en'
  })

  it('renders years list from injected posts', () => {
    const posts = {
      en: [
        { date: '2024-03-01', url: '/a' },
        { date: '2023-01-01', url: '/b' },
        { date: '2024-05-01', url: '/c' },
      ],
    }
    const wrapper = mount(NeptuYears, {
      global: {
        provide: { posts },
      },
    })
    expect(wrapper.find('h1').text()).toBe('Archive')
    const items = wrapper.findAllComponents({ name: 'ListItemWithBadge' })
    expect(items.length).toBe(2)
    expect(items[0].props('text')).toBe('2024')
    expect(items[0].props('count')).toBe(2)
    expect(items[1].props('text')).toBe('2023')
    expect(items[1].props('count')).toBe(1)
  })

  it('renders nothing when no posts', () => {
    const wrapper = mount(NeptuYears, {
      global: {
        provide: { posts: {} },
      },
    })
    expect(wrapper.find('ul').exists()).toBe(false)
  })
})
