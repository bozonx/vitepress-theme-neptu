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

  it('skips when description is already set and non-empty', () => {
    const pageData: Record<string, any> = {
      frontmatter: { layout: 'post', description: 'Existing desc' },
      description: undefined,
      filePath: 'en/post/hello.md',
    }
    const readFile = vi.fn().mockReturnValue('raw content')
    resolveDescription(pageData as any, { siteConfig: { srcDir: '/src', userConfig: {} } as any }, readFile)
    expect(readFile).not.toHaveBeenCalled()
    expect(pageData.description).toBe('Existing desc')
  })

  it('reads file and extracts description for post', () => {
    const readFile = vi.fn().mockReturnValue('# Title\n\nSome content here.')

    const pageData: Record<string, any> = {
      frontmatter: { layout: 'post', description: '' },
      description: undefined,
      filePath: 'en/post/hello.md',
    }
    resolveDescription(pageData as any, { siteConfig: { srcDir: '/src', userConfig: { themeConfig: { seo: { maxDescriptionLength: 200 } } } } as any }, readFile)
    expect(readFile).toHaveBeenCalledWith('/src/en/post/hello.md')
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

  it('catches file read errors gracefully', () => {
    const readFile = vi.fn().mockImplementation(() => {
      throw new Error('ENOENT')
    })
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const pageData: Record<string, any> = {
      frontmatter: { layout: 'post', description: '' },
      description: undefined,
      filePath: 'en/post/missing.md',
    }

    resolveDescription(pageData as any, { siteConfig: { srcDir: '/src', userConfig: {} } as any }, readFile)
    expect(pageData.description).toBeUndefined()
    expect(warnSpy).toHaveBeenCalledWith(
      'Failed to resolve description for en/post/missing.md:',
      'ENOENT'
    )
    warnSpy.mockRestore()
  })
})
