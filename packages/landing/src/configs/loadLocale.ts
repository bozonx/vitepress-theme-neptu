import {
  parseLocaleSite,
  parseSharedSite,
} from 'vitepress-theme-neptu/utils/node'
import {
  interpolateDollarTemplate,
  isExternalUrl,
  deepMerge,
  resolveBaseLocaleKey,
  extractThemeConfig,
} from 'vitepress-theme-neptu/utils'
import {
  resolveEditLinkPattern,
  autoLoadLocalesFactory,
  loadLocaleYamlChain,
  type LocaleEntry,
} from 'vitepress-theme-neptu/utils/node'
import type {
  LandingUserConfig,
  ThemeConfig,
  I18nTranslations,
} from '../types.d.ts'
import siteBaseLocales from './landingLocalesBase/index.ts'
import { landingBaseConfig as siteCommon } from './landingConfigBase.ts'

type SiteLocaleEntry = LocaleEntry
type EditLinkConfig = NonNullable<ThemeConfig['editLink']>

const localeMap = siteBaseLocales as unknown as Record<string, SiteLocaleEntry>

/**
 * Processes a VitePress sidebar config (keyed by section name) by applying
 * template substitution to text/link fields and prefixing relative links
 * with the locale path.
 */
function processSidebar(
  sidebar: Record<string, unknown[]> | undefined,
  params: Record<string, unknown>
): Record<string, unknown> {
  if (!sidebar) return {}

  function processSidebarItems(items: unknown[], linkPrePath: string): unknown[] {
    for (const item of items) {
      const typedItem = item as Record<string, unknown>
      if (typeof typedItem.text === 'string') {
        typedItem.text = interpolateDollarTemplate(typedItem.text, params)
      }

      if (typeof typedItem.link === 'string') {
        typedItem.link = interpolateDollarTemplate(typedItem.link, params)

        const link = typedItem.link as string
        if (
          link.indexOf('/') !== 0 &&
          !isExternalUrl(link)
        ) {
          typedItem.link = linkPrePath + link
        }
      }

      if (Array.isArray(typedItem.items)) {
        typedItem.items = processSidebarItems(typedItem.items, linkPrePath)
      }
    }

    return items
  }

  const newSidebar: Record<string, unknown> = {}

  for (const key of Object.keys(sidebar)) {
    const linkPrePath = `/${params.localeIndex}/${key}/`
    newSidebar[linkPrePath] = processSidebarItems(sidebar[key]!, linkPrePath)
  }

  return newSidebar
}

/**
 * Builds a VitePress `LocaleConfig` for a single content locale by merging
 * every admin-editable and developer-provided layer in priority order:
 *
 *   built-in theme defaults (siteCommon)
 *     → built-in content-locale defaults (`landingLocalesBase[*]`)
 *       → config.ts (`LandingUserConfig.themeConfig`)
 *         → `<srcDir>/site.yaml` (cross-locale admin)
 *           → `<srcDir>/<localeIndex>/_site.yaml` extends chain
 *
 * Prefer `defineLandingConfig` in application code; this function
 * is the lower-level primitive and is re-exported for advanced usage.
 */
