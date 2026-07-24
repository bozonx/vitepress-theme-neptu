import tailwindcss from '@tailwindcss/vite'
import { createSiteYamlHotReloadPlugin } from '../utils/node/hotReloadPlugin.ts'
import type {
  UserConfig,
  HeadConfig,
  TransformContext,
  SiteConfig,
} from 'vitepress'
import { omitUndefined, hasNoIndex } from '../utils/shared/index.ts'
import { deepMerge } from '../utils/shared/merge.ts'
import blogBaseLocales from './blogLocalesBase/index.ts'
import { addJsonLd } from '../transformers/addJsonLd.ts'
import { addHreflang } from '../transformers/addHreflang.ts'
import { addOgMetaTags } from '../transformers/addOgMetaTags.ts'
import { addDescriptionMetaTag } from '../transformers/addDescriptionMetaTag.ts'
import { addRssLinks } from '../transformers/addRssLinks.ts'
import { filterSitemap } from '../transformers/filterSitemap.ts'
import type { SitemapItem } from '../transformers/filterSitemap.ts'
import { generateRssFeed } from '../transformers/generateRssFeed.ts'
import { generateRobotsTxt } from '../transformers/generateRobotsTxt.ts'
import { transformPageMeta } from '../transformers/transformPageMeta.ts'
import { transformTitle } from '../transformers/transformTitle.ts'
import { resolveDescription } from '../transformers/resolveDescription.ts'
import { addCanonicalLink } from '../transformers/addCanonicalLink.ts'
import { collectImageDimensions } from '../transformers/collectImageDimensions.ts'
import { mdImage } from '../transformers/mdImage.ts'
import { autoLoadLocales } from '../utils/node/config.ts'
import type {
  ExtendedPageData,
  ExtendedSiteConfig,
  BlogUserConfig,
  ThemeConfig,
  SeoConfig,
  I18n,
} from '../types.d.ts'

// ---------------------------------------------------------------------------
// Type adapters — isolate all `as unknown as` casts in one place so the
// rest of the file can use named, readable casts instead of inline ones.
// ---------------------------------------------------------------------------

type TransformHeadContext = {
  head: HeadConfig[]
  pageData: ExtendedPageData
  siteConfig: ExtendedSiteConfig
  page: string
}

function asExtendedPageData(pageData: unknown): ExtendedPageData {
  return pageData as ExtendedPageData
}

function asTransformContext(ctx: unknown): TransformContext {
  return ctx as unknown as TransformContext
}

function asExtendedSiteConfig(siteConfig: unknown): ExtendedSiteConfig {
  return siteConfig as unknown as ExtendedSiteConfig
}

function asTransformHeadContext(ctx: unknown): TransformHeadContext {
  return ctx as unknown as TransformHeadContext
}

function mergeReturnedPageData(
  pageData: ExtendedPageData,
  returnedPageData: unknown
): void {
  if (
    returnedPageData &&
    typeof returnedPageData === 'object' &&
    !Array.isArray(returnedPageData)
  ) {
    Object.assign(pageData, returnedPageData)
  }
}

// ---------------------------------------------------------------------------
// Tailwind plugin guard — type-safe name check that handles nested arrays.
// ---------------------------------------------------------------------------

function hasTailwindPlugin(plugins: unknown): boolean {
  const flat = Array.isArray(plugins) ? (plugins as unknown[]).flat(10) : []
  return flat.some(
    (p) =>
      p != null &&
      typeof p === 'object' &&
      'name' in p &&
      (p as Record<string, unknown>).name === 'tailwindcss'
  )
}

type ResolvedBlogConfig = BlogUserConfig & {
  head: NonNullable<UserConfig['head']>
  locales: NonNullable<BlogUserConfig['locales']>
  markdown: NonNullable<UserConfig['markdown']> & {
    image: NonNullable<NonNullable<UserConfig['markdown']>['image']>
  }
  sitemap: NonNullable<UserConfig['sitemap']> & {
    transformItems: NonNullable<
      NonNullable<UserConfig['sitemap']>['transformItems']
    >
  }
  themeConfig: Partial<ThemeConfig> & {
    popularPosts: NonNullable<ThemeConfig['popularPosts']>
    feeds: NonNullable<ThemeConfig['feeds']>
    seo: NonNullable<ThemeConfig['seo']>
    t: I18n
  }
  vite: NonNullable<UserConfig['vite']> & {
    ssr: NonNullable<NonNullable<UserConfig['vite']>['ssr']>
    build: NonNullable<NonNullable<UserConfig['vite']>['build']>
  }
}

