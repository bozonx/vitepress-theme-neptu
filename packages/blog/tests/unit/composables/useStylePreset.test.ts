import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import {
  useStylePreset,
  STYLE_PRESETS,
  STYLE_STORAGE_KEY,
  STYLE_ATTRIBUTE,
  DEFAULT_STYLE_PRESET,
} from '../../../src/composables/useStylePreset.ts'
import {
  COLOR_STORAGE_KEY,
  COLOR_ATTRIBUTE,
} from '../../../src/composables/useColorTheme.ts'
import {
  createThemeHeadScript,
  COLOR_STORAGE_KEY as HEAD_COLOR_KEY,
  COLOR_ATTRIBUTE as HEAD_COLOR_ATTR,
  STYLE_STORAGE_KEY as HEAD_STYLE_KEY,
  STYLE_ATTRIBUTE as HEAD_STYLE_ATTR,
} from '../../../src/configs/headScript.ts'

/** Mounts a component so the composable's onMounted hook runs. */
function useInComponent() {
  let api!: ReturnType<typeof useStylePreset>
  const Comp = defineComponent({
    setup() {
      api = useStylePreset()
      return () => null
    },
  })
  mount(Comp)
  return api
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute(STYLE_ATTRIBUTE)
})

describe('useStylePreset', () => {
  it('writes the attribute and persists the choice', () => {
    const { setStylePreset, activeStyle } = useInComponent()

    setStylePreset('brutal')

    expect(document.documentElement.getAttribute(STYLE_ATTRIBUTE)).toBe('brutal')
    expect(localStorage.getItem(STYLE_STORAGE_KEY)).toBe('brutal')
    expect(activeStyle.value).toBe('brutal')
  })

  it('adopts the attribute already set by the head script', () => {
    document.documentElement.setAttribute(STYLE_ATTRIBUTE, 'glass')

    const { activeStyle } = useInComponent()

    expect(activeStyle.value).toBe('glass')
  })

  it('restores a saved preset when no attribute is present', () => {
    localStorage.setItem(STYLE_STORAGE_KEY, 'editorial')

    const { activeStyle } = useInComponent()

    expect(activeStyle.value).toBe('editorial')
    expect(document.documentElement.getAttribute(STYLE_ATTRIBUTE)).toBe(
      'editorial'
    )
  })

  it('ignores an empty id', () => {
    const { setStylePreset, activeStyle } = useInComponent()
    setStylePreset('sharp')

    setStylePreset('')

    expect(activeStyle.value).toBe('sharp')
  })

  it('ships the six built-in presets', () => {
    expect(STYLE_PRESETS.map((preset) => preset.id)).toEqual([
      'soft',
      'sharp',
      'brutal',
      'glass',
      'editorial',
      'mono',
    ])
  })

  it('defaults to a preset that exists', () => {
    expect(STYLE_PRESETS.map((preset) => preset.id)).toContain(
      DEFAULT_STYLE_PRESET
    )
  })
})

describe('createThemeHeadScript', () => {
  it('restores both axes from storage, falling back to the configured default', () => {
    const script = createThemeHeadScript({
      colorTheme: 'teal',
      stylePreset: 'brutal',
    })

    expect(script).toContain(COLOR_STORAGE_KEY)
    expect(script).toContain(STYLE_STORAGE_KEY)
    expect(script).toContain(COLOR_ATTRIBUTE)
    expect(script).toContain(STYLE_ATTRIBUTE)
    expect(script).toContain('"teal"')
    expect(script).toContain('"brutal"')
  })

  it('runs without defaults', () => {
    expect(() => new Function(createThemeHeadScript())).not.toThrow()
  })

  it('injects the extra statements it is handed', () => {
    expect(createThemeHeadScript({ extra: `d.classList.add('ln-js');` })).toContain(
      'ln-js'
    )
  })

  /**
   * The head script runs in the Node config and cannot import the composables,
   * so it repeats their constants. A drift here would silently break theme
   * persistence — the script would write one key and the composable read another.
   */
  it('keeps its copies of the axis constants in sync with the composables', () => {
    expect(HEAD_COLOR_KEY).toBe(COLOR_STORAGE_KEY)
    expect(HEAD_COLOR_ATTR).toBe(COLOR_ATTRIBUTE)
    expect(HEAD_STYLE_KEY).toBe(STYLE_STORAGE_KEY)
    expect(HEAD_STYLE_ATTR).toBe(STYLE_ATTRIBUTE)
  })
})
