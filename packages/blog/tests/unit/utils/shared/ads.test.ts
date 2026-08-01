import { describe, it, expect } from 'vitest'
import {
  DEFAULT_ADS_IN_CONTENT,
  isAdsEnabled,
  isPlacementEnabled,
  requiresAdConsent,
  resolveInContentRule,
} from '../../../../src/utils/shared/ads.ts'
import type { ThemeConfig } from '../../../../src/types.d.ts'

describe('isAdsEnabled', () => {
  const theme = {} as ThemeConfig

  it('is on for posts by default', () => {
    expect(isAdsEnabled(theme, { layout: 'post' })).toBe(true)
    expect(isAdsEnabled(theme, {})).toBe(true)
  })

  it('is off for utility and plain pages by default', () => {
    expect(isAdsEnabled(theme, { layout: 'page' })).toBe(false)
    expect(isAdsEnabled(theme, { layout: 'tag' })).toBe(false)
  })

  it('never renders on the home page', () => {
    expect(isAdsEnabled(theme, { layout: 'home', ads: true })).toBe(false)
  })

  it('honours the master switch', () => {
    expect(isAdsEnabled({ ads: { enabled: false } } as ThemeConfig, {})).toBe(
      false
    )
  })

  it('lets frontmatter override the layout list', () => {
    expect(isAdsEnabled(theme, { layout: 'page', ads: true })).toBe(true)
    expect(isAdsEnabled(theme, { layout: 'post', ads: false })).toBe(false)
  })

  it('applies the landing fallback layout', () => {
    // The landing theme sets these: a bare `layout` means `doc` there.
    const landing = {
      ads: { layouts: ['doc'], defaultLayout: 'doc' },
    } as ThemeConfig
    expect(isAdsEnabled(landing, {})).toBe(true)
    expect(isAdsEnabled(landing, { layout: 'page' })).toBe(false)
  })
})

describe('isPlacementEnabled', () => {
  it('defaults to aside and in-content on, after-content off', () => {
    expect(isPlacementEnabled(undefined, 'aside')).toBe(true)
    expect(isPlacementEnabled(undefined, 'in-content')).toBe(true)
    expect(isPlacementEnabled(undefined, 'after-content')).toBe(false)
  })

  it('honours explicit flags', () => {
    expect(isPlacementEnabled({ aside: false }, 'aside')).toBe(false)
    expect(
      isPlacementEnabled({ inContent: { enabled: false } }, 'in-content')
    ).toBe(false)
    expect(isPlacementEnabled({ afterContent: true }, 'after-content')).toBe(
      true
    )
  })
})

describe('requiresAdConsent', () => {
  it('does not gate slots unless asked to', () => {
    expect(requiresAdConsent(undefined)).toBe(false)
    expect(requiresAdConsent({})).toBe(false)
    expect(requiresAdConsent({ requireConsent: true })).toBe(true)
  })
})

describe('resolveInContentRule', () => {
  it('fills in the defaults', () => {
    expect(resolveInContentRule(undefined)).toEqual(DEFAULT_ADS_IN_CONTENT)
  })

  it('merges a partial override over them', () => {
    expect(resolveInContentRule({ inContent: { max: 5 } })).toEqual({
      ...DEFAULT_ADS_IN_CONTENT,
      max: 5,
    })
  })
})
