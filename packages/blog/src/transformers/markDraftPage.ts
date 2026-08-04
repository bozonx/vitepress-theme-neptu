import { hasNoIndex } from '../utils/shared/head.ts'
import { isDraft, resolveShowDrafts } from '../utils/shared/publication.ts'
import type { DraftsConfig, ExtendedPageData } from '../types.d.ts'

/**
 * Seals a draft page off from every discovery surface.
 *
 * Filtering drafts out of the post lists is not enough: a page is still built,
 * so it would otherwise be crawled, land in the sitemap and be indexed by
 * Pagefind. This transformer adds `robots: noindex, nofollow` — which the
 * existing `hasNoIndex` checks pick up to also skip JSON-LD, hreflang,
 * canonical and the sitemap entry — and clears `searchIncluded` so the body
 * marker is left off the rendered HTML.
 *
 * The page itself stays reachable by direct URL, which is what makes a draft
 * previewable.
 *
 * No-op while drafts are visible (the dev server by default): there the author
 * is looking at the page on purpose.
 */
export function markDraftPage(
  pageData: ExtendedPageData,
  draftsConfig?: DraftsConfig | null
): void {
  if (!isDraft(pageData.frontmatter)) return
  if (resolveShowDrafts(draftsConfig)) return

  pageData.frontmatter.searchIncluded = false

  const head = Array.isArray(pageData.frontmatter.head)
    ? pageData.frontmatter.head
    : []

  if (hasNoIndex(head)) return

  pageData.frontmatter.head = [
    ...head,
    ['meta', { name: 'robots', content: 'noindex, nofollow' }],
  ]
}
