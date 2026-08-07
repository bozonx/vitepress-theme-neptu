import { isPost, normalizeTags, normalizeCategories } from '../utils/shared/index.ts'
import { mdToHtml } from '../utils/node/index.ts'
import { getCategoriesRegistry } from '../utils/node/categoriesRegistry.ts'
import type { ExtendedPageData, ExtendedSiteConfig } from '../types.d.ts'

interface TransformPageMetaOptions {
  siteConfig?: ExtendedSiteConfig
}

/** Transform md in frontmatter params of post to html. And resolve preview */
export function transformPageMeta(
  pageData: ExtendedPageData,
  options: TransformPageMetaOptions = {}
): void {
  if (!isPost(pageData.frontmatter)) return
  const localeIndex = pageData.filePath?.split('/')[0]

  if (pageData.frontmatter.coverDescription) {
    pageData.frontmatter.coverDescription = mdToHtml(pageData.frontmatter.coverDescription)
  }

  pageData.frontmatter.tags = normalizeTags(pageData.frontmatter.tags, localeIndex)
  // `category: 'getting-started'` is sugar, and the value is an id from the
  // locale's `_categories.yaml`. Resolve it against the registry and fold it
  // into `categories` here so every consumer downstream — components, JSON-LD,
  // feeds — sees one shape.
  pageData.frontmatter.categories = normalizeCategories(
    pageData.frontmatter.category,
    pageData.frontmatter.categories,
    localeIndex,
    getCategoriesRegistry(options.siteConfig?.srcDir, localeIndex)
  )
  delete pageData.frontmatter.category
}
