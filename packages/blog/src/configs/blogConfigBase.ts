import tailwindcss from '@tailwindcss/vite'
import { createSiteYamlHotReloadPlugin } from '../utils/node/hotReloadPlugin.ts'
import { createColocatedMediaPlugin } from '../utils/node/colocatedMedia.ts'
import type { UserConfig, SiteConfig } from 'vitepress'
import { omitUndefined, hasNoIndex } from '../utils/shared/index.ts'
import { deepMerge } from '../utils/shared/merge.ts'
import {
  asExtendedPageData,
  asExtendedSiteConfig,
  asTransformContext,
  asTransformHeadContext,
  mergeReturnedPageData,
  hasTailwindPlugin,
  commonBaseConfig,
  normalizeSitemapUrl,
  prefixSitemapItems,
  resolveSitemapSiteUrl,
  warnMissingRequired,
  resolveExternalLinkIcon,
} from '../utils/shared/configHelpers.ts'
import blogBaseLocales from './blogLocalesBase/index.ts'
import { createThemeHeadScript } from './headScript.ts'
import { createConsentHeadScript } from './consentHeadScript.ts'
import {
  DEFAULT_ADS_IN_CONTENT,
  DEFAULT_ADS_LAYOUTS,
} from '../utils/shared/ads.ts'
import { DEFAULT_READING_WPM } from '../utils/shared/readingTime.ts'
import {
  DEFAULT_TOC_LAYOUTS,
  DEFAULT_TOC_LEVEL,
  DEFAULT_TOC_MIN_HEADINGS,
} from '../utils/shared/toc.ts'
import { mdAdSlots } from '../transformers/mdAdSlots.ts'
import { addJsonLd } from '../transformers/addJsonLd.ts'
import { addHreflang } from '../transformers/addHreflang.ts'
import { addOgMetaTags } from '../transformers/addOgMetaTags.ts'
import { addRssLinks } from '../transformers/addRssLinks.ts'
import { addReadingTime } from '../transformers/addReadingTime.ts'
import { markDraftPage } from '../transformers/markDraftPage.ts'
import { filterSitemap } from '../transformers/filterSitemap.ts'
import type { SitemapItem } from '../transformers/filterSitemap.ts'
import { generateRssFeed } from '../transformers/generateRssFeed.ts'
import { generateRobotsTxt } from '../transformers/generateRobotsTxt.ts'
import { generateSearchIndex } from '../transformers/generateSearchIndex.ts'
import { transformPageMeta } from '../transformers/transformPageMeta.ts'
import { transformDescription } from '../transformers/transformDescription.ts'
import { transformTitle } from '../transformers/transformTitle.ts'
import { resolveDescription } from '../transformers/resolveDescription.ts'
import { addCanonicalLink } from '../transformers/addCanonicalLink.ts'
import { collectImageDimensions } from '../transformers/collectImageDimensions.ts'
import { resolveMediaPaths } from '../transformers/resolveMediaPaths.ts'
import { mdImage } from '../transformers/mdImage.ts'
import { autoLoadLocales } from '../utils/node/config.ts'
import { assertStrictLocaleStructure } from '../utils/node/localeStructure.ts'
import type {
  BlogUserConfig,
  LocaleDefinition,
  ThemeConfig,
  SeoConfig,
  I18n,
} from '../types.d.ts'

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

  // Both theme pickers are demo controls. A production blog ships one chosen
  // theme via `defaultColorTheme` / `defaultStylePreset` instead.
  colorPicker: false,
  stylePicker: false,

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
    showReadingTime: false,
  },

  readingTime: {
    enabled: true,
    wpm: DEFAULT_READING_WPM,
    layouts: ['post'],
  },

  drafts: {
    // `includeDrafts` is intentionally absent: leaving it unset lets
    // `resolveIncludeDrafts` fall back to the environment, so drafts show in
    // `vitepress dev` and disappear from a production build.
    showBadge: true,
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
    fullContent: false,
  },

  seo: {
    maxDescriptionLength: 300,
    autoCanonical: true,
  },

  toc: {
    enabled: true,
    layouts: DEFAULT_TOC_LAYOUTS,
    level: DEFAULT_TOC_LEVEL,
    minHeadings: DEFAULT_TOC_MIN_HEADINGS,
    position: 'auto' as const,
    collapsed: true,
  },

  // No ad network is wired up by default: `ads.component` is unset, so the
  // slots resolve to nothing until a site provides its own unit.
  ads: {
    enabled: true,
    layouts: DEFAULT_ADS_LAYOUTS,
    aside: true,
    afterContent: false,
    requireConsent: false,
    inContent: DEFAULT_ADS_IN_CONTENT,
  },

  consent: {
    enabled: true,
    waitForUpdate: 500,
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
  ...commonBaseConfig,
  themeConfig: commonThemeConfig,
}

const LOG_PREFIX = '[vitepress-theme-neptu]'

/**
 * Root-level identity for the language selector at `/`.
 *
 * The root page has no locale of its own, so it borrows the primary locale's
 * title and description: `en` when it exists, otherwise the first discovered
 * locale. Without this the root falls back to VitePress' own `"VitePress"`
 * default, since locales live under `config.locales` and never on `config.en`.
 */
