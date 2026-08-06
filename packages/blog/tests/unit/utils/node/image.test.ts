import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getImageDimensions, getImageSize } from '../../../../src/utils/node/image.ts'

vi.mock('image-size', () => ({
  imageSize: vi.fn(),
}))

vi.mock('node:fs', () => ({
  default: {
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
  },
}))

import { imageSize } from 'image-size'
import fs from 'node:fs'

describe('getImageDimensions', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('returns null for null input', () => {
    expect(getImageDimensions(null, '/src')).toBeNull()
  })

  it('returns null for undefined input', () => {
    expect(getImageDimensions(undefined, '/src')).toBeNull()
  })

  it('returns null for external http URL', () => {
    expect(getImageDimensions('http://example.com/img.jpg', '/src')).toBeNull()
  })

  it('returns null for external https URL', () => {
    expect(getImageDimensions('https://example.com/img.jpg', '/src')).toBeNull()
  })

  it('returns null for protocol-relative URL', () => {
    expect(getImageDimensions('//example.com/img.jpg', '/src')).toBeNull()
  })

  it('reads from public directory when file exists', () => {
    vi.mocked(fs.existsSync).mockImplementation((p: any) =>
      String(p).includes('public')
    )
    vi.mocked(fs.readFileSync).mockReturnValue(Buffer.from([]))
    vi.mocked(imageSize).mockReturnValue({ width: 100, height: 200 } as any)

    const result = getImageDimensions('img.png', '/src')
    expect(fs.existsSync).toHaveBeenCalledWith(expect.stringContaining('public/img.png'))
    expect(result).toEqual({ width: 100, height: 200 })
  })

  it('returns null when file not found anywhere', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false)
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    expect(getImageDimensions('missing.png', '/src')).toBeNull()
    warnSpy.mockRestore()
  })

  it('returns null when dimensions are invalid', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue(Buffer.from([]))
    vi.mocked(imageSize).mockReturnValue({} as any)
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    expect(getImageDimensions('img.png', '/src')).toBeNull()
    warnSpy.mockRestore()
  })

  it('returns null on read error', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockImplementation(() => {
      throw new Error('read error')
    })
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    expect(getImageDimensions('img.png', '/src')).toBeNull()
    warnSpy.mockRestore()
  })

  it('resolves relative path against the markdown file directory', () => {
    vi.mocked(fs.existsSync).mockImplementation((p: any) =>
      String(p) === '/src/en/posts/my-article/cover.jpg'
    )
    vi.mocked(fs.readFileSync).mockReturnValue(Buffer.from([]))
    vi.mocked(imageSize).mockReturnValue({ width: 400, height: 300 } as any)

    const result = getImageDimensions('./cover.jpg', '/src', 'en/posts/my-article/index.md')
    expect(fs.existsSync).toHaveBeenCalledWith('/src/en/posts/my-article/cover.jpg')
    expect(result).toEqual({ width: 400, height: 300 })
  })

  it('resolves relative path with subfolder against the markdown file directory', () => {
    vi.mocked(fs.existsSync).mockImplementation((p: any) =>
      String(p) === '/src/en/posts/my-article/media/photo.png'
    )
    vi.mocked(fs.readFileSync).mockReturnValue(Buffer.from([]))
    vi.mocked(imageSize).mockReturnValue({ width: 800, height: 600 } as any)

    const result = getImageDimensions('media/photo.png', '/src', 'en/posts/my-article/index.md')
    expect(fs.existsSync).toHaveBeenCalledWith('/src/en/posts/my-article/media/photo.png')
    expect(result).toEqual({ width: 800, height: 600 })
  })

  it('falls back to public dir when relative path not found next to md', () => {
    vi.mocked(fs.existsSync).mockImplementation((p: any) =>
      String(p).includes('public')
    )
    vi.mocked(fs.readFileSync).mockReturnValue(Buffer.from([]))
    vi.mocked(imageSize).mockReturnValue({ width: 100, height: 100 } as any)

    const result = getImageDimensions('shared.png', '/src', 'en/posts/my-article/index.md')
    expect(fs.existsSync).toHaveBeenCalledWith(expect.stringContaining('public/shared.png'))
    expect(result).toEqual({ width: 100, height: 100 })
  })

  it('ignores mdRelativePath for absolute paths', () => {
    vi.mocked(fs.existsSync).mockImplementation((p: any) =>
      String(p).includes('public')
    )
    vi.mocked(fs.readFileSync).mockReturnValue(Buffer.from([]))
    vi.mocked(imageSize).mockReturnValue({ width: 200, height: 200 } as any)

    const result = getImageDimensions('/img/cover.jpg', '/src', 'en/posts/my-article/index.md')
    expect(fs.existsSync).toHaveBeenCalledWith(expect.stringContaining('public/img/cover.jpg'))
    expect(fs.existsSync).not.toHaveBeenCalledWith(expect.stringContaining('my-article'))
    expect(result).toEqual({ width: 200, height: 200 })
  })
})

describe('getImageSize', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('returns dimensions from buffer', () => {
    vi.mocked(imageSize).mockReturnValue({ width: 100, height: 200, type: 'png' } as any)

    const result = getImageSize(Buffer.from('fake'))
    expect(result).toEqual({ width: 100, height: 200, type: 'png' })
  })

  it('uses 0 for missing width/height', () => {
    vi.mocked(imageSize).mockReturnValue({ type: 'gif' } as any)

    const result = getImageSize(Buffer.from('fake'))
    expect(result).toEqual({ width: 0, height: 0, type: 'gif' })
  })

  it('throws when input is not a Buffer', () => {
    expect(() => getImageSize('not-a-buffer' as any)).toThrow('Input must be a Buffer')
  })

  it('throws on image-size error', () => {
    vi.mocked(imageSize).mockImplementation(() => {
      throw new Error('corrupt')
    })

    expect(() => getImageSize(Buffer.from('fake'))).toThrow('Failed to get image dimensions')
  })
})
