import fs from 'node:fs'
import { deepMerge } from '../shared/merge.ts'
import { mergeAuthorsById } from '../shared/mergeStrategy.ts'
import {
  parseLocaleSite,
  parseSharedSite,
  parseLocaleAuthors,
  hasLocaleSite,
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
 * Extracts the `themeConfig` block from a site YAML payload.
 *
 * Both `<srcDir>/site.yaml` (shared) and `<srcDir>/<locale>/_site.yaml`
 * (per-locale) follow the canonical `Partial<BlogUserConfig>` shape:
 * top-level keys for VitePress identity (`lang`, `title`, `titleTemplate`,
 * `description`, `extends`) and a nested `themeConfig:` block for the rest.
 */
function extractThemeConfig(
  site: Record<string, unknown> | undefined
): Record<string, unknown> {
  return (site?.themeConfig as Record<string, unknown> | undefined) ?? {}
}

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
  const sharedThemeBaseForTemplate = {
    ...(blogCommon.themeConfig || {}),
    ...(config.themeConfig || {}),
  } as Record<string, unknown>
  const sharedSite = (await parseSharedSite(config.srcDir || '', {
    localeIndex,
    config,
    theme: sharedThemeBaseForTemplate,
    t: (sharedThemeBaseForTemplate.t as Record<string, unknown> | undefined) ?? {},
  })) as Record<string, unknown>
  const { site: sharedSiteSanitized, authors: sharedAuthors } =
    stripThemeAuthors(sharedSite)
  const sharedThemeConfig = extractThemeConfig(sharedSiteSanitized)

  const resolvedTheme = deepMerge(
    deepMerge(sharedThemeBaseForTemplate, sharedThemeConfig),
    {
      ...(baseLocale.themeConfig || {}),
      t: { ...baseLocale.t },
    }
  )
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
  const title =
    rawTitle ??
    (localeThemeConfig.blogTitle as string | undefined) ??
    (sharedThemeConfig.blogTitle as string | undefined)

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

  const mergedThemeConfig = deepMerge(
    deepMerge(
      (baseLocale.themeConfig || {}) as Record<string, unknown>,
      sharedThemeConfig
    ),
    localeThemeConfig
  )

  return {
    lang: typeof lang === 'string' ? lang : undefined,
    label: baseLocale.label,
    title: typeof title === 'string' ? title : undefined,
    titleTemplate: typeof titleTemplate === 'string' ? titleTemplate : undefined,
    description: typeof description === 'string' ? description : undefined,
    themeConfig: {
      ...mergedThemeConfig,
      editLink: {
        ...(config.themeConfig?.repo
          ? { pattern: resolveEditLinkPattern(config.themeConfig.repo) }
          : {}),
        ...baseLocale.themeConfig?.editLink,
        ...(sharedThemeConfig.editLink as Record<string, unknown> | undefined),
        ...(localeThemeConfig.editLink as Record<string, unknown> | undefined),
      } as EditLinkConfig,
      t: {
        ...baseLocale.t,
        ...((sharedThemeConfig.t || {}) as Record<string, unknown>),
        ...((localeThemeConfig.t || {}) as Record<string, unknown>),
      } as I18n,
      authors,
    },
  }
}

/**
 * Auto-discovers every content locale under `config.srcDir` and builds the
 * `locales` map for VitePress.
 *
 * A folder `<srcDir>/<name>/` qualifies as a locale when it contains
 * `_site.yaml` or `_site.ts`. Folder names starting with `.` or `_` are
 * skipped so that VitePress-internal and theme-internal folders are never
 * mis-detected as locales. Results are returned sorted alphabetically by
 * locale key for stable build output.
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
): Promise<Record<string, LocaleDefinition & { label?: string }>> {
  const srcDir = config.srcDir || ''
  if (!srcDir) {
    console.warn(
      '[vitepress-theme-neptu-blog] autoLoadLocales: `srcDir` is not set; no locales discovered.'
    )
    return {}
  }

  if (!fs.existsSync(srcDir)) {
    console.warn(
      `[vitepress-theme-neptu-blog] autoLoadLocales: \`srcDir\` does not exist: ${srcDir}`
    )
    return {}
  }

  const entries = await fs.promises.readdir(srcDir, { withFileTypes: true })
  const candidates = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith('.') && !name.startsWith('_'))
    .sort()

  const locales: Record<string, LocaleDefinition & { label?: string }> = {}
  for (const name of candidates) {
    if (!hasLocaleSite(srcDir, name)) continue
    locales[name] = await loadBlogLocale(name, config)
  }

  if (Object.keys(locales).length === 0) {
    console.warn(
      `[vitepress-theme-neptu-blog] autoLoadLocales: no folders with \`_site.yaml\` or \`_site.ts\` found under ${srcDir}.`
    )
  }

  return locales
}
