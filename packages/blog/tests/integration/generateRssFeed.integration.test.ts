import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { generateRssFeed } from '../../src/transformers/generateRssFeed.ts'
import { createTestBlogEnv, type TestEnv } from './setup/createTestBlogEnv.ts'

describe('generateRssFeed integration', () => {
  let env: TestEnv

  beforeEach(() => {
    env = createTestBlogEnv()
  })

  afterEach(() => {
    env.cleanUp()
  })

  it('generates valid RSS, Atom, and JSON feeds on real filesystem', async () => {
    // Create posts for 'ru' locale
    env.createPost({
      locale: 'ru',
      slug: 'first-post',
      frontmatter: {
        title: 'Первый пост',
        date: '2025-01-10T12:00:00.000Z',
        tags: ['Vue', 'TypeScript'],
        authorId: 'alice',
        cover: '/img/cover-1.jpg',
        description: 'Явное описание первого поста',
      },
      content: '# Первый пост\n\nТекст первого поста',
    })

    env.createPost({
      locale: 'ru',
      slug: 'second-post',
      frontmatter: {
        title: 'Второй пост',
        date: '2025-01-15T12:00:00.000Z',
        tags: ['VitePress'],
        authorId: 'bob',
      },
      content: '# Второй пост\n\nЭто описание должно автоматически извлечься из текста статьи, так как явного description нет.',
    })

    // Create posts for 'en' locale
    env.createPost({
      locale: 'en',
      slug: 'english-post',
      frontmatter: {
        title: 'English Post Title',
        date: '2025-01-12T10:00:00.000Z',
        tags: ['General'],
        authorId: 'alice',
      },
      content: '# English Post\n\nSome body text for english post.',
    })

    // Run generateRssFeed
    await generateRssFeed(env.siteConfig)

    // Verify 'ru' feeds exist
    const ruRssPath = path.join(env.outDir, 'ru', 'feed.rss')
    const ruAtomPath = path.join(env.outDir, 'ru', 'feed.atom')
    const ruJsonPath = path.join(env.outDir, 'ru', 'feed.json')

    expect(fs.existsSync(ruRssPath)).toBe(true)
    expect(fs.existsSync(ruAtomPath)).toBe(true)
    expect(fs.existsSync(ruJsonPath)).toBe(true)

    // Check RSS XML Content
    const ruRssContent = fs.readFileSync(ruRssPath, 'utf-8')
    expect(ruRssContent).toContain('<rss version="2.0"')
    expect(ruRssContent).toContain('<title>Блог на русском</title>')
    expect(ruRssContent).toContain('<link>https://example.com/ru</link>')
    expect(ruRssContent).toContain('Второй пост')
    expect(ruRssContent).toContain('Первый пост')
    expect(ruRssContent).toContain('<category domain="https://example.com/ru/tags/vue/1">Vue</category>')

    // Check Atom XML Content
    const ruAtomContent = fs.readFileSync(ruAtomPath, 'utf-8')
    expect(ruAtomContent).toContain('<feed xmlns="http://www.w3.org/2005/Atom">')
    expect(ruAtomContent).toContain('<title>Блог на русском</title>')
    expect(ruAtomContent).toContain('Первый пост')

    // Check JSON Feed Content
    const ruJsonContent = JSON.parse(fs.readFileSync(ruJsonPath, 'utf-8'))
    expect(ruJsonContent.title).toBe('Блог на русском')
    expect(ruJsonContent.items).toHaveLength(2)

    // Verify ordering (newest date first: second-post (Jan 15) before first-post (Jan 10))
    expect(ruJsonContent.items[0].title).toBe('Второй пост')
    expect(ruJsonContent.items[1].title).toBe('Первый пост')

    // Verify 'en' feed content
    const enRssPath = path.join(env.outDir, 'en', 'feed.rss')
    expect(fs.existsSync(enRssPath)).toBe(true)
    const enRssContent = fs.readFileSync(enRssPath, 'utf-8')
    expect(enRssContent).toContain('<title>English Blog</title>')
    expect(enRssContent).toContain('English Post Title')
  })

  it('respects maxPosts limit when generating feeds', async () => {
    env.siteConfig.userConfig!.themeConfig!.feeds!.maxPosts = 2

    for (let i = 1; i <= 5; i++) {
      env.createPost({
        locale: 'ru',
        slug: `post-${i}`,
        frontmatter: {
          title: `Пост №${i}`,
          date: `2025-01-0${i}T10:00:00.000Z`,
        },
        content: `Контент поста ${i}`,
      })
    }

    await generateRssFeed(env.siteConfig)

    const ruJsonPath = path.join(env.outDir, 'ru', 'feed.json')
    const ruJsonContent = JSON.parse(fs.readFileSync(ruJsonPath, 'utf-8'))

    // Should contain only 2 newest posts (post-5, post-4)
    expect(ruJsonContent.items).toHaveLength(2)
    expect(ruJsonContent.items[0].title).toBe('Пост №5')
    expect(ruJsonContent.items[1].title).toBe('Пост №4')
  })

  it('skips invalid posts without breaking feed generation', async () => {
    // Valid post
    env.createPost({
      locale: 'ru',
      slug: 'valid-post',
      frontmatter: {
        title: 'Валидный пост',
        date: '2025-01-10T10:00:00.000Z',
      },
      content: 'Текст валидного поста',
    })

    // Invalid post (missing title)
    env.createPost({
      locale: 'ru',
      slug: 'invalid-no-title',
      frontmatter: {
        date: '2025-01-11T10:00:00.000Z',
      },
      content: 'Пост без заголовка',
    })

    // Invalid post (date in far future)
    env.createPost({
      locale: 'ru',
      slug: 'invalid-future-date',
      frontmatter: {
        title: 'Пост из будущего',
        date: '2099-01-01T10:00:00.000Z',
      },
      content: 'Пост из далекого будущего',
    })

    await generateRssFeed(env.siteConfig)

    const ruJsonPath = path.join(env.outDir, 'ru', 'feed.json')
    const ruJsonContent = JSON.parse(fs.readFileSync(ruJsonPath, 'utf-8'))

    expect(ruJsonContent.items).toHaveLength(1)
    expect(ruJsonContent.items[0].title).toBe('Валидный пост')
  })
})
