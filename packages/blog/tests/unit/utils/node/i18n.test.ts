import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('node:fs', () => ({
  default: {
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
  },
}))

vi.mock('../../../../src/utils/node/tsLoader.ts', () => ({
  importConfigModule: vi.fn(async () => undefined),
}))

import fs from 'node:fs'
import {
  parseLocaleSite,
  parseSharedSite,
  parseLocaleAuthors,
  hasLocaleSite,
  LOCALE_SITE_FILE,
  SHARED_SITE_FILE,
  LOCALE_AUTHORS_FILE,
  LOCALE_SITE_TS_FILE,
} from '../../../../src/utils/node/i18n.ts'
import { importConfigModule } from '../../../../src/utils/node/tsLoader.ts'

const existsSyncMock = vi.mocked(fs.existsSync)
const readFileSyncMock = vi.mocked(fs.readFileSync)
const importMock = vi.mocked(importConfigModule)

describe('parseLocaleSite', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    importMock.mockResolvedValue(undefined)
  })

  it('returns empty object when neither TS nor YAML variant exists', async () => {
    existsSyncMock.mockReturnValue(false)
    await expect(parseLocaleSite('/src', { localeIndex: 'en' })).resolves.toEqual({})
  })

  it('returns empty object on YAML parse error', async () => {
    existsSyncMock.mockReturnValue(true)
    readFileSyncMock.mockReturnValue('bad: [')
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    await expect(parseLocaleSite('/src', { localeIndex: 'en' })).resolves.toEqual({})
    warnSpy.mockRestore()
  })

  it('applies template substitution to YAML string values', async () => {
    existsSyncMock.mockReturnValue(true)
    readFileSyncMock.mockReturnValue('greeting: Hello ${name}!\n')

    const result = (await parseLocaleSite('/src', {
      localeIndex: 'en',
      name: 'World',
    })) as any
    expect(result.greeting).toBe('Hello World!')
  })

  it('prefers TS variant over YAML when both exist', async () => {
    existsSyncMock.mockReturnValue(true)
    readFileSyncMock.mockReturnValue('source: yaml\n')
    importMock.mockResolvedValue({ source: 'ts' })

    const result = (await parseLocaleSite('/src', { localeIndex: 'en' })) as any
    expect(result).toEqual({ source: 'ts' })
    expect(readFileSyncMock).not.toHaveBeenCalled()
  })

  it('falls back to YAML when TS variant returns undefined', async () => {
    existsSyncMock.mockReturnValue(true)
    readFileSyncMock.mockReturnValue('source: yaml\n')
    importMock.mockResolvedValue(undefined)

    const result = (await parseLocaleSite('/src', { localeIndex: 'en' })) as any
    expect(result).toEqual({ source: 'yaml' })
  })

  it('reads <srcDir>/<localeIndex>/_site.yaml when TS absent', async () => {
    existsSyncMock.mockReturnValue(false)
    await parseLocaleSite('/my-src', { localeIndex: 'ru' })
    expect(existsSyncMock).toHaveBeenCalledWith(
      expect.stringContaining(`/my-src/ru/${LOCALE_SITE_FILE}`)
    )
  })
})

describe('parseSharedSite', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    importMock.mockResolvedValue(undefined)
  })

  it('returns empty object when neither TS nor YAML variant exists', async () => {
    existsSyncMock.mockReturnValue(false)
    await expect(parseSharedSite('/src', {})).resolves.toEqual({})
  })

  it('parses YAML with template substitution', async () => {
    existsSyncMock.mockReturnValue(true)
    readFileSyncMock.mockReturnValue(
      'themeConfig:\n  publisher:\n    name: ${name}\n'
    )

    const result = (await parseSharedSite('/src', { name: 'Acme' })) as any
    expect(result.themeConfig.publisher.name).toBe('Acme')
  })

  it('reads <srcDir>/site.yaml when TS absent', async () => {
    existsSyncMock.mockReturnValue(false)
    await parseSharedSite('/my-src', {})
    expect(existsSyncMock).toHaveBeenCalledWith(
      expect.stringContaining(`/my-src/${SHARED_SITE_FILE}`)
    )
  })
})

describe('parseLocaleAuthors', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    importMock.mockResolvedValue(undefined)
  })

  it('returns [] when no file exists', async () => {
    existsSyncMock.mockReturnValue(false)
    await expect(parseLocaleAuthors('/src', { localeIndex: 'en' })).resolves.toEqual([])
  })

  it('parses YAML array of authors', async () => {
    existsSyncMock.mockReturnValue(true)
    readFileSyncMock.mockReturnValue('- id: a\n  name: A\n- id: b\n  name: B\n')
    const result = await parseLocaleAuthors('/src', { localeIndex: 'en' })
    expect(result).toEqual([
      { id: 'a', name: 'A' },
      { id: 'b', name: 'B' },
    ])
  })

  it('returns [] and warns on non-array YAML payload', async () => {
    existsSyncMock.mockReturnValue(true)
    readFileSyncMock.mockReturnValue('authors:\n  - id: a\n')
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const result = await parseLocaleAuthors('/src', { localeIndex: 'en' })
    expect(result).toEqual([])
    expect(warnSpy).toHaveBeenCalled()
    warnSpy.mockRestore()
  })

  it('reads <srcDir>/<localeIndex>/_authors.yaml', async () => {
    existsSyncMock.mockReturnValue(false)
    await parseLocaleAuthors('/my-src', { localeIndex: 'en' })
    expect(existsSyncMock).toHaveBeenCalledWith(
      expect.stringContaining(`/my-src/en/${LOCALE_AUTHORS_FILE}`)
    )
  })

  it('accepts TS default export', async () => {
    existsSyncMock.mockReturnValue(true)
    importMock.mockResolvedValue([{ id: 'a', name: 'A' }])
    const result = await parseLocaleAuthors('/src', { localeIndex: 'en' })
    expect(result).toEqual([{ id: 'a', name: 'A' }])
  })
})

describe('hasLocaleSite', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('returns true when _site.yaml exists', () => {
    existsSyncMock.mockImplementation((p) =>
      String(p).endsWith(`/${LOCALE_SITE_FILE}`)
    )
    expect(hasLocaleSite('/src', 'en')).toBe(true)
  })

  it('returns true when _site.ts exists', () => {
    existsSyncMock.mockImplementation((p) =>
      String(p).endsWith(`/${LOCALE_SITE_TS_FILE}`)
    )
    expect(hasLocaleSite('/src', 'en')).toBe(true)
  })

  it('returns false when neither variant exists', () => {
    existsSyncMock.mockReturnValue(false)
    expect(hasLocaleSite('/src', 'en')).toBe(false)
  })
})
