import { describe, it, expect } from 'vitest'
import {
  isSeoEnabled,
  resolveSeoSetting,
} from '../../../../src/utils/shared/seo.ts'
import type {
  ExtendedPageData,
  ExtendedSiteConfig,
} from '../../../../src/types.d.ts'

const createPageData = (seo?: Record<string, unknown>): ExtendedPageData =>
  ({
    filePath: 'en/posts/hello.md',
    frontmatter: seo ? { seo } : {},
  }) as any

const createSiteConfig = (
  localeSeo?: Record<string, unknown>,
  rootSeo?: Record<string, unknown>
): ExtendedSiteConfig =>
  ({
    userConfig: { themeConfig: rootSeo ? { seo: rootSeo } : {} },
    site: {
      locales: { en: { themeConfig: localeSeo ? { seo: localeSeo } : {} } },
    },
  }) as any

describe('resolveSeoSetting', () => {
  it('prefers the page over the locale and the locale over the site', () => {
    expect(
      resolveSeoSetting(
        'canonical',
        createPageData({ canonical: true }),
        createSiteConfig({ canonical: false }, { canonical: false })
      )
    ).toBe(true)

    expect(
      resolveSeoSetting(
        'canonical',
        createPageData(),
        createSiteConfig({ canonical: true }, { canonical: false })
      )
    ).toBe(true)

    expect(
      resolveSeoSetting(
        'canonical',
        createPageData(),
        createSiteConfig(undefined, { canonical: false })
      )
    ).toBe(false)
  })

  it('returns undefined when no layer defines the key', () => {
    expect(
      resolveSeoSetting('canonical', createPageData(), createSiteConfig())
    ).toBeUndefined()
  })

  it('resolves non-boolean settings through the same layers', () => {
    expect(
      resolveSeoSetting(
        'maxDescriptionLength',
        createPageData({ maxDescriptionLength: 120 }),
        createSiteConfig({ maxDescriptionLength: 200 }, { maxDescriptionLength: 300 })
      )
    ).toBe(120)
  })

  it('ignores the locale layer for a page outside any locale', () => {
    const pageData = { filePath: 'index.md', frontmatter: {} } as any
    expect(
      resolveSeoSetting(
        'canonical',
        pageData,
        createSiteConfig({ canonical: true }, { canonical: false })
      )
    ).toBe(false)
  })
})

describe('isSeoEnabled', () => {
  it('is enabled unless a layer explicitly sets false', () => {
    expect(isSeoEnabled('og', createPageData(), createSiteConfig())).toBe(true)
    expect(
      isSeoEnabled('og', createPageData(), createSiteConfig({ og: false }))
    ).toBe(false)
    expect(
      isSeoEnabled('og', createPageData({ og: true }), createSiteConfig({ og: false }))
    ).toBe(true)
  })
})
