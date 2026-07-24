import { getImageDimensions } from '../utils/node/index.ts'

import type { ExtendedPageData, ExtendedSiteConfig } from '../types.d.ts'

export function collectImageDimensions(
  pageData: ExtendedPageData,
  siteConfig: ExtendedSiteConfig
): void {

  if (!pageData.frontmatter.cover) return
  if (!siteConfig.srcDir) return

  const imageDimensions = getImageDimensions(
    pageData.frontmatter.cover,
    siteConfig.srcDir
  )

  pageData.frontmatter.coverHeight = imageDimensions?.height
  pageData.frontmatter.coverWidth = imageDimensions?.width
}
