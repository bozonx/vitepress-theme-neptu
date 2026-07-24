import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

const { existsSync, readFileSync, writeFileSync, mkdirSync } = vi.hoisted(() => {
  const store: Record<string, string> = {}

  return {
    existsSync: vi.fn((p: string) => p in store),
    readFileSync: vi.fn((p: string) => store[p] || ''),
    writeFileSync: vi.fn((p: string, data: string) => {
      store[p] = data
    }),
    mkdirSync: vi.fn(),
    __clearStore: () => {
      for (const key of Object.keys(store)) delete store[key]
    },
  }
})

vi.mock('node:fs', () => ({
  default: {
    existsSync,
    readFileSync,
    writeFileSync,
    mkdirSync,
  },
}))

import { generateRobotsTxt } from '../../../src/transformers/generateRobotsTxt.ts'

describe('generateRobotsTxt', () => {
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

  beforeEach(() => {
    warnSpy.mockClear()
    existsSync.mockClear()
    readFileSync.mockClear()
    writeFileSync.mockClear()
    mkdirSync.mockClear()
    // @ts-expect-error private helper
    existsSync.__clearStore?.()
  })

  afterAll(() => {
    warnSpy.mockRestore()
  })

  it('does nothing when siteUrl is missing', () => {
    generateRobotsTxt({
      srcDir: '/src',
      outDir: '/dist',
      userConfig: {},
    } as unknown as Parameters<typeof generateRobotsTxt>[0])

    expect(writeFileSync).not.toHaveBeenCalled()
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('generates robots.txt when no custom file exists in public/', () => {
    existsSync.mockReturnValue(false)

    generateRobotsTxt({
      srcDir: '/src',
      outDir: '/dist',
      userConfig: { siteUrl: 'https://example.com' },
    } as unknown as Parameters<typeof generateRobotsTxt>[0])

    expect(mkdirSync).toHaveBeenCalledWith('/dist', { recursive: true })
    expect(writeFileSync).toHaveBeenCalledWith(
      '/dist/robots.txt',
      'User-agent: *\nAllow: /\n\nSitemap: https://example.com/sitemap.xml\n',
      'utf-8'
    )
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('warns when custom robots.txt lacks Sitemap directive', () => {
    existsSync.mockImplementation((p: string) =>
      p.includes('public/robots.txt')
    )
    readFileSync.mockReturnValue('User-agent: *\nDisallow: /admin\n')

    generateRobotsTxt({
      srcDir: '/src',
      outDir: '/dist',
      userConfig: { siteUrl: 'https://blog.org' },
    } as unknown as Parameters<typeof generateRobotsTxt>[0])

    expect(writeFileSync).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Custom robots.txt detected')
    )
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Sitemap: https://blog.org/sitemap.xml')
    )
  })

  it('does not warn when custom robots.txt already has Sitemap directive', () => {
    existsSync.mockImplementation((p: string) =>
      p.includes('public/robots.txt')
    )
    readFileSync.mockReturnValue(
      'User-agent: *\nDisallow: /admin\n\nSitemap: https://blog.org/sitemap.xml\n'
    )

    generateRobotsTxt({
      srcDir: '/src',
      outDir: '/dist',
      userConfig: { siteUrl: 'https://blog.org' },
    } as unknown as Parameters<typeof generateRobotsTxt>[0])

    expect(writeFileSync).not.toHaveBeenCalled()
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('ignores commented-out Sitemap lines when checking custom file', () => {
    existsSync.mockImplementation((p: string) =>
      p.includes('public/robots.txt')
    )
    readFileSync.mockReturnValue(
      'User-agent: *\n#Sitemap: https://old.com/sitemap.xml\n'
    )

    generateRobotsTxt({
      srcDir: '/src',
      outDir: '/dist',
      userConfig: { siteUrl: 'https://blog.org' },
    } as unknown as Parameters<typeof generateRobotsTxt>[0])

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Custom robots.txt detected')
    )
  })
})
