import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineLandingConfig } from 'vitepress-theme-neptu-landing/configs'
import type { LandingUserConfig } from 'vitepress-theme-neptu-landing'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default async () => {
  const base = process.env.VITEPRESS_BASE || '/'
  const assetUrl = (path: string) => `${base}${path.replace(/^\//, '')}`

  const config: LandingUserConfig = {
    srcDir: path.resolve(__dirname, '../'),
    base,
    siteUrl:
      process.env.SITE_URL ||
      'https://bozonx.github.io/vitepress-theme-neptu/landing',

    head: [
      ['meta', { name: 'format-detection', content: 'telephone=no' }],
      ['link', { rel: 'icon', type: 'image/svg+xml', href: assetUrl('/img/logo.svg') }],
      ['link', { rel: 'manifest', href: assetUrl('/site.webmanifest') }],
    ],

    themeConfig: {
      repo: 'https://github.com/bozonx/vitepress-theme-neptu',

      // Theme defaults for first-time visitors. The two axes are independent;
      // the picker remembers the visitor's choice in localStorage.
      // These must stay in config.ts — they are read before YAML merging
      // for the inline head script and edit-link auto-generation.
      defaultColorTheme: 'blue',
      defaultLandingStyle: 'soft',

      // The docs half of the template uses the built-in local search.
      search: { provider: 'local' },
    },
  }

  return defineLandingConfig(config)
}
