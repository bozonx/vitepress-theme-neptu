import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

const { writeFileSync, mkdirSync, feedInstances, loadMock, FeedMock } = vi.hoisted(() => {
  const writeFileSync = vi.fn()
  const mkdirSync = vi.fn()
  const feedInstances: Array<{ options: Record<string, unknown>; items: Record<string, unknown>[] }> = []
  const loadMock = vi.fn()

  class FeedMock {
    options: Record<string, unknown>
    items: Record<string, unknown>[] = []

    constructor(options: Record<string, unknown>) {
      this.options = options
      feedInstances.push(this)
    }

    addItem(item: Record<string, unknown>) {
      this.items.push(item)
    }

    rss2() {
      return JSON.stringify({ type: 'rss', options: this.options, items: this.items })
    }

    atom1() {
      return JSON.stringify({ type: 'atom', options: this.options, items: this.items })
    }

    json1() {
      return JSON.stringify({ type: 'json', options: this.options, items: this.items })
    }
  }

  return { writeFileSync, mkdirSync, feedInstances, loadMock, FeedMock }
})

vi.mock('feed', () => ({
  Feed: FeedMock,
}))

vi.mock('node:fs', () => ({
  default: {
    writeFileSync,
    mkdirSync,
  },
}))

vi.mock('vitepress', () => ({
  createContentLoader: vi.fn(() => ({
    load: loadMock,
  })),
}))

import { generateRssFeed } from '../../../src/transformers/generateRssFeed.ts'

describe('generateRssFeed', () => {
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

  beforeEach(() => {
    feedInstances.length = 0
    writeFileSync.mockReset()
    mkdirSync.mockReset()
    loadMock.mockReset()
    warnSpy.mockClear()
    errorSpy.mockClear()
  })

  afterAll(() => {
    warnSpy.mockRestore()
    errorSpy.mockRestore()
  })

  it('writes localized feeds and fills maxPosts with valid posts only', async () => {
    loadMock.mockResolvedValue([
      {
        url: '/en/post/invalid',
        frontmatter: { date: '2024-03-03' },
        src: '# Missing title',
      },
      {
        url: '/en/post/first',
        frontmatter: {
          title: 'First post',
          date: '2024-03-02',
          tags: ['Web Dev'],
          cover: '/img/post.webp',
          authorId: 'alice',
        },
        src: '# First\n\nBody',
      },
      {
        url: '/en/post/second',
        frontmatter: {
          title: 'Second post',
          date: '2024-03-01',
          tags: ['Vue'],
        },
        src: '# Second\n\nBody',
      },
    ])

    await generateRssFeed({
      outDir: '/tmp/dist',
      site: {
        locales: {
          en: {
            lang: 'en-US',
            title: 'English Blog',
            description: 'Desc',
            themeConfig: {
              authors: [{ id: 'alice', name: 'Alice' }],
            },
          },
        },
      },
      userConfig: {
        siteUrl: 'https://example.com/',
        themeConfig: {
          feeds: { maxPosts: 2, formats: ['rss', 'json'] },
          seo: { maxDescriptionLength: 120 },
        },
      },
    } as any)

    expect(mkdirSync).toHaveBeenCalledWith('/tmp/dist/en', { recursive: true })
    expect(writeFileSync).toHaveBeenCalledTimes(2)
    expect(writeFileSync).toHaveBeenNthCalledWith(
      1,
      '/tmp/dist/en/feed.rss',
      expect.any(String),
      'utf-8'
    )
    expect(writeFileSync).toHaveBeenNthCalledWith(
      2,
      '/tmp/dist/en/feed.json',
      expect.any(String),
      'utf-8'
    )

    const rssPayload = JSON.parse(writeFileSync.mock.calls[0]![1])
    expect(rssPayload.options.language).toBe('en-US')
    expect(rssPayload.options.feedLinks).toEqual({
      rss: 'https://example.com/en/feed.rss',
    })
    expect(rssPayload.items).toHaveLength(2)
    expect(rssPayload.items[0]).toMatchObject({
      title: 'First post',
      link: 'https://example.com/en/post/first',
      image: 'https://example.com/img/post.webp',
      author: { name: 'Alice', link: 'https://example.com/en/authors/alice/1' },
      category: [{ name: 'Web Dev', domain: 'https://example.com/en/tags/web-dev/1' }],
    })
    expect(rssPayload.items[1]).toMatchObject({
      title: 'Second post',
      link: 'https://example.com/en/post/second',
      category: [{ name: 'Vue', domain: 'https://example.com/en/tags/vue/1' }],
    })
  })

  it('keeps atom feed links localized when atom is enabled', async () => {
    loadMock.mockResolvedValue([])

    await generateRssFeed({
      outDir: '/tmp/dist',
      site: {
        locales: {
          ru: {
            lang: 'ru-RU',
            title: 'Russian Blog',
            description: 'Desc',
            themeConfig: {},
          },
        },
      },
      userConfig: {
        siteUrl: 'https://example.com',
        themeConfig: {
          feeds: { maxPosts: 10, formats: ['rss', 'atom'] },
          seo: { maxDescriptionLength: 120 },
        },
      },
    } as any)

    const rssPayload = JSON.parse(writeFileSync.mock.calls[0]![1])
    expect(rssPayload.options.language).toBe('ru-RU')
    expect(rssPayload.options.feedLinks).toEqual({
      rss: 'https://example.com/ru/feed.rss',
      atom: 'https://example.com/ru/feed.atom',
    })
  })

  it('throws aggregated build errors when a locale cannot be loaded', async () => {
    loadMock.mockRejectedValue(new Error('boom'))

    await expect(
      generateRssFeed({
        outDir: '/tmp/dist',
        site: {
          locales: {
          en: {
            lang: 'en-US',
            title: 'English Blog',
            description: 'Desc',
            themeConfig: {},
            },
          },
        },
        userConfig: {
          siteUrl: 'https://example.com',
          themeConfig: {
            feeds: { maxPosts: 10, formats: ['rss'] },
            seo: { maxDescriptionLength: 120 },
          },
        },
      } as any)
    ).rejects.toThrow('RSS feed generation completed with errors')

    expect(writeFileSync).not.toHaveBeenCalled()
  })
})
