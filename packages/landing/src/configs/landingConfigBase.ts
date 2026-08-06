import type {
  UserConfig,
  SiteConfig,
} from 'vitepress'
import { omitUndefined, hasNoIndex } from 'vitepress-theme-neptu/utils'
import { deepMerge } from 'vitepress-theme-neptu/utils'
import { resolveBaseLocaleKey } from 'vitepress-theme-neptu/utils'
import {
  asExtendedPageData,
  asExtendedSiteConfig,
  asTransformContext,
  asTransformHeadContext,
  mergeReturnedPageData,
  commonBaseConfig,
  normalizeSitemapUrl,
  prefixSitemapItems,
  resolveSitemapSiteUrl,
  warnMissingRequired,
  resolveExternalLinkIcon,
} from 'vitepress-theme-neptu/utils'
import {
  assertStrictLocaleStructure,
  createSiteYamlHotReloadPlugin,
  createColocatedMediaPlugin,
} from 'vitepress-theme-neptu/utils/node'
import {
  addCanonicalLink,
  addDescriptionMetaTag,
  addHreflang,
  addJsonLd,
  addOgMetaTags,
  collectImageDimensions,
  resolveMediaPaths,
  filterSitemap,
  generateRobotsTxt,
  mdAdSlots,
  mdImage,
  resolveDescription,
  transformPageMeta,
  transformTitle,
} from 'vitepress-theme-neptu/transformers'
import type { SitemapItem } from 'vitepress-theme-neptu/transformers'
import { resolveBlockMedia } from '../utils/resolveBlockMedia.ts'
import siteBaseLocales from './landingLocalesBase/index.ts'
import { autoLoadLocales } from './loadLocale.ts'
import { createLandingHeadScript } from './headScript.ts'
// Imported from the modules rather than the barrels: the `configs` barrel
// pulls in the whole server-side config pipeline, and both of these are
// dependency-free.
import { createConsentHeadScript } from 'vitepress-theme-neptu/src/configs/consentHeadScript.ts'
import { DEFAULT_ADS_IN_CONTENT } from 'vitepress-theme-neptu/src/utils/shared/ads.ts'
import type {
  LandingUserConfig,
  ResolvedLandingConfig,
  SeoConfig,
  I18nTranslations,
  LandingThemeConfig,
} from '../types.d.ts'

// ---------------------------------------------------------------------------
// Common defaults
// ---------------------------------------------------------------------------

const commonThemeConfig = {
  externalLinkIcon: true,
  i18nRouting: true,
  heroImage: '/img/home-logo.webp',
  // Demo controls. A production site ships one theme via
  // `defaultColorTheme` / `defaultStylePreset` instead.
  colorPicker: false,
  stylePicker: false,
  seo: {
    maxDescriptionLength: 300,
    autoCanonical: true,
  },

  // The right-hand column and its outline come from the VitePress default
  // theme, so there is no `toc` config here — use `themeConfig.outline`.
  // Ads are the theme's own: no network is wired up until a site sets
  // `ads.component`.
  ads: {
    enabled: true,
    // Docs pages only. A bare `layout` means `doc` in the default theme,
    // which is why the fallback differs from the blog's.
    layouts: ['doc'],
    defaultLayout: 'doc',
    aside: true,
    afterContent: false,
    requireConsent: false,
    inContent: DEFAULT_ADS_IN_CONTENT,
  },

  consent: {
    enabled: true,
    waitForUpdate: 500,
  },
} satisfies Partial<LandingThemeConfig>

export const landingBaseConfig: LandingUserConfig = {
  ...commonBaseConfig,
  themeConfig: commonThemeConfig,
}

const LOG_PREFIX = '[vitepress-theme-neptu-landing]'

/**
 * Low-level config merge without validation warnings.
 *
 * Applies all built-in defaults (head, vite, markdown, sitemap, transformers,
 * deep-merges seo / t) on top of the provided config. Does NOT emit warnings
 * for missing required fields.
 *
 * Prefer {@link defineLandingConfig} as the standard entry point — it wraps
 * this function and also calls `warnMissingRequired`.
 */
