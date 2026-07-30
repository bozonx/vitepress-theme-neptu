import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { assertStrictLocaleStructure } from '../../../../src/utils/node/localeStructure.ts'

const tempDirs: string[] = []

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

function makeSrcDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'neptu-locales-'))
  tempDirs.push(dir)
  return dir
}

describe('assertStrictLocaleStructure', () => {
  it('allows only the selector Markdown file at the content root', () => {
    const srcDir = makeSrcDir()
    fs.writeFileSync(path.join(srcDir, 'index.md'), '# Languages')

    expect(() =>
      assertStrictLocaleStructure(
        { srcDir, locales: { en: {} } },
        '[test]'
      )
    ).not.toThrow()
  })

  it('rejects flat root content', () => {
    const srcDir = makeSrcDir()
    fs.writeFileSync(path.join(srcDir, 'about.md'), '# About')

    expect(() =>
      assertStrictLocaleStructure(
        { srcDir, locales: { en: {} } },
        '[test]'
      )
    ).toThrow('Root-level content is not supported: about.md')
  })

  it('rejects a root locale even without srcDir', () => {
    expect(() =>
      assertStrictLocaleStructure(
        { locales: { root: {} } },
        '[test]'
      )
    ).toThrow('`root` content locale is not supported')
  })
})
