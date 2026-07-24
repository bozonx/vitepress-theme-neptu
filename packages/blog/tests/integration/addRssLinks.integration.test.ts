import { describe, expect, it } from 'vitest'
import type { HeadConfig } from 'vitepress'
import { addRssLinks } from '../../src/transformers/addRssLinks.ts'
import type { ExtendedPageData, ExtendedSiteConfig } from '../../src/types.d.ts'

describe('addRssLinks integration', () => {
  const createMockSiteConfig = (overrideFeeds?: any): ExtendedSiteConfig => ({
    root: '/test',
    site: {
      locales: {
        ru: {
          lang: 'ru-RU',
          title: 'Мой Блог',
          description: 'Описание',
        },
        en: {
          lang: 'en-US',
          title: 'My Blog',
          description: 'Description',
        },
      },
    },
    userConfig: {
      siteUrl: 'https://blog.example.com',
      themeConfig: {
        feeds: overrideFeeds ?? {
          formats: ['rss', 'atom', 'json'],
        },
      },
    },
  })

  const createHomePageData = (rssEnabled = true): ExtendedPageData =>
    ({
      frontmatter: {
        layout: 'home',
        seo: { rss: rssEnabled },
      },
      filePath: 'ru/index.md',
    }) as any

  it('adds alternate link tags to head for all locales and supported RSS formats', () => {
    const head: HeadConfig[] = []
    const pageData = createHomePageData()
    const siteConfig = createMockSiteConfig()

    addRssLinks({
      page: 'ru/index.html',
      head,
      pageData,
      siteConfig,
    })

    // 2 locales (ru, en) * 3 formats (rss, atom, json) = 6 link tags
    expect(head).toHaveLength(6)

    // RU RSS link
    expect(head).toContainEqual([
      'link',
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: 'Мой Блог - RSS Feed',
        href: 'https://blog.example.com/ru/feed.rss',
        hreflang: 'ru-RU',
      },
    ])

    // RU Atom link
    expect(head).toContainEqual([
      'link',
      {
        rel: 'alternate',
        type: 'application/atom+xml',
        title: 'Мой Блог - Atom Feed',
        href: 'https://blog.example.com/ru/feed.atom',
        hreflang: 'ru-RU',
      },
    ])

    // EN RSS link
    expect(head).toContainEqual([
      'link',
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: 'My Blog - RSS Feed',
        href: 'https://blog.example.com/en/feed.rss',
        hreflang: 'en-US',
      },
    ])
  })

  it('respects rss=false in page frontmatter and skips adding links', () => {
    const head: HeadConfig[] = []
    const pageData = createHomePageData(false)
    const siteConfig = createMockSiteConfig()

    addRssLinks({
      page: 'ru/index.html',
      head,
      pageData,
      siteConfig,
    })

    expect(head).toHaveLength(0)
  })

  it('skips adding links for non-home pages', () => {
    const head: HeadConfig[] = []
    const pageData: ExtendedPageData = {
      frontmatter: { layout: 'post' },
      filePath: 'ru/post/some-post.md',
    } as any
    const siteConfig = createMockSiteConfig()

    addRssLinks({
      page: 'ru/post/some-post.html',
      head,
      pageData,
      siteConfig,
    })

    expect(head).toHaveLength(0)
  })
})
