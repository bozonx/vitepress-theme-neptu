import { imageSize } from 'image-size'
import fs from 'node:fs'
import path from 'node:path'

export interface ImageDimensions {
  width: number
  height: number
}

export interface ImageSizeResult extends ImageDimensions {
  type: string | undefined
}

/** Reads image dimensions from a file. */
export function getImageDimensions(
  imagePath: string | null | undefined,
  srcDir: string
): ImageDimensions | null {
  if (!imagePath) return null
  // External URL
  if (imagePath.startsWith('http') || imagePath.startsWith('//')) return null

  try {
    // 1. Try public directory (most common for theme assets)
    let fullPath = path.join(srcDir, 'public', imagePath)

    if (!fs.existsSync(fullPath)) {
      // 2. Try relative to srcDir (for co-located images)
      fullPath = path.join(srcDir, imagePath)
    }

    if (!fs.existsSync(fullPath)) {
      console.warn(`Image file not found: ${imagePath} in ${srcDir}`)
      return null
    }

    const dimensions = imageSize(fs.readFileSync(fullPath))

    if (!dimensions || !dimensions.width || !dimensions.height) {
      console.warn(`Invalid image dimensions for ${fullPath}`)
      return null
    }

    return { width: dimensions.width, height: dimensions.height }
  } catch (error) {
    console.warn(
      `Failed to get image dimensions for ${imagePath}:`,
      (error as Error)?.message
    )
    return null
  }
}

/** Gets image dimensions from a buffer */
export function getImageSize(buffer: Buffer): ImageSizeResult {
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
