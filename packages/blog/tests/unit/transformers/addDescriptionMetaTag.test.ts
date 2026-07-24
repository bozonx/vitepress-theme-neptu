import { describe, it, expect } from 'vitest'
import {
  addDescriptionMetaTag,
  type AddDescriptionMetaTagContext,
} from '../../../src/transformers/addDescriptionMetaTag.ts'

describe('addDescriptionMetaTag', () => {
  function createContext(
    overrides: Partial<AddDescriptionMetaTagContext> = {}
  ): AddDescriptionMetaTagContext {
    return {
      head: [],
      pageData: {
        filePath: 'en/post/hello.md',
        relativePath: 'en/post/hello.md',
        frontmatter: { description: 'Frontmatter description' },
        description: '',
        ...overrides.pageData,
      } as any,
      siteConfig: {
        site: {
          locales: {
            en: { title: 'My Blog', description: 'Locale description' },
          },
        },
        ...overrides.siteConfig,
      } as any,
      ...overrides,
    }
  }

  it('adds a single <meta name="description"> from frontmatter', () => {
    const ctx = createContext()
    addDescriptionMetaTag(ctx)
    const descTags = ctx.head.filter(
      (item: any) => item[0] === 'meta' && item[1]?.name === 'description'
    )
    expect(descTags).toHaveLength(1)
    expect(descTags[0]).toEqual([
      'meta',
      { name: 'description', content: 'Frontmatter description' },
    ])
  })

  it('falls back to resolved pageData.description', () => {
    const ctx = createContext({
      pageData: {
        filePath: 'en/post/hello.md',
        relativePath: 'en/post/hello.md',
        frontmatter: {},
        description: 'Resolved from content',
      } as any,
    })
    addDescriptionMetaTag(ctx)
    expect(ctx.head).toContainEqual([
      'meta',
      { name: 'description', content: 'Resolved from content' },
    ])
  })

  it('falls back to locale description', () => {
    const ctx = createContext({
      pageData: {
        filePath: 'en/post/hello.md',
        relativePath: 'en/post/hello.md',
        frontmatter: {},
        description: '',
      } as any,
    })
    addDescriptionMetaTag(ctx)
    expect(ctx.head).toContainEqual([
      'meta',
      { name: 'description', content: 'Locale description' },
    ])
  })

  it('adds nothing when no description is available', () => {
    const ctx = createContext({
      pageData: {
        filePath: 'root.md',
        relativePath: 'root.md',
        frontmatter: {},
        description: '',
      } as any,
    })
    addDescriptionMetaTag(ctx)
    expect(ctx.head).toEqual([])
  })
})
