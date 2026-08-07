import { deepMerge } from '../shared/merge.ts'
import {
  mergeAuthorsById,
  mergeCategoriesById,
  mergeSocialMediaSharesByName,
} from '../shared/mergeStrategy.ts'
import { extractThemeConfig } from '../shared/configHelpers.ts'
import { autoLoadLocalesFactory, type LocaleEntry } from './autoLoadLocales.ts'
import {
  parseLocaleSite,
  parseSharedSite,
  parseLocaleAuthors,
  parseLocaleCategories,
  resolveConfigTemplates,
} from './i18n.ts'
import { registerCategories } from './categoriesRegistry.ts'
import { loadLocaleYamlChain } from './localeYamlChain.ts'
import { mdToHtml } from './markdown.ts'
import { getImageDimensions } from './image.ts'
import { resolveBaseLocaleKey } from '../shared/i18n.ts'
import { blogBaseConfig } from '../../configs/blogConfigBase.ts'
import blogBaseLocales from '../../configs/blogLocalesBase/index.ts'
import { resolveEditLinkPattern } from './editLink.ts'
import type {
  LocaleDefinition,
  Author,
  CategoryDefinition,
  SocialMediaShare,
  BlogUserConfig,
  ThemeConfig,
  I18nTranslations,
} from '../../types.d.ts'

type EditLinkConfig = NonNullable<ThemeConfig['editLink']>

/**
 * Recursively checks whether any string leaf still contains a `${...}`
 * placeholder. Used by {@link resolveLocaleTemplates} to decide when the
 * iterative substitution has converged — cheaper and order-independent
 * compared to `JSON.stringify` equality.
 */
function hasUnresolvedTemplates(value: unknown): boolean {
  if (typeof value === 'string') return /\$\{[^}]*\}/.test(value)
  if (Array.isArray(value)) return value.some(hasUnresolvedTemplates)
  if (value && typeof value === 'object') {
    return Object.values(value).some(hasUnresolvedTemplates)
  }
  return false
}

function resolveLocaleTemplates(
  site: Record<string, unknown>,
  theme: Record<string, unknown>,
  config: BlogUserConfig,
  localeIndex: string
): { site: Record<string, unknown>; theme: Record<string, unknown> } {
  let resolvedSite = site
  let resolvedTheme = theme

  // Resolve references to sibling/inherited values, e.g.
  // `publisher.name: '${site.title}'`. A bounded loop keeps cycles
  // harmless: unresolved placeholders stay visible instead of disappearing.
  for (let pass = 0; pass < 8; pass++) {
    const context = {
      config,
      localeIndex,
      site: resolvedSite,
      theme: resolvedTheme,
      t: (resolvedTheme.t as Record<string, unknown> | undefined) ?? {},
    }
    const nextSite = resolveConfigTemplates(resolvedSite, context)
    const nextTheme = resolveConfigTemplates(resolvedTheme, context)

    // Stop when no `${...}` placeholders remain in any string leaf —
    // cheaper and more stable than JSON.stringify comparison.
    const siteDone = !hasUnresolvedTemplates(nextSite)
    const themeDone = !hasUnresolvedTemplates(nextTheme)
    resolvedSite = nextSite
    resolvedTheme = nextTheme
    if (siteDone && themeDone) break
  }

  return { site: resolvedSite, theme: resolvedTheme }
}

/**
 * Removes `authors`, `categories` and `socialMediaShares` from a nested
 * `themeConfig` so that generic deep-merge does not touch them — they are
 * merged separately with by-id / by-name strategies.
 */
