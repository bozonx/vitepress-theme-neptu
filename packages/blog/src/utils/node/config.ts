import { deepMerge } from '../shared/merge.ts'
import { mergeAuthorsById, mergeSocialMediaSharesByName } from '../shared/mergeStrategy.ts'
import { extractThemeConfig } from '../shared/configHelpers.ts'
import { autoLoadLocalesFactory, type LocaleEntry } from './autoLoadLocales.ts'
import {
  parseLocaleSite,
  parseSharedSite,
  parseLocaleAuthors,
  resolveConfigTemplates,
} from './i18n.ts'
import { loadLocaleYamlChain } from './localeYamlChain.ts'
import { mdToHtml } from './markdown.ts'
import { getImageDimensions } from './image.ts'
import { resolveBaseLocaleKey } from '../shared/i18n.ts'
import { common as blogCommon } from '../../configs/blogConfigBase.ts'
import blogBaseLocales from '../../configs/blogLocalesBase/index.ts'
import { resolveEditLinkPattern } from './editLink.ts'
import type {
  LocaleDefinition,
  Author,
  SocialMediaShare,
  BlogUserConfig,
  ThemeConfig,
  I18n,
} from '../../types.d.ts'

type EditLinkConfig = NonNullable<ThemeConfig['editLink']>

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
    if (
      JSON.stringify(nextSite) === JSON.stringify(resolvedSite) &&
      JSON.stringify(nextTheme) === JSON.stringify(resolvedTheme)
    ) {
      break
    }
    resolvedSite = nextSite
    resolvedTheme = nextTheme
  }

  return { site: resolvedSite, theme: resolvedTheme }
}

/**
 * Removes `authors` and `socialMediaShares` from a nested `themeConfig` so
 * that generic deep-merge does not touch them — they are merged separately
 * with by-id / by-name strategies.
 */
function stripThemeArrays(
  site: Record<string, unknown>
): {
  site: Record<string, unknown>
  authors: Author[]
  socialShares: SocialMediaShare[]
} {
  const themeConfig = extractThemeConfig(site)
  const {
    authors: themeAuthors,
    socialMediaShares: themeSocialShares,
    ...themeConfigRest
  } = themeConfig as {
    authors?: Author[]
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
    socialShares: Array.isArray(themeSocialShares)
      ? (themeSocialShares as SocialMediaShare[])
      : [],
  }
}

interface LocaleYamlChain {
  /** Merged `_site.yaml` payload with `authors`/`socialMediaShares` stripped and `extends` resolved. */
  site: Record<string, unknown>
  /** Merged authors list from every step of the `extends` chain. */
  authors: Author[]
  /** Merged socialMediaShares list from every step of the `extends` chain. */
  socialShares: SocialMediaShare[]
}

/**
 * Blog-specific adapter for the shared `loadLocaleYamlChain` factory.
 *
 * Authors from `_site.yaml themeConfig.authors` and `_authors.yaml` are
 * combined at each step (local `_authors.yaml` wins over local `_site.yaml
 * themeConfig.authors`), then merged across the chain with the by-id strategy.
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
    socialShares: SocialMediaShare[]
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
      const { site: siteWithoutArrays, authors: siteAuthors, socialShares } =
        stripThemeArrays(rawSite)
      const localeParams = { ...templateParams, localeIndex }
      const authorsFile = (await parseLocaleAuthors(srcDir, localeParams)) as Author[]
      return {
        site: siteWithoutArrays,
        extra: {
          authors: mergeAuthorsById(siteAuthors, authorsFile),
          socialShares,
        },
      }
    },
    mergeExtra: (parent, current) => ({
      authors: mergeAuthorsById(parent.authors, current.authors),
      socialShares: mergeSocialMediaSharesByName(
        parent.socialShares,
        current.socialShares
      ),
    }),
    defaultExtra: { authors: [], socialShares: [] },
  })

  return {
    site: result.site,
    authors: result.extra.authors,
    socialShares: result.extra.socialShares,
  }
}

/**
 * Builds a VitePress `LocaleConfig` for a single content locale by merging
 * every admin-editable and developer-provided layer in priority order:
 *
 *   built-in theme defaults (blogCommon)
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
  // Template substitution context uses common+config defaults so that
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
    ...configThemeRest
  } = (config.themeConfig || {}) as {
    socialMediaShares?: SocialMediaShare[]
    [key: string]: unknown
  }

  const builtInTheme = deepMerge(
    (blogCommon.themeConfig || {}) as Record<string, unknown>,
    {
      ...baseLocaleThemeRest,
      t: { ...baseLocale.t },
    }
  )
  const sharedThemeBaseForTemplate = deepMerge(
    builtInTheme,
    configThemeRest as Record<string, unknown>
  )
  const sharedSite = (await parseSharedSite(config.srcDir || '', {
    localeIndex,
    config,
    theme: sharedThemeBaseForTemplate,
    t: (sharedThemeBaseForTemplate.t as Record<string, unknown> | undefined) ?? {},
  })) as Record<string, unknown>
  const { site: sharedSiteSanitized, authors: sharedAuthors, socialShares: sharedSocialShares } =
    stripThemeArrays(sharedSite)
  const { repo: _sharedYamlRepo, ...sharedThemeConfig } = extractThemeConfig(sharedSiteSanitized)

  const resolvedTheme = deepMerge(sharedThemeBaseForTemplate, sharedThemeConfig)
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
    chain.socialShares,
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

  const {
    lang,
    label,
    title: rawTitle,
    titleTemplate,
    description,
  } = templatedSite
  const title = rawTitle
  const resolvedRepo = mergedThemeConfig.repo as string | undefined

  return {
    lang: typeof lang === 'string' ? lang : undefined,
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
      } as unknown as I18n,
      authors,
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
