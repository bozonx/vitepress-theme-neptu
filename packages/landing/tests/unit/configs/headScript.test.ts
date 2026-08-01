import { describe, it, expect } from 'vitest'
import {
  createLandingHeadScript,
  COLOR_STORAGE_KEY,
  STYLE_STORAGE_KEY,
} from '../../../src/configs/headScript.ts'

describe('createLandingHeadScript', () => {
  it('arms the reveal animations and restores both theme axes', () => {
    const script = createLandingHeadScript({
      colorTheme: 'teal',
      stylePreset: 'brutal',
    })

    expect(script).toContain('ln-js')
    expect(script).toContain(COLOR_STORAGE_KEY)
    expect(script).toContain(STYLE_STORAGE_KEY)
    expect(script).toContain('"teal"')
    expect(script).toContain('"brutal"')
    expect(script).toContain('data-style')
  })

  it('runs without defaults', () => {
    const script = createLandingHeadScript()

    expect(script).toContain('ln-js')
    expect(() => new Function(script)).not.toThrow()
  })
})