function extractMergeableThemeArrays(
  site: Record<string, unknown>
): {
  site: Record<string, unknown>
  authors: Author[]
  categories: CategoryDefinition[]
  socialMediaShares: SocialMediaShare[]
} {
  const themeConfig = extractThemeConfig(site)
  const {
    authors: themeAuthors,
    categories: themeCategories,
    socialMediaShares: themeSocialShares,
    ...themeConfigRest
  } = themeConfig as {
    authors?: Author[]
    categories?: CategoryDefinition[]
    socialMediaShares?: SocialMediaShare[]
    [key: string]: unknown
  }
  const { themeConfig: _tc, ...siteRest } = site
  return {
    site:
      Object.keys(themeConfigRest).length > 0
        ? { ...siteRest, themeConfig: themeConfigRest }
        : siteRest,
    authors: Array.isArray(themeAuthors) ? (themeAuthors as Author[]) : [],
    categories: Array.isArray(themeCategories)
      ? (themeCategories as CategoryDefinition[])
      : [],
    socialMediaShares: Array.isArray(themeSocialShares)
      ? (themeSocialShares as SocialMediaShare[])
      : [],
  }
}

interface LocaleYamlChain {
  /** Merged `_site.yaml` payload with the by-key arrays stripped and `extends` resolved. */
  site: Record<string, unknown>
  /** Merged authors list from every step of the `extends` chain. */
  authors: Author[]
  /** Merged category registry from every step of the `extends` chain. */
  categories: CategoryDefinition[]
  /** Merged socialMediaShares list from every step of the `extends` chain. */
  socialMediaShares: SocialMediaShare[]
}

/**
 * Blog-specific adapter for the shared `loadLocaleYamlChain` factory.
 *
 * Authors from `_site.yaml themeConfig.authors` and `_authors.yaml` are
 * combined at each step (local `_authors.yaml` wins over local `_site.yaml
 * themeConfig.authors`), then merged across the chain with the by-id strategy.
 * Categories work exactly the same way with `_categories.yaml`.
 */
async function loadBlogLocaleYamlChain(
  localeIndex: string,
  config: BlogUserConfig,
  templateParams: Record<string, unknown>,
  visited: Set<string>
): Promise<LocaleYamlChain> {
  const srcDir = config.srcDir || ''

  const result = await loadLocaleYamlChain<{
    authors: Author[]
    categories: CategoryDefinition[]
    socialMediaShares: SocialMediaShare[]
  }>(localeIndex, {
    srcDir,
    templateParams,
    visited,
    parseLocale: parseLocaleSite as (
      srcDir: string,
      params: Record<string, unknown>
    ) => Promise<Record<string, unknown>>,
    logPrefix: '[vitepress-theme-neptu]',
    prepareSite: async (rawSite) => {
      const {
        site: siteWithoutArrays,
        authors: siteAuthors,
        categories: siteCategories,
        socialMediaShares,
      } = extractMergeableThemeArrays(rawSite)
      const localeParams = { ...templateParams, localeIndex }
      const authorsFile = (await parseLocaleAuthors(srcDir, localeParams)) as Author[]
      const categoriesFile = (await parseLocaleCategories(
        srcDir,
        localeParams
      )) as CategoryDefinition[]
      return {
        site: siteWithoutArrays,
        extra: {
          authors: mergeAuthorsById(siteAuthors, authorsFile),
          categories: mergeCategoriesById(siteCategories, categoriesFile),
          socialMediaShares,
        },
      }
    },
    mergeExtra: (parent, current) => ({
      authors: mergeAuthorsById(parent.authors, current.authors),
      categories: mergeCategoriesById(parent.categories, current.categories),
      socialMediaShares: mergeSocialMediaSharesByName(
        parent.socialMediaShares,
        current.socialMediaShares
      ),
    }),
    defaultExtra: { authors: [], categories: [], socialMediaShares: [] },
  })

  return {
    site: result.site,
    authors: result.extra.authors,
    categories: result.extra.categories,
    socialMediaShares: result.extra.socialMediaShares,
  }
}

/**
 * Builds a VitePress `LocaleConfig` for a single content locale by merging
 * every admin-editable and developer-provided layer in priority order:
 *
 *   built-in theme defaults (blogBaseConfig)
 *     → built-in content-locale defaults (`blogLocalesBase[*]`)
 *       → config.ts (`BlogUserConfig.themeConfig`)
 *         → `<srcDir>/site.yaml` (cross-locale admin)
 *           → `<srcDir>/<localeIndex>/_site.yaml` extends chain
 *             + `<srcDir>/<localeIndex>/_authors.yaml`
 *
 * Prefer `defineBlogConfig` in application code; this function
 * is the lower-level primitive and is re-exported for advanced usage.
 */
