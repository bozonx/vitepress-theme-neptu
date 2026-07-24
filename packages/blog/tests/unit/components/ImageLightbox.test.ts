import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@iconify/vue', () => ({
  Icon: {
    name: 'Icon',
    template: '<i />',
  },
}))

const mockClose = vi.fn()

vi.mock('../../../src/composables/useLightbox.ts', () => ({
  useLightbox: () => ({
    isOpen: ref(true),
    currentIndex: ref(0),
    items: ref([{ src: '/img/test.jpg', alt: 'Test image' }]),
    close: mockClose,
    next: vi.fn(),
    prev: vi.fn(),
  }),
  useLightboxLocales: () => ({
    close: 'Закрыть',
    prev: 'Предыдущее',
    next: 'Следующее',
    dialogTitle: 'Изображение',
    loadingIndicatorLabel: 'Загрузка...',
    resetZoom: 'Сбросить масштаб',
  }),
}))

import ImageLightbox from '../../../src/components/doc-components/ImageLightbox.vue'

describe('ImageLightbox', () => {
  it('uses localized aria labels', async () => {
    document.body.innerHTML = '<div id="modals"></div>'

    const wrapper = mount(ImageLightbox, {
      attachTo: document.body,
    })

    const dialog = document.body.querySelector('[role="dialog"]')
    const closeButton = document.body.querySelector('.lightbox-close')

    expect(dialog?.getAttribute('aria-label')).toBe('Изображение')
    expect(closeButton?.getAttribute('aria-label')).toBe('Закрыть')

    const imageWrap = document.body.querySelector('.lightbox-img-wrap')
    imageWrap?.dispatchEvent(new WheelEvent('wheel', { deltaY: -100, bubbles: true, cancelable: true }))
    await nextTick()

    const resetZoomButton = document.body.querySelector('.lightbox-zoom-level')

    expect(resetZoomButton?.getAttribute('aria-label')).toBe(
      'Сбросить масштаб'
    )

    wrapper.unmount()
  })

  it('closes when image is clicked with left mouse button', async () => {
    mockClose.mockClear()
    document.body.innerHTML = '<div id="modals"></div>'

    const wrapper = mount(ImageLightbox, {
      attachTo: document.body,
    })

    const img = document.body.querySelector('.lightbox-img') as HTMLImageElement
    expect(img).not.toBeNull()

    // Dispatch left click on image
    img.dispatchEvent(new MouseEvent('click', { button: 0, bubbles: true }))
    expect(mockClose).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })
})
