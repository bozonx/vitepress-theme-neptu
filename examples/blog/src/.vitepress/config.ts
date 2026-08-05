import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineBlogConfig } from 'vitepress-theme-neptu/configs'
import type { BlogUserConfig, ThemeConfig } from 'vitepress-theme-neptu'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const PER_PAGE = 10

export const postList = {
  maxPreviewLength: 300,
}

export const popularPosts = {
  enabled: true,
  sortBy: 'pageviews',
  dataSource: {
    provider: 'ga4' as const,
    propertyId: process.env.GA_PROPERTY_ID,
    credentialsJson: process.env.GA_CREDENTIALS_JSON,
  },
} satisfies NonNullable<ThemeConfig['popularPosts']>

export default async () => {
  const base = process.env.VITEPRESS_BASE || '/'
  const assetUrl = (path: string) => `${base}${path.replace(/^\//, '')}`

  const config: BlogUserConfig = {
    srcDir: path.resolve(__dirname, '../'),
    base,
    siteUrl: process.env.SITE_URL || 'https://bozonx.github.io/vitepress-theme-neptu/blog',

    head: [
      ['meta', { name: 'format-detection', content: 'telephone=no' }],
      ['link', { rel: 'icon', type: 'image/svg+xml', href: assetUrl('/favicon.svg') }],
      ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: assetUrl('/img/favicon-32x32.png') }],
      ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: assetUrl('/img/favicon-16x16.png') }],
      ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: assetUrl('/img/apple-touch-icon.png') }],
      ['link', { rel: 'shortcut icon', href: assetUrl('/favicon.ico') }],
      ['link', { rel: 'manifest', href: assetUrl('/site.webmanifest') }],
    ],

    themeConfig: {
      // Core
      perPage: PER_PAGE,
      repo: 'https://github.com/bozonx/vitepress-theme-neptu',

      // Integrations
      search: {
        enabled: true,
      },
      popularPosts,
    },
  }

  return defineBlogConfig(config)
}