export async function loadBlogLocale(
  localeIndex: string,
  config: BlogUserConfig
): Promise<LocaleDefinition & { label?: string }> {
  const localeMap = blogBaseLocales as unknown as Record<
    string,
    LocaleDefinition
  >
  const baseLocaleKey = resolveBaseLocaleKey(localeIndex, localeMap)
  const baseLocale = localeMap[baseLocaleKey]

  // ------------------------------------------------------------------
  // Shared <srcDir>/site.yaml — admin-editable layer applied to every
  // locale. Sits between config.ts and per-locale YAML in priority.
  // Template substitution context uses blogBaseConfig+config defaults so that
  // ${theme.*} can reference values declared in config.ts.
  // ------------------------------------------------------------------
  // Keep this order identical to the public three-layer contract:
  // built-ins → developer config.ts → shared site.yaml → locale _site.yaml.
  // In particular, config.themeConfig must participate in the final locale
  // config, not merely be available while interpolating YAML templates.
  // Strip socialMediaShares from built-in locale and config.ts layers so
  // they are merged by name instead of replaced by deepMerge.
  const {
    socialMediaShares: baseSocialShares,
    ...baseLocaleThemeRest
  } = (baseLocale.themeConfig || {}) as {
    socialMediaShares?: SocialMediaShare[]
    [key: string]: unknown
  }
  const {
    socialMediaShares: configSocialShares,
    categories: configCategories,
    ...configThemeRest
  } = (config.themeConfig || {}) as {
    socialMediaShares?: SocialMediaShare[]
    categories?: CategoryDefinition[]
    [key: string]: unknown
  }

  const builtInTheme = deepMerge(
    (blogBaseConfig.themeConfig || {}) as Record<string, unknown>,
    {
      ...baseLocaleThemeRest,
      t: { ...baseLocale.t },
    }
  )
  const themeForTemplates = deepMerge(
    builtInTheme,
    configThemeRest as Record<string, unknown>
  )
  const sharedSite = (await parseSharedSite(config.srcDir || '', {
    localeIndex,
    config,
    theme: themeForTemplates,
    t: (themeForTemplates.t as Record<string, unknown> | undefined) ?? {},
  })) as Record<string, unknown>
  const {
    site: sharedSiteSanitized,
    authors: sharedAuthors,
    categories: sharedCategories,
    socialMediaShares: sharedSocialShares,
  } = extractMergeableThemeArrays(sharedSite)
  const { repo: _sharedYamlRepo, ...sharedThemeConfig } = extractThemeConfig(sharedSiteSanitized)

  const resolvedTheme = deepMerge(themeForTemplates, sharedThemeConfig)
  const templateParams = {
    config,
    theme: resolvedTheme,
    t: (resolvedTheme as Record<string, unknown>).t as Record<string, unknown>,
  }

  const chain = await loadBlogLocaleYamlChain(
    localeIndex,
    config,
    templateParams,
    new Set()
  )
  const site = chain.site
  const { repo: _localeYamlRepo, ...localeThemeConfig } = extractThemeConfig(site)
  const mergedAuthorsList = mergeAuthorsById(sharedAuthors, chain.authors)

  // Category registry in priority order (low→high):
  // config.ts → shared site.yaml → locale _site.yaml chain + _categories.yaml
  const mergedCategories = mergeCategoriesById(
    mergeCategoriesById(configCategories, sharedCategories),
    chain.categories
  )

  // Merge socialMediaShares in priority order (low→high):
  // built-in locale → config.ts → shared site.yaml → locale _site.yaml
  const mergedSocialShares = mergeSocialMediaSharesByName(
    mergeSocialMediaSharesByName(
      mergeSocialMediaSharesByName(
        baseSocialShares,
        configSocialShares,
      ),
      sharedSocialShares,
    ),
    chain.socialMediaShares,
  )
  const rawMergedThemeConfig = deepMerge(resolvedTheme, localeThemeConfig)
  const templated = resolveLocaleTemplates(
    site,
    rawMergedThemeConfig,
    config,
    localeIndex
  )
  const templatedSite = templated.site
  const mergedThemeConfig = templated.theme
  const templateContext = {
    config,
    localeIndex,
    site: templatedSite,
    theme: mergedThemeConfig,
    t: (mergedThemeConfig.t as Record<string, unknown> | undefined) ?? {},
  }
  const authors = mergedAuthorsList.length
    ? mergedAuthorsList.map((item) => {
        const templatedAuthor = resolveConfigTemplates(item, templateContext)
        const imageDimensions = templatedAuthor.image
          ? getImageDimensions(templatedAuthor.image as string, config.srcDir || '')
          : null

        return {
          ...templatedAuthor,
          description: mdToHtml(templatedAuthor.description),
          imageHeight: imageDimensions?.height ?? templatedAuthor.imageHeight,
          imageWidth: imageDimensions?.width ?? templatedAuthor.imageWidth,
        }
      })
    : undefined

  // `name` and `slug` are materialized here rather than left to default at
  // read time, so every consumer — components, the language switcher, route
  // params — sees the same fully-resolved entry.
  const categories = mergedCategories.map((item) => {
    const templatedCategory = resolveConfigTemplates(item, templateContext)
    return {
      ...templatedCategory,
      name: templatedCategory.name || templatedCategory.id,
      slug: templatedCategory.slug || templatedCategory.id,
    }
  })

  // Published before the return so the synchronous readers in
  // `makePreviewItem` / `transformPageMeta` resolve post frontmatter against
  // the same registry the components see.
  registerCategories(config.srcDir || '', localeIndex, categories)

  const {
    lang,
    label,
    title: rawTitle,
    titleTemplate,
    description,
    dir: rawDir,
  } = templatedSite
  const title = rawTitle
  const resolvedRepo = mergedThemeConfig.repo as string | undefined

  return {
    lang: typeof lang === 'string' ? lang : undefined,
    dir: typeof rawDir === 'string' ? (rawDir as 'ltr' | 'rtl' | 'auto') : baseLocale.dir,
    label: typeof label === 'string' ? label : baseLocale.label,
    title: typeof title === 'string' ? title : undefined,
    titleTemplate:
      typeof titleTemplate === 'string' || typeof titleTemplate === 'boolean'
        ? titleTemplate
        : undefined,
    description: typeof description === 'string' ? description : undefined,
    themeConfig: {
      ...mergedThemeConfig,
      editLink: {
        ...(resolvedRepo
          ? { pattern: resolveEditLinkPattern(resolvedRepo) }
          : {}),
        ...(mergedThemeConfig.editLink as Record<string, unknown> | undefined),
        ...(
          extractThemeConfig(templatedSite).editLink as
            | Record<string, unknown>
            | undefined
        ),
      } as EditLinkConfig,
      t: {
        ...((mergedThemeConfig.t || {}) as Record<string, unknown>),
        ...((extractThemeConfig(templatedSite).t || {}) as Record<string, unknown>),
      } as unknown as I18nTranslations,
      authors,
      ...(categories.length > 0 ? { categories } : {}),
      ...(mergedSocialShares.length > 0
        ? {
            socialMediaShares: resolveConfigTemplates(
              mergedSocialShares,
              templateContext
            )
          }
        : {}),
    },
  }
}
/**
 * Auto-discovers every content locale under `config.srcDir` and builds the
 * `locales` map for VitePress.
 *
 * Low-level helper for manually composing locale discovery. Most applications
 * should use `defineBlogConfig` instead:
 *
 * ```ts
 * return defineBlogConfig({
 *   ...config,
 *   locales: await autoLoadLocales(config),
 * })
 * ```
 */
export async function autoLoadLocales(
  config: BlogUserConfig
): Promise<Record<string, LocaleEntry>> {
  return autoLoadLocalesFactory({
    config,
    loadLocale: loadBlogLocale,
    logPrefix: '[vitepress-theme-neptu]',
  })
}
