import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import YouTubeVideo from '../../../src/components/doc-components/YouTubeVideo.vue'

describe('YouTubeVideo', () => {
  it('renders iframe with valid YouTube ID', () => {
    const wrapper = mount(YouTubeVideo, { props: { id: 'dQw4w9WgXcQ' } })
    const iframe = wrapper.find('iframe')
    expect(iframe.exists()).toBe(true)
    expect(iframe.attributes('src')).toBe(
      'https://www.youtube.com/embed/dQw4w9WgXcQ'
    )
  })

  it('does not render iframe for invalid ID', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(YouTubeVideo, { props: { id: 'short' } })
    expect(wrapper.find('iframe').exists()).toBe(false)
    expect(consoleSpy).toHaveBeenCalledWith('Invalid YouTube ID: short')
    consoleSpy.mockRestore()
  })

  it('does not render for empty ID', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(YouTubeVideo, { props: { id: '' } })
    expect(wrapper.find('iframe').exists()).toBe(false)
    consoleSpy.mockRestore()
  })

  it('accepts IDs with hyphens and underscores', () => {
    const wrapper = mount(YouTubeVideo, { props: { id: 'a-b_C_1234Q' } })
    expect(wrapper.find('iframe').exists()).toBe(true)
  })
})
