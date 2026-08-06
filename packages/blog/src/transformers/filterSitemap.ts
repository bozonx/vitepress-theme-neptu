const EXCLUDED_ROUTES = ['tags', 'archive', 'authors', 'popular', 'recent', 'featured']

const EXCLUDED_ROUTES_REGEXP = new RegExp(
  `^[^/]+/(${EXCLUDED_ROUTES.join('|')})(/|$)`
)

export interface SitemapItem {
  url: string
  links?: Array<{ url?: string; [key: string]: unknown }>
  [key: string]: unknown
}

/**
 * Filter sitemap items excluding known utility routes and user-defined noindex
 * pages
 */
export function filterSitemap(
  items: SitemapItem[],
  noIndexUrls?: Set<string>
): SitemapItem[] {
  return items
    .filter((item) => {
      // `links` holds the hreflang alternates and is absent for pages that
      // exist in a single locale — those still belong in the sitemap.
      if (!item.url) return false
      else if (item.url.startsWith('/')) return false
      else if (item.url.match(/^[^/]+\/$/)) return true
      else if (EXCLUDED_ROUTES_REGEXP.test(item.url)) return false
      else if (noIndexUrls?.has(item.url)) return false
      else return true
    })
    .map((item) => {
      if (item.links && item.url.endsWith('/')) {
        return { ...item, links: item.links.filter((link) => link.url) }
      } else return item
    })
}