export async function loadLocale(
  localeIndex: string,
  config: LandingUserConfig
): Promise<SiteLocaleEntry> {
  const baseLocaleKey = resolveBaseLocaleKey(localeIndex, localeMap)
  const baseLocale = localeMap[baseLocaleKey]

  // ------------------------------------------------------------------
  // Shared <srcDir>/site.yaml — admin-editable layer applied to every
  // locale. Sits between config.ts and per-locale YAML in priority.
  // ------------------------------------------------------------------
  const themeForTemplates = {
    ...((siteCommon.themeConfig || {}) as Record<string, unknown>),
    ...((config.themeConfig || {}) as Record<string, unknown>),
  }
  const sharedSite = (await parseSharedSite(config.srcDir || '', {
    localeIndex,
    config,
    theme: themeForTemplates,
    t: (themeForTemplates.t as Record<string, unknown> | undefined) ?? {},
  })) as Record<string, unknown>
  const { repo: _sharedYamlRepo, ...sharedThemeConfig } = extractThemeConfig(sharedSite)

  const resolvedTheme = deepMerge(
    deepMerge(themeForTemplates, sharedThemeConfig),
    {
      ...((baseLocale.themeConfig || {}) as Record<string, unknown>),
      t: { ...((baseLocale.t || {}) as Record<string, unknown>) },
    }
  )
  const templateParams = {
    config,
    theme: resolvedTheme,
    t: (resolvedTheme as Record<string, unknown>).t as Record<string, unknown>,
  }

  // ------------------------------------------------------------------
  // Per-locale <srcDir>/<localeIndex>/_site.yaml (with extends chain)
  // ------------------------------------------------------------------
  const chain = await loadLocaleYamlChain<undefined>(localeIndex, {
    srcDir: config.srcDir || '',
    templateParams,
    visited: new Set(),
    parseLocale: parseLocaleSite as (
      srcDir: string,
      params: Record<string, unknown>
    ) => Promise<Record<string, unknown>>,
    logPrefix: '[vitepress-theme-neptu-landing]',
    prepareSite: (rawSite) => ({ site: rawSite, extra: undefined }),
    mergeExtra: () => undefined,
    defaultExtra: undefined,
  })
  const site = chain.site
  const {
    lang,
    label,
    title: rawTitle,
    titleTemplate,
    description,
  } = site
  const { repo: _localeYamlRepo, ...localeThemeConfig } = extractThemeConfig(site)
  const title = rawTitle as string | undefined

  // ------------------------------------------------------------------
  // Merge themeConfig layers: baseLocale → shared → locale
  // ------------------------------------------------------------------
  const mergedThemeConfig = deepMerge(resolvedTheme, localeThemeConfig)

  // Process sidebar: template substitution + link prefixing
  const { sidebar: rawSidebar, ...themeConfigRest } = mergedThemeConfig as {
    sidebar?: Record<string, unknown[]>
    [key: string]: unknown
  }
  const sidebar = processSidebar(rawSidebar, {
    ...templateParams,
    localeIndex,
  })

  return {
    lang: typeof lang === 'string' ? lang : undefined,
    label: typeof label === 'string' ? label : baseLocale.label,
    title: typeof title === 'string' ? title : undefined,
    titleTemplate:
      typeof titleTemplate === 'string' ? titleTemplate : undefined,
    description: typeof description === 'string' ? description : undefined,
    themeConfig: {
      ...themeConfigRest,
      editLink: {
        ...(config.themeConfig?.repo
          ? { pattern: resolveEditLinkPattern(config.themeConfig.repo) }
          : {}),
        ...((baseLocale.themeConfig?.editLink || {}) as Record<string, unknown>),
        ...((sharedThemeConfig.editLink || {}) as Record<string, unknown>),
        ...((localeThemeConfig.editLink || {}) as Record<string, unknown>),
      } as EditLinkConfig,
      t: {
        ...((baseLocale.t || {}) as Record<string, unknown>),
        ...((sharedThemeConfig.t || {}) as Record<string, unknown>),
        ...((localeThemeConfig.t || {}) as Record<string, unknown>),
      } as unknown as I18nTranslations,
      sidebar,
    },
  }
}

/**
 * Auto-discovers every content locale under `config.srcDir` and builds the
 * `locales` map for VitePress.
 *
 * A folder `<srcDir>/<name>/` qualifies as a locale when it contains
 * `_site.yaml` or `_site.ts`. Folder names starting with `.` or `_` are
 * skipped. Results are returned sorted alphabetically by locale key.
 * This locale directory is required even for a single-language Neptu site;
 * root-level content is reserved for the language selector.
 */
export async function autoLoadLocales(
  config: LandingUserConfig
): Promise<Record<string, SiteLocaleEntry>> {
  return autoLoadLocalesFactory({
    config,
    loadLocale: loadLocale,
    logPrefix: '[vitepress-theme-neptu-landing]',
  })
}
