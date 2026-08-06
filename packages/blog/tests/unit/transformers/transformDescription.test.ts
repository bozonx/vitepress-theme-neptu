import { describe, expect, it, vi } from 'vitest'
import { transformDescription } from '../../../src/transformers/transformDescription.ts'

vi.mock('../../../src/utils/shared/index.ts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../src/utils/shared/index.ts')>()
  return {
    ...actual,
    interpolateMustache: vi.fn((template: string) =>
      template.replace('{{params.name}}', 'SEO')
    ),
  }
})

describe('transformDescription', () => {
  const siteConfig = {
    site: { locales: { en: { themeConfig: {} } } },
    userConfig: { themeConfig: {} },
  } as any

  it('resolves an explicit dynamic description into pageData', () => {
    const pageData = {
      filePath: 'en/tags/[slug]/[page].md',
      params: { name: 'SEO' },
      frontmatter: { description: 'Posts tagged {{params.name}}' },
      description: 'Posts tagged {{params.name}}',
    } as any

    transformDescription(pageData, { siteConfig })

    expect(pageData.frontmatter.description).toBe('Posts tagged SEO')
    expect(pageData.description).toBe('Posts tagged SEO')
  })

  it('leaves a static description to VitePress', () => {
    const pageData = {
      filePath: 'en/pages/about.md',
      frontmatter: { description: 'About the blog' },
      description: 'About the blog',
    } as any

    transformDescription(pageData, { siteConfig })

    expect(pageData.description).toBe('About the blog')
  })
})
