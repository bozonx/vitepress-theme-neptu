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

  it('falls back to srcDir when not in public', () => {
    vi.mocked(fs.existsSync).mockImplementation((p: any) =>
      String(p) === '/src/img.png'
    )
    vi.mocked(fs.readFileSync).mockReturnValue(Buffer.from([]))
    vi.mocked(imageSize).mockReturnValue({ width: 50, height: 60 } as any)

    const result = getImageDimensions('img.png', '/src')
    expect(fs.existsSync).toHaveBeenCalledWith('/src/img.png')
    expect(result).toEqual({ width: 50, height: 60 })
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