const commonThemeConfig = {
  externalLinkIcon: true,

  perPage: 10,
  sidebarTagsCount: 15,
  similarPostsCount: 5,
  homeBgParallaxOffset: 300,
  paginationMaxItems: 5,
  postList: {
    showDate: true,
    showTags: true,
    showThumbnail: true,
    showPreview: true,
    showAuthor: true,
    maxPreviewLength: 300,
  },

  popularPosts: {
    enabled: false,
    sortBy: 'pageviews',
    dataSource: {
      provider: 'ga4' as const,
      propertyId: null,
      credentialsJson: null,
      dataPeriodDays: 30,
      dataLimit: 1000,
    },
  },

  feeds: {
    maxPosts: 50,
    formats: ['rss', 'atom', 'json'],
  },

  seo: {
    maxDescriptionLength: 300,
    autoCanonical: true,
  },

  donateIcon: 'fa6-solid:hand-holding-heart',
  recentIcon: 'fa6-solid:bolt',
  popularIcon: 'fa6-solid:star',
  byDateIcon: 'fa6-solid:calendar-days',
  authorsIcon: 'mdi:users',
  rssIcon: 'bi:rss-fill',
  atomIcon: 'vscode-icons:file-type-atom',
  youtubeIcon: 'fa6-brands:youtube',
  tagsIcon: 'fa6-solid:tag',
} satisfies Partial<ThemeConfig>

export const common: BlogUserConfig = {
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
  lastUpdated: true,
  cleanUrls: true,
  lang: 'en-US',

  themeConfig: commonThemeConfig,
}

function warnMissingRequired(config: BlogUserConfig): void {
  if (!config.siteUrl) {
    console.warn(
      '[vitepress-theme-neptu-blog] `siteUrl` is not set. ' +
        'SEO features (sitemap, RSS, canonical links) may produce broken URLs.'
    )
  }

  if (!config.locales || Object.keys(config.locales).length === 0) {
    console.warn(
      '[vitepress-theme-neptu-blog] `locales` is empty. ' +
        'The theme requires at least one locale (e.g. `{ en: { lang: "en-US" } }`).'
    )
  }
}

/**
 * Low-level config merge without validation warnings.
 *
 * Applies all built-in defaults (head, vite, markdown, sitemap, transformers,
 * deep-merges postList / popularPosts / feeds / seo / t) on top of the
 * provided config. Does NOT emit warnings for missing required fields.
 *
 * Prefer {@link defineBlogConfig} as the standard entry point — it wraps this
 * function and also calls `warnMissingRequired`. Use `mergeBlogConfig` directly
 * only when composing configs programmatically and you want to suppress
 * warnings (e.g. in tests or multi-step merge pipelines).
 */
