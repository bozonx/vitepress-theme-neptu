import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineLandingConfig } from 'vitepress-theme-neptu-landing/configs'
import type { LandingUserConfig } from 'vitepress-theme-neptu-landing'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default async () => {
  const base = process.env.VITEPRESS_BASE || '/'

  const config: LandingUserConfig = {
    srcDir: path.resolve(__dirname, '../'),
    base,
    siteUrl:
      process.env.SITE_URL || 'https://bozonx.github.io/vitepress-theme-neptu-blog',

    head: [
      ['meta', { name: 'format-detection', content: 'telephone=no' }],
      [
        'link',
        {
          rel: 'stylesheet',
          href: `${base}/pagefind/pagefind-ui.css`.replace(/\/+/g, '/'),
        },
      ],
      [
        'script',
        { src: `${base}/pagefind/pagefind-ui.js`.replace(/\/+/g, '/') },
      ],
    ],

    themeConfig: {
      repo: 'https://github.com/bozonx/vitepress-theme-neptu-blog',
      logo: '/img/logo.svg',
      mainHeroImg: '/img/home-logo.svg',
      blogUrl: 'https://bozonx.github.io/vitepress-theme-neptu-blog',
      search: {
        provider: 'pagefind',
        options: { bodyMarker: 'data-pagefind-body' },
      },
    },
  }

  return defineLandingConfig(config)
}
