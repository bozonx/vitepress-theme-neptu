import type { HeadConfig } from 'vitepress'
import type { ExtendedPageData, ExtendedSiteConfig } from '../../types.d.ts'

// ---------------------------------------------------------------------------
// Type adapters — isolate all `as unknown as` casts in one place so the
// rest of the config files can use named, readable casts instead of inline ones.
// ---------------------------------------------------------------------------

export type TransformHeadContext = {
  head: HeadConfig[]
  pageData: ExtendedPageData
  siteConfig: ExtendedSiteConfig
  page: string
}

export function asExtendedPageData(pageData: unknown): ExtendedPageData {
  return pageData as ExtendedPageData
}

export function asTransformContext(ctx: unknown): import('vitepress').TransformContext {
  return ctx as unknown as import('vitepress').TransformContext
}

export function asExtendedSiteConfig(siteConfig: unknown): ExtendedSiteConfig {
  return siteConfig as unknown as ExtendedSiteConfig
}

export function asTransformHeadContext(ctx: unknown): TransformHeadContext {
  return ctx as unknown as TransformHeadContext
}

export function mergeReturnedPageData(
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

export function hasTailwindPlugin(plugins: unknown): boolean {
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
// Shared constants & helpers used by both blog and landing config base files.
// ---------------------------------------------------------------------------

/**
 * Default `<head>` entries shared by both blog and landing themes:
 * X-UA-Compatible meta, favicon links, apple-touch-icon, web manifest.
 */
export const commonHead: HeadConfig[] = [
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
]

/**
 * Common base config fields shared by both themes (excluding `themeConfig`,
 * which differs between blog and landing).
 */
export const commonBaseConfig = {
  head: commonHead,
  lastUpdated: true,
  cleanUrls: true,
  lang: 'en-US',
}

/**
 * Normalizes a VitePress relative path for sitemap: strips `index.md` and
 * `.md` extensions.
 */
export function normalizeSitemapUrl(relativePath: string): string {
  return relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
}

/**
 * Emits `console.warn` for commonly missed required fields (`siteUrl`,
 * `locales`). The `logPrefix` distinguishes blog vs landing messages.
 */
export function warnMissingRequired(
  config: { siteUrl?: string; locales?: Record<string, unknown> },
  logPrefix: string
): void {
  if (!config.siteUrl) {
    console.warn(
      `${logPrefix} \`siteUrl\` is not set. ` +
        'SEO features (sitemap, canonical links) may produce broken URLs.'
    )
  }

  if (!config.locales || Object.keys(config.locales).length === 0) {
    console.warn(
      `${logPrefix} \`locales\` is empty. ` +
        'The theme requires at least one locale (e.g. `{ en: { lang: "en-US" } }`).'
    )
  }
}

/**
 * Extracts the `themeConfig` block from a site YAML payload.
 *
 * Both `<srcDir>/site.yaml` (shared) and `<srcDir>/<locale>/_site.yaml`
 * (per-locale) follow the canonical `Partial<BlogUserConfig>` shape:
 * top-level keys for VitePress identity (`lang`, `title`, `titleTemplate`,
 * `description`, `extends`) and a nested `themeConfig:` block for the rest.
 */
export function extractThemeConfig(
  site: Record<string, unknown> | undefined
): Record<string, unknown> {
  return (site?.themeConfig as Record<string, unknown> | undefined) ?? {}
}

/**
 * Resolves `externalLinkIcon` from user config or falls back to the provided
 * default value.
 */
export function resolveExternalLinkIcon(
  userValue: boolean | undefined,
  defaultValue: boolean
): boolean {
  return typeof userValue === 'boolean' ? userValue : defaultValue
}
