import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  loadPostsData,
  loadPostsDataFromFiles,
} from '../../../src/list-helpers/loadPosts.ts'

const CACHE_KEY = '__neptuBlogCache__'
function clearGlobalCache() {
  const g = globalThis as Record<string, unknown>
  if (g[CACHE_KEY] && typeof g[CACHE_KEY] === 'object') {
    const cache = g[CACHE_KEY] as Record<string, unknown>
    for (const k of Object.keys(cache)) delete cache[k]
  }
}

const mockReaddir = vi.fn()
const mockMakePreviewItem = vi.fn((path: string) => ({
  url: path.replace(/\\/g, '/').replace('.md', '.html'),
}))

vi.mock('node:fs/promises', () => ({
  default: { readdir: (...args: any[]) => mockReaddir(...args) },
  readdir: (...args: any[]) => mockReaddir(...args),
}))

vi.mock('../../../src/list-helpers/makePreviewItem.ts', () => ({
  makePreviewItem: (...args: Parameters<typeof mockMakePreviewItem>) =>
    mockMakePreviewItem(...args),
}))

describe('loadPostsData', () => {
  beforeEach(() => {
    mockReaddir.mockReset()
    clearGlobalCache()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('returns empty array for empty localeDir', async () => {
    expect(await loadPostsData('')).toEqual([])
  })

  it('reads md files from posts directory', async () => {
    mockReaddir.mockResolvedValue(['post1.md', 'post2.md', 'readme.txt'])
    const posts = await loadPostsData('/content/en')
    expect(posts).toHaveLength(2)
    expect(posts[0].url).toContain('post1')
    expect(posts[1].url).toContain('post2')
  })

  it('returns cached results on second call', async () => {
    mockReaddir.mockResolvedValue(['a.md'])
    const first = await loadPostsData('/content/en')
    const second = await loadPostsData('/content/en')
    expect(mockReaddir).toHaveBeenCalledTimes(1)
    expect(second).toEqual(first)
  })

  it('ignores cache when ignoreCache is true', async () => {
    mockReaddir.mockResolvedValue(['a.md'])
    await loadPostsData('/content/en')
    await loadPostsData('/content/en', { ignoreCache: true })
    expect(mockReaddir).toHaveBeenCalledTimes(2)
  })

  it('uses injected cache instead of global cache', async () => {
    mockReaddir.mockResolvedValue(['x.md'])
    const isolatedCache: Record<string, any> = {}
    const posts = await loadPostsData('/content/en', { cache: isolatedCache })
    expect(posts).toHaveLength(1)
    // global cache should remain untouched
    const g = globalThis as Record<string, unknown>
    const globalCache = (g[CACHE_KEY] as Record<string, unknown>) ?? {}
    expect(Object.keys(globalCache)).not.toContain(
      expect.stringContaining('/content/en')
    )
  })

  it('passes maxPreviewLength to preview item builder', async () => {
    mockReaddir.mockResolvedValue(['a.md'])
    await loadPostsData('/content/en', { maxPreviewLength: 120 })
    expect(mockMakePreviewItem).toHaveBeenCalledWith(
      expect.stringContaining('/content/en/post/a.md'),
      { maxPreviewLength: 120, srcDir: '/content' }
    )
  })

  it('throws on fs error', async () => {
    mockReaddir.mockRejectedValue(new Error('ENOENT'))
    await expect(loadPostsData('/content/en')).rejects.toThrow(
      'Error loading posts'
    )
  })
})

describe('loadPostsDataFromFiles', () => {
  beforeEach(() => {
    clearGlobalCache()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('filters non-md files', async () => {
    const posts = await loadPostsDataFromFiles(['a.md', 'b.txt', 'c.md'])
    expect(posts).toHaveLength(2)
  })

  it('returns empty array for empty input', async () => {
    expect(await loadPostsDataFromFiles([])).toEqual([])
  })

  it('caches by file list', async () => {
    const files = ['/a.md', '/b.md']
    const first = await loadPostsDataFromFiles(files)
    const second = await loadPostsDataFromFiles(files)
    expect(second).toEqual(first)
  })

  it('uses injected cache instead of global cache', async () => {
    const isolatedCache: Record<string, any> = {}
    const files = ['/a.md', '/b.md']
    const posts = await loadPostsDataFromFiles(files, { cache: isolatedCache })
    expect(posts).toHaveLength(2)
    const g = globalThis as Record<string, unknown>
    const globalCache = (g[CACHE_KEY] as Record<string, unknown>) ?? {}
    const cacheKeys = Object.keys(globalCache)
    // No global key should match our file list
    expect(cacheKeys.some((k) => k.includes('/a.md'))).toBe(false)
  })

  it('passes maxPreviewLength to preview item builder', async () => {
    await loadPostsDataFromFiles(['/a.md'], { maxPreviewLength: 80 })
    expect(mockMakePreviewItem).toHaveBeenCalledWith('/a.md', { maxPreviewLength: 80, srcDir: undefined })
  })

  it('throws when makePreviewItem fails', async () => {
    mockMakePreviewItem.mockImplementation(() => {
      throw new Error('parse error')
    })
    await expect(loadPostsDataFromFiles(['/a.md'])).rejects.toThrow(
      'Error loading posts from watched files'
    )
    mockMakePreviewItem.mockRestore()
  })
})
