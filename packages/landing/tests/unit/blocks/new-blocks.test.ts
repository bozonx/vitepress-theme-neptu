import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import LnCode from '../../../src/blocks/LnCode.vue'
import LnTabs from '../../../src/blocks/LnTabs.vue'
import LnCompare from '../../../src/blocks/LnCompare.vue'
import LnNewsletter from '../../../src/blocks/LnNewsletter.vue'
import LnVideo from '../../../src/blocks/LnVideo.vue'
import LnBanner from '../../../src/blocks/LnBanner.vue'

describe('LnCode', () => {
  const items = [
    { label: 'npm', lang: 'bash', code: 'npm i vitepress-theme-neptu-landing' },
    { label: 'pnpm', lang: 'bash', code: 'pnpm add vitepress-theme-neptu-landing' },
  ]

  it('renders a tab per sample and shows only the active panel', async () => {
    const wrapper = mount(LnCode, { props: { id: 'install', items } })

    const tabs = wrapper.findAll('.ln-code__tab')
    expect(tabs).toHaveLength(2)
    expect(tabs[0].attributes('aria-selected')).toBe('true')
    expect(tabs[1].attributes('aria-selected')).toBe('false')

    await tabs[1].trigger('click')
    expect(wrapper.findAll('.ln-code__tab')[1].attributes('aria-selected')).toBe('true')
  })

  it('prints raw code and prefers pre-highlighted markup when given', () => {
    const wrapper = mount(LnCode, {
      props: {
        items: [{ code: 'echo hi', html: '<pre class="shiki"><code>echo hi</code></pre>' }],
      },
    })

    expect(wrapper.find('.shiki').exists()).toBe(true)
  })

  it('copies the raw source, not the rendered markup', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })

    const wrapper = mount(LnCode, { props: { items } })
    await wrapper.find('.ln-code__copy-btn').trigger('click')

    expect(writeText).toHaveBeenCalledWith('npm i vitepress-theme-neptu-landing')
  })
})

describe('LnTabs', () => {
  const items = [
    { label: 'Write', title: 'Write in markdown', text: 'One' },
    { label: 'Ship', title: 'Ship anywhere', text: 'Two' },
  ]

  it('follows the tablist pattern', () => {
    const wrapper = mount(LnTabs, { props: { id: 'how', items } })

    expect(wrapper.find('[role="tablist"]').exists()).toBe(true)
    const tabs = wrapper.findAll('[role="tab"]')
    expect(tabs[0].attributes('tabindex')).toBe('0')
    expect(tabs[1].attributes('tabindex')).toBe('-1')
    expect(tabs[0].attributes('aria-controls')).toBe('how-panel-0')
  })

  it('keeps every panel in the DOM so the copy stays indexable', () => {
    const wrapper = mount(LnTabs, { props: { items } })

    expect(wrapper.findAll('[role="tabpanel"]')).toHaveLength(2)
    expect(wrapper.text()).toContain('Ship anywhere')
  })

  it('moves the selection with the arrow keys', async () => {
    const wrapper = mount(LnTabs, { props: { items } })

    await wrapper.findAll('[role="tab"]')[0].trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.findAll('[role="tab"]')[1].attributes('aria-selected')).toBe('true')
  })
})

describe('LnCompare', () => {
  const props = {
    columns: [{ title: 'Free' }, { title: 'Pro', featured: true }],
    rows: [
      { group: 'Basics', label: 'Projects', values: ['1', 'Unlimited'] },
      { group: 'Basics', label: 'Custom domain', values: [false, true] },
    ],
  }

  it('renders a real table with header cells', () => {
    const wrapper = mount(LnCompare, { props })

    expect(wrapper.findAll('thead th')).toHaveLength(3) // corner + two columns
    expect(wrapper.findAll('tbody tr')).toHaveLength(3) // group row + two rows
    expect(wrapper.find('[scope="row"]').text()).toContain('Projects')
  })

  it('renders a group header once per run', () => {
    const wrapper = mount(LnCompare, { props })

    expect(wrapper.findAll('.ln-compare__group')).toHaveLength(1)
  })

  it('gives boolean cells a text equivalent', () => {
    const wrapper = mount(LnCompare, { props })
    const cells = wrapper.findAll('.ln-compare__cell')

    expect(cells[2].text()).toContain('—')
    expect(cells[3].text()).toContain('✓')
  })
})

