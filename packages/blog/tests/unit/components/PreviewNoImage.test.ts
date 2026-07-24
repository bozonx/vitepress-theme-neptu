import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PreviewNoImage from '../../../src/components/PreviewNoImage.vue'

describe('PreviewNoImage', () => {
  it('passes props through to PreviewWithImage', () => {
    const wrapper = mount(PreviewNoImage, {
      props: {
        date: '2024-01-01',
        localeDate: 'Jan 1, 2024',
        preview: 'Hello world',
        authorName: 'John',
      },
    })
    const child = wrapper.findComponent({ name: 'PreviewWithImage' })
    expect(child.exists()).toBe(true)
    expect(child.props('date')).toBe('2024-01-01')
    expect(child.props('localeDate')).toBe('Jan 1, 2024')
    expect(child.props('preview')).toBe('Hello world')
    expect(child.props('authorName')).toBe('John')
  })
})
