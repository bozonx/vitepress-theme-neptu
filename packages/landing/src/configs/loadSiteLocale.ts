import fs from 'node:fs'
import path from 'node:path'
import yaml from 'yaml'
import { parseLocaleSite } from 'vitepress-theme-neptu-blog/utils/node'
import { standardTemplate } from 'vitepress-theme-neptu-blog/utils'
import { isExternalUrl } from 'vitepress-theme-neptu-blog/utils'
import siteEn from './siteLocalesBase/en.ts'
import siteRu from './siteLocalesBase/ru.ts'

const siteBaseLocales: Record<string, any> = { en: siteEn, ru: siteRu }

function loadConfigYamlFile(
  srcDir: string,
  filename: string
): Record<string, any[]> {
  const filePath = path.join(srcDir, 'site', filename)

  if (!fs.existsSync(filePath)) return {}

  try {
    const config = yaml.parse(fs.readFileSync(filePath, 'utf8')) as
      | Record<string, unknown>
      | undefined
    const body = config?.body

    return (typeof body === 'string' ? yaml.parse(body) : config ?? {}) as Record<
      string,
      any[]
    >
  } catch (error) {
    console.warn(
      `[vitepress-theme-neptu-landing] Failed to parse ${filePath}:`,
      (error as Error).message
    )
    return {}
  }
}

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
  const site = parseLocaleSite(config.srcDir, params) as any
  const {
    lang,
    title,
    description,
    t,
    editLink,
    lastUpdated,
    search,
    ...themeConfig
  } = site

  const sidebar = parseLocaleSidebar(config.srcDir, params)

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

export function parseLocaleSidebar(
  srcDir: string,
  params: any
): Record<string, any> {
  const sidebar = loadConfigYamlFile(
    srcDir,
    `sidebar.${params.localeIndex}.yaml`
  ) as Record<string, any[]>

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
