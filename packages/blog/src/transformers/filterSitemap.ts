const EXCLUDED_ROUTES = ['tags', 'archive', 'authors', 'popular', 'recent']

const EXCLUDED_ROUTES_REGEXP = new RegExp(
  `^[^/]+/(${EXCLUDED_ROUTES.join('|')})(/|$)`
)

export interface SitemapItem {
  url: string
  links: Array<{ url?: string; [key: string]: unknown }>
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
      if (!item.url || !item.links) return false
      else if (item.url.startsWith('/')) return false
      else if (item.url.match(/^[^/]+\/$/)) return true
      else if (EXCLUDED_ROUTES_REGEXP.test(item.url)) return false
      else if (noIndexUrls?.has(item.url)) return false
      else return true
    })
    .map((item) => {
      if (item.url.indexOf('/') === item.url.length - 1) {
        return { ...item, links: item.links.filter((link) => link.url) }
      } else return item
    })
}
