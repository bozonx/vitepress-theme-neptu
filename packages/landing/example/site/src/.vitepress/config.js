import path from 'node:path'
import { defineConfig } from 'vitepress'
import { mergeSiteConfig, loadSiteLocale } from 'vitepress-theme-neptu-landing/configs'

export default async () => {
  const config = defineConfig({
    srcDir: path.resolve(__dirname, '../'),
    siteUrl: 'https://...',
    repo: 'https://github.com/...',
    themeConfig: {
      logo: '/img/logo.svg',

      // specific for this site
      blogUrl: '',
    },
    head: [
      // do not recognize telephone numbers on the page
      ['meta', { name: 'format-detection', content: 'telephone=no' }],

      // pagefind
      ['link', { rel: 'stylesheet', href: '/pagefind/pagefind-ui.css' }],
      ['script', { src: '/pagefind/pagefind-ui.js' }],
    ],
  })

  return mergeSiteConfig({
    ...config,
    locales: { en: await loadSiteLocale('en', config) },
  })
}
