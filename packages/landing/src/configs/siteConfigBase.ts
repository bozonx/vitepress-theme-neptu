import type {
  UserConfig,
  HeadConfig,
  TransformContext,
  SiteConfig,
} from 'vitepress'
import tailwindcss from '@tailwindcss/vite'
import { omitUndefined, hasNoIndex } from 'vitepress-theme-neptu-blog/utils'
import { deepMerge } from 'vitepress-theme-neptu-blog/utils'
import { resolveBaseLocaleKey } from 'vitepress-theme-neptu-blog/utils'
import { createSiteYamlHotReloadPlugin } from 'vitepress-theme-neptu-blog/utils/node'
import {
  addCanonicalLink,
  addDescriptionMetaTag,
  addHreflang,
  addJsonLd,
  addOgMetaTags,
  collectImageDimensions,
  filterSitemap,
  generateRobotsTxt,
  mdImage,
  resolveDescription,
  transformPageMeta,
  transformTitle,
} from 'vitepress-theme-neptu-blog/transformers'
import type { SitemapItem } from 'vitepress-theme-neptu-blog/transformers'
import siteBaseLocales from './siteLocalesBase/index.ts'
import { autoLoadSiteLocales } from './loadSiteLocale.ts'
import type {
  ExtendedPageData,
  ExtendedSiteConfig,
  LandingUserConfig,
  ResolvedLandingConfig,
  ThemeConfig,
  SeoConfig,
  I18n,
} from '../types.d.ts'

// ---------------------------------------------------------------------------
// Type adapters — isolate all `as unknown as` casts in one place.
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

// ---------------------------------------------------------------------------
// Common defaults
// ---------------------------------------------------------------------------

const commonThemeConfig = {
  externalLinkIcon: true,
  i18nRouting: true,
  mainHeroImg: '/img/home-logo.webp',
  seo: {
    maxDescriptionLength: 300,
    autoCanonical: true,
  },
} satisfies Partial<ThemeConfig>

export const common: LandingUserConfig = {
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

function warnMissingRequired(config: LandingUserConfig): void {
  if (!config.siteUrl) {
    console.warn(
      '[vitepress-theme-neptu-landing] `siteUrl` is not set. ' +
        'SEO features (sitemap, canonical links) may produce broken URLs.'
    )
  }

  if (!config.locales || Object.keys(config.locales).length === 0) {
    console.warn(
      '[vitepress-theme-neptu-landing] `locales` is empty. ' +
        'The theme requires at least one locale (e.g. `{ en: { lang: "en-US" } }`).'
    )
  }
}

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
  const externalLinkIcon =
    typeof config.themeConfig?.externalLinkIcon === 'boolean'
      ? config.themeConfig.externalLinkIcon
      : commonThemeConfig.externalLinkIcon

  const noIndexUrls = new Set<string>()

  function normalizeSitemapUrl(relativePath: string): string {
    return relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
  }

  const baseLocaleKey = resolveBaseLocaleKey(
    Object.keys(config.locales || {})[0],
    siteBaseLocales as unknown as Record<string, unknown>
  )
  const baseLocale = (
    siteBaseLocales as unknown as Record<string, { t: Record<string, unknown> }>
  )[baseLocaleKey]

  return {
    ...common,
    ...config,
    title: config.title || config.en?.title,
    description: config.description || config.en?.description,
    head: [...(common.head || []), ...(config.head || [])],
    locales: Object.fromEntries(
      Object.entries({
        ...(common.locales || {}),
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
        ...(hasTailwindPlugin(config.vite?.plugins) ? [] : [tailwindcss()]),
        ...(config.srcDir
          ? [createSiteYamlHotReloadPlugin(config.srcDir)]
          : []),
        ...(config.vite?.plugins || []),
      ],
      ssr: { noExternal: ['vitepress-theme-neptu-blog'], ...config.vite?.ssr },
    },
    sitemap: {
      hostname: config.siteUrl,
      transformItems: (items) => {
        return filterSitemap(
          items as unknown as SitemapItem[],
          noIndexUrls
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

        if (config.markdown?.config) {
          config.markdown.config(md)
        }
      },
    },

    themeConfig: {
      ...common.themeConfig,
      ...config.themeConfig,
      socialLinks: config.themeConfig?.repo
        ? [{ icon: 'github', link: config.themeConfig.repo }]
        : undefined,

      seo: {
        ...commonThemeConfig.seo,
        ...config.themeConfig?.seo,
      },

      t: deepMerge(
        (baseLocale?.t ?? {}) as unknown as Record<string, unknown>,
        (config.themeConfig?.t ?? {}) as unknown as Record<string, unknown>
      ) as unknown as I18n,
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
  warnMissingRequired(config)
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
    locales: hasLocales ? config.locales : await autoLoadSiteLocales(config),
  })
}

/**
 * @deprecated Use {@link mergeLandingConfig} instead.
 * Kept for backward compatibility.
 */
export const mergeSiteConfig = mergeLandingConfig
