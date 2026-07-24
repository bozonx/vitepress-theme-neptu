import { omitUndefined } from 'vitepress-theme-neptu-blog/utils'
import {
  addOgMetaTags,
  resolveDescription,
  addJsonLd,
  addHreflang,
  addCanonicalLink,
  filterSitemap,
  mdImage,
} from 'vitepress-theme-neptu-blog/transformers'

export const common: Record<string, any> = {
  head: [
    ['meta', { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' }],

    ['link', { rel: 'icon', sizes: '16x16', href: '/img/favicon-16x16.png' }],
    ['link', { rel: 'icon', sizes: '32x32', href: '/img/favicon-32x32.png' }],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/img/apple-touch-icon.png',
      },
    ],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
  ],
  srcExclude: ['site/**', '**/site/**'],
  lastUpdated: true,
  cleanUrls: true,
  lang: 'en-US',
  locales: { root: { lang: 'en-US' } },

  maxDescriptionLength: 300,

  themeConfig: {
    i18nRouting: true,
    externalLinkIcon: true,
    mainHeroImg: '/img/home-logo.webp',
    lastUpdated: { formatOptions: { dateStyle: 'medium', forceLocale: true } },
  },
}

export function mergeSiteConfig(config: any): any {
  const externalLinkIcon =
    typeof config.themeConfig.externalLinkIcon === 'boolean'
      ? config.themeConfig.externalLinkIcon
      : common.themeConfig.externalLinkIcon

  return {
    ...common,
    ...config,
    title: config.title || config.en?.title,
    description: config.description || config.en?.description,
    head: [...common.head, ...(config.head || [])],
    locales: { ...(common.locales || {}), ...(config.locales || {}) },
    vite: {
      ...config.vite,
      ssr: { noExternal: ['vitepress-theme-neptu-blog'], ...config.vite?.ssr },
    },
    sitemap: {
      hostname: config.siteUrl,
      transformItems: (items: any[]) => {
        return filterSitemap(items as any)
      },
      ...config.sitemap,
    },
    markdown: {
      ...config.markdown,
      image: { lazyLoading: true, ...config.markdown?.image },
      externalLinks: omitUndefined({
        target: '_blank',
        class: externalLinkIcon ? 'vp-external-link-icon' : undefined,
        rel: [],
      }),
      config: (md: any) => {
        md.use(mdImage, { srcDir: config.srcDir })

        if (config.markdown?.config) {
          config.markdown.config(md)
        }
      },
    },

    themeConfig: {
      ...common.themeConfig,
      socialLinks: config.repo && [{ icon: 'github', link: config.repo }],
      ...config.themeConfig,
    },

    async transformPageData(pageData: any, ctx: any) {
      resolveDescription(pageData, ctx)

      if (config.transformPageData) {
        await config.transformPageData(pageData, ctx)
      }
    },

    async transformHead(ctx: any) {
      addOgMetaTags(ctx)
      addJsonLd(ctx)
      addHreflang(ctx)
      addCanonicalLink(ctx)

      if (config.transformHead) {
        await config.transformHead(ctx)
      }
    },
  }
}
