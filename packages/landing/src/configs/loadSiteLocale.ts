import fs from 'node:fs'
import {
  parseLocaleSite,
  parseSharedSite,
  hasLocaleSite,
} from 'vitepress-theme-neptu-blog/utils/node'
import {
  standardTemplate,
  isExternalUrl,
  deepMerge,
  resolveBaseLocaleKey,
} from 'vitepress-theme-neptu-blog/utils'
import { resolveEditLinkPattern } from 'vitepress-theme-neptu-blog/utils/node'
import type {
  LocaleDefinition,
  LandingUserConfig,
  ThemeConfig,
  I18n,
} from '../types.d.ts'
import siteBaseLocales from './siteLocalesBase/index.ts'
import { common as siteCommon } from './siteConfigBase.ts'

type SiteLocaleEntry = LocaleDefinition & { label?: string }
type EditLinkConfig = NonNullable<ThemeConfig['editLink']>

const localeMap = siteBaseLocales as unknown as Record<string, SiteLocaleEntry>

/**
 * Extracts the `themeConfig` block from a site YAML payload.
 */
function extractThemeConfig(
  site: Record<string, unknown> | undefined
): Record<string, unknown> {
  return (site?.themeConfig as Record<string, unknown> | undefined) ?? {}
}

interface LocaleYamlChain {
  /** Merged `_site.yaml` payload with `extends` resolved. */
  site: Record<string, unknown>
}

/**
 * Recursively loads `<locale>/_site.yaml` following any `extends:` reference,
 * with cycle detection.
 */
async function loadLocaleYamlChain(
  localeIndex: string,
  config: LandingUserConfig,
  templateParams: Record<string, unknown>,
  visited: Set<string>
): Promise<LocaleYamlChain> {
  if (visited.has(localeIndex)) {
    const chain = [...visited, localeIndex].join(' -> ')
    console.warn(
      `[vitepress-theme-neptu-landing] Cycle detected in _site.yaml \`extends\` chain: ${chain}`
    )
    return { site: {} }
  }
  const nextVisited = new Set(visited).add(localeIndex)

  const localeParams = { ...templateParams, localeIndex }
  const rawSite = (await parseLocaleSite(
    config.srcDir || '',
    localeParams
  )) as Record<string, unknown>

  const extendsKey =
    typeof rawSite.extends === 'string' ? (rawSite.extends as string) : null
  const { extends: _extends, ...siteRest } = rawSite

  if (extendsKey) {
    const parent = await loadLocaleYamlChain(
      extendsKey,
      config,
      templateParams,
      nextVisited
    )
    return {
      site: deepMerge(parent.site, siteRest),
    }
  }

  return { site: siteRest }
}

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

  function menuRecursive(items: unknown[], linkPrePath: string): unknown[] {
    for (const item of items) {
      const typedItem = item as Record<string, unknown>
      if (typeof typedItem.text === 'string') {
        typedItem.text = standardTemplate(typedItem.text, params)
      }

      if (typeof typedItem.link === 'string') {
        typedItem.link = standardTemplate(typedItem.link, params)

        const link = typedItem.link as string
        if (
          link.indexOf('/') !== 0 &&
          !isExternalUrl(link)
        ) {
          typedItem.link = linkPrePath + link
        }
      }

      if (Array.isArray(typedItem.items)) {
        typedItem.items = menuRecursive(typedItem.items, linkPrePath)
      }
    }

    return items
  }

  const newSidebar: Record<string, unknown> = {}

  for (const key of Object.keys(sidebar)) {
    const linkPrePath = `/${params.localeIndex}/${key}/`
    newSidebar[linkPrePath] = menuRecursive(sidebar[key]!, linkPrePath)
  }

  return newSidebar
}

/**
 * Builds a VitePress `LocaleConfig` for a single content locale by merging
 * every admin-editable and developer-provided layer in priority order:
 *
 *   built-in theme defaults (siteCommon)
 *     → built-in content-locale defaults (`siteLocalesBase[*]`)
 *       → config.ts (`LandingUserConfig.themeConfig`)
 *         → `<srcDir>/site.yaml` (cross-locale admin)
 *           → `<srcDir>/<localeIndex>/_site.yaml` extends chain
 *
 * Prefer `defineLandingConfig` in application code; this function
 * is the lower-level primitive and is re-exported for advanced usage.
 */
export async function loadSiteLocale(
  localeIndex: string,
  config: LandingUserConfig
): Promise<SiteLocaleEntry> {
  const baseLocaleKey = resolveBaseLocaleKey(localeIndex, localeMap)
  const baseLocale = localeMap[baseLocaleKey]

  // ------------------------------------------------------------------
  // Shared <srcDir>/site.yaml — admin-editable layer applied to every
  // locale. Sits between config.ts and per-locale YAML in priority.
  // ------------------------------------------------------------------
  const sharedThemeBaseForTemplate = {
    ...((siteCommon.themeConfig || {}) as Record<string, unknown>),
    ...((config.themeConfig || {}) as Record<string, unknown>),
  }
  const sharedSite = (await parseSharedSite(config.srcDir || '', {
    localeIndex,
    config,
    theme: sharedThemeBaseForTemplate,
    t: (sharedThemeBaseForTemplate.t as Record<string, unknown> | undefined) ?? {},
  })) as Record<string, unknown>
  const sharedThemeConfig = extractThemeConfig(sharedSite)

  const resolvedTheme = deepMerge(
    deepMerge(sharedThemeBaseForTemplate, sharedThemeConfig),
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
  const title =
    (rawTitle as string | undefined) ??
    (localeThemeConfig.blogTitle as string | undefined) ??
    (sharedThemeConfig.blogTitle as string | undefined)

  // ------------------------------------------------------------------
  // Merge themeConfig layers: baseLocale → shared → locale
  // ------------------------------------------------------------------
  const mergedThemeConfig = deepMerge(
    deepMerge(
      (baseLocale.themeConfig || {}) as Record<string, unknown>,
      sharedThemeConfig
    ),
    localeThemeConfig
  )

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
    label: baseLocale.label,
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
      } as unknown as I18n,
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
 */
export async function autoLoadSiteLocales(
  config: LandingUserConfig
): Promise<Record<string, SiteLocaleEntry>> {
  const srcDir = config.srcDir || ''
  if (!srcDir) {
    console.warn(
      '[vitepress-theme-neptu-landing] autoLoadSiteLocales: `srcDir` is not set; no locales discovered.'
    )
    return {}
  }

  if (!fs.existsSync(srcDir)) {
    console.warn(
      `[vitepress-theme-neptu-landing] autoLoadSiteLocales: \`srcDir\` does not exist: ${srcDir}`
    )
    return {}
  }

  const entries = await fs.promises.readdir(srcDir, { withFileTypes: true })
  const candidates = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith('.') && !name.startsWith('_'))
    .sort()

  const locales: Record<string, SiteLocaleEntry> = {}
  for (const name of candidates) {
    if (!hasLocaleSite(srcDir, name)) continue
    locales[name] = await loadSiteLocale(name, config)
  }

  if (Object.keys(locales).length === 0) {
    console.warn(
      `[vitepress-theme-neptu-landing] autoLoadSiteLocales: no folders with \`_site.yaml\` or \`_site.ts\` found under ${srcDir}.`
    )
  }

  return locales
}
