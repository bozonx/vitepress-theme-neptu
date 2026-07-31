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
      makeConfig({ provider: 'pagefind', options: { bodyMarker: 'data-x' } })
    )

    expect(addDirectory).toHaveBeenCalledWith({ path: '/site/dist' })
    expect(writeFiles).toHaveBeenCalledWith({
      outputPath: '/site/dist/pagefind',
    })
    expect(close).toHaveBeenCalled()
  })

  it('passes indexing options through and keeps `enabled`/`glob` out of them', async () => {
    await generateSearchIndex(
      makeConfig({
        provider: 'pagefind',
        index: {
          enabled: true,
          glob: '**/*.htm',
          excludeSelectors: ['.no-index'],
          forceLanguage: 'en',
        },
      })
    )

    expect(createIndex).toHaveBeenCalledWith({
      excludeSelectors: ['.no-index'],
      forceLanguage: 'en',
    })
    expect(addDirectory).toHaveBeenCalledWith({
      path: '/site/dist',
      glob: '**/*.htm',
    })
  })

  it('skips indexing when search is not configured', async () => {
    await generateSearchIndex(makeConfig(undefined))

    expect(createIndex).not.toHaveBeenCalled()
  })

  it('skips indexing for a non-pagefind provider', async () => {
    await generateSearchIndex(makeConfig({ provider: 'algolia' }))

    expect(createIndex).not.toHaveBeenCalled()
  })

  it('skips indexing when disabled explicitly', async () => {
    await generateSearchIndex(
      makeConfig({ provider: 'pagefind', index: { enabled: false } })
    )

    expect(createIndex).not.toHaveBeenCalled()
  })

  it('warns instead of throwing when indexing fails', async () => {
    addDirectory.mockRejectedValueOnce(new Error('boom'))

    await expect(
      generateSearchIndex(makeConfig({ provider: 'pagefind' }))
    ).resolves.toBeUndefined()

    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('boom'))
    expect(close).toHaveBeenCalled()
  })
})
