import { describe, it, expect } from 'vitest'
import * as composables from '../../../src/composables/index.ts'

describe('composables barrel', () => {
  it('exports all public composables', () => {
    expect(composables).toHaveProperty('useBreakpoint')
    expect(composables).toHaveProperty('useContentLangs')
    expect(composables).toHaveProperty('useLightbox')
    expect(composables).toHaveProperty('useScrollY')
    expect(composables).toHaveProperty('useSwipeDrawer')
    expect(composables).toHaveProperty('useToTheTop')
    expect(composables).toHaveProperty('useUiTheme')
  })
})
