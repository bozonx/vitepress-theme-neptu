import type { PostFrontmatter, ThemeConfig } from '../../types.d.ts'



const UTIL_LAYOUTS = new Set(['util', 'tag', 'archive', 'author'])

/** True for posts: explicit `layout: post` or no layout set. */
export function isPost(frontmatter: PostFrontmatter | null | undefined): boolean {
  if (!frontmatter) return false
  if (frontmatter.layout === 'post') return true
  return frontmatter.layout == null
}

export function isHomePage(frontmatter: PostFrontmatter | null | undefined): boolean {
  return frontmatter?.layout === 'home'
}

/** Plain content page (no post chrome, no util chrome). Explicit only. */
export function isPage(frontmatter: PostFrontmatter | null | undefined): boolean {
  return frontmatter?.layout === 'page'
}

/** True for layout: util / tag / archive / author. */
export function isUtilPage(frontmatter: PostFrontmatter | null | undefined): boolean {
  return UTIL_LAYOUTS.has(frontmatter?.layout as string)
}

export function isPopularPostsRoute(routePath: string): boolean {
  return routePath.includes('/popular/')
}

/**
 * Layouts that render the aside column unless `themeConfig.asideLayouts`
 * says otherwise. The home page and plain `page` layouts are excluded.
 */
export const DEFAULT_ASIDE_LAYOUTS = [
  'post',
  'util',
  'tag',
  'archive',
  'author',
]

/**
 * Layout key used to match a page against `themeConfig.asideLayouts` and the
 * `toc` / `ads` layout lists.
 *
 * `fallback` is what an absent `layout` means, which differs per theme: in the
 * blog a bare page is a post, while the landing theme inherits the VitePress
 * default where it is a `doc`.
 */
export function resolveLayoutKey(
  frontmatter: PostFrontmatter | null | undefined,
  fallback = 'post'
): string {
  const layout = frontmatter?.layout

  return typeof layout === 'string' && layout ? layout : fallback
}

/**
 * Generic feature-on/off check shared by {@link isAsideEnabled}, `isAdsEnabled`,
 * `isTocEnabled` and `isReadingTimeEnabled`.
 *
 * Resolution order:
 * 1. Home page → never;
 * 2. Master switch (`enabledFlag === false`) → off;
 * 3. Frontmatter boolean override → wins;
 * 4. Layout list match → decides.
 */
export function isFeatureEnabled(
  frontmatter: PostFrontmatter | null | undefined,
  options: {
    frontmatterKey: 'ads' | 'toc' | 'readingTime' | 'aside'
    enabledFlag?: boolean | undefined
    layouts: string[]
    fallbackLayout?: string
  }
): boolean {
  if (isHomePage(frontmatter)) return false
  if (options.enabledFlag === false) return false
  const fmFlag = frontmatter?.[options.frontmatterKey]
  if (typeof fmFlag === 'boolean') return fmFlag
  return options.layouts.includes(resolveLayoutKey(frontmatter, options.fallbackLayout))
}

/**
 * Whether the aside column should be rendered for the current page.
 * PostFrontmatter `aside` wins over `themeConfig.asideLayouts`; the home page
 * never renders an aside because it uses its own full-takeover layout.
 */
export function isAsideEnabled(
  theme: ThemeConfig | null | undefined,
  frontmatter: PostFrontmatter | null | undefined
): boolean {
  return isFeatureEnabled(frontmatter, {
    frontmatterKey: 'aside',
    layouts: theme?.asideLayouts ?? DEFAULT_ASIDE_LAYOUTS,
  })
}

export function isAuthorPath(filePath: string | null | undefined): boolean {
  if (!filePath) return false

  return (
    !!filePath.match(/^[^/]+\/authors\//) &&
    !filePath.endsWith('authors/index.md')
  )
}

/** Resolve explicit preview text from frontmatter. Or return undefined. */
export function resolvePreviewText(frontmatter: PostFrontmatter): string | undefined {
  const { previewText, descriptionAsPreview, description } = frontmatter
  const normalizedPreviewText =
    typeof previewText === 'string' ? previewText.trim() : undefined
  const normalizedDescription =
    typeof description === 'string' ? description.trim() : undefined

  if (normalizedPreviewText !== undefined) {
    return normalizedPreviewText || undefined
  } else if (descriptionAsPreview && normalizedDescription) {
    return normalizedDescription
  }
  return undefined
}

export function resolvePagefindBodyAttribute(theme: ThemeConfig, frontmatter: PostFrontmatter): string | undefined {
  // Pagefind is the only search provider; the body marker is fixed.
  if (theme.search?.enabled === false) return undefined

  // By default util pages are excluded from search
  const allowed = isUtilPage(frontmatter)
    ? frontmatter.searchIncluded || false
    : (frontmatter.searchIncluded ?? true)

  return allowed ? 'data-pagefind-body' : undefined
}