describe('LnNewsletter', () => {
  it('posts natively to the endpoint and labels the email input', () => {
    const wrapper = mount(LnNewsletter, {
      props: { id: 'sub', action: 'https://example.com/f', emailName: 'EMAIL' },
    })

    const form = wrapper.find('form')
    expect(form.attributes('action')).toBe('https://example.com/f')
    expect(form.attributes('method')).toBe('post')

    const input = wrapper.find('input[type="email"]')
    expect(input.attributes('name')).toBe('EMAIL')
    expect(wrapper.find('label[for="sub-email"]').exists()).toBe(true)
  })

  it('renders extra fields, including hidden ones', () => {
    const wrapper = mount(LnNewsletter, {
      props: {
        fields: [
          { name: 'name', label: 'Name', required: true },
          { name: 'list', type: 'hidden' as const, value: 'weekly' },
        ],
      },
    })

    expect(wrapper.find('input[name="name"]').attributes('required')).toBeDefined()
    expect(wrapper.find('input[name="list"]').attributes('type')).toBe('hidden')
  })

  it('shows a status message instead of the form after an ajax submit', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))

    const wrapper = mount(LnNewsletter, {
      props: { action: 'https://example.com/f', ajax: true },
    })
    await wrapper.find('form').trigger('submit')
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(wrapper.find('form').exists()).toBe(false)
    expect(wrapper.find('.ln-form__status--ok').exists()).toBe(true)
  })
})

describe('LnVideo', () => {
  it('shows a facade and embeds nothing until it is clicked', async () => {
    const wrapper = mount(LnVideo, { props: { youtube: 'https://youtu.be/dQw4w9WgXcQ' } })

    expect(wrapper.find('iframe').exists()).toBe(false)
    expect(wrapper.find('.ln-video__facade').exists()).toBe(true)

    await wrapper.find('.ln-video__facade').trigger('click')

    const iframe = wrapper.find('iframe')
    expect(iframe.exists()).toBe(true)
    // No cookies on the first visit, and none from the cookie-ful domain after.
    expect(iframe.attributes('src')).toContain('youtube-nocookie.com/embed/dQw4w9WgXcQ')
  })

  it('uses a native player for a self-hosted file', () => {
    const wrapper = mount(LnVideo, { props: { src: '/media/demo.mp4' } })

    expect(wrapper.find('video').attributes('controls')).toBeDefined()
    expect(wrapper.find('.ln-video__facade').exists()).toBe(false)
  })
})

describe('LnBanner', () => {
  beforeEach(() => localStorage.clear())

  it('renders and stays put when it is not dismissible', () => {
    const wrapper = mount(LnBanner, { props: { text: 'v1.0 is out' } })

    expect(wrapper.text()).toContain('v1.0 is out')
    expect(wrapper.find('.ln-banner__close').exists()).toBe(false)
  })

  it('remembers the dismissal under the storage key', async () => {
    const wrapper = mount(LnBanner, {
      props: { text: 'v1.0 is out', dismissible: true, storageKey: 'ln-banner-v1' },
    })

    await wrapper.find('.ln-banner__close').trigger('click')

    expect(wrapper.find('.ln-banner__inner').exists()).toBe(false)
    expect(localStorage.getItem('ln-banner-v1')).toBe('dismissed')
  })

  it('starts hidden when the key is already set', async () => {
    localStorage.setItem('ln-banner-v1', 'dismissed')

    const wrapper = mount(LnBanner, {
      props: { text: 'v1.0', dismissible: true, storageKey: 'ln-banner-v1' },
    })
    // Rendered first, hidden on mount — the other way round would flash for
    // everyone who never dismissed it.
    await nextTick()

    expect(wrapper.find('.ln-banner__inner').exists()).toBe(false)
  })
})
