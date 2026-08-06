import { resolveContentMediaPath } from '../utils/shared/media.ts'

import type { ExtendedPageData } from '../types.d.ts'

/**
 * Rewrites co-located media paths in frontmatter to site-root paths.
 *
 * `cover: ./media/cover.jpg` in `ru/posts/my-article/index.md` becomes
 * `/ru/posts/my-article/media/cover.jpg`, so the same value stays correct in
 * list previews, RSS items, `og:image` and JSON-LD — none of which are
 * rendered from the post's own URL.
 */
export function resolveMediaPaths(pageData: ExtendedPageData): void {
  const { frontmatter, relativePath } = pageData
  if (!relativePath) return

  frontmatter.cover = resolveContentMediaPath(frontmatter.cover, relativePath, {
    allowBare: true,
  }) as string | undefined
}
