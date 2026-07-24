import type { PostFrontmatter, ThemeConfig } from '../../types.d.ts'

export type Frontmatter = PostFrontmatter

const UTIL_LAYOUTS = new Set(['util', 'tag', 'archive', 'author'])

/** True for posts: explicit `layout: post` or no layout set. */
export function isPost(frontmatter: Frontmatter | null | undefined): boolean | undefined {
  if (!frontmatter) return
  if (frontmatter.layout === 'post') return true
  return frontmatter.layout == null
}

export function isHomePage(frontmatter: Frontmatter | null | undefined): boolean {
  return frontmatter?.layout === 'home'
}

/** Plain content page (no post chrome, no util chrome). Explicit only. */
export function isPage(frontmatter: Frontmatter | null | undefined): boolean {
  return frontmatter?.layout === 'page'
}

/** True for layout: util / tag / archive / author. */
export function isUtilPage(frontmatter: Frontmatter | null | undefined): boolean {
  return UTIL_LAYOUTS.has(frontmatter?.layout as string)
}

export function isPopularRoute(routPath: string): boolean {
  return routPath.includes('/popular/')
}

export function isAuthorPage(filePath: string | null | undefined): boolean {
  if (!filePath) return false

  return (
    !!filePath.match(/^[^/]+\/authors\//) &&
    !filePath.endsWith('authors/index.md')
  )
}

/** Resolve explicit preview text from frontmatter. Or return undefined. */
export function resolvePreviewText(frontmatter: Frontmatter): string | undefined {
  const { previewText, descrAsPreview, description } = frontmatter
  const normalizedPreviewText =
    typeof previewText === 'string' ? previewText.trim() : undefined
  const normalizedDescription =
    typeof description === 'string' ? description.trim() : undefined

  if (normalizedPreviewText !== undefined) {
    return normalizedPreviewText || undefined
  } else if (descrAsPreview && normalizedDescription) {
    return normalizedDescription
  }
  return undefined
}

/** Resolve article preview text inside article. Or return undefined */
export function resolveArticlePreview(frontmatter: Frontmatter): string | undefined {
  return resolvePreviewText(frontmatter)
}

export function resolveBodyMarker(theme: ThemeConfig, frontmatter: Frontmatter): string | undefined {
  const bodyMarker = theme.search?.options?.bodyMarker

  if (!bodyMarker) return undefined

  // By default util pages are excluded from search
  const allowed = isUtilPage(frontmatter)
    ? frontmatter.searchIncluded || false
    : (frontmatter.searchIncluded ?? true)

  return allowed ? bodyMarker : undefined
}
