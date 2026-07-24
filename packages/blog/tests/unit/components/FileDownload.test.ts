import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import FileDownload from '../../../src/components/doc-components/FileDownload.vue'
import { mockTheme } from '../../mocks/vitepress'

const IconStub = { name: 'Icon', template: '<span class="icon-stub" />' }
const NeptuBtnStub = {
  name: 'NeptuBtn',
  template: '<button class="btn-stub"><slot /></button>',
  props: ['icon', 'disabled', 'text', 'class'],
}

describe('FileDownload', () => {
  beforeEach(() => {
    mockTheme.value = { t: { fileDownload: { fileDownload: 'Download', downloadFile: 'Download', fileType: 'Type', downloadFileWithName: 'Download file' } } }
  })

  it('extracts filename from url', () => {
    const wrapper = mount(FileDownload, {
      props: { url: 'https://example.com/files/doc.pdf' },
      global: { stubs: { Icon: IconStub, NeptuBtn: NeptuBtnStub } },
    })
    expect(wrapper.text()).toContain('doc.pdf')
  })

  it('uses provided filename', () => {
    const wrapper = mount(FileDownload, {
      props: { url: 'https://example.com/f', filename: 'report.xlsx' },
      global: { stubs: { Icon: IconStub, NeptuBtn: NeptuBtnStub } },
    })
    expect(wrapper.text()).toContain('report.xlsx')
  })

  it('resolves correct icon for pdf', () => {
    const wrapper = mount(FileDownload, {
      props: { url: 'https://example.com/f.pdf' },
      global: { stubs: { Icon: IconStub, NeptuBtn: NeptuBtnStub } },
    })
    expect(wrapper.find('.file-icon').exists()).toBe(true)
  })

  it('disables button when disabled prop is true', () => {
    const wrapper = mount(FileDownload, {
      props: { url: 'https://example.com/f.pdf', disabled: true },
      global: { stubs: { Icon: IconStub, NeptuBtn: NeptuBtnStub } },
    })
    expect(wrapper.findComponent({ name: 'NeptuBtn' }).props('disabled')).toBe(true)
  })

  it('resolves correct icon for unknown extension', () => {
    const wrapper = mount(FileDownload, {
      props: { url: 'https://example.com/f.unknown' },
      global: { stubs: { Icon: IconStub, NeptuBtn: NeptuBtnStub } },
    })
    expect(wrapper.find('.file-icon').exists()).toBe(true)
  })
})
