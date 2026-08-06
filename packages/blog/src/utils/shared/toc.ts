import type { PostFrontmatter, ThemeConfig, TocConfig } from '../../types.d.ts'
import { isFeatureEnabled } from './page.ts'

/**
 * A heading as VitePress exposes it on `page.headers`: a tree keyed by the
 * markdown heading level, already carrying the slugified anchor in `link`.
 */
export interface TocHeader {
  level: number
  title: string
  link: string
  children?: TocHeader[]
}

/** One entry of the rendered table of contents. */
export interface TocItem {
  /** Heading level, 2 for `##`. */
  level: number
  title: string
  /** In-page anchor including the leading `#`. */
  link: string
  /** 0 for the shallowest kept level — drives the indent. */
  depth: number
}

/**
 * Layouts that render a table of contents unless `themeConfig.toc.layouts`
 * says otherwise. Only posts by default: utility pages (tag / archive /
 * author listings) have no prose to navigate, and `page` layouts are usually
 * short standalone pages where a TOC is noise.
 */
export const DEFAULT_TOC_LAYOUTS = ['post']

/** Heading levels included by default — `##` and `###`. */
export const DEFAULT_TOC_LEVEL: [number, number] = [2, 3]

/**
 * Below this many headings the table of contents is dropped entirely.
 *
 * A two-item list restates the article structure without helping anyone
 * navigate it, so it reads as chrome rather than as a tool. Three is the
 * usual threshold across doc themes.
 */
export const DEFAULT_TOC_MIN_HEADINGS = 3

/**
 * Normalise the VitePress-style `level` option into an inclusive range.
 *
 * Accepts the same shapes as `themeConfig.outline` of the default theme:
 * a single level, a `[min, max]` tuple, or `'deep'` (h2–h6).
 */
export function resolveTocLevels(
  level: TocConfig['level'] | undefined
): [number, number] {
  if (level === 'deep') return [2, 6]
  if (typeof level === 'number') return [level, level]
  if (Array.isArray(level) && level.length === 2) {
    const [min, max] = level
    if (typeof min === 'number' && typeof max === 'number') {
      return min <= max ? [min, max] : [max, min]
    }
  }
  return DEFAULT_TOC_LEVEL
}

/**
 * Flatten the VitePress heading tree into the ordered list the TOC renders,
 * keeping only levels inside `levels` and normalising the indent so that the
 * shallowest kept level sits at depth 0.
 */
export function flattenTocHeaders(
  headers: TocHeader[] | null | undefined,
  levels: [number, number] = DEFAULT_TOC_LEVEL
): TocItem[] {
  if (!Array.isArray(headers) || !headers.length) return []

  const [min, max] = levels
  const items: TocItem[] = []

  const walk = (nodes: TocHeader[]): void => {
    for (const node of nodes) {
      if (!node || typeof node !== 'object') continue

      const level = typeof node.level === 'number' ? node.level : 0
      const title = typeof node.title === 'string' ? node.title.trim() : ''
      const link = typeof node.link === 'string' ? node.link : ''

      if (level >= min && level <= max && title && link) {
        items.push({ level, title, link, depth: level - min })
      }

      if (Array.isArray(node.children) && node.children.length) {
        walk(node.children)
      }
    }
  }

  walk(headers)

  return items
}

/**
 * Whether the table of contents should be rendered for the current page.
 *
 * Frontmatter `toc: true | false` wins over `themeConfig.toc.layouts`; the
 * home page never renders one because it uses its own full-takeover layout.
 * The heading-count threshold is applied separately by the components, which
 * are the only place that knows how many headings survived the level filter.
 */
export function isTocEnabled(
  theme: ThemeConfig | null | undefined,
  frontmatter: PostFrontmatter | null | undefined
): boolean {
  return isFeatureEnabled(frontmatter, {
    frontmatterKey: 'toc',
    enabledFlag: theme?.toc?.enabled,
    layouts: theme?.toc?.layouts ?? DEFAULT_TOC_LAYOUTS,
  })
}

/**
 * Whether a TOC with this many entries is worth showing.
 * `minHeadings: 0` disables the threshold.
 */
export function hasEnoughHeadings(
  count: number,
  theme: ThemeConfig | null | undefined
): boolean {
  const min = theme?.toc?.minHeadings ?? DEFAULT_TOC_MIN_HEADINGS

  return count >= min
}
