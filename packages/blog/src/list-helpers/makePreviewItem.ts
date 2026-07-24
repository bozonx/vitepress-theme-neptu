import fs from 'node:fs'
import path from 'node:path'

import { DEFAULT_ENCODE, PREVIEW_LENGTH } from '../constants.ts'
import {
  parseMdFile,
  extractDescriptionFromContent,
} from '../utils/node/markdown.ts'
import { normalizeTags, resolvePreviewText } from '../utils/shared/index.ts'
import { getImageDimensions } from '../utils/node/image.ts'
import type { PostFrontmatter, Tag } from '../types.d.ts'

export interface PreviewItem {
  url: string
  date: string | Date | undefined
  authorId: string | undefined
  title: string | undefined
  tags: Tag[]
  preview: string | undefined
  thumbnail: string | undefined
  cover: string | undefined
  coverHeight: number | undefined
  coverWidth: number | undefined
  frontmatter: PostFrontmatter
  [key: string]: unknown
}

export interface MakePreviewItemOptions {
  maxPreviewLength?: number
  /** Absolute path to srcDir. When provided, avoids the hardcoded 3-level depth assumption. */
  srcDir?: string
}

export function makePreviewItem(
  filePath: string,
  options: MakePreviewItemOptions = {}
): PreviewItem {
  const { maxPreviewLength, srcDir } = options
  const baseDir = srcDir ?? path.resolve(filePath, '../../../')
  const relativePath = path.relative(baseDir, filePath)
  const lang = relativePath.split('/')[0]!

  const url = '/' + relativePath.replace(/\.md$/, '')
  const rawContent = fs.readFileSync(filePath, DEFAULT_ENCODE)
  const { frontmatter, content } = parseMdFile(rawContent, filePath)
  const fm = frontmatter as PostFrontmatter

  let preview = resolvePreviewText(fm)
  if (!preview)
    preview = extractDescriptionFromContent(
      content,
      maxPreviewLength ?? PREVIEW_LENGTH
    )

  // Get image dimensions if cover is provided
  let coverDimensions = null
  if (fm.cover) {
    coverDimensions = getImageDimensions(fm.cover, baseDir)
  }

  return {
    url,
    date: fm.date,
    authorId: fm.authorId,
    title: fm.title,
    tags: normalizeTags(fm.tags, lang) || [],
    preview,
    thumbnail: fm.cover,
    cover: fm.cover,
    coverHeight: coverDimensions?.height,
    coverWidth: coverDimensions?.width,
    frontmatter: fm,
  }
}

export function resolvePreview(frontmatter: PostFrontmatter): string | undefined {
  return resolvePreviewText(frontmatter)
}
