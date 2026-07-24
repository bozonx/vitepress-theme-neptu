import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import MenuItem from '../../../src/components/MenuItem.vue'

const menuItemSource = readFileSync(
  join(process.cwd(), 'src/components/MenuItem.vue'),
  'utf-8'
)

describe('MenuItem', () => {
  it('passes attributes and slots to Btn', () => {
    const wrapper = mount(MenuItem, {
      attrs: { href: '/test' },
      slots: { default: 'Item text' },
    })
    const btn = wrapper.findComponent({ name: 'NeptuBtn' })
    expect(btn.exists()).toBe(true)
    expect(btn.attributes('href')).toBe('/test')
    expect(btn.text()).toBe('Item text')
  })

  it('applies menu-item classes to Btn', () => {
    const wrapper = mount(MenuItem)
    const btn = wrapper.findComponent({ name: 'NeptuBtn' })
    const classes = btn.props('customClass')
    expect(classes).toEqual(
      expect.arrayContaining([expect.stringContaining('menu-item')])
    )
  })

  it('sets noBg and iconClass on Btn', () => {
    const wrapper = mount(MenuItem)
    const btn = wrapper.findComponent({ name: 'NeptuBtn' })
    expect(btn.props('noBg')).toBe(true)
    expect(btn.props('iconClass')).toBe('muted')
    expect(btn.props('innerClass')).toBe('menu-item-inner')
  })

  it('renders text prop inside the animated inner container', () => {
    const wrapper = mount(MenuItem, {
      props: { text: 'Menu text', href: '/menu' },
    })

    const link = wrapper.find('a.menu-item')
    const inner = link.find('.menu-item-inner')
    expect(link.exists()).toBe(true)
    expect(inner.exists()).toBe(true)
    expect(inner.text()).toBe('Menu text')
  })

  it('keeps the hover slide animation independent from utility CSS', () => {
    expect(menuItemSource).toContain('display: inline-flex;')
    expect(menuItemSource).toContain('transition: transform 0.2s ease-in-out !important;')
    expect(menuItemSource).toContain('transform: translateX(4px) !important;')
  })
})
