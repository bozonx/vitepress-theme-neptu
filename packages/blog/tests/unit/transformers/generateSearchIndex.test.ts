import { beforeEach, describe, expect, it, vi } from 'vitest'

const { addDirectory, writeFiles, createIndex, close } = vi.hoisted(() => {
  const addDirectory = vi.fn(async () => ({ errors: [], page_count: 3 }))
  const writeFiles = vi.fn(async ({ outputPath }: { outputPath: string }) => ({
    errors: [],
    outputPath,
  }))

  return {
    addDirectory,
    writeFiles,
    close: vi.fn(async () => null),
    createIndex: vi.fn(async () => ({
      errors: [],
      index: { addDirectory, writeFiles },
    })),
  }
})

vi.mock('pagefind', () => ({ createIndex, close }))

import { generateSearchIndex } from '../../../src/transformers/generateSearchIndex.ts'
import type { ExtendedSiteConfig } from '../../../src/types.d.ts'

const makeConfig = (
  search: Record<string, unknown> | undefined,
  outDir = '/site/dist'
) =>
  ({
    outDir,
    userConfig: { themeConfig: { search } },
  }) as unknown as ExtendedSiteConfig

describe('generateSearchIndex', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  it('indexes outDir and writes the bundle next to it', async () => {
    await generateSearchIndex(
      makeConfig({ enabled: true })
    )

    expect(addDirectory).toHaveBeenCalledWith({ path: '/site/dist' })
    expect(writeFiles).toHaveBeenCalledWith({
      outputPath: '/site/dist/pagefind',
    })
    expect(close).toHaveBeenCalled()
  })

  it('indexes by default when search is not configured', async () => {
    await generateSearchIndex(makeConfig(undefined))

    expect(createIndex).toHaveBeenCalled()
  })

  it('skips indexing when disabled explicitly', async () => {
    await generateSearchIndex(
      makeConfig({ enabled: false })
    )

    expect(createIndex).not.toHaveBeenCalled()
  })

  it('warns instead of throwing when indexing fails', async () => {
    addDirectory.mockRejectedValueOnce(new Error('boom'))

    await expect(
      generateSearchIndex(makeConfig({ enabled: true }))
    ).resolves.toBeUndefined()

    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('boom'))
    expect(close).toHaveBeenCalled()
  })
})