function resolvePrimaryLocale(
  config: BlogUserConfig
): { title?: string; description?: string } | undefined {
  const locales = Object.entries(config.locales || {}).filter(
    ([code]) => code !== 'root'
  )
  const primary = locales.find(([code]) => code === 'en') || locales[0]

  return primary?.[1] as { title?: string; description?: string } | undefined
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
  const externalLinkIcon = resolveExternalLinkIcon(
    config.themeConfig?.externalLinkIcon,
    commonThemeConfig.externalLinkIcon
  )

  const noIndexUrls = new Set<string>()
  const sitemapSiteUrl = resolveSitemapSiteUrl(config.siteUrl)
  const primaryLocale = resolvePrimaryLocale(config)
  const primaryThemeConfig = (
    primaryLocale as (LocaleDefinition & { themeConfig?: Partial<ThemeConfig> }) | undefined
  )?.themeConfig

  return {
    ...common,
    ...config,
    title: config.title || config.en?.title || primaryLocale?.title,
    description:
      config.description || config.en?.description || primaryLocale?.description,
    head: [
      // Consent Mode v2 defaults. Must be the very first script on the page:
      // the signals only bind tags that load after them, so anything emitted
      // earlier — gtag.js, AdSense, a CMP — would escape the gate.
      ...(config.themeConfig?.consent?.enabled === false
        ? []
        : [
            [
              'script',
              {},
              createConsentHeadScript(config.themeConfig?.consent),
            ] as [string, Record<string, string>, string],
          ]),
      ...(common.head || []),
      // Restores both theme axes before the first paint. Must run inline,
      // before any stylesheet is applied.
      [
        'script',
        {},
        createThemeHeadScript({
          colorTheme:
            primaryThemeConfig?.defaultColorTheme ??
            config.themeConfig?.defaultColorTheme,
          stylePreset:
            primaryThemeConfig?.defaultStylePreset ??
            config.themeConfig?.defaultStylePreset,
        }),
      ],
      ...(config.head || []),
    ],
    // Keep the locale identity fields native. VitePress already uses `title`
    // as the default suffix and avoids duplicating it on a home page; creating
    // `:title | ${locale.title}` here defeats that behaviour.
    locales: { ...(common.locales || {}), ...(config.locales || {}) },
    vite: {
      ...config.vite,
      plugins: [
        ...(hasTailwindPlugin(config.vite?.plugins) ? [] : [tailwindcss()]),
        ...(config.srcDir
          ? [
              createSiteYamlHotReloadPlugin(config.srcDir),
              createColocatedMediaPlugin(config.srcDir),
            ]
          : []),
        ...(config.vite?.plugins || []),
      ],
      ssr: { noExternal: ['vitepress-theme-neptu'], ...config.vite?.ssr },
    },
    sitemap: {
      hostname: sitemapSiteUrl.hostname,
      transformItems: (items) => {
        return prefixSitemapItems(
          filterSitemap(items as unknown as SitemapItem[], noIndexUrls),
          sitemapSiteUrl.basePath
        )
      },
      ...config.sitemap,
    } as UserConfig['sitemap'],
    markdown: {
      ...config.markdown,
      image: { lazyLoading: true, ...config.markdown?.image },
      // Populates `page.headers`, which the table of contents is built from.
      // VitePress leaves the extraction off unless a theme asks for it. All
      // levels are collected here and narrowed later by `toc.level`, so
      // switching that setting needs no rebuild of the config.
      headers: config.markdown?.headers ?? { level: [2, 3, 4, 5, 6] },
      externalLinks: omitUndefined({
        target: '_blank',
        class: externalLinkIcon ? 'vp-external-link-icon' : undefined,
      }),
      config: (md) => {
        md.use(mdImage, { srcDir: config.srcDir })
        // Places in-content ad slots while the page is compiled, so they are
        // part of the server-rendered HTML instead of appearing after load.
        md.use(mdAdSlots, {
          ads: { ...commonThemeConfig.ads, ...config.themeConfig?.ads },
        })

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

      readingTime: {
        ...commonThemeConfig.readingTime,
        ...config.themeConfig?.readingTime,
      },

      drafts: {
        ...commonThemeConfig.drafts,
        ...config.themeConfig?.drafts,
      },

      feeds: {
        ...commonThemeConfig.feeds,
        ...config.themeConfig?.feeds,
      },

      seo: {
        ...commonThemeConfig.seo,
        ...config.themeConfig?.seo,
      },

      toc: {
        ...commonThemeConfig.toc,
        ...config.themeConfig?.toc,
      },

      ads: {
        ...commonThemeConfig.ads,
        ...config.themeConfig?.ads,
        inContent: {
          ...commonThemeConfig.ads.inContent,
          ...config.themeConfig?.ads?.inContent,
        },
      },

      consent: {
        ...commonThemeConfig.consent,
        ...config.themeConfig?.consent,
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
      resolveMediaPaths(extendedPageData)
      // Before the noindex check below: a draft adds its own robots meta and
      // must be picked up by the same `hasNoIndex` pass.
      markDraftPage(extendedPageData, config.themeConfig?.drafts)
      addReadingTime(extendedPageData, {
        siteConfig: extendedSiteConfig,
        readingTime: config.themeConfig?.readingTime,
      })
      transformTitle(extendedPageData, { siteConfig: extendedSiteConfig })
      transformDescription(extendedPageData, { siteConfig: extendedSiteConfig })
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
      await generateSearchIndex(asExtendedSiteConfig(cfg))

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
  warnMissingRequired(config, LOG_PREFIX)
  assertStrictLocaleStructure(config, LOG_PREFIX)

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
