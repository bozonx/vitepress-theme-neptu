import { isPost, normalizeTags, normalizeCategories } from '../utils/shared/index.ts'
import { mdToHtml } from '../utils/node/index.ts'
import type { ExtendedPageData } from '../types.d.ts'

/** Transform md in frontmatter params of post to html. And resolve preview */
export function transformPageMeta(pageData: ExtendedPageData): void {
  if (!isPost(pageData.frontmatter)) return
  const localeIndex = pageData.filePath?.split('/')[0]

  if (pageData.frontmatter.coverDescription) {
    pageData.frontmatter.coverDescription = mdToHtml(pageData.frontmatter.coverDescription)
  }

  pageData.frontmatter.tags = normalizeTags(pageData.frontmatter.tags, localeIndex)
  // `category: 'Frontend'` is sugar. Fold it into `categories` here so every
  // consumer downstream — components, JSON-LD, feeds — sees one shape.
  pageData.frontmatter.categories = normalizeCategories(
    pageData.frontmatter.category,
    pageData.frontmatter.categories,
    localeIndex
  )
  delete pageData.frontmatter.category
}
