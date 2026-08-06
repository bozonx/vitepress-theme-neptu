import fs from 'node:fs'
import path from 'node:path'

import { DEFAULT_ENCODING, DEFAULT_PREVIEW_LENGTH } from '../constants.ts'
import {
  parseMdFile,
  extractDescriptionFromContent,
} from '../utils/node/markdown.ts'
import {
  normalizeTags,
  normalizeCategories,
  resolvePreviewText,
  resolveContentMediaPath,
} from '../utils/shared/index.ts'
import { getImageDimensions } from '../utils/node/image.ts'
import { measureMarkdown } from '../utils/node/readingTime.ts'
import { isDraft } from '../utils/shared/publication.ts'
import type { PostFrontmatter, Tag, TaxonomyEntry } from '../types.d.ts'

export interface PreviewItem {
  url: string
  date: string | Date | undefined
  authorId: string | undefined
  title: string | undefined
  tags: Tag[]
  /** Normalized `{ name, slug }` list — `category` sugar is folded in here. */
  categories: TaxonomyEntry[]
  preview: string | undefined
  draft: boolean
  featured?: boolean
  wordCount: number
  readingTime: number
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
  /** Words per minute for the reading-time estimate. Defaults to 200. */
  readingWpm?: number
}

export function makePreviewItem(
  filePath: string,
  options: MakePreviewItemOptions = {}
): PreviewItem {
  const { maxPreviewLength, srcDir, readingWpm } = options
  const baseDir = srcDir ?? path.resolve(filePath, '../../../')
  const relativePath = path.relative(baseDir, filePath)
  const lang = relativePath.split('/')[0] || ''

  // `posts/my-article/index.md` is served as `/posts/my-article/`, not
  // `/posts/my-article/index`.
  const url =
    '/' + relativePath.replace(/\.md$/, '').replace(/(^|\/)index$/, '$1')
  const rawContent = fs.readFileSync(filePath, DEFAULT_ENCODING)
  const { frontmatter, content } = parseMdFile(rawContent, filePath)
  const fm = frontmatter as PostFrontmatter

  let preview = resolvePreviewText(fm)
  if (!preview)
    preview = extractDescriptionFromContent(
      content,
      maxPreviewLength ?? DEFAULT_PREVIEW_LENGTH
    )

  const { wordCount, readingTime } = measureMarkdown(content, readingWpm)

  // Get image dimensions if cover is provided
  let coverDimensions = null
  if (fm.cover) {
    // `relativePath` lets co-located covers (`./cover.jpg`, `./media/cover.jpg`)
    // resolve against the post's own folder.
    coverDimensions = getImageDimensions(fm.cover, baseDir, relativePath)
  }

  // A preview is rendered on list pages, so a path relative to the post
  // itself has to become a site-root path.
  const cover = resolveContentMediaPath(fm.cover, relativePath, {
    allowBare: true,
  }) as string | undefined

  return {
    url,
    date: fm.date,
    authorId: fm.authorId,
    title: fm.title,
    featured: fm.featured === true,
    tags: normalizeTags(fm.tags, lang) || [],
    categories: normalizeCategories(fm.category, fm.categories, lang),
    preview,
    draft: isDraft(fm),
    wordCount,
    readingTime,
    cover,
    coverHeight: coverDimensions?.height,
    coverWidth: coverDimensions?.width,
    frontmatter: { ...fm, cover },
  }
}