export function mergeBlogConfig(config: BlogUserConfig): ResolvedBlogConfig {
  const externalLinkIcon =
    typeof config.themeConfig?.externalLinkIcon === 'boolean'
      ? config.themeConfig.externalLinkIcon
      : commonThemeConfig.externalLinkIcon

  const noIndexUrls = new Set<string>()

  function normalizeSitemapUrl(relativePath: string): string {
    return relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
  }

  return {
    ...common,
    ...config,
    title: config.title || config.en?.title,
    description: config.description || config.en?.description,
    head: [...(common.head || []), ...(config.head || [])],
    locales: Object.fromEntries(
      Object.entries({ ...(common.locales || {}), ...(config.locales || {}) }).map(
        ([key, locale]) => {
          const titleTemplate =
            locale.titleTemplate ?? (locale.title ? `:title | ${locale.title}` : undefined)
          return [key, titleTemplate ? { ...locale, titleTemplate } : locale]
        }
      )
    ),
    vite: {
      ...config.vite,
      plugins: [
        ...(hasTailwindPlugin(config.vite?.plugins) ? [] : [tailwindcss()]),
        ...(config.srcDir ? [createSiteYamlHotReloadPlugin(config.srcDir)] : []),
        ...(config.vite?.plugins || []),
      ],
      ssr: { noExternal: ['vitepress-theme-neptu-blog'], ...config.vite?.ssr },
    },
    sitemap: {
      hostname: config.siteUrl,
      transformItems: (items) => {
        return filterSitemap(items as unknown as SitemapItem[], noIndexUrls)
      },
      ...config.sitemap,
    } as UserConfig['sitemap'],
    markdown: {
      ...config.markdown,
      image: { lazyLoading: true, ...config.markdown?.image },
      externalLinks: omitUndefined({
        target: '_blank',
        class: externalLinkIcon ? 'vp-external-link-icon' : undefined,
      }),
      config: (md) => {
        md.use(mdImage, { srcDir: config.srcDir })

        if (config.markdown?.config) {
          config.markdown.config(md)
        }
      },
    },

    themeConfig: {
      ...common.themeConfig,
      ...config.themeConfig,

      popularPosts: {
        ...commonThemeConfig.popularPosts,
        ...config.themeConfig?.popularPosts,
        dataSource: {
          ...commonThemeConfig.popularPosts.dataSource,
          ...config.themeConfig?.popularPosts?.dataSource,
        },
      },

      postList: {
        ...commonThemeConfig.postList,
        ...config.themeConfig?.postList,
      },

      feeds: {
        ...commonThemeConfig.feeds,
        ...config.themeConfig?.feeds,
      },

      seo: {
        ...commonThemeConfig.seo,
        ...config.themeConfig?.seo,
      },

      t: deepMerge(
        (blogBaseLocales.en as { t: I18n }).t,
        (config.themeConfig?.t ?? {}) as Record<string, unknown>
      ) as I18n,
    },

    async transformPageData(pageData, ctx) {
      const extendedPageData = asExtendedPageData(pageData)
      const extendedSiteConfig = asExtendedSiteConfig(ctx.siteConfig)

      collectImageDimensions(extendedPageData, extendedSiteConfig)
      transformTitle(extendedPageData, { siteConfig: extendedSiteConfig })
      transformPageMeta(extendedPageData)
      resolveDescription(extendedPageData, { siteConfig: extendedSiteConfig })

      if (hasNoIndex(extendedPageData.frontmatter.head)) {
        noIndexUrls.add(normalizeSitemapUrl(extendedPageData.relativePath))
      }

      if (config.transformPageData) {
        mergeReturnedPageData(
          extendedPageData,
          await config.transformPageData(pageData, ctx)
        )
      }
    },

    async transformHead(ctx) {
      const extendedCtx = asTransformHeadContext(ctx)
      const typedCtx = asTransformContext(ctx)

      const pageSeo = extendedCtx.pageData.frontmatter?.seo
      const globalSeo = extendedCtx.siteConfig.userConfig?.themeConfig?.seo
      const isSeoEnabled = (key: keyof SeoConfig): boolean => {
        if (pageSeo?.[key] !== undefined) return pageSeo[key] !== false
        if (globalSeo?.[key] !== undefined) return globalSeo[key] !== false
        return true
      }

      const isNoIndex = hasNoIndex(extendedCtx.pageData.frontmatter?.head)

      addDescriptionMetaTag(extendedCtx)
      if (isSeoEnabled('og')) addOgMetaTags(extendedCtx)
      if (!isNoIndex && isSeoEnabled('jsonLd')) addJsonLd(extendedCtx)
      if (!isNoIndex && isSeoEnabled('hreflang')) addHreflang(extendedCtx)
      if (!isNoIndex && isSeoEnabled('canonical')) addCanonicalLink(extendedCtx)
      if (isSeoEnabled('rss')) addRssLinks(extendedCtx)

      return config.transformHead ? await config.transformHead(typedCtx) : undefined
    },

    buildEnd: async (cfg: SiteConfig) => {
      await generateRssFeed(asExtendedSiteConfig(cfg))
      generateRobotsTxt(asExtendedSiteConfig(cfg))

      if (config.buildEnd) {
        await config.buildEnd(cfg)
      }
    },
  } as ResolvedBlogConfig
}

/**
 * Synchronous entry point for blog configuration.
 *
 * Calls {@link mergeBlogConfig} to apply all built-in defaults, and additionally
 * emits `console.warn` for commonly missed required fields (`siteUrl`,
 * `locales`).
 *
 * Prefer {@link defineBlogConfig} for normal usage — it auto-discovers locales.
 * Use `defineBlogConfigSync` only in tests or when you need a synchronous
 * merge without locale discovery.
 */
export function defineBlogConfigSync(config: BlogUserConfig): ResolvedBlogConfig {
  warnMissingRequired(config)

  return mergeBlogConfig(config)
}

/**
 * Standard async entry point for the conventional folder-based blog setup.
 *
 * If `locales` is omitted or empty, discovers locale folders from `srcDir`
 * using `<srcDir>/<locale>/_site.yaml` or `_site.ts`. Explicit `locales`
 * still win for advanced/manual setups.
 *
 * Use this function in your `.vitepress/config.ts`.
 */
export async function defineBlogConfig(
  config: BlogUserConfig
): Promise<ResolvedBlogConfig> {
  const hasLocales = Boolean(
    config.locales && Object.keys(config.locales).length > 0
  )

  return defineBlogConfigSync({
    ...config,
    locales: hasLocales ? config.locales : await autoLoadLocales(config),
  })
}
