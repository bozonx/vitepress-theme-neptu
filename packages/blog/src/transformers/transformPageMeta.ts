import { isPost } from '../utils/shared/index.ts'
import { mdToHtml } from '../utils/node/index.ts'
import { normalizeTags } from '../utils/shared/index.ts'
import type { ExtendedPageData } from '../types.d.ts'

/** Transform md in frontmatter params of post to html. And resolve preview */
export function transformPageMeta(pageData: ExtendedPageData): void {
  if (!isPost(pageData.frontmatter)) return
  const localeIndex = pageData.filePath?.split('/')[0]

  if (pageData.frontmatter.coverDescr) {
    pageData.frontmatter.coverDescr = mdToHtml(pageData.frontmatter.coverDescr)
  }

  pageData.frontmatter.tags = normalizeTags(pageData.frontmatter.tags, localeIndex)
}
