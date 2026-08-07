import { imageSize } from 'image-size'
import fs from 'node:fs'
import path from 'node:path'

export interface ImageDimensions {
  width: number
  height: number
}

export interface ImageMetadata extends ImageDimensions {
  type: string | undefined
}

/**
 * Reads image dimensions from a file.
 *
 * Resolution order for local paths:
 * 1. **Relative to the markdown file** — when `mdRelativePath` is provided and
 *    `imagePath` is a relative path (`./foo.png`, `../bar.jpg`, `media/baz.webp`),
 *    resolves from the directory of the .md file. This supports co-located
 *    images and folder-per-article layouts.
 * 2. **Public directory** — `srcDir/public/<imagePath>` (absolute paths like
 *    `/img/cover.jpg`).
 */
export function getImageDimensions(
  imagePath: string | null | undefined,
  srcDir: string,
  mdRelativePath?: string
): ImageDimensions | null {
  if (!imagePath) return null
  // External URL
  if (/^https?:\/\//i.test(imagePath) || imagePath.startsWith('//')) return null

  try {
    const candidates: string[] = []
    const isRelative =
      !imagePath.startsWith('/') && !imagePath.startsWith('\\')

    if (isRelative && mdRelativePath) {
      // Resolve relative to the markdown file's directory
      const mdDir = path.dirname(path.join(srcDir, mdRelativePath))
      candidates.push(path.resolve(mdDir, imagePath))
    }

    // Always try public dir as fallback
    candidates.push(path.join(srcDir, 'public', imagePath))

    for (const fullPath of candidates) {
      if (fs.existsSync(fullPath)) {
        const dimensions = imageSize(fs.readFileSync(fullPath))

        if (dimensions?.width && dimensions?.height) {
          return { width: dimensions.width, height: dimensions.height }
        }
      }
    }

    console.warn(`Image file not found: ${imagePath} in ${srcDir}`)
    return null
  } catch (error) {
    console.warn(
      `Failed to get image dimensions for ${imagePath}:`,
      (error as Error)?.message
    )
    return null
  }
}

/** Gets image dimensions from a buffer */
export function getImageSize(buffer: Buffer): ImageMetadata {
  if (!Buffer.isBuffer(buffer)) {
    throw new Error('Input must be a Buffer')
  }

  try {
    const dimensions = imageSize(buffer)

    return {
      width: dimensions.width || 0,
      height: dimensions.height || 0,
      type: dimensions.type,
    }
  } catch (error) {
    throw new Error('Failed to get image dimensions', { cause: error })
  }
}
