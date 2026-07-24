import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import yaml from 'yaml'
import type { ExtendedSiteConfig, PostFrontmatter } from '../../../src/types.d.ts'

export interface TestPostConfig {
  locale: string
  slug: string
  frontmatter: PostFrontmatter
  content?: string
}

export interface TestEnv {
  tempDir: string
  srcDir: string
  outDir: string
  siteConfig: ExtendedSiteConfig
  createPost: (post: TestPostConfig) => string
  cleanUp: () => void
}

export function createTestBlogEnv(options?: {
  siteUrl?: string
  locales?: Record<string, any>
  feedsConfig?: any
}): TestEnv {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'neptu-rss-integration-'))
  const srcDir = path.join(tempDir, 'src')
  const outDir = path.join(tempDir, 'dist')

  fs.mkdirSync(srcDir, { recursive: true })
  fs.mkdirSync(outDir, { recursive: true })

  const siteUrl = options?.siteUrl ?? 'https://example.com'
  const locales = options?.locales ?? {
    ru: {
      lang: 'ru-RU',
      title: 'Блог на русском',
      description: 'Описание блога',
      themeConfig: {
        authors: [
          { id: 'alice', name: 'Алиса', avatar: '/img/alice.jpg' },
          { id: 'bob', name: 'Боб', avatar: '/img/bob.jpg' },
        ],
      },
    },
    en: {
      lang: 'en-US',
      title: 'English Blog',
      description: 'Blog description',
      themeConfig: {
        authors: [
          { id: 'alice', name: 'Alice', avatar: '/img/alice.jpg' },
        ],
      },
    },
  }

  const siteConfig: ExtendedSiteConfig = {
    root: tempDir,
    srcDir,
    outDir,
    site: {
      base: '/',
      locales,
    },
    markdown: {},
    userConfig: {
      siteUrl,
      themeConfig: {
        feeds: options?.feedsConfig ?? {
          maxPosts: 50,
          formats: ['rss', 'atom', 'json'],
        },
        seo: {
          maxDescriptionLength: 150,
        },
      },
    },
  }

  // Set global VITEPRESS_CONFIG expected by VitePress's createContentLoader
  ;(globalThis as any).VITEPRESS_CONFIG = siteConfig

  const createPost = ({ locale, slug, frontmatter, content = '' }: TestPostConfig): string => {
    const postDir = path.join(srcDir, locale, 'post')
    fs.mkdirSync(postDir, { recursive: true })

    const postPath = path.join(postDir, `${slug}.md`)
    const yamlFm = yaml.stringify(frontmatter)
    const fileContent = `---\n${yamlFm}---\n\n${content}\n`

    fs.writeFileSync(postPath, fileContent, 'utf-8')
    return postPath
  }

  const cleanUp = () => {
    delete (globalThis as any).VITEPRESS_CONFIG
    try {
      fs.rmSync(tempDir, { recursive: true, force: true })
    } catch {
      // ignore cleanup errors
    }
  }

  return {
    tempDir,
    srcDir,
    outDir,
    siteConfig,
    createPost,
    cleanUp,
  }
}
