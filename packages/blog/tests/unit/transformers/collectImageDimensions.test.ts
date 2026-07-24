import { describe, it, expect, vi } from 'vitest'
import * as nodeUtils from '../../../src/utils/node/index.ts'
import { collectImageDimensions } from '../../../src/transformers/collectImageDimensions.ts'

vi.mock('../../../src/utils/node/index.ts', () => ({
  getImageDimensions: vi.fn(),
}))

describe('collectImageDimensions', () => {
  it('does nothing without cover', () => {
    const pageData: any = { frontmatter: {} }
    collectImageDimensions(pageData, { srcDir: '/src' } as any)
    expect(pageData.frontmatter.coverHeight).toBeUndefined()
    expect(pageData.frontmatter.coverWidth).toBeUndefined()
  })

  it('sets dimensions when cover exists', () => {
    vi.mocked(nodeUtils.getImageDimensions).mockReturnValue({ width: 800, height: 600 })

    const pageData: any = { frontmatter: { cover: '/img/hero.png' } }
    collectImageDimensions(pageData, { srcDir: '/src' } as any)
    expect(pageData.frontmatter.coverHeight).toBe(600)
    expect(pageData.frontmatter.coverWidth).toBe(800)
  })

  it('handles null dimensions gracefully', () => {
    vi.mocked(nodeUtils.getImageDimensions).mockReturnValue(null)

    const pageData: any = { frontmatter: { cover: '/img/hero.png' } }
    collectImageDimensions(pageData, { srcDir: '/src' } as any)
    expect(pageData.frontmatter.coverHeight).toBeUndefined()
    expect(pageData.frontmatter.coverWidth).toBeUndefined()
  })

  it('passes correct arguments to getImageDimensions', () => {
    vi.mocked(nodeUtils.getImageDimensions).mockReturnValue({ width: 100, height: 200 })

    const pageData: any = { frontmatter: { cover: '/img/cover.jpg' } }
    collectImageDimensions(pageData, { srcDir: '/project/src' } as any)
    expect(nodeUtils.getImageDimensions).toHaveBeenCalledWith('/img/cover.jpg', '/project/src')
  })

})
