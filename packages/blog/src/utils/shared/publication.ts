/**
 * Draft handling.
 *
 * A post marked `draft: true` in its frontmatter is kept out of every public
 * surface of the blog: post lists, archive/tag/author pages, RSS feeds, the
 * sitemap and the search index. The page itself is still rendered, so the
 * author can open its URL directly to preview the result — it is simply
 * unlisted and marked `noindex`.
 */

export interface PostVisibilityOptions {
  /**
   * Keep drafts in the result. Defaults to `false` — callers that want the
   * dev-server behaviour pass {@link areDraftsVisibleByDefault}.
   */
  includeDrafts?: boolean
}

/** Frontmatter shape this module needs. Kept structural to avoid a cycle. */
export interface PublicationFrontmatter {
  draft?: unknown
  [key: string]: unknown
}

/** True when the frontmatter explicitly marks the post as a draft. */
export function isDraft(frontmatter: PublicationFrontmatter | undefined): boolean {
  return frontmatter?.draft === true
}

/**
 * Drafts are visible while developing and hidden in a production build, so an
 * author sees unfinished posts in `vitepress dev` without a config switch and
 * never ships them by accident.
 */
export function areDraftsVisibleByDefault(): boolean {
  return process.env.NODE_ENV !== 'production'
}

/**
 * Resolves the effective flag from `themeConfig.drafts`, falling back to the
 * environment default when the user has not set it.
 */
export function resolveIncludeDrafts(
  draftsConfig?: { includeDrafts?: boolean } | null
): boolean {
  return draftsConfig?.includeDrafts ?? areDraftsVisibleByDefault()
}

/** True when the post belongs in public listings. */
export function isPostVisible(
  frontmatter: PublicationFrontmatter | undefined,
  options: PostVisibilityOptions = {}
): boolean {
  if (options.includeDrafts) return true

  return !isDraft(frontmatter)
}
