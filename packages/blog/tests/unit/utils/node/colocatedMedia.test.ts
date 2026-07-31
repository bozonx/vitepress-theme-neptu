import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import {
  collectColocatedMedia,
  createColocatedMediaPlugin,
} from '../../../../src/utils/node/colocatedMedia.ts'

let srcDir: string

function write(relativePath: string, content = 'x'): void {
  const full = path.join(srcDir, relativePath)
  fs.mkdirSync(path.dirname(full), { recursive: true })
  fs.writeFileSync(full, content)
}

beforeEach(() => {
  srcDir = fs.mkdtempSync(path.join(os.tmpdir(), 'neptu-media-'))
})

afterEach(() => {
  fs.rmSync(srcDir, { recursive: true, force: true })
})

describe('collectColocatedMedia', () => {
  it('collects media next to posts and in media subfolders', () => {
    write('ru/post/my-article/index.md')
    write('ru/post/my-article/media/cover.jpg')
    write('ru/post/next-to-me.md')
    write('ru/post/next-to-me.png')
    write('ru/page/deep/sub/demo.mp4')

    expect(collectColocatedMedia(srcDir)).toEqual([
      'ru/page/deep/sub/demo.mp4',
      'ru/post/my-article/media/cover.jpg',
      'ru/post/next-to-me.png',
    ])
  })

  it('skips public, dot folders and non-media files', () => {
    write('public/img/logo.svg')
    write('.vitepress/dist/index.html')
    write('.vitepress/dist/img/built.png')
    write('ru/_authors.yaml')
    write('ru/getAllPosts.ts')
    write('ru/post/a.md')

    expect(collectColocatedMedia(srcDir)).toEqual([])
  })

  it('returns an empty list for a missing srcDir', () => {
    expect(collectColocatedMedia(path.join(srcDir, 'nope'))).toEqual([])
  })
})

describe('createColocatedMediaPlugin', () => {
  it('mirrors media into the output directory', () => {
    write('ru/post/my-article/media/cover.jpg', 'jpeg-bytes')
    const outDir = path.join(srcDir, '.vitepress', 'dist')

    createColocatedMediaPlugin(srcDir).writeBundle({ dir: outDir })

    expect(
      fs.readFileSync(
        path.join(outDir, 'ru/post/my-article/media/cover.jpg'),
        'utf-8'
      )
    ).toBe('jpeg-bytes')
  })

  it('never overwrites an already generated file', () => {
    write('ru/post/a.png', 'source')
    const outDir = path.join(srcDir, '.vitepress', 'dist')
    fs.mkdirSync(path.join(outDir, 'ru/post'), { recursive: true })
    fs.writeFileSync(path.join(outDir, 'ru/post/a.png'), 'generated')

    createColocatedMediaPlugin(srcDir).writeBundle({ dir: outDir })

    expect(fs.readFileSync(path.join(outDir, 'ru/post/a.png'), 'utf-8')).toBe(
      'generated'
    )
  })

  it('skips the SSR bundle output', () => {
    write('ru/post/a.png')
    const tempDir = path.join(srcDir, '.vitepress', '.temp')

    createColocatedMediaPlugin(srcDir).writeBundle({ dir: tempDir })

    expect(fs.existsSync(path.join(tempDir, 'ru/post/a.png'))).toBe(false)
  })
})