export function mergeLandingConfig(
  config: LandingUserConfig
): ResolvedLandingConfig {
  const externalLinkIcon = resolveExternalLinkIcon(
    config.themeConfig?.externalLinkIcon,
    commonThemeConfig.externalLinkIcon
  )

  const noIndexUrls = new Set<string>()
  const sitemapSiteUrl = resolveSitemapSiteUrl(config.siteUrl)

  const primaryLocaleKey =
    config.primaryLocale || Object.keys(config.locales || {})[0]
  const baseLocaleKey = resolveBaseLocaleKey(
    primaryLocaleKey,
    siteBaseLocales as unknown as Record<string, unknown>
  )
  const baseLocale = (
    siteBaseLocales as unknown as Record<string, { t: Record<string, unknown> }>
  )[baseLocaleKey]
  const primaryLocaleTheme = (
    (config.locales || {})[primaryLocaleKey] as
      | { themeConfig?: LandingThemeConfig }
      | undefined
  )?.themeConfig

  return {
    ...landingBaseConfig,
    ...config,
    title: config.title || config.rootMeta?.title,
    description: config.description || config.rootMeta?.description,
    head: [
      // Consent Mode v2 defaults. Must be the very first script on the page:
      // the signals only bind tags that load after them.
      ...(config.themeConfig?.consent?.enabled === false
        ? []
        : [
            [
              'script',
              {},
              createConsentHeadScript(config.themeConfig?.consent),
            ] as [string, Record<string, string>, string],
          ]),
      ...(landingBaseConfig.head || []),
      // Restores the saved theme before the first paint and arms the reveal
      // animations. Must run inline, before any stylesheet is applied.
      [
        'script',
        {},
        createLandingHeadScript({
          colorTheme:
            primaryLocaleTheme?.defaultColorTheme ??
            config.themeConfig?.defaultColorTheme,
          stylePreset:
            primaryLocaleTheme?.defaultStylePreset ??
            config.themeConfig?.defaultStylePreset,
        }),
      ],
      ...(config.head || []),
    ],
    locales: Object.fromEntries(
      Object.entries({
        ...(landingBaseConfig.locales || {}),
        ...(config.locales || {}),
      }).map(([key, locale]) => {
        const titleTemplate =
          locale.titleTemplate ??
          (locale.title ? `:title | ${locale.title}` : undefined)
        return [key, titleTemplate ? { ...locale, titleTemplate } : locale]
      })
    ),
    vite: {
      ...config.vite,
      plugins: [
        ...(config.srcDir
          ? [
              createSiteYamlHotReloadPlugin(config.srcDir),
              createColocatedMediaPlugin(config.srcDir),
            ]
          : []),
        ...(config.vite?.plugins || []),
      ],
      ssr: {
        noExternal: [
          'vitepress-theme-neptu',
          'vitepress-theme-neptu-landing',
        ],
        ...config.vite?.ssr,
      },
    },
    sitemap: {
      hostname: sitemapSiteUrl.hostname,
      transformItems: (items) => {
        return prefixSitemapItems(
          filterSitemap(
            items as unknown as SitemapItem[],
            noIndexUrls
          ),
          sitemapSiteUrl.basePath
        )
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
      ...landingBaseConfig.themeConfig,
      ...config.themeConfig,
      socialLinks: config.themeConfig?.repo
        ? [{ icon: 'github', link: config.themeConfig.repo }]
        : undefined,

      seo: {
        ...commonThemeConfig.seo,
        ...config.themeConfig?.seo,
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
        (baseLocale?.t ?? {}) as unknown as Record<string, unknown>,
        (config.themeConfig?.t ?? {}) as unknown as Record<string, unknown>
      ) as unknown as I18nTranslations,
    },

    async transformPageData(pageData, ctx) {
      const extendedPageData = asExtendedPageData(pageData)
      const extendedSiteConfig = asExtendedSiteConfig(ctx.siteConfig)

      collectImageDimensions(extendedPageData, extendedSiteConfig)
      resolveMediaPaths(extendedPageData)
      extendedPageData.frontmatter.blocks = resolveBlockMedia(
        extendedPageData.frontmatter.blocks,
        extendedPageData.relativePath
      ) as typeof extendedPageData.frontmatter.blocks
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

      return config.transformHead
        ? await config.transformHead(typedCtx)
        : undefined
    },

    buildEnd: async (cfg: SiteConfig) => {
      generateRobotsTxt(asExtendedSiteConfig(cfg))

      if (config.buildEnd) {
        await config.buildEnd(cfg)
      }
    },
  } as ResolvedLandingConfig
}

/**
 * Synchronous entry point for landing configuration.
 *
 * Calls {@link mergeLandingConfig} to apply all built-in defaults, and
 * additionally emits `console.warn` for commonly missed required fields
 * (`siteUrl`, `locales`).
 *
 * Use {@link defineLandingConfig} for normal usage — it auto-discovers
 * locales. Use `defineLandingConfigSync` only in tests or when you need a
 * synchronous merge without locale discovery.
 */
export function defineLandingConfigSync(
  config: LandingUserConfig
): ResolvedLandingConfig {
  warnMissingRequired(config, LOG_PREFIX)
  assertStrictLocaleStructure(config, LOG_PREFIX)
  return mergeLandingConfig(config)
}

/**
 * Standard async entry point for the conventional folder-based landing setup.
 *
 * If `locales` is omitted or empty, discovers locale folders from `srcDir`
 * using `<srcDir>/<locale>/_site.yaml` or `_site.ts`. Explicit `locales`
 * still win for advanced/manual setups.
 *
 * Use this function in your `.vitepress/config.ts`.
 */
export async function defineLandingConfig(
  config: LandingUserConfig
): Promise<ResolvedLandingConfig> {
  const hasLocales = Boolean(
    config.locales && Object.keys(config.locales).length > 0
  )

  return defineLandingConfigSync({
    ...config,
    locales: hasLocales ? config.locales : await autoLoadLocales(config),
  })
}
