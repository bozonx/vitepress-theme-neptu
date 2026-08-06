import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import PostReadingTime from '../../../src/components/post/PostReadingTime.vue'
import {
  mockFrontmatter,
  mockPage,
  mockRoute,
  mockTheme,
} from '../../mocks/vitepress.ts'

describe('PostReadingTime', () => {
  beforeEach(() => {
    mockFrontmatter.value = { layout: 'post' }
    mockPage.value = { readingMinutes: 1 }
    mockRoute.value = { path: '/ru/posts/example' }
    mockTheme.value = {
      readingTime: { enabled: true, layouts: ['post'] },
      t: {},
    }
  })

  it('falls back to the route locale when theme forms are absent', () => {
    const wrapper = mount(PostReadingTime)

    expect(wrapper.text()).toBe('1 мин')
  })

  it('prefers forms configured by the site', () => {
    mockPage.value = { readingMinutes: 2 }
    mockTheme.value.t = {
      readingTime: 'Время на статью',
      readingTimeForms: ['минута', 'минуты', 'минут'],
    }

    const wrapper = mount(PostReadingTime)

    expect(wrapper.text()).toBe('2 минуты')
  })

  it('can include a descriptive label in the post header', () => {
    const wrapper = mount(PostReadingTime, {
      props: { showLabel: true },
    })

    expect(wrapper.text()).toBe('Время чтения: 1 мин')
  })

  it('stays hidden when globally disabled, including list-item usage', () => {
    mockTheme.value.readingTime.enabled = false

    const wrapper = mount(PostReadingTime, {
      props: { minutes: 3, forceShow: true },
    })

    expect(wrapper.text()).toBe('')
  })
})
