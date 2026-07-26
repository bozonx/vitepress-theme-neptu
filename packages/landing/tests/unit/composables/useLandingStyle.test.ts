import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import {
  useLandingStyle,
  STYLE_PRESETS,
  STYLE_STORAGE_KEY,
} from '../../../src/composables/useLandingStyle.ts'
import { createLandingHeadScript } from '../../../src/configs/headScript.ts'

/** Mounts a component so the composable's onMounted hook runs. */
function useInComponent() {
  let api!: ReturnType<typeof useLandingStyle>
  const Comp = defineComponent({
    setup() {
      api = useLandingStyle()
      return () => null
    },
  })
  mount(Comp)
  return api
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-ln-style')
})

describe('useLandingStyle', () => {
  it('writes the attribute and persists the choice', () => {
    const { setLandingStyle, activeStyle } = useInComponent()

    setLandingStyle('brutal')

    expect(document.documentElement.getAttribute('data-ln-style')).toBe('brutal')
    expect(localStorage.getItem(STYLE_STORAGE_KEY)).toBe('brutal')
    expect(activeStyle.value).toBe('brutal')
  })

  it('adopts the attribute already set by the head script', () => {
    document.documentElement.setAttribute('data-ln-style', 'glass')

    const { activeStyle } = useInComponent()

    expect(activeStyle.value).toBe('glass')
  })

  it('restores a saved preset when no attribute is present', () => {
    localStorage.setItem(STYLE_STORAGE_KEY, 'editorial')

    const { activeStyle } = useInComponent()

    expect(activeStyle.value).toBe('editorial')
    expect(document.documentElement.getAttribute('data-ln-style')).toBe('editorial')
  })

  it('ignores an empty id', () => {
    const { setLandingStyle, activeStyle } = useInComponent()
    setLandingStyle('sharp')

    setLandingStyle('')

    expect(activeStyle.value).toBe('sharp')
  })

  it('ships the five built-in presets', () => {
    expect(STYLE_PRESETS.map((preset) => preset.id)).toEqual([
      'soft',
      'sharp',
      'brutal',
      'glass',
      'editorial',
    ])
  })
})

describe('createLandingHeadScript', () => {
  it('arms the reveal animations and restores both theme axes', () => {
    const script = createLandingHeadScript({
      colorTheme: 'teal',
      landingStyle: 'brutal',
    })

    expect(script).toContain('ln-js')
    expect(script).toContain('neptu-color-theme')
    expect(script).toContain(STYLE_STORAGE_KEY)
    expect(script).toContain('"teal"')
    expect(script).toContain('"brutal"')
    expect(script).toContain('data-ln-style')
  })

  it('runs without defaults', () => {
    const script = createLandingHeadScript()

    expect(script).toContain('ln-js')
    expect(() => new Function(script)).not.toThrow()
  })
})
