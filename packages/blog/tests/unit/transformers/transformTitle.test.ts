import { describe, it, expect, vi } from 'vitest'
import { transformTitle } from '../../../src/transformers/transformTitle.ts'
import type { ExtendedPageData, ExtendedSiteConfig } from '../../../src/types.d.ts'

vi.mock('../../../src/utils/shared/index.ts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../src/utils/shared/index.ts')>()
  return {
    ...actual,
    mustacheTemplate: vi.fn((tmpl: string, _options: any, { eval: isEval }: { eval?: boolean }) => {
      if (!isEval) return tmpl
      return tmpl.replace(/\{\{(.+?)\}\}/g, (_: string, key: string) => {
        if (key === 'params.tag') return 'MyTag'
        if (key === 'theme.blogTitle') return 'MySite'
        return ''
      })
    }),
  }
})

describe('transformTitle', () => {
  function createPageData(overrides: Partial<ExtendedPageData> = {}): ExtendedPageData {
    return {
      filePath: 'en/post/hello.md',
      frontmatter: { title: 'Hello' },
      ...overrides,
    } as ExtendedPageData
  }

  function createSiteConfig(overrides: Partial<ExtendedSiteConfig> = {}): ExtendedSiteConfig {
    return {
      userConfig: {
        themeConfig: {},
      },
      site: {
        locales: {
          en: {
            themeConfig: { blogTitle: 'MySite' },
          },
        },
      },
      ...overrides,
    } as ExtendedSiteConfig
  }

  it('does nothing if filePath has no slash', () => {
    const pageData = createPageData({ filePath: 'hello.md', frontmatter: { title: 'Hello' } })
    transformTitle(pageData, { siteConfig: createSiteConfig() })
    expect(pageData.frontmatter.title).toBe('Hello')
  })

  it('does nothing without frontmatter title', () => {
    const pageData = createPageData({ frontmatter: {} })
    transformTitle(pageData, { siteConfig: createSiteConfig() })
    expect(pageData.frontmatter.title).toBeUndefined()
  })

  it('transforms mustache template in title', () => {
    const pageData = createPageData({
      frontmatter: { title: 'Tag: {{params.tag}}' },
      params: { tag: 'MyTag' },
    })
    transformTitle(pageData, { siteConfig: createSiteConfig() })
    expect(pageData.frontmatter.title).toBe('Tag: MyTag')
    expect(pageData.title).toBe('Tag: MyTag')
  })

  it('uses theme config in template', () => {
    const pageData = createPageData({
      frontmatter: { title: 'Site: {{theme.blogTitle}}' },
    })
    transformTitle(pageData, { siteConfig: createSiteConfig() })
    expect(pageData.frontmatter.title).toBe('Site: MySite')
  })

  it('updates pageData.title as well', () => {
    const pageData = createPageData({
      frontmatter: { title: 'New Title' },
      title: 'Old Title',
    })
    transformTitle(pageData, { siteConfig: createSiteConfig() })
    expect(pageData.title).toBe('New Title')
  })
})
