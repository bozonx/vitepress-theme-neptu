import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AudioFile from '../../../src/components/doc-components/AudioFile.vue'
import { mockTheme } from '../../mocks/vitepress'

const IconStub = { name: 'Icon', template: '<span class="icon-stub" />', props: ['icon'] }
const BtnStub = {
  name: 'Btn',
  template: '<button class="btn-stub"><slot /></button>',
  props: ['icon', 'disabled', 'text', 'class'],
}

describe('AudioFile', () => {
  beforeEach(() => {
    mockTheme.value = {
      t: {
        audioFile: {
          playAudio: 'Play',
          pauseAudio: 'Pause',
          stopAudio: 'Stop',
          playAudioPlayback: 'Play audio',
          pauseAudioPlayback: 'Pause audio',
          resumeAudioPlayback: 'Resume',
          startAudioPlayback: 'Start audio',
          downloadFile: 'Download',
          downloadAudioFile: 'Download audio',
          invalidUrlProvided: 'Invalid URL',
          errorDownloadingFile: 'Download error',
          invalidAudioUrlProvided: 'Invalid audio URL',
          errorPlayingAudioFile: 'Playback error',
          audioFile: 'Audio',
          audioProgress: 'Progress',
          currentTime: 'Current time',
          volumeControl: 'Volume',
          volumePercent: '%',
          hidePlayerTitle: 'Hide player',
          hidePlayer: 'Hide',
          stopAudioPlayback: 'Stop audio',
          audioPlaybackAborted: 'Aborted',
          networkErrorLoadingAudio: 'Network error',
          audioDecodingError: 'Decoding error',
          audioFormatNotSupported: 'Format not supported',
          unknownAudioError: 'Unknown error',
          errorLoadingAudioFile: 'Error loading',
        },
      },
    }
  })

  it('renders filename from URL', () => {
    const wrapper = mount(AudioFile, {
      props: { url: 'https://example.com/audio/music.mp3' },
      global: { stubs: { Icon: IconStub, Btn: BtnStub } },
    })
    expect(wrapper.text()).toContain('music.mp3')
  })

  it('uses explicit filename when provided', () => {
    const wrapper = mount(AudioFile, {
      props: { url: 'https://example.com/audio/1.mp3', filename: 'song.mp3' },
      global: { stubs: { Icon: IconStub, Btn: BtnStub } },
    })
    expect(wrapper.text()).toContain('song.mp3')
  })

  it('shows invalid URL error for empty URL', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount(AudioFile, {
      props: { url: 'not-a-url' },
      global: { stubs: { Icon: IconStub, Btn: BtnStub } },
    })
    const playBtn = wrapper.findComponent('.play-btn-header')
    if (playBtn.exists()) {
      ;(playBtn as any).vm.$emit('click')
    }
    expect(consoleSpy).toHaveBeenCalledWith('Invalid audio URL provided')
    consoleSpy.mockRestore()
  })

  it('disables buttons when disabled prop is true', () => {
    const wrapper = mount(AudioFile, {
      props: { url: 'https://example.com/audio/music.mp3', disabled: true },
      global: { stubs: { Icon: IconStub, Btn: BtnStub } },
    })
    const btns = wrapper.findAllComponents({ name: 'Btn' })
    expect(btns.every((b) => b.props('disabled') === true)).toBe(true)
  })

  it('renders audio element', () => {
    const wrapper = mount(AudioFile, {
      props: { url: 'https://example.com/audio/my song.mp3' },
      global: { stubs: { Icon: IconStub, Btn: BtnStub } },
    })
    const audio = wrapper.find('audio')
    expect(audio.exists()).toBe(true)
  })

  it('applies containerClass', () => {
    const wrapper = mount(AudioFile, {
      props: { url: 'https://example.com/audio/music.mp3', containerClass: 'custom-class' },
      global: { stubs: { Icon: IconStub, Btn: BtnStub } },
    })
    expect(wrapper.find('.audio-file').classes()).toContain('custom-class')
  })
})
