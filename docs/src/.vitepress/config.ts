import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineBlogConfig } from 'vitepress-theme-neptu-blog/configs'
import type { BlogUserConfig, ThemeConfig } from 'vitepress-theme-neptu-blog'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const PER_PAGE = 10

export const postList = {
  maxPreviewLength: 300,
}

export const popularPosts = {
  enabled: Boolean(
    process.env.GA_PROPERTY_ID && process.env.GA_CREDENTIALS_JSON
  ),
  sortBy: 'pageviews',
  dataSource: {
    provider: 'ga4' as const,
    propertyId: process.env.GA_PROPERTY_ID,
    credentialsJson: process.env.GA_CREDENTIALS_JSON,
  },
} satisfies NonNullable<ThemeConfig['popularPosts']>

export default async () => {
  const base = process.env.VITEPRESS_BASE || '/'

  const config: BlogUserConfig = {
    srcDir: path.resolve(__dirname, '../'),
    base,
    siteUrl: process.env.SITE_URL || 'https://bozonx.github.io/vitepress-theme-neptu-blog',

    head: [
      ['meta', { name: 'format-detection', content: 'telephone=no' }],
      ['link', { rel: 'stylesheet', href: `${base}/pagefind/pagefind-ui.css`.replace(/\/+/g, '/') }],
      ['script', { src: `${base}/pagefind/pagefind-ui.js`.replace(/\/+/g, '/') }],
    ],

    themeConfig: {
      repo: 'https://github.com/bozonx/vitepress-theme-neptu',
      perPage: PER_PAGE,
      themeSwitcher: true,
      search: {
        provider: 'pagefind',
        options: { bodyMarker: 'data-pagefind-body' },
      },
      popularPosts,
    },
  }

  return defineBlogConfig(config)
}
