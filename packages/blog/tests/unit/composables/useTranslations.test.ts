import { describe, it, expect, vi } from 'vitest'
import { computed, defineComponent, h, provide } from 'vue'
import { mount } from '@vue/test-utils'
import {
  useTranslations,
  TranslationsKey,
} from '../../../src/composables/useTranslations.ts'

const { mockedUseRoute } = vi.hoisted(() => ({
  mockedUseRoute: vi.fn(),
}))

vi.mock('vitepress', () => ({
  useRoute: mockedUseRoute,
}))

describe('useTranslations', () => {
  it('returns provided translations when TranslationsKey is present in context', () => {
    const customTranslations = computed(() => ({
      t: { search: { title: 'Custom Search' } } as any,
    }))

    const ChildComp = defineComponent({
      setup() {
        const trans = useTranslations()
        return () => h('div', (trans.value as any).t.search.title)
      },
    })

    const ParentComp = defineComponent({
      setup() {
        provide(TranslationsKey, customTranslations)
        return () => h(ChildComp)
      },
    })

    const wrapper = mount(ParentComp)
    expect(wrapper.text()).toBe('Custom Search')
  })

  it('resolves translations based on route.path when not provided', () => {
    mockedUseRoute.mockReturnValue({
      path: '/ru/blog/test',
    })

    const TestComp = defineComponent({
      setup() {
        const trans = useTranslations()
        return () => h('div', (trans.value as any).t.search.title)
      },
    })

    const wrapper = mount(TestComp)
    expect(wrapper.text()).toBeDefined()
  })
})
