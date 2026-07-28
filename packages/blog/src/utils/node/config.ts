import { deepMerge } from '../shared/merge.ts'
import { mergeAuthorsById } from '../shared/mergeStrategy.ts'
import { extractThemeConfig } from '../shared/configHelpers.ts'
import { autoLoadLocalesFactory, type LocaleEntry } from './autoLoadLocales.ts'
import {
  parseLocaleSite,
  parseSharedSite,
  parseLocaleAuthors,
} from './i18n.ts'
import { mdToHtml } from './markdown.ts'
import { getImageDimensions } from './image.ts'
import { resolveBaseLocaleKey } from '../shared/i18n.ts'
import { common as blogCommon } from '../../configs/blogConfigBase.ts'
import blogBaseLocales from '../../configs/blogLocalesBase/index.ts'
import { resolveEditLinkPattern } from './editLink.ts'
import type {
  LocaleDefinition,
  Author,
  BlogUserConfig,
  ThemeConfig,
  I18n,
} from '../../types.d.ts'

type EditLinkConfig = NonNullable<ThemeConfig['editLink']>

/**
 * Removes `authors` from a nested `themeConfig` so that generic deep-merge
 * does not touch authors — they are merged separately with a by-id strategy.
 */
function stripThemeAuthors(
  site: Record<string, unknown>
): { site: Record<string, unknown>; authors: Author[] } {
  const themeConfig = extractThemeConfig(site)
  const { authors: themeAuthors, ...themeConfigRest } = themeConfig as {
    authors?: Author[]
    [key: string]: unknown
  }
  const { themeConfig: _tc, ...siteRest } = site
  return {
    site:
      Object.keys(themeConfigRest).length > 0
        ? { ...siteRest, themeConfig: themeConfigRest }
        : siteRest,
    authors: Array.isArray(themeAuthors) ? (themeAuthors as Author[]) : [],
  }
}

interface LocaleYamlChain {
  /** Merged `_site.yaml` payload with `authors` stripped and `extends` resolved. */
  site: Record<string, unknown>
  /** Merged authors list from every step of the `extends` chain. */
  authors: Author[]
}

/**
 * Recursively loads `<locale>/_site.yaml` following any `extends:` reference,
 * with cycle detection. Authors from `_site.yaml themeConfig.authors` and
 * `_authors.yaml` are combined at each step (local `_authors.yaml` wins over
 * local `_site.yaml themeConfig.authors`), then merged across the chain with
 * the by-id strategy.
 */
async function loadLocaleYamlChain(
  localeIndex: string,
  config: BlogUserConfig,
  templateParams: Record<string, unknown>,
  visited: Set<string>
): Promise<LocaleYamlChain> {
  if (visited.has(localeIndex)) {
    const chain = [...visited, localeIndex].join(' -> ')
    console.warn(
      `[vitepress-theme-neptu-blog] Cycle detected in _site.yaml \`extends\` chain: ${chain}`
    )
    return { site: {}, authors: [] }
  }
  const nextVisited = new Set(visited).add(localeIndex)

  const srcDir = config.srcDir || ''
  const localeParams = { ...templateParams, localeIndex }

  const rawSite = (await parseLocaleSite(srcDir, localeParams)) as Record<
    string,
    unknown
  >
  const { site: siteWithoutAuthors, authors: siteAuthors } = stripThemeAuthors(rawSite)
  const authorsFile = (await parseLocaleAuthors(srcDir, localeParams)) as Author[]
  const currentAuthors = mergeAuthorsById(siteAuthors, authorsFile)

  const extendsKey =
    typeof siteWithoutAuthors.extends === 'string'
      ? (siteWithoutAuthors.extends as string)
      : null
  const { extends: _extends, ...siteRest } = siteWithoutAuthors

  if (extendsKey) {
    const parent = await loadLocaleYamlChain(
      extendsKey,
      config,
      templateParams,
      nextVisited
    )
    return {
      site: deepMerge(parent.site, siteRest),
      authors: mergeAuthorsById(parent.authors, currentAuthors),
    }
  }

  return { site: siteRest, authors: currentAuthors }
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
  const builtInTheme = deepMerge(
    (blogCommon.themeConfig || {}) as Record<string, unknown>,
    {
      ...(baseLocale.themeConfig || {}),
      t: { ...baseLocale.t },
    }
  )
  const sharedThemeBaseForTemplate = deepMerge(
    builtInTheme,
    (config.themeConfig || {}) as Record<string, unknown>
  )
  const sharedSite = (await parseSharedSite(config.srcDir || '', {
    localeIndex,
    config,
    theme: sharedThemeBaseForTemplate,
    t: (sharedThemeBaseForTemplate.t as Record<string, unknown> | undefined) ?? {},
  })) as Record<string, unknown>
  const { site: sharedSiteSanitized, authors: sharedAuthors } =
    stripThemeAuthors(sharedSite)
  const sharedThemeConfig = extractThemeConfig(sharedSiteSanitized)

  const resolvedTheme = deepMerge(sharedThemeBaseForTemplate, sharedThemeConfig)
  const templateParams = {
    config,
    theme: resolvedTheme,
    t: (resolvedTheme as Record<string, unknown>).t as Record<string, unknown>,
  }

  const chain = await loadLocaleYamlChain(
    localeIndex,
    config,
    templateParams,
    new Set()
  )
  const site = chain.site
  const {
    lang,
    title: rawTitle,
    titleTemplate,
    description,
  } = site
  const localeThemeConfig = extractThemeConfig(site)
  const mergedAuthorsList = mergeAuthorsById(sharedAuthors, chain.authors)
  const authors = mergedAuthorsList.length
    ? mergedAuthorsList.map((item) => {
        const imageDimensions = item.image
          ? getImageDimensions(item.image as string, config.srcDir || '')
          : null

        return {
          ...item,
          description: mdToHtml(item.description),
          imageHeight: imageDimensions?.height,
          imageWidth: imageDimensions?.width,
        }
      })
    : undefined

  const mergedThemeConfig = deepMerge(resolvedTheme, localeThemeConfig)
  const title =
    rawTitle ?? (mergedThemeConfig.blogTitle as string | undefined)
  const resolvedRepo = mergedThemeConfig.repo as string | undefined

  return {
    lang: typeof lang === 'string' ? lang : undefined,
    label: baseLocale.label,
    title: typeof title === 'string' ? title : undefined,
    titleTemplate: typeof titleTemplate === 'string' ? titleTemplate : undefined,
    description: typeof description === 'string' ? description : undefined,
    themeConfig: {
      ...mergedThemeConfig,
      editLink: {
        ...(resolvedRepo
          ? { pattern: resolveEditLinkPattern(resolvedRepo) }
          : {}),
        ...(mergedThemeConfig.editLink as Record<string, unknown> | undefined),
        ...(localeThemeConfig.editLink as Record<string, unknown> | undefined),
      } as EditLinkConfig,
      t: {
        ...((mergedThemeConfig.t || {}) as Record<string, unknown>),
        ...((localeThemeConfig.t || {}) as Record<string, unknown>),
      } as unknown as I18n,
      authors,
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
    logPrefix: '[vitepress-theme-neptu-blog]',
  })
}
