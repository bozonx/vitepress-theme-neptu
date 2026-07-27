import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LandingRenderer from '../../../src/blocks/LandingRenderer.vue'
import { registerBlockTypes, blockRegistry } from '../../../src/blocks/registry.ts'
import { defineBuiltInBlocks, defineCustomBlocks } from '../../../src/blocks/types.ts'
import { mockFrontmatter } from '../../mocks/vitepress'

afterEach(() => {
  mockFrontmatter.value = {}
  vi.restoreAllMocks()
})

describe('LandingRenderer', () => {
  it('exports explicit helpers for strict built-in and opt-in custom data', () => {
    expect(defineBuiltInBlocks([{ type: 'hero', title: 'Hello' }])[0].type).toBe('hero')
    expect(defineCustomBlocks<'custom-block'>([{ type: 'custom-block', emphasis: true }])[0].type).toBe('custom-block')
  })

  it('renders blocks passed as a prop', () => {
    const wrapper = mount(LandingRenderer, {
      props: {
        blocks: [
          { type: 'hero', title: 'Hello' },
          { type: 'cta', title: 'Act now' },
        ],
      },
    })

    expect(wrapper.find('.ln-page').exists()).toBe(true)
    expect(wrapper.findAll('.ln-section').length).toBe(2)
    expect(wrapper.text()).toContain('Hello')
    expect(wrapper.text()).toContain('Act now')
  })

  it('falls back to frontmatter.blocks', () => {
    mockFrontmatter.value = { blocks: [{ type: 'faq', title: 'Questions' }] }

    const wrapper = mount(LandingRenderer)

    expect(wrapper.text()).toContain('Questions')
  })

  it('passes every other key to the block as a prop', () => {
    const wrapper = mount(LandingRenderer, {
      props: { blocks: [{ type: 'stats', bg: 'inverse', items: [{ value: '42' }] }] },
    })

    expect(wrapper.find('.ln-section--bg-inverse').exists()).toBe(true)
    expect(wrapper.text()).toContain('42')
  })

  it('skips unknown block types instead of crashing', () => {
    const wrapper = mount(LandingRenderer, {
      props: { blocks: [{ type: 'nope' }, { type: 'cta', title: 'Kept' }] },
    })

    expect(wrapper.findAll('.ln-section').length).toBe(1)
    expect(wrapper.text()).toContain('Kept')
    expect(wrapper.find('.ln-unknown-block').exists()).toBe(true)
  })

  it('ignores a non-array blocks value', () => {
    mockFrontmatter.value = { blocks: 'not an array' }

    const wrapper = mount(LandingRenderer)

    expect(wrapper.findAll('.ln-section').length).toBe(0)
  })

  it('renders custom types registered at runtime', () => {
    registerBlockTypes({
      'custom-block': { template: '<div class="custom">custom</div>' },
    })

    try {
      const wrapper = mount(LandingRenderer, {
        props: { blocks: [{ type: 'custom-block' }] },
      })

      expect(wrapper.find('.custom').exists()).toBe(true)
    } finally {
      delete blockRegistry['custom-block']
    }
  })
})
