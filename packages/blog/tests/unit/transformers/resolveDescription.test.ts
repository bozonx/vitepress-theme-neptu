import { describe, it, expect, vi } from 'vitest'
import { resolveDescription } from '../../../src/transformers/resolveDescription.ts'

vi.mock('../../../src/utils/node/index.ts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../src/utils/node/index.ts')>()
  return {
    ...actual,
    extractDescriptionFromMd: vi.fn((content: string, _maxLen: number) => content.trim()),
  }
})

describe('resolveDescription', () => {
  it('does nothing for non-post non-page frontmatter', () => {
    const pageData: Record<string, any> = {
      frontmatter: { layout: 'home' },
      description: undefined,
    }
    const readFile = vi.fn()
    resolveDescription(pageData as any, { siteConfig: { srcDir: '/src', userConfig: {} } as any }, readFile)
    expect(pageData.description).toBeUndefined()
    expect(readFile).not.toHaveBeenCalled()
  })

  it('preserves the description already resolved by VitePress', () => {
    const pageData: Record<string, any> = {
      frontmatter: { layout: 'post', description: 'Existing desc' },
      description: 'Existing desc',
      filePath: 'en/posts/hello.md',
    }
    const readFile = vi.fn().mockReturnValue('raw content')
    resolveDescription(pageData as any, { siteConfig: { srcDir: '/src', userConfig: {} } as any }, readFile)
    expect(readFile).not.toHaveBeenCalled()
    expect(pageData.description).toBe('Existing desc')
  })

  it('preserves a description declared through frontmatter.head', () => {
    const pageData: Record<string, any> = {
      frontmatter: { layout: 'post', head: [['meta', { name: 'description', content: 'Head desc' }]] },
      description: 'Head desc',
      filePath: 'en/posts/hello.md',
    }
    const readFile = vi.fn()
    resolveDescription(pageData as any, { siteConfig: { srcDir: '/src', userConfig: {} } as any }, readFile)
    expect(pageData.description).toBe('Head desc')
    expect(readFile).not.toHaveBeenCalled()
  })

  it('reads file and extracts description for post', () => {
    const readFile = vi.fn().mockReturnValue('# Title\n\nSome content here.')

    const pageData: Record<string, any> = {
      frontmatter: { layout: 'post', description: '' },
      description: undefined,
      filePath: 'en/posts/hello.md',
    }
    resolveDescription(pageData as any, { siteConfig: { srcDir: '/src', userConfig: { themeConfig: { seo: { maxDescriptionLength: 200 } } } } as any }, readFile)
    expect(readFile).toHaveBeenCalledWith('/src/en/posts/hello.md')
    expect(pageData.description).toBe('# Title\n\nSome content here.')
  })

  it('handles missing description field', () => {
    const readFile = vi.fn().mockReturnValue('content')

    const pageData: Record<string, any> = {
      frontmatter: { layout: 'page' },
      description: undefined,
      filePath: 'en/about.md',
    }
    resolveDescription(pageData as any, { siteConfig: { srcDir: '/src', userConfig: { themeConfig: { seo: { maxDescriptionLength: 50 } } } } as any }, readFile)
    expect(pageData.description).toBe('content')
  })

  it('uses locale SEO length before the global fallback', async () => {
    const readFile = vi.fn().mockReturnValue('content')
    resolveDescription(
      {
        frontmatter: { layout: 'post' },
        description: '',
        filePath: 'en/posts/hello.md',
      } as any,
      {
        siteConfig: {
          srcDir: '/src',
          site: { locales: { en: { themeConfig: { seo: { maxDescriptionLength: 123 } } } } },
          userConfig: { themeConfig: { seo: { maxDescriptionLength: 50 } } },
        },
      } as any,
      readFile
    )
    const { extractDescriptionFromMd } = await import('../../../src/utils/node/index.ts')
    expect(vi.mocked(extractDescriptionFromMd)).toHaveBeenLastCalledWith(
      'content',
      123,
      undefined,
      'en/posts/hello.md'
    )
  })

  it('catches file read errors gracefully', () => {
    const readFile = vi.fn().mockImplementation(() => {
      throw new Error('ENOENT')
    })
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const pageData: Record<string, any> = {
      frontmatter: { layout: 'post', description: '' },
      description: undefined,
      filePath: 'en/posts/missing.md',
    }

    resolveDescription(pageData as any, { siteConfig: { srcDir: '/src', userConfig: {} } as any }, readFile)
    expect(pageData.description).toBeUndefined()
    expect(warnSpy).toHaveBeenCalledWith(
      'Failed to resolve description for en/posts/missing.md:',
      'ENOENT'
    )
    warnSpy.mockRestore()
  })
})
