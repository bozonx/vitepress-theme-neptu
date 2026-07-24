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

  it('uses search.options.translations.button when provided', () => {
    mockTheme.value = {
      search: {
        options: {
          translations: {
            button: {
              buttonText: 'Find',
              buttonAriaLabel: 'Find in blog',
            },
          },
        },
      },
      t: {
        search: 'Search',
        searchInBlog: 'Search in blog',
      },
    }
    wrapper = mount(NavSearchButton)
    const button = wrapper.find('button')
    expect(button.attributes('title')).toBe('Find in blog')
    expect(button.text()).toContain('Find...')
    expect(button.text()).not.toContain('Search...')
  })

  it('falls back to t values when search translations are missing', () => {
    mockTheme.value = {
      search: { provider: 'local' },
      t: {
        search: 'Fallback Search',
        searchInBlog: 'Fallback Search in blog',
      },
    }
    wrapper = mount(NavSearchButton)
    const button = wrapper.find('button')
    expect(button.attributes('title')).toBe('Fallback Search in blog')
    expect(button.text()).toContain('Fallback Search...')
  })
})
