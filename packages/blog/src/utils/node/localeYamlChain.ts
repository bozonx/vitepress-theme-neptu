import { deepMerge } from '../shared/merge.ts'

/**
 * Result of loading a locale's `_site.yaml` extends chain.
 *
 * `site` is the deep-merged config with `extends` stripped. `extra` holds
 * package-specific data extracted at each step (e.g. authors and social shares
 * for the blog, nothing for the landing).
 */
export interface LocaleYamlChainResult<TExtra> {
  site: Record<string, unknown>
  extra: TExtra
}

export interface LoadLocaleYamlChainOptions<TExtra> {
  /** Source directory (config.srcDir). */
  srcDir: string
  /** Template substitution params for the current locale. */
  templateParams: Record<string, unknown>
  /** Already-visited locale indexes for cycle detection. */
  visited: Set<string>
  /** Parses `<srcDir>/<localeIndex>/_site.{ts,yaml}` into a raw object. */
  parseLocale: (
    srcDir: string,
    params: Record<string, unknown>
  ) => Promise<Record<string, unknown>>
  /** Prefix for console warnings, e.g. `[vitepress-theme-neptu]`. */
  logPrefix: string
  /**
   * Transforms the raw parsed site into the portion that goes through
   * `deepMerge` plus any extra data to carry alongside. This is where the
   * blog strips `authors` / `socialMediaShares` so they are merged by id/name
   * instead of by deep-merge.
   */
  prepareSite: (rawSite: Record<string, unknown>) => Promise<{
    site: Record<string, unknown>
    extra: TExtra
  }> | {
    site: Record<string, unknown>
    extra: TExtra
  }
  /** Merges extra data from a parent step with the current step. */
  mergeExtra: (parent: TExtra, current: TExtra) => TExtra
  /** Extra value returned when a cycle is detected. */
  defaultExtra: TExtra
}

/**
 * Recursively loads `<locale>/_site.yaml` following any `extends:` reference,
 * with cycle detection.
 *
 * Generic factory used by both blog and landing themes. The blog provides
 * `prepareSite` / `mergeExtra` hooks that strip and merge `authors` and
 * `socialMediaShares`; the landing uses identity hooks.
 */
export async function loadLocaleYamlChain<TExtra>(
  localeIndex: string,
  options: LoadLocaleYamlChainOptions<TExtra>
): Promise<LocaleYamlChainResult<TExtra>> {
  const {
    srcDir,
    templateParams,
    visited,
    parseLocale,
    logPrefix,
    prepareSite,
    mergeExtra,
    defaultExtra,
  } = options

  if (visited.has(localeIndex)) {
    const chain = [...visited, localeIndex].join(' -> ')
    console.warn(
      `${logPrefix} Cycle detected in _site.yaml \`extends\` chain: ${chain}`
    )
    return { site: {}, extra: defaultExtra }
  }
  const nextVisited = new Set(visited).add(localeIndex)

  const localeParams = { ...templateParams, localeIndex }
  const rawSite = await parseLocale(srcDir, localeParams)

  const { site: preparedSite, extra: currentExtra } = await prepareSite(rawSite)

  const extendsKey =
    typeof preparedSite.extends === 'string'
      ? (preparedSite.extends as string)
      : null
  const { extends: _extends, ...siteRest } = preparedSite

  if (extendsKey) {
    const parent = await loadLocaleYamlChain(extendsKey, {
      ...options,
      visited: nextVisited,
    })
    return {
      site: deepMerge(parent.site, siteRest) as Record<string, unknown>,
      extra: mergeExtra(parent.extra, currentExtra),
    }
  }

  return { site: siteRest, extra: currentExtra }
}
