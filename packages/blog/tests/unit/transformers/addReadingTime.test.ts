import { describe, it, expect, afterEach } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { addReadingTime } from '../../../src/transformers/addReadingTime.ts'
import type {
  ExtendedPageData,
  ExtendedSiteConfig,
} from '../../../src/types.d.ts'

const tempDirs: string[] = []

afterEach(() => {
  while (tempDirs.length) {
    fs.rmSync(tempDirs.pop()!, { recursive: true, force: true })
  }
})

function makeSrcDir(content: string): string {
  const srcDir = fs.mkdtempSync(path.join(os.tmpdir(), 'neptu-reading-'))
  tempDirs.push(srcDir)
  fs.mkdirSync(path.join(srcDir, 'en', 'posts'), { recursive: true })
  fs.writeFileSync(
    path.join(srcDir, 'en', 'posts', 'a.md'),
    `---\ntitle: A\n---\n\n${content}`,
    'utf8'
  )

  return srcDir
}

function makePageData(
  frontmatter: Record<string, unknown> = {}
): ExtendedPageData {
  return {
    frontmatter,
    filePath: 'en/posts/a.md',
    relativePath: 'en/posts/a.md',
  } as unknown as ExtendedPageData
}

const siteConfig = (srcDir: string): ExtendedSiteConfig =>
  ({ srcDir }) as unknown as ExtendedSiteConfig

describe('addReadingTime', () => {
  it('adds word count and reading time to a post page', () => {
    const srcDir = makeSrcDir(Array.from({ length: 400 }, () => 'word').join(' '))
    const pageData = makePageData()

    addReadingTime(pageData, { siteConfig: siteConfig(srcDir) })

    expect(pageData.wordCount).toBe(400)
    expect(pageData.readingMinutes).toBe(2)
  })

  it('honours the configured words per minute', () => {
    const srcDir = makeSrcDir(Array.from({ length: 400 }, () => 'word').join(' '))
    const pageData = makePageData()

    addReadingTime(pageData, { siteConfig: siteConfig(srcDir), readingTime: { wpm: 100 } })

    expect(pageData.readingMinutes).toBe(4)
  })

  it('skips non-post layouts', () => {
    const srcDir = makeSrcDir('some words here')
    const pageData = makePageData({ layout: 'page' })

    addReadingTime(pageData, { siteConfig: siteConfig(srcDir) })

    expect(pageData.wordCount).toBeUndefined()
  })

  it('skips when disabled', () => {
    const srcDir = makeSrcDir('some words here')
    const pageData = makePageData()

    addReadingTime(pageData, {
      siteConfig: siteConfig(srcDir),
      readingTime: { enabled: false },
    })

    expect(pageData.wordCount).toBeUndefined()
  })

  it('stays silent when the source file is missing', () => {
    const pageData = makePageData()

    expect(() =>
      addReadingTime(pageData, { siteConfig: siteConfig('/nope/nowhere') })
    ).not.toThrow()
    expect(pageData.wordCount).toBeUndefined()
  })
})
