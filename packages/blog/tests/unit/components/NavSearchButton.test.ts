import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import NavSearchButton from '../../../src/components/utility/NavSearchButton.vue'
import { mockTheme } from '../../mocks/vitepress'

describe('NavSearchButton', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    mockTheme.value = {
      t: {
        search: 'Search',
        searchInBlog: 'Search in blog',
      },
    }
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  it('renders with default t values', () => {
    wrapper = mount(NavSearchButton)
    const button = wrapper.find('button')
    expect(button.attributes('title')).toBe('Search in blog')
    expect(button.text()).toContain('Search...')
  })

  it('uses t values for search text and aria label', () => {
    mockTheme.value = {
      t: {
        search: 'Find',
        searchInBlog: 'Find in blog',
      },
    }
    wrapper = mount(NavSearchButton)
    const button = wrapper.find('button')
    expect(button.attributes('title')).toBe('Find in blog')
    expect(button.text()).toContain('Find...')
    expect(button.text()).not.toContain('Search...')
  })

  it('falls back to hardcoded defaults when t values are missing', () => {
    mockTheme.value = {
      t: {},
    }
    wrapper = mount(NavSearchButton)
    const button = wrapper.find('button')
    expect(button.attributes('title')).toBe('Search in blog')
    expect(button.text()).toContain('Search...')
  })
})
