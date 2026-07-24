import { describe, it, expect, beforeEach, vi } from 'vitest'
import { defineComponent, h, ref, type Ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useUiTheme } from '../../../src/composables/useUiTheme.ts'

const mockTheme: Ref<any> = ref({
  langMenuLabel: 'Change language',
  t: {
    search: 'Search',
    popularPosts: 'Popular',
  },
})

const mockLocaleIndex = ref('en')

vi.mock('vitepress', () => ({
  inBrowser: true,
  useData: () => ({
    theme: mockTheme,
    localeIndex: mockLocaleIndex,
  }),
}))

describe('useUiTheme', () => {
  beforeEach(() => {
    mockTheme.value = {
      langMenuLabel: 'Change language',
      t: {
        search: 'Search',
        popularPosts: 'Popular',
      },
    }
    mockLocaleIndex.value = 'en'
  })

  function mountComposable() {
    const result: Record<string, any> = {}
    const TestComp = defineComponent({
      setup() {
        Object.assign(result, useUiTheme())
        return () => h('div')
      },
    })
    mount(TestComp)
    return result
  }

  it('returns the build-resolved theme from vitepress data', () => {
    const { theme } = mountComposable()
    expect(theme.value.t.search).toBe('Search')
    expect(theme.value.langMenuLabel).toBe('Change language')
  })

  it('stays reactive when vitepress theme changes', async () => {
    const { theme } = mountComposable()
    mockTheme.value = {
      ...mockTheme.value,
      t: {
        ...mockTheme.value.t,
        search: 'Suchen',
      },
    }

    expect(theme.value.t.search).toBe('Suchen')
  })
})
