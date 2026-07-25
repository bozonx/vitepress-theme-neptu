import {
  parseLocaleSite,
  parseSharedSite,
} from 'vitepress-theme-neptu-blog/utils/node'
import {
  standardTemplate,
  isExternalUrl,
  deepMerge,
} from 'vitepress-theme-neptu-blog/utils'
import siteEn from './siteLocalesBase/en.ts'
import siteRu from './siteLocalesBase/ru.ts'

const siteBaseLocales: Record<string, any> = { en: siteEn, ru: siteRu }

export async function loadSiteLocale(
  localeIndex: string,
  config: any
): Promise<any> {
  const baseLocale = siteBaseLocales[localeIndex]
  const params = {
    localeIndex,
    config,
    theme: { ...(baseLocale.themeConfig || {}), ...config.themeConfig },
    t: baseLocale.t,
  }

  // Load shared (<srcDir>/site.yaml) and per-locale (<srcDir>/<locale>/_site.yaml) configs
  const sharedSite = (await parseSharedSite(config.srcDir, params)) as any
  const localeSite = (await parseLocaleSite(config.srcDir, params)) as any

  // Merge: shared site → per-locale site
  const site = deepMerge(sharedSite || {}, localeSite || {})

  const {
    lang,
    title,
    description,
    search,
    themeConfig: rawThemeConfig = {},
  } = site

  const {
    t,
    editLink,
    lastUpdated,
    sidebar: rawSidebar,
    ...themeConfig
  } = rawThemeConfig

  // Process VitePress sidebar: template substitution + link prefixing
  const sidebar = processSidebar(rawSidebar, params)

  return {
    lang,
    label: baseLocale.label,
    title,
    description,
    search: { ...baseLocale.search, ...search },
    themeConfig: {
      ...baseLocale.themeConfig,
      ...themeConfig,
      editLink: {
        pattern: `${params.config.repo}/edit/main/src/:path`,
        ...baseLocale.themeConfig.editLink,
        ...editLink,
      },
      lastUpdated: {
        ...baseLocale.themeConfig.lastUpdated,
        ...lastUpdated,
      },
      t: { ...baseLocale.t, ...t },
      sidebar,
    },
  }
}

/**
 * Processes a VitePress sidebar config (keyed by section name) by applying
 * template substitution to text/link fields and prefixing relative links
 * with the locale path.
 */
function processSidebar(
  sidebar: Record<string, any[]> | undefined,
  params: any
): Record<string, any> {
  if (!sidebar) return {}

  function menuRecursive(items: any[], linkPrePath: string): any[] {
    for (const item of items) {
      item.text = standardTemplate(item.text, params)

      if (typeof item.link === 'string') {
        item.link = standardTemplate(item.link, params)

        if (item.link.indexOf('/') !== 0 && !isExternalUrl(item.link)) {
          item.link = linkPrePath + item.link
        }
      }

      if (item.items) {
        item.items = menuRecursive(item.items, linkPrePath)
      }
    }

    return items
  }

  const newSidebar: Record<string, any> = {}

  for (const key of Object.keys(sidebar)) {
    const linkPrePath = `/${params.localeIndex}/${key}/`

    newSidebar[linkPrePath] = menuRecursive(sidebar[key]!, linkPrePath)
  }

  return newSidebar
}
